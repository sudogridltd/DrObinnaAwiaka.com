/**
 * Paystack inline payment hook.
 *
 * Usage:
 *   const { pay, isPaying } = usePaystack();
 *
 *   // Initialize on backend first, then:
 *   await pay({
 *     reference: 'ORD-...',
 *     email: 'customer@example.com',
 *     amount: 5000,          // in smallest currency unit (kobo for NGN)
 *     onSuccess: (ref) => { ... },
 *     onCancel: () => { ... },
 *   });
 */

import { useCallback, useRef, useState } from 'react';
import { strapiClient } from './strapi';

const PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY ?? '';

// ─────────────────────────────────────────────────────
// Load Paystack inline script on demand
// ─────────────────────────────────────────────────────

let scriptPromise: Promise<void> | null = null;

function loadPaystackScript(): Promise<void> {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    if ((window as any).PaystackPop) return resolve();
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Paystack script'));
    document.head.appendChild(script);
  });
  return scriptPromise;
}

// ─────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────

export interface PaystackPayOptions {
  /** Reference returned from backend initialization */
  reference: string;
  email: string;
  /** Amount in smallest currency unit (kobo for NGN) */
  amount: number;
  onSuccess: (reference: string) => void;
  onCancel?: () => void;
}

export interface InitializeProductPaymentParams {
  items: Array<{ productId: string; quantity?: number }>;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
}

export interface InitializeBookingDepositParams {
  serviceId: string;
  bookingData: Record<string, unknown>;
  captchaToken: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
}

// ─────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────

export function usePaystack() {
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const popupRef = useRef<any>(null);

  /** Open the Paystack popup with a pre-initialized reference from the backend. */
  const pay = useCallback(async (options: PaystackPayOptions) => {
    setError(null);
    setIsPaying(true);

    try {
      await loadPaystackScript();

      const PaystackPop = (window as any).PaystackPop;
      if (!PaystackPop) throw new Error('Paystack failed to load');
      if (!PUBLIC_KEY) throw new Error('VITE_PAYSTACK_PUBLIC_KEY is not configured');

      popupRef.current = PaystackPop.setup({
        key: PUBLIC_KEY,
        email: options.email,
        amount: options.amount,
        ref: options.reference,
        onClose: () => {
          setIsPaying(false);
          options.onCancel?.();
        },
        callback: async (response: { reference: string }) => {
          try {
            // Verify the payment with the backend before showing success
            const result = await strapiClient.verifyPayment(response.reference);
            if (result.success) {
              options.onSuccess(response.reference);
            } else {
              setError('Payment received but verification failed. Please contact support.');
            }
          } catch {
            setError('Payment received but verification failed. Please contact support.');
          } finally {
            setIsPaying(false);
          }
        },
      });

      popupRef.current.openIframe();
    } catch (err) {
      setIsPaying(false);
      const msg = err instanceof Error ? err.message : 'Payment failed to initialize';
      setError(msg);
    }
  }, []);

  /** Full flow: initialize on backend → open popup → verify. Returns order ID on success. */
  const payForProducts = useCallback(
    async (
      params: InitializeProductPaymentParams,
      callbacks: { onSuccess: (reference: string) => void; onCancel?: () => void }
    ) => {
      setError(null);
      setIsPaying(true);

      try {
        const init = await strapiClient.initializePayment({
          type: 'product',
          items: params.items,
          customerEmail: params.customerEmail,
          customerName: params.customerName,
          customerPhone: params.customerPhone,
        });

        await pay({
          reference: init.reference,
          email: params.customerEmail,
          amount: Math.round(init.amount * 100),
          onSuccess: callbacks.onSuccess,
          onCancel: callbacks.onCancel,
        });
      } catch (err) {
        setIsPaying(false);
        const msg = err instanceof Error ? err.message : 'Payment initialization failed';
        setError(msg);
      }
    },
    [pay]
  );

  /** Full flow: initialize booking deposit on backend → open popup → verify. */
  const payBookingDeposit = useCallback(
    async (
      params: InitializeBookingDepositParams,
      callbacks: { onSuccess: (reference: string, bookingId: string) => void; onCancel?: () => void }
    ) => {
      setError(null);
      setIsPaying(true);

      try {
        const init = await strapiClient.initializePayment({
          type: 'booking-deposit',
          serviceId: params.serviceId,
          bookingData: params.bookingData,
          captchaToken: params.captchaToken,
          customerEmail: params.customerEmail,
          customerName: params.customerName,
          customerPhone: params.customerPhone,
        });

        await pay({
          reference: init.reference,
          email: params.customerEmail,
          amount: Math.round(init.amount * 100),
          onSuccess: (ref) => callbacks.onSuccess(ref, init.bookingId ?? ''),
          onCancel: callbacks.onCancel,
        });
      } catch (err) {
        setIsPaying(false);
        const msg = err instanceof Error ? err.message : 'Payment initialization failed';
        setError(msg);
      }
    },
    [pay]
  );

  return { pay, payForProducts, payBookingDeposit, isPaying, error, clearError: () => setError(null) };
}
