import { strapiClient } from './strapi';

interface ApiResponse {
  success: boolean;
  message: string;
  reference?: number;
}

/**
 * submitForm — thin wrapper that routes form submissions to the Strapi CMS.
 * Pass `captchaToken` in data to enable server-side hCaptcha verification.
 */
export async function submitForm(
  formType: string,
  data: Record<string, unknown>
): Promise<ApiResponse> {
  const captchaToken = data.captchaToken as string | null | undefined;

  if (formType === 'booking') {
    return strapiClient.submitBooking(
      {
        name: String(data.name ?? ''),
        email: String(data.email ?? ''),
        phone: data.phone ? String(data.phone) : null,
        sessionType: String(data.sessionType ?? ''),
        preferredDate: data.date ? String(data.date) : null,
        preferredTime: data.time ? String(data.time) : null,
        goals: data.goals ? String(data.goals) : null,
        notes: data.notes ? String(data.notes) : null,
      },
      captchaToken
    );
  }

  if (formType === 'contact') {
    return strapiClient.submitContact(
      {
        firstName: String(data.firstName ?? ''),
        lastName: data.lastName ? String(data.lastName) : null,
        email: String(data.email ?? ''),
        phone: data.phone ? String(data.phone) : null,
        topic: String(data.topic ?? ''),
        message: String(data.message ?? ''),
      },
      captchaToken
    );
  }

  if (formType === 'newsletter') {
    return strapiClient.subscribeNewsletter(
      {
        email: String(data.email ?? ''),
        firstName: data.name ? String(data.name) : undefined,
        source: 'homepage',
      },
      captchaToken
    );
  }

  return { success: false, message: `Unknown form type: ${formType}` };
}
