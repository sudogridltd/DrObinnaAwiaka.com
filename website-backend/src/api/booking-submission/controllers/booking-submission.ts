import { factories } from '@strapi/strapi';
import { verifyCaptcha } from '../../../utils/captcha';

export default factories.createCoreController(
  'api::booking-submission.booking-submission',
  ({ strapi }) => ({
    async create(ctx) {
      // Strip captchaToken before schema validation — it's not a schema field
      const { captchaToken, ...formData } = (ctx.request.body?.data ?? {}) as Record<string, unknown>;
      ctx.request.body = { data: formData };

      const isValid = await verifyCaptcha(captchaToken as string | null);
      if (!isValid) {
        return ctx.badRequest('Captcha verification failed. Please refresh the page and try again.');
      }

      const response = await super.create(ctx);

      // Auto-find/create customer — runs after response is returned so it never blocks
      if (formData.email) {
        const nameParts = String(formData.name ?? '').split(' ');
        strapi
          .service('api::customer.customer')
          .findOrCreate(String(formData.email), {
            firstName: nameParts[0] || String(formData.name ?? ''),
            lastName: nameParts.slice(1).join(' '),
            phone: formData.phone ? String(formData.phone) : undefined,
          })
          .then(async (customer) => {
            const bookingDocId = (response as any)?.data?.documentId;
            if (bookingDocId && customer?.documentId) {
              await strapi.documents('api::booking-submission.booking-submission').update({
                documentId: bookingDocId,
                data: { customer: { documentId: customer.documentId } },
              });
            }
          })
          .catch((err) => strapi.log.warn('[booking] Customer auto-track failed:', err));
      }

      return response;
    },
  })
);
