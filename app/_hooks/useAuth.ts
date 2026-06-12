'use client';

// Define the User Profile interface
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  imageUrl?: string;
}

// Check if Clerk configuration variables are defined
export const isClerkConfigured = () => {
  return typeof window !== 'undefined'
    ? !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    : !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
};
