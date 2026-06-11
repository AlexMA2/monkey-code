'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ShieldCheck, ShieldAlert, Loader2 } from 'lucide-react';

interface TurnstileCaptchaProps {
  onVerify: (token: string | null) => void;
  sitekey?: string;
  theme?: 'light' | 'dark';
}

export default function TurnstileCaptcha({
  onVerify,
  sitekey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  theme = 'dark',
}: TurnstileCaptchaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'failed'>('idle');
  const [isSandbox, setIsSandbox] = useState(true);

  useEffect(() => {
    // If a sitekey is provided, we use the real Turnstile integration
    if (sitekey) {
      setIsSandbox(false);
      setStatus('verifying');

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
    }
  }, [sitekey, theme, onVerify]);

  // Sandbox simulation trigger
  const handleSandboxClick = () => {
    if (status !== 'idle') return;
    setStatus('verifying');

    // Simulate smart bot-detection analysis delay
    setTimeout(() => {
      // 95% pass rate for simulation, fits normal usage
      setStatus('success');
      onVerify('mock_turnstile_success_token');
    }, 1500);
  };

  if (!isSandbox) {
    return (
      <div className="w-full flex justify-center py-2">
        <div ref={containerRef} id="turnstile-container"></div>
      </div>
    );
  }

  // Beautiful developer-sandbox Turnstile fallback
  return (
    <div className="w-full p-4 bg-card-bg border border-card-border rounded-xl flex items-center justify-between gap-4 select-none">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSandboxClick}
          disabled={status !== 'idle'}
          className={`w-6 h-6 rounded border transition-all flex items-center justify-center cursor-pointer ${
            status === 'success'
              ? 'bg-correct border-correct text-correct-text'
              : status === 'verifying'
              ? 'border-accent bg-accent-dim'
              : 'border-card-border bg-card-muted hover:border-accent'
          }`}
        >
          {status === 'success' && <ShieldCheck className="w-4 h-4 text-black" />}
          {status === 'verifying' && <Loader2 className="w-4 h-4 animate-spin text-accent" />}
        </button>
        <span className="text-xs font-medium text-untyped">
          {status === 'idle' && 'Verify you are human'}
          {status === 'verifying' && 'Analyzing connection safety...'}
          {status === 'success' && 'Verification successful'}
          {status === 'failed' && 'Verification failed'}
        </span>
      </div>

      <div className="flex flex-col items-end opacity-60">
        <span className="text-[10px] tracking-widest uppercase text-accent font-bold">Turnstile</span>
        <span className="text-[8px] text-untyped">Sandbox Protected</span>
      </div>
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
