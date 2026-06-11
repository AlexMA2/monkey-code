'use client';

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '@/_context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Terminal, Shield, Mail, Lock, Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';
import TurnstileCaptcha from '@components/TurnstileCaptcha';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Checkbox } from '@components/ui/checkbox';
import { Label } from '@components/ui/label';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithProvider, isAuthenticated, isLoading: authLoading } = useAuthContext();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
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

    // Validate inputs
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all credentials.');
      return;
    }

    // Enforce captcha verification
    if (!captchaToken) {
      setError('Please complete the CAPTCHA security verification.');
      return;
    }

    setLocalLoading(true);
    try {
      await login(email, password, rememberMe);
      // Success redirection is handled by AuthContext or useEffect
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
      setLocalLoading(false);
    }
  };

  const handleOAuth = async (provider: 'oauth_google' | 'oauth_github') => {
    setError(null);
    setLocalLoading(true);
    try {
      await loginWithProvider(provider);
    } catch (err: any) {
      setError(err.message || 'OAuth authentication failed.');
      setLocalLoading(false);
    }
  };

  const isLoading = authLoading || localLoading;

  return (
    <div className="w-full max-w-md mx-auto my-8 px-4 flex flex-col justify-center min-h-[70vh]">
      <div className="relative group">
        
        {/* Card Body */}
        <div className="relative bg-card-bg/80 border border-card-border backdrop-blur-xl p-8 rounded-2xl flex flex-col gap-6">
          
          {/* Brand/Header */}
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-accent-dim border border-accent/30 flex items-center justify-center mb-1">
              <Terminal className="w-6 h-6 text-accent" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Sign in to Monkey<span className="text-accent">Code</span>
            </h2>
            <p className="text-xs text-untyped">
              Enter your developer credentials to synchronize your settings and stats.
            </p>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              onClick={() => handleOAuth('oauth_google')}
              disabled={isLoading}
              variant="secondary"
              className="flex items-center justify-center gap-2.5 py-2.5 px-4 h-auto cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              Google
            </Button>
            <Button
              type="button"
              onClick={() => handleOAuth('oauth_github')}
              disabled={isLoading}
              variant="secondary"
              className="flex items-center justify-center gap-2.5 py-2.5 px-4 h-auto cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              GitHub
            </Button>
          </div>

          <div className="flex items-center gap-4 text-xs text-untyped">
            <div className="h-[1px] flex-1 bg-card-border"></div>
            <span>OR CONTINUE WITH</span>
            <div className="h-[1px] flex-1 bg-card-border"></div>
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="p-3.5 bg-error-dim/20 border border-error/30 rounded-xl text-error text-xs flex items-start gap-2.5">
                <Shield className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
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

            {/* Remember Me Box */}
            <div className="flex items-center gap-2 py-1 select-none">
              <Checkbox
                id="rememberMe"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(!!checked)}
                disabled={isLoading}
              />
              <Label htmlFor="rememberMe" className="text-xs font-medium text-untyped cursor-pointer">
                Remember me on this machine
              </Label>
            </div>

            {/* Cloudflare Turnstile Captcha */}
            <TurnstileCaptcha onVerify={setCaptchaToken} />

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
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          {/* Register Link */}
          <div className="text-center text-xs text-untyped border-t border-card-border pt-4">
            Don't have an account?{' '}
            <Link href="/register" className="text-accent hover:underline font-semibold">
              Create an account
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
