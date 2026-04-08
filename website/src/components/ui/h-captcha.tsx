/**
 * HCaptcha wrapper component.
 *
 * Usage:
 *   const captchaRef = useRef<HCaptchaRef>(null);
 *
 *   // In submit handler:
 *   const token = await captchaRef.current?.getToken();
 *   if (!token) { setError('Please complete the captcha'); return; }
 *   // ... submit form with token
 *   captchaRef.current?.reset();
 *
 *   // In JSX:
 *   <HCaptcha ref={captchaRef} />
 */

import HCaptchaLib from '@hcaptcha/react-hcaptcha';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

const SITE_KEY =
  import.meta.env.VITE_HCAPTCHA_SITE_KEY ?? '10000000-ffff-ffff-ffff-000000000001';

export interface HCaptchaRef {
  /** Returns the current verified token */
  getToken: () => string | null;
  /** Resets the captcha widget */
  reset: () => void;
}

interface HCaptchaProps {
  theme?: 'light' | 'dark';
  size?: 'normal' | 'compact';
  className?: string;
}

const HCaptcha = forwardRef<HCaptchaRef, HCaptchaProps>(
  ({ theme = 'light', size = 'normal', className }, ref) => {
    const captchaRef = useRef<any>(null);
    const [token, setToken] = useState<string | null>(null);

    useImperativeHandle(ref, () => ({
      getToken: () => token,
      reset: () => {
        captchaRef.current?.resetCaptcha?.();
        setToken(null);
      },
    }), [token]);

    return (
      <div className={className}>
        <HCaptchaLib
          ref={captchaRef}
          sitekey={SITE_KEY}
          theme={theme}
          size={size}
          explicit={true}
          onVerify={(t: string) => setToken(t)}
          onExpire={() => setToken(null)}
          onError={() => setToken(null)}
        />
      </div>
    );
  }
);

HCaptcha.displayName = 'HCaptcha';

export default HCaptcha;
