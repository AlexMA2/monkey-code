'use client';

import { useState, useEffect } from 'react';

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

// Custom Auth Hook
export function useAuth() {
  const isEnabled = isClerkConfigured();
  
  // Real Clerk integration import & usage will be loaded conditionally or safely
  // To avoid runtime hooks execution issues, we write standard hooks but safely fallback
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [verificationRequired, setVerificationRequired] = useState<boolean>(false);
  const [pendingEmail, setPendingEmail] = useState<string>('');

  // ----------------------------------------------------
  // SANDBOX MOCK IMPLEMENTATION (WHEN CLERK IS NOT KEYED)
  // ----------------------------------------------------
  useEffect(() => {
    if (isEnabled) {
      // If clerk is enabled, the actual Clerk components/hooks will handle authentication.
      // But we will expose a similar schema.
      setIsLoading(false);
      return;
    }

    // Load mock user session
    const checkSession = () => {
      const storedUser = localStorage.getItem('mc_user') || sessionStorage.getItem('mc_user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setUser(parsed);
          setIsAuthenticated(true);
        } catch (e) {
          console.error('Failed to parse stored user session', e);
        }
      }
      setIsLoading(false);
    };

    checkSession();
  }, [isEnabled]);

  // Mock Login Action
  const loginSandbox = async (email: string, password: string, rememberMe: boolean) => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simple security validation
    if (!email || !password) {
      setIsLoading(false);
      throw new Error('Email and password are required.');
    }

    const dummyUser: UserProfile = {
      id: 'usr_sandbox_123',
      username: email.split('@')[0],
      email: email,
      imageUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`,
    };

    setUser(dummyUser);
    setIsAuthenticated(true);
    setIsLoading(false);

    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('mc_user', JSON.stringify(dummyUser));
    return dummyUser;
  };

  // Mock Register Action
  const registerSandbox = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (!username || !email || !password) {
      setIsLoading(false);
      throw new Error('All fields are required.');
    }

    setPendingEmail(email);
    setVerificationRequired(true);
    setIsLoading(false);
  };

  // Mock Verify Code Action
  const verifyEmailCodeSandbox = async (code: string) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (code !== '123456' && code !== '000000') {
      setIsLoading(false);
      throw new Error('Invalid verification code. Use 123456 to simulate success.');
    }

    const dummyUser: UserProfile = {
      id: 'usr_sandbox_123',
      username: pendingEmail.split('@')[0],
      email: pendingEmail,
      imageUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${pendingEmail}`,
    };

    setUser(dummyUser);
    setIsAuthenticated(true);
    setVerificationRequired(false);
    setIsLoading(false);

    localStorage.setItem('mc_user', JSON.stringify(dummyUser));
    return dummyUser;
  };

  // Mock Logout Action
  const logoutSandbox = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    localStorage.removeItem('mc_user');
    sessionStorage.removeItem('mc_user');
    setUser(null);
    setIsAuthenticated(false);
    setIsLoading(false);
  };

  return {
    isClerkEnabled: isEnabled,
    user,
    isAuthenticated,
    isLoading,
    verificationRequired,
    pendingEmail,
    setVerificationRequired,
    // Methods
    login: loginSandbox,
    register: registerSandbox,
    verifyEmailCode: verifyEmailCodeSandbox,
    logout: logoutSandbox,
  };
}
