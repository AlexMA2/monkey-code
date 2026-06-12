'use client';

import { useAuthContext } from '@/_context/AuthContext';
import TurnstileCaptcha from '@components/TurnstileCaptcha';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail, Shield, Terminal, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import PasswordRequirements from './_components/PasswordRequirements';
import VerificationCode from './_components/VerificationCode';
import { PASSWORD_REQUIREMENTS } from './constants';

export default function RegisterPage() {
  const router = useRouter();
  const {
    register,
    verifyEmailCode,
    verificationRequired,
    setVerificationRequired,
    pendingEmail,
    isAuthenticated,
    isLoading: authLoading,
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

    const unmet = PASSWORD_REQUIREMENTS.filter((req) => !req.test(password));
    if (unmet.length > 0) {
      setError('Password requirements not met:\n' + unmet.map((u) => `• ${u.label}`).join('\n'));
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
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed.');
    } finally {
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
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Verification failed. Please try again.');
      setLocalLoading(false);
    }
  };

  const isLoading = authLoading || localLoading;

  // Render Verification code input interface
  if (verificationRequired) {
    return (
      <VerificationCode
        pendingEmail={pendingEmail}
        verificationCode={verificationCode}
        setVerificationCode={setVerificationCode}
        isLoading={isLoading}
        error={error}
        onSubmit={handleVerifySubmit}
        onGoBack={() => setVerificationRequired(false)}
      />
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
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Create Account</h2>
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
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-untyped z-10" />
                <Input
                  id="username"
                  type="text"
                  required
                  placeholder="monkeycoder"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  className="pl-10 h-11 rounded-xl"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-untyped z-10" />
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="pl-10 h-11 rounded-xl"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-untyped z-10" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="pl-10 pr-11 h-11 rounded-xl"
                />
                <Button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-untyped hover:text-foreground hover:bg-transparent h-9 w-9"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Password Requirements Checklist */}
            <PasswordRequirements password={password} />

            {/* Confirm Password Field */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-untyped z-10" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  className="pl-10 pr-11 h-11 rounded-xl"
                />
                <Button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-untyped hover:text-foreground hover:bg-transparent h-9 w-9"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Turnstile Captcha */}
            <TurnstileCaptcha onVerify={setCaptchaToken} />

            {/* Clerk Captcha Target for Bot Detection */}
            <div id="clerk-captcha"></div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              variant="default"
              className="w-full font-semibold rounded-xl py-2.5 px-4 text-sm flex items-center justify-center gap-2 shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer h-11"
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
            </Button>
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
