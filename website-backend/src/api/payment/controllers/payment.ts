import { verifyCaptcha } from '../../../utils/captcha';
import type { JSONObject } from '@strapi/types/dist/utils/json';

/** Generate a unique order number: ORD-{timestamp}-{random} */
function generateOrderNumber(): string {
  return `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

/** Convert a decimal price to the lowest currency unit (×100). */
function toSmallestUnit(amount: number): number {
  return Math.round(amount * 100);
}

/**
 * Handle a confirmed successful Paystack payment.
 * Updates the order, creates/links the customer, and updates totalSpent.
 * For booking-deposit orders, also confirms the booking.
 */
async function handleSuccessfulPayment(order: any, paystackData: Record<string, unknown>) {
  // Update order to paid
  await strapi.documents('api::order.order').update({
    documentId: order.documentId,
    data: { status: 'paid', paystackData: paystackData as JSONObject },
  });

  // Find or create customer
  const customer = await strapi.service('api::customer.customer').findOrCreate(
    order.customerEmail,
    {
      firstName: String(order.customerName ?? '').split(' ')[0] || undefined,
      lastName: String(order.customerName ?? '').split(' ').slice(1).join(' ') || undefined,
      phone: order.customerPhone || undefined,
    }
  );

  if (customer?.documentId) {
    // Link customer to order
    await strapi.documents('api::order.order').update({
      documentId: order.documentId,
      data: { customer: { documentId: customer.documentId } },
    });

    // Update total spent
    await strapi.service('api::customer.customer').addToTotalSpent(
      customer.documentId,
      order.total ?? 0
    );
  }

  // If this was a booking deposit, confirm the booking and link the customer
  if (order.paymentType === 'booking-deposit' && order.bookingSubmission?.documentId) {
    await strapi.documents('api::booking-submission.booking-submission').update({
      documentId: order.bookingSubmission.documentId,
      data: {
        status: 'confirmed',
        ...(customer?.documentId ? { customer: { documentId: customer.documentId } } : {}),
      },
    });
  }
}

export default {
  /**
   * POST /api/payments/initialize
   *
   * Body for product purchase:
   *   { type: 'product', items: [{productId, quantity}], customerEmail, customerName, customerPhone, callbackUrl? }
   *
   * Body for booking deposit:
   *   { type: 'booking-deposit', bookingData, serviceId, captchaToken, customerEmail, customerName, customerPhone, callbackUrl? }
   *
   * Returns: { reference, authorizationUrl, orderId, bookingId? }
   */
  async initialize(ctx) {
    const {
      type,
      items,
      customerEmail,
      customerName,
      customerPhone,
      bookingData,
      serviceId,
      captchaToken,
      callbackUrl,
    } = ctx.request.body as Record<string, any>;

    if (!customerEmail) return ctx.badRequest('customerEmail is required.');

    // ── Booking deposit ────────────────────────────────────────────────────
    if (type === 'booking-deposit') {
      const isValid = await verifyCaptcha(captchaToken);
      if (!isValid) return ctx.badRequest('Captcha verification failed. Please refresh and try again.');

      if (!serviceId) return ctx.badRequest('serviceId is required for booking deposits.');
      if (!bookingData) return ctx.badRequest('bookingData is required for booking deposits.');

      const services = await strapi.documents('api::service.service').findMany({
        filters: { documentId: { $eq: serviceId } },
      });
      const service = services[0] as any;

      if (!service) return ctx.badRequest('Service not found.');
      if (!service.requiresDeposit || !service.depositAmount) {
        return ctx.badRequest('This service does not require a deposit.');
      }

      // Create booking (payment_pending)
      const booking = await strapi.documents('api::booking-submission.booking-submission').create({
        status: 'published',
        data: { ...bookingData, status: 'payment_pending' },
      });

      const orderNumber = generateOrderNumber();

      const order = await strapi.documents('api::order.order').create({
        status: 'published',
        data: {
          orderNumber,
          customerName,
          customerEmail,
          customerPhone,
          subtotal: service.depositAmount,
          total: service.depositAmount,
          status: 'pending',
          paymentType: 'booking-deposit',
          paystackReference: orderNumber,
          bookingSubmission: { documentId: booking.documentId },
          items: [
            {
              productTitle: `Deposit — ${service.title}`,
              unitPrice: service.depositAmount,
              quantity: 1,
              lineTotal: service.depositAmount,
            },
          ],
        },
      });

      const paystack = strapi.service('api::payment.payment');
      const result = (await paystack.initializeTransaction({
        email: customerEmail,
        amount: toSmallestUnit(service.depositAmount),
        reference: orderNumber,
        metadata: { orderId: order.documentId, bookingId: booking.documentId, type: 'booking-deposit' },
        callback_url: callbackUrl,
      })) as any;

      if (!result.status) {
        strapi.log.error('[payment] Paystack init failed:', result);
        return ctx.internalServerError('Payment initialization failed. Please try again.');
      }

      return ctx.send({
        reference: orderNumber,
        authorizationUrl: result.data.authorization_url,
        orderId: order.documentId,
        bookingId: booking.documentId,
      });
    }

    // ── Product purchase ───────────────────────────────────────────────────
    if (type === 'product') {
      if (!Array.isArray(items) || items.length === 0) {
        return ctx.badRequest('items array is required for product purchases.');
      }

      const productDocIds = items.map((i: any) => i.productId);
      const products = (await strapi.documents('api::product.product').findMany({
        filters: { documentId: { $in: productDocIds } },
      })) as any[];

      if (products.length !== productDocIds.length) {
        return ctx.badRequest('One or more products could not be found.');
      }

      let total = 0;
      const orderItems = items.map((item: any) => {
        const product = products.find((p) => p.documentId === item.productId);
        const qty = Math.max(1, Number(item.quantity) || 1);
        const lineTotal = product.price * qty;
        total += lineTotal;
        return {
          productTitle: product.title,
          productSlug: product.slug,
          unitPrice: product.price,
          quantity: qty,
          lineTotal,
          product: { documentId: product.documentId },
        };
      });

      const orderNumber = generateOrderNumber();

      const order = await strapi.documents('api::order.order').create({
        status: 'published',
        data: {
          orderNumber,
          customerName,
          customerEmail,
          customerPhone,
          items: orderItems,
          subtotal: total,
          total,
          status: 'pending',
          paymentType: 'product',
          paystackReference: orderNumber,
        },
      });

      const paystack = strapi.service('api::payment.payment');
      const result = (await paystack.initializeTransaction({
        email: customerEmail,
        amount: toSmallestUnit(total),
        reference: orderNumber,
        metadata: { orderId: order.documentId, type: 'product' },
        callback_url: callbackUrl,
      })) as any;

      if (!result.status) {
        strapi.log.error('[payment] Paystack init failed:', result);
        return ctx.internalServerError('Payment initialization failed. Please try again.');
      }

      return ctx.send({
        reference: orderNumber,
        authorizationUrl: result.data.authorization_url,
        orderId: order.documentId,
        amount: total,
      });
    }

    return ctx.badRequest('Invalid payment type. Must be "product" or "booking-deposit".');
  },

  /**
   * GET /api/payments/verify?reference=ORD-xxx
   * Called by the frontend after Paystack redirect / popup success.
   */
  async verify(ctx) {
    const reference = (ctx.query as Record<string, string>).reference;
    if (!reference) return ctx.badRequest('reference query parameter is required.');

    const paystack = strapi.service('api::payment.payment');
    const result = (await paystack.verifyTransaction(reference)) as any;

    if (!result.status || result.data?.status !== 'success') {
      return ctx.send({ success: false, message: 'Payment not yet verified.' });
    }

    // Find and update the order if not already paid
    const orders = await strapi.documents('api::order.order').findMany({
      filters: { orderNumber: { $eq: reference } },
      populate: ['bookingSubmission', 'customer'],
    });
    const order = (orders as any[])[0];

    if (order && order.status !== 'paid') {
      await handleSuccessfulPayment(order, result.data);
    }

    return ctx.send({ success: true, reference, message: 'Payment confirmed.' });
  },

  /**
   * POST /api/webhooks/paystack
   * Paystack calls this automatically after every transaction event.
   * Must be publicly reachable (no auth).
   */
  async webhook(ctx) {
    const signature = (ctx.request.headers as Record<string, string>)['x-paystack-signature'];
    const rawBody = JSON.stringify(ctx.request.body);

    const paystack = strapi.service('api::payment.payment');
    if (!paystack.verifyWebhookSignature(rawBody, signature)) {
      strapi.log.warn('[webhook] Invalid Paystack signature');
      return ctx.unauthorized('Invalid webhook signature.');
    }

    const event = ctx.request.body as any;
    strapi.log.info(`[webhook] Paystack event: ${event.event}`);

    if (event.event === 'charge.success') {
      const reference = event.data?.reference;
      if (reference) {
        const orders = await strapi.documents('api::order.order').findMany({
          filters: { orderNumber: { $eq: reference } },
          populate: ['bookingSubmission', 'customer'],
        });
        const order = (orders as any[])[0];

        if (order && order.status !== 'paid') {
          await handleSuccessfulPayment(order, event.data);
        }
      }
    }

    ctx.status = 200;
    return ctx.send({ received: true });
  },
};
