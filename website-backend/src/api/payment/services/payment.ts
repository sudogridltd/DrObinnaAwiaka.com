import crypto from 'crypto';

const PAYSTACK_BASE = 'https://api.paystack.co';

async function paystackFetch(path: string, options: RequestInit = {}) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) throw new Error('PAYSTACK_SECRET_KEY is not configured');

  const res = await fetch(`${PAYSTACK_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${secret}`,
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  });

  return res.json() as Promise<Record<string, unknown>>;
}

export default () => ({
  /**
   * Initialize a Paystack transaction.
   * Amount must be in the lowest currency unit (kobo for NGN, cents for USD, etc.)
   */
  async initializeTransaction(params: {
    email: string;
    amount: number;
    reference: string;
    currency?: string;
    metadata?: Record<string, unknown>;
    callback_url?: string;
  }) {
    return paystackFetch('/transaction/initialize', {
      method: 'POST',
      body: JSON.stringify({
        ...params,
        currency: params.currency ?? process.env.PAYSTACK_CURRENCY ?? 'NGN',
      }),
    });
  },

  /** Verify a transaction by its reference. */
  async verifyTransaction(reference: string) {
    return paystackFetch(`/transaction/verify/${encodeURIComponent(reference)}`);
  },

  /** Validate the HMAC-SHA512 signature on an incoming Paystack webhook. */
  verifyWebhookSignature(rawBody: string, signature: string): boolean {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) return false;

    const hash = crypto
      .createHmac('sha512', secret)
      .update(rawBody)
      .digest('hex');

    return hash === signature;
  },
});
