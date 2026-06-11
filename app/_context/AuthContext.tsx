'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isClerkConfigured, UserProfile } from '@/_hooks/useAuth';

// Define the interface for the unified auth context
export interface AuthContextType {
  isClerkEnabled: boolean;
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  verificationRequired: boolean;
  pendingEmail: string;
  setVerificationRequired: (val: boolean) => void;
  login: (email: string, password: string, rememberMe: boolean) => Promise<any>;
  register: (username: string, email: string, password: string) => Promise<any>;
  verifyEmailCode: (code: string) => Promise<any>;
  logout: () => Promise<any>;
  loginWithProvider: (provider: 'oauth_google' | 'oauth_github') => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper for Sandbox Auth logic
function SandboxAuthProviderHelper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [verificationRequired, setVerificationRequired] = useState<boolean>(false);
  const [pendingEmail, setPendingEmail] = useState<string>('');

  useEffect(() => {
    const storedUser = localStorage.getItem('mc_user') || sessionStorage.getItem('mc_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        setIsAuthenticated(true);
      } catch (e) {
        console.error('Failed to parse sandbox user session', e);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (!email || !password) {
      setIsLoading(false);
      throw new Error('Email and password are required.');
    }

    const dummyUser: UserProfile = {
      id: 'usr_sandbox_' + Math.random().toString(36).substring(2, 9),
      username: email.split('@')[0],
      email: email,
      imageUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`,
    };

    setUser(dummyUser);
    setIsAuthenticated(true);
    setIsLoading(false);

    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('mc_user', JSON.stringify(dummyUser));
    router.push('/');
    return dummyUser;
  };

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (!username || !email || !password) {
      setIsLoading(false);
      throw new Error('All fields are required.');
    }

    setPendingEmail(email);
    setVerificationRequired(true);
    setIsLoading(false);
  };

  const verifyEmailCode = async (code: string) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Support standard testing codes
    if (code !== '123456' && code !== '000000') {
      setIsLoading(false);
      throw new Error('Invalid verification code. Enter 123456 to simulate verification.');
    }

    const dummyUser: UserProfile = {
      id: 'usr_sandbox_' + Math.random().toString(36).substring(2, 9),
      username: pendingEmail.split('@')[0],
      email: pendingEmail,
      imageUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${pendingEmail}`,
    };

    setUser(dummyUser);
    setIsAuthenticated(true);
    setVerificationRequired(false);
    setIsLoading(false);

    localStorage.setItem('mc_user', JSON.stringify(dummyUser));
    router.push('/');
    return dummyUser;
  };

  const logout = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    localStorage.removeItem('mc_user');
    sessionStorage.removeItem('mc_user');
    setUser(null);
    setIsAuthenticated(false);
    setIsLoading(false);
    router.push('/login');
  };

  const loginWithProvider = async (provider: 'oauth_google' | 'oauth_github') => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const providerName = provider === 'oauth_google' ? 'Google User' : 'GitHub User';
    const dummyUser: UserProfile = {
      id: 'usr_sandbox_' + Math.random().toString(36).substring(2, 9),
      username: provider === 'oauth_google' ? 'google_dev' : 'github_dev',
      email: `${provider}@sandbox.local`,
      imageUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${provider}`,
    };

    setUser(dummyUser);
    setIsAuthenticated(true);
    setIsLoading(false);

    localStorage.setItem('mc_user', JSON.stringify(dummyUser));
    router.push('/');
    return dummyUser;
  };

  return (
    <AuthContext.Provider
      value={{
        isClerkEnabled: false,
        user,
        isAuthenticated,
        isLoading,
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

// Helper for Real Clerk Auth integration
function ClerkAuthProviderHelper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  
  // Real Clerk imports
  const { useAuth: useClerkAuth, useUser: useClerkUser, useSignIn, useSignUp } = require('@clerk/nextjs');
  
  const { isLoaded: isAuthLoaded, userId, signOut } = useClerkAuth();
  const { isLoaded: isUserLoaded, user: clerkUser } = useClerkUser();
  const { isLoaded: isSignInLoaded, signIn, setActive: setSignInActive } = useSignIn();
  const { isLoaded: isSignUpLoaded, signUp, setActive: setSignUpActive } = useSignUp();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [verificationRequired, setVerificationRequired] = useState<boolean>(false);
  const [pendingEmail, setPendingEmail] = useState<string>('');

  useEffect(() => {
    if (isAuthLoaded && isUserLoaded) {
      setIsLoading(false);
    }
  }, [isAuthLoaded, isUserLoaded]);

  const login = async (email: string, password: string, rememberMe: boolean) => {
    if (!isSignInLoaded) throw new Error('Clerk SDK is not initialized yet.');
    setIsLoading(true);

    try {
      const result = await signIn.create({
        identifier: email,
        password: password,
      });

      if (result.status === 'complete') {
        await setSignInActive({ session: result.createdSessionId });
        router.push('/');
        return result;
      } else {
        throw new Error(`Login status incomplete: ${result.status}`);
      }
    } catch (e: any) {
      setIsLoading(false);
      throw new Error(e.errors?.[0]?.message || e.message || 'Login failed.');
    }
  };

  const register = async (username: string, email: string, password: string) => {
    if (!isSignUpLoaded) throw new Error('Clerk SDK is not initialized yet.');
    setIsLoading(true);

    try {
      // 1. Create signUp profile with Clerk
      await signUp.create({
        emailAddress: email,
        password: password,
        username: username,
      });

      // 2. Prepare email verification (Clerk automatically sends the code)
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      
      setPendingEmail(email);
      setVerificationRequired(true);
      setIsLoading(false);
    } catch (e: any) {
      setIsLoading(false);
      throw new Error(e.errors?.[0]?.message || e.message || 'Registration failed.');
    }
  };

  const verifyEmailCode = async (code: string) => {
    if (!isSignUpLoaded) throw new Error('Clerk SDK is not initialized yet.');
    setIsLoading(true);

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: code,
      });

      if (result.status === 'complete') {
        await setSignUpActive({ session: result.createdSessionId });
        setVerificationRequired(false);
        setIsLoading(false);
        router.push('/');
        return result;
      } else {
        throw new Error(`Email verification incomplete: ${result.status}`);
      }
    } catch (e: any) {
      setIsLoading(false);
      throw new Error(e.errors?.[0]?.message || e.message || 'Verification failed.');
    }
  };

  const logout = async () => {
    setIsLoading(true);
    await signOut();
    setIsLoading(false);
    router.push('/login');
  };

  const loginWithProvider = async (provider: 'oauth_google' | 'oauth_github') => {
    if (!isSignInLoaded) throw new Error('Clerk SDK is not initialized yet.');
    
    try {
      await signIn.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/',
      });
    } catch (e: any) {
      throw new Error(e.errors?.[0]?.message || e.message || 'OAuth authentication failed.');
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

// Master AuthProvider that decides dynamically based on configurations
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [clerkActive, setClerkActive] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(true);

  useEffect(() => {
    setClerkActive(isClerkConfigured());
    setChecking(false);
  }, []);

  if (checking) {
    return null; // Prevent hydration mismatch
  }

  if (clerkActive) {
    return <ClerkAuthProviderHelper>{children}</ClerkAuthProviderHelper>;
  }

  return <SandboxAuthProviderHelper>{children}</SandboxAuthProviderHelper>;
}

// Hook to access auth contexts
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
