/**
 * hCaptcha server-side verification utility.
 *
 * Dev mode: if HCAPTCHA_SECRET_KEY is not set, verification is skipped
 * and a warning is logged. In production always set the secret key.
 *
 * Test keys (always pass):
 *   Site key:   10000000-ffff-ffff-ffff-000000000001
 *   Secret key: 0x0000000000000000000000000000000000000000
 */

export async function verifyCaptcha(token: string | null | undefined): Promise<boolean> {
  const secret = process.env.HCAPTCHA_SECRET_KEY;

  if (!secret) {
    strapi.log.warn('[captcha] HCAPTCHA_SECRET_KEY not set — skipping verification (dev mode)');
    return true;
  }

  if (!token) return false;

  try {
    const res = await fetch('https://hcaptcha.com/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token }).toString(),
    });

    const data = (await res.json()) as { success: boolean; 'error-codes'?: string[] };

    if (!data.success) {
      strapi.log.warn('[captcha] Verification failed:', data['error-codes']);
    }

    return data.success === true;
  } catch (err) {
    strapi.log.error('[captcha] Verification request failed:', err);
    return false;
  }
}
