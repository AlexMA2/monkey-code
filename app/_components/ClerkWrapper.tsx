'use client';

import React from 'react';
import { ClerkProvider } from '@clerk/nextjs';

const DUMMY_KEY = 'pk_test_dGVzdC1jbGVyay5hY2NvdW50cy5kZXYk';

export default function ClerkWrapper({ children }: { children: React.ReactNode }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || DUMMY_KEY;

  return (
    <ClerkProvider publishableKey={publishableKey}>
      {children}
    </ClerkProvider>
  );
}
