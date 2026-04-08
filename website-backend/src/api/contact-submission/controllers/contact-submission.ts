import { factories } from '@strapi/strapi';
import { verifyCaptcha } from '../../../utils/captcha';

export default factories.createCoreController(
  'api::contact-submission.contact-submission',
  ({ strapi }) => ({
    async create(ctx) {
      const { captchaToken, ...formData } = (ctx.request.body?.data ?? {}) as Record<string, unknown>;
      ctx.request.body = { data: formData };

      const isValid = await verifyCaptcha(captchaToken as string | null);
      if (!isValid) {
        return ctx.badRequest('Captcha verification failed. Please refresh the page and try again.');
      }

      const response = await super.create(ctx);

      // Auto-track customer from contact enquiry
      if (formData.email) {
        strapi
          .service('api::customer.customer')
          .findOrCreate(String(formData.email), {
            firstName: formData.firstName ? String(formData.firstName) : undefined,
            lastName: formData.lastName ? String(formData.lastName) : undefined,
            phone: formData.phone ? String(formData.phone) : undefined,
          })
          .then(async (customer) => {
            const submissionDocId = (response as any)?.data?.documentId;
            if (submissionDocId && customer?.documentId) {
              await strapi.documents('api::contact-submission.contact-submission').update({
                documentId: submissionDocId,
                data: { customer: { documentId: customer.documentId } },
              });
            }
          })
          .catch((err) => strapi.log.warn('[contact] Customer auto-track failed:', err));
      }

      return response;
    },
  })
);
