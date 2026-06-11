import { NextRequest, NextResponse } from 'next/server';

// Conditional Clerk middleware loading to prevent crashes when keys are missing
export default function proxy(request: NextRequest) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const secretKey = process.env.CLERK_SECRET_KEY;

  if (publishableKey && secretKey) {
    // If Clerk is configured, use the Clerk middleware logic dynamically
    try {
      const { clerkMiddleware } = require('@clerk/nextjs/server');
      return clerkMiddleware()(request, {} as any);
    } catch (e) {
      console.warn('Clerk middleware loading failed, using fallback', e);
    }
  }

  // Fallback for Sandbox Mode
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Run proxy on all paths except static files & internal Next.js assets
    '/((?!_next/static|_next/image|favicon.ico).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
    // Clerk auto-proxy path
    '/__clerk/:path*',
  ],
};
