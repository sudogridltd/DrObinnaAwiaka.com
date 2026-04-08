/**
 * Order Lifecycle Hooks
 * Triggers notifications when order status changes
 */

export default {
    async afterCreate(event: any) {
        const { result } = event;

        // Notify customer when order is created
        try {
            const notificationService = strapi.service('api::notification.notification');

            if (notificationService && result.customerEmail) {
                await notificationService.notifySubscribers({
                    type: 'order',
                    entityId: result.id.toString(),
                    entityType: 'order',
                    templateSlug: 'order-confirmation',
                    templateData: {
                        customerName: result.customerName || 'Valued Customer',
                        orderNumber: result.orderNumber || result.id.toString(),
                        orderDate: new Date(result.createdAt).toLocaleDateString(),
                        orderTotal: result.total ? `$${result.total}` : 'N/A',
                        paymentStatus: result.paymentStatus || 'Pending',
                        orderUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders/${result.id}`,
                    },
                    priority: 'high',
                    channel: 'email',
                });

                strapi.log.info(`Order confirmation sent for order: ${result.orderNumber || result.id}`);
            }
        } catch (error) {
            strapi.log.error('Failed to send order confirmation:', error);
        }
    },

    async afterUpdate(event: any) {
        const { result, params } = event;

        // Notify customer on order status changes
        try {
            const notificationService = strapi.service('api::notification.notification');

            if (!notificationService || !result.customerEmail) {
                return;
            }

            // Check if status changed
            const statusChanged = params.data.status && params.data.status !== result.status;
            const paymentStatusChanged = params.data.paymentStatus && params.data.paymentStatus !== result.paymentStatus;

            if (statusChanged || paymentStatusChanged) {
                let notificationType = 'order';
                let priority: 'low' | 'normal' | 'high' | 'urgent' = 'normal';
                let message = '';

                // Determine notification based on status
                if (result.status === 'confirmed') {
                    message = 'Your order has been confirmed and is being processed.';
                    priority = 'high';
                } else if (result.status === 'processing') {
                    message = 'Your order is now being processed.';
                    priority = 'normal';
                } else if (result.status === 'shipped') {
                    message = 'Your order has been shipped!';
                    priority = 'high';
                } else if (result.status === 'delivered') {
                    message = 'Your order has been delivered. Thank you for your purchase!';
                    priority = 'high';
                } else if (result.status === 'cancelled') {
                    message = 'Your order has been cancelled.';
                    priority = 'urgent';
                } else if (result.paymentStatus === 'paid') {
                    message = 'Your payment has been confirmed.';
                    priority = 'high';
                } else if (result.paymentStatus === 'failed') {
                    message = 'Your payment failed. Please try again.';
                    priority = 'urgent';
                }

                if (message) {
                    await notificationService.notifySubscribers({
                        type: 'order',
                        entityId: result.id.toString(),
                        entityType: 'order',
                        templateSlug: 'order-confirmation',
                        templateData: {
                            customerName: result.customerName || 'Valued Customer',
                            orderNumber: result.orderNumber || result.id.toString(),
                            orderDate: new Date(result.createdAt).toLocaleDateString(),
                            orderTotal: result.total ? `$${result.total}` : 'N/A',
                            paymentStatus: result.paymentStatus || 'Pending',
                            orderStatus: result.status || 'Pending',
                            statusMessage: message,
                            orderUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders/${result.id}`,
                        },
                        priority,
                        channel: priority === 'urgent' ? 'both' : 'email',
                    });

                    strapi.log.info(`Order status notification sent for order: ${result.orderNumber || result.id} - Status: ${result.status}`);
                }
            }
        } catch (error) {
            strapi.log.error('Failed to send order status notification:', error);
        }
    },
};
