import { factories } from '@strapi/strapi';
import { verifyCaptcha } from '../../../utils/captcha';

export default factories.createCoreController(
  'api::newsletter-subscriber.newsletter-subscriber',
  () => ({
    async create(ctx) {
      const { captchaToken, ...formData } = (ctx.request.body?.data ?? {}) as Record<string, unknown>;
      ctx.request.body = { data: formData };

      const isValid = await verifyCaptcha(captchaToken as string | null);
      if (!isValid) {
        return ctx.badRequest('Captcha verification failed. Please refresh the page and try again.');
      }

      try {
        return await super.create(ctx);
      } catch (err: any) {
        // Unique email constraint — treat as success so we don't leak subscriber info
        const isUniqueError = err?.details?.errors?.some(
          (e: any) => e.path?.includes('email') || e.message?.toLowerCase().includes('unique')
        );
        if (isUniqueError) {
          return ctx.send({
            data: { email: formData.email },
            meta: { alreadySubscribed: true },
          });
        }
        throw err;
      }
    },
  })
);
