'use client';

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '@/_context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Terminal, Shield, Mail, Lock, Loader2, ArrowRight, Eye, EyeOff, User, CheckCircle2, Info } from 'lucide-react';
import TurnstileCaptcha from '@components/TurnstileCaptcha';

export default function RegisterPage() {
  const router = useRouter();
  const { 
    isClerkEnabled, 
    register, 
    verifyEmailCode, 
    verificationRequired, 
    setVerificationRequired,
    pendingEmail,
    isAuthenticated, 
    isLoading: authLoading 
  } = useAuthContext();

  // Inputs
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  
  // Visual Toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // CAPTCHA State
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  
  // UI States
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Initial validations
    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Please fill in all registration fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (!captchaToken) {
      setError('Please complete the CAPTCHA security verification.');
      return;
    }

    setLocalLoading(true);
    try {
      await register(username, email, password);
      // Switches the screen to Verification Phase (handled by AuthContext state)
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
      setLocalLoading(false);
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (verificationCode.length !== 6) {
      setError('Verification code must be exactly 6 digits.');
      return;
    }

    setLocalLoading(true);
    try {
      await verifyEmailCode(verificationCode);
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please try again.');
      setLocalLoading(false);
    }
  };

  // Safe Simulation code filler
  const handleAutocompleteSimulation = () => {
    setVerificationCode('123456');
    setError(null);
  };

  const isLoading = authLoading || localLoading;

  // Render Verification code input interface
  if (verificationRequired) {
    return (
      <div className="w-full max-w-md mx-auto my-8 px-4 flex flex-col justify-center min-h-[70vh]">
        <div className="relative group">
          <div className="absolute -inset-1.5 bg-gradient-to-r from-accent to-purple-600 rounded-3xl blur opacity-30 group-hover:opacity-40 transition duration-1000"></div>
          
          <div className="relative bg-card-bg/80 border border-card-border backdrop-blur-xl p-8 rounded-2xl shadow-2xl flex flex-col gap-6">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 rounded-xl bg-correct/10 border border-correct/30 flex items-center justify-center mb-1">
                <CheckCircle2 className="w-6 h-6 text-correct" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Verify Your Email
              </h2>
              <p className="text-xs text-untyped">
                We sent a 6-digit confirmation code to <span className="text-foreground font-semibold">{pendingEmail}</span>.
              </p>
            </div>

            <form onSubmit={handleVerifySubmit} className="flex flex-col gap-4">
              {error && (
                <div className="p-3.5 bg-error-dim/20 border border-error/30 rounded-xl text-error text-xs flex items-start gap-2.5">
                  <Shield className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label htmlFor="code" className="text-xs font-semibold text-foreground">
                  6-Digit Code
                </label>
                <input
                  id="code"
                  type="text"
                  maxLength={6}
                  required
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  disabled={isLoading}
                  className="w-full bg-card-muted border border-card-border focus:border-accent/80 focus:ring-1 focus:ring-accent/40 rounded-xl py-3 text-center tracking-widest text-lg font-bold outline-none transition-all text-foreground"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-accent hover:bg-accent/90 text-black font-semibold rounded-xl py-2.5 px-4 text-sm flex items-center justify-center gap-2  shadow-accent/25 hover:shadow-accent/40 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Complete Registration
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Simulation/Autocomplete helper button (available for mock testing) */}
              {!isClerkEnabled && (
                <button
                  type="button"
                  onClick={handleAutocompleteSimulation}
                  className="w-full bg-card-muted hover:bg-card-border border border-card-border text-untyped hover:text-foreground font-medium rounded-xl py-2 px-4 text-xs transition-all cursor-pointer text-center"
                >
                  Autocomplete Simulation (Code: 123456)
                </button>
              )}
            </form>

            {/* Provider Configuration details */}
            <div className="bg-card-muted/50 border border-card-border rounded-xl p-4 flex flex-col gap-2.5">
              <div className="flex items-start gap-2.5">
                <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span className="text-[10px] text-untyped font-semibold uppercase tracking-wider">
                  Provider Guide
                </span>
              </div>
              <p className="text-[11px] text-untyped leading-relaxed">
                When using Clerk, email codes are **sent automatically for free** with zero custom SMTP setup. In the Clerk Dashboard, go to **User & Auth** &rarr; **Authentication** and toggle **Email verification code**.
              </p>
            </div>

            <div className="text-center text-xs text-untyped border-t border-card-border pt-4">
              <button 
                onClick={() => setVerificationRequired(false)} 
                className="text-untyped hover:text-foreground transition-all cursor-pointer underline"
              >
                Go back to form
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // Standard Registration Form
  return (
    <div className="w-full max-w-md mx-auto my-8 px-4 flex flex-col justify-center min-h-[70vh]">
      <div className="relative group">
        
        {/* Card Body */}
        <div className="relative bg-card-bg/80 border border-card-border backdrop-blur-xl p-8 rounded-2xl flex flex-col gap-6">
          
          {/* Header */}
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-accent-dim border border-accent/30 flex items-center justify-center mb-1">
              <Terminal className="w-6 h-6 text-accent" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Create Account
            </h2>
            <p className="text-xs text-untyped">
              Register to save your typing progress, settings, and unlock typing leaderboards.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="p-3.5 bg-error-dim/20 border border-error/30 rounded-xl text-error text-xs flex items-start gap-2.5">
                <Shield className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Username Field */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="username" className="text-xs font-semibold text-foreground">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-untyped" />
                <input
                  id="username"
                  type="text"
                  required
                  placeholder="monkeycoder"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-card-muted border border-card-border focus:border-accent/80 focus:ring-1 focus:ring-accent/40 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none transition-all text-foreground"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-foreground">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-untyped" />
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-card-muted border border-card-border focus:border-accent/80 focus:ring-1 focus:ring-accent/40 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none transition-all text-foreground"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-xs font-semibold text-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-untyped" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-card-muted border border-card-border focus:border-accent/80 focus:ring-1 focus:ring-accent/40 rounded-xl py-2.5 pl-10 pr-11 text-sm outline-none transition-all text-foreground"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-untyped hover:text-foreground cursor-pointer transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirmPassword" className="text-xs font-semibold text-foreground">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-untyped" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-card-muted border border-card-border focus:border-accent/80 focus:ring-1 focus:ring-accent/40 rounded-xl py-2.5 pl-10 pr-11 text-sm outline-none transition-all text-foreground"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-untyped hover:text-foreground cursor-pointer transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Turnstile Captcha */}
            <TurnstileCaptcha onVerify={setCaptchaToken} />

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent hover:bg-accent/90 text-black font-semibold rounded-xl py-2.5 px-4 text-sm flex items-center justify-center gap-2 shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Register
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center text-xs text-untyped border-t border-card-border pt-4">
            Already have an account?{' '}
            <Link href="/login" className="text-accent hover:underline font-semibold">
              Sign in
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
