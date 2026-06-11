'use client';

import React from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import { isClerkConfigured } from '@/_hooks/useAuth';

export default function ClerkWrapper({ children }: { children: React.ReactNode }) {
  if (isClerkConfigured()) {
    return (
      <ClerkProvider
        publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      >
        {children}
      </ClerkProvider>
    );
  }

  // Fallback if Clerk isn't configured yet
  return <>{children}</>;
}
