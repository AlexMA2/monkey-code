'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthenticateWithRedirectCallback } from '@clerk/nextjs';
import { Terminal } from 'lucide-react';
import { useAuthContext } from '@/_context/AuthContext';
import Image from 'next/image';

function SSOCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuthContext();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
      return;
    }

    const hasOAuthParams =
      searchParams.has('code') ||
      searchParams.has('state') ||
      searchParams.has('__clerk_status') ||
      searchParams.has('redirect_status');

    if (!hasOAuthParams) {
      router.replace('/login');
    }
  }, [isAuthenticated, searchParams, router]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full min-h-[350px] relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col items-center gap-6 z-10">
        {/* Animated Icon */}
        <Image
          src="/logo-v2.png"
          alt="MonkeyCode Logo"
          width={64}
          height={64}
          className="object-contain animate-bounce"
        />

        {/* Text Logo */}
        <div className="flex flex-col items-center gap-1.5">
          <h2 className="text-xl font-bold tracking-wider text-foreground flex items-center gap-1">
            Monkey<span className="text-accent">Code</span>
            <span className="inline-block w-1.5 h-5 bg-accent animate-caret-blink" />
          </h2>
          <p className="text-xs text-untyped tracking-widest uppercase animate-pulse">
            Completing authentication...
          </p>
        </div>

        {/* Loading progress bar indicator */}
        <div className="w-48 h-1 bg-card-border rounded-full overflow-hidden mt-2">
          <div className="h-full bg-accent animate-[loading-bar_1.5s_infinite_ease-in-out] w-1/3 rounded-full" />
        </div>
      </div>

      {/* Clerk SSO callback handler */}
      <AuthenticateWithRedirectCallback />
    </div>
  );
}

export default function SSOCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex flex-col items-center justify-center w-full min-h-[350px]">
        <Image
          src="/logo-v2.png"
          alt="MonkeyCode Logo"
          width={64}
          height={64}
          className="object-contain animate-pulse"
        />
      </div>
    }>
      <SSOCallbackContent />
    </Suspense>
  );
}
