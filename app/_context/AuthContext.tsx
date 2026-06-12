'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserProfile } from '@/_hooks/useAuth';
import { useAuth as useClerkAuth, useUser as useClerkUser, useClerk } from '@clerk/nextjs';

// Define the interface for the unified auth context
export interface AuthContextType {
  isClerkEnabled: boolean;
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  verificationRequired: boolean;
  pendingEmail: string;
  setVerificationRequired: (val: boolean) => void;
  login: (email: string, password: string, rememberMe: boolean) => Promise<unknown>;
  register: (username: string, email: string, password: string) => Promise<unknown>;
  verifyEmailCode: (code: string) => Promise<unknown>;
  logout: () => Promise<unknown>;
  loginWithProvider: (provider: 'oauth_google' | 'oauth_github') => Promise<unknown>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface ClerkError {
  errors?: { message: string; long_message?: string }[];
  message?: string;
}

// Unified AuthProvider integrating Clerk
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const clerk = useClerk();
  
  const { isLoaded: isAuthLoaded, userId, signOut } = useClerkAuth();
  const { isLoaded: isUserLoaded, user: clerkUser } = useClerkUser();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [verificationRequired, setVerificationRequired] = useState<boolean>(false);
  const [pendingEmail, setPendingEmail] = useState<string>('');

  useEffect(() => {
    if (isAuthLoaded && isUserLoaded) {
      setIsLoading(false);
    }
  }, [isAuthLoaded, isUserLoaded, userId, clerkUser]);

  const login = async (email: string, password: string, _rememberMe: boolean) => {
    if (!isAuthLoaded) throw new Error('Clerk SDK is not initialized yet.');
    setIsLoading(true);

    try {
      const result = await clerk.client.signIn.create({
        identifier: email,
        password: password,
      });

      if (result.status === 'complete') {
        await clerk.setActive({ session: result.createdSessionId });
        setIsLoading(false);
        router.push('/');
        return result;
      } else {
        throw new Error(`Login status incomplete: ${result.status}`);
      }
    } catch (err: unknown) {
      const e = err as ClerkError;
      setIsLoading(false);
      throw new Error(e.errors?.[0]?.long_message || e.errors?.[0]?.message || e.message || 'Login failed.');
    }
  };

  const register = async (username: string, email: string, password: string) => {
    if (!isAuthLoaded) throw new Error('Clerk SDK is not initialized yet.');
    setIsLoading(true);

    try {
      // 1. Create signUp profile with Clerk
      await clerk.client.signUp.create({
        emailAddress: email,
        password: password,
        username: username,
      });

      // 2. Prepare email verification (Clerk automatically sends the code)
      await clerk.client.signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      
      setPendingEmail(email);
      setVerificationRequired(true);
      setIsLoading(false);
    } catch (err: unknown) {
      const e = err as ClerkError;
      setIsLoading(false);
      throw new Error(e.errors?.[0]?.long_message || e.errors?.[0]?.message || e.message || 'Registration failed.');
    }
  };

  const verifyEmailCode = async (code: string) => {
    if (!isAuthLoaded) throw new Error('Clerk SDK is not initialized yet.');
    setIsLoading(true);

    try {
      const result = await clerk.client.signUp.attemptEmailAddressVerification({
        code: code,
      });

      if (result.status === 'complete') {
        await clerk.setActive({ session: result.createdSessionId });
        setVerificationRequired(false);
        setIsLoading(false);
        router.push('/');
        return result;
      } else {
        throw new Error(`Email verification incomplete: ${result.status}`);
      }
    } catch (err: unknown) {
      const e = err as ClerkError;
      setIsLoading(false);
      throw new Error(e.errors?.[0]?.long_message || e.errors?.[0]?.message || e.message || 'Verification failed.');
    }
  };

  const logout = async () => {
    setIsLoading(true);
    await signOut();
    setIsLoading(false);
    router.push('/login');
  };

  const loginWithProvider = async (provider: 'oauth_google' | 'oauth_github') => {
    if (!isAuthLoaded) throw new Error('Clerk SDK is not initialized yet.');
    
    try {
      await clerk.client.signIn.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/',
      });
    } catch (err: unknown) {
      const e = err as ClerkError;
      throw new Error(e.errors?.[0]?.long_message || e.errors?.[0]?.message || e.message || 'OAuth authentication failed.');
    }
  };

  const mappedUser: UserProfile | null = clerkUser ? {
    id: clerkUser.id,
    username: clerkUser.username || clerkUser.firstName || clerkUser.primaryEmailAddress?.emailAddress.split('@')[0] || 'User',
    email: clerkUser.primaryEmailAddress?.emailAddress || '',
    imageUrl: clerkUser.imageUrl,
  } : null;

  return (
    <AuthContext.Provider
      value={{
        isClerkEnabled: true,
        user: mappedUser,
        isAuthenticated: !!userId,
        isLoading: isLoading,
        verificationRequired,
        pendingEmail,
        setVerificationRequired,
        login,
        register,
        verifyEmailCode,
        logout,
        loginWithProvider,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook to access auth contexts
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
