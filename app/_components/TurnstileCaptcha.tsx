'use client';

import { useEffect, useRef, useState } from 'react';

interface TurnstileCaptchaProps {
  onVerify: (token: string | null) => void;
  sitekey?: string;
  theme?: 'light' | 'dark';
}

export default function TurnstileCaptcha({
  onVerify,
  sitekey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA',
  theme = 'dark',
}: TurnstileCaptchaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [, setStatus] = useState<'idle' | 'verifying' | 'success' | 'failed'>('idle');

  useEffect(() => {
    // If a sitekey is provided, we use the real Turnstile integration
    if (!sitekey) {
      return;
    }

    // Check if turnstile script is already injected
    const scriptId = 'cloudflare-turnstile-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    const initializeTurnstile = () => {
      if (window.turnstile && containerRef.current) {
        window.turnstile.render(containerRef.current, {
          sitekey: sitekey,
          theme: theme,
          callback: (token: string) => {
            setStatus('success');
            onVerify(token);
          },
          'error-callback': () => {
            setStatus('failed');
            onVerify(null);
          },
          'expired-callback': () => {
            setStatus('idle');
            onVerify(null);
          },
        });
      } else {
        // Retry in case turnstile isn't loaded yet
        setTimeout(initializeTurnstile, 200);
      }
    };

    if (window.turnstile) {
      initializeTurnstile();
    } else {
      script.addEventListener('load', initializeTurnstile);
    }

    return () => {
      if (script) {
        script.removeEventListener('load', initializeTurnstile);
      }
    };
  }, [sitekey, theme, onVerify]);


  return (
    <div className="w-full flex justify-center py-2">
      <div ref={containerRef} id="turnstile-container"></div>
    </div>
  );


}

// Global declaration for TypeScript Turnstile window property
declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          theme?: 'light' | 'dark';
          callback?: (token: string) => void;
          'error-callback'?: () => void;
          'expired-callback'?: () => void;
        }
      ) => string;
    };
  }
}
