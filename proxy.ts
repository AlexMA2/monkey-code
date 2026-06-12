import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { clerkMiddleware } from '@clerk/nextjs/server';

export default function proxy(request: NextRequest) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!publishableKey || !secretKey) {
    console.warn('Clerk is not configured. Skipping Clerk middleware.');
    return NextResponse.next();
  }
  try {
    const fn = clerkMiddleware();
    return fn(request, {} as NextFetchEvent);
  } catch (e) {
    console.warn('Clerk middleware loading failed, using fallback', e);
  }
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
