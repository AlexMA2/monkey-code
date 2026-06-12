import React from 'react';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { ArrowRight, CheckCircle2, Loader2, Shield } from 'lucide-react';

interface VerificationCodeProps {
  pendingEmail: string;
  verificationCode: string;
  setVerificationCode: (code: string) => void;
  isLoading: boolean;
  error: string | null;
  onSubmit: (e: React.FormEvent) => void;
  onGoBack: () => void;
}

export default function VerificationCode({
  pendingEmail,
  verificationCode,
  setVerificationCode,
  isLoading,
  error,
  onSubmit,
  onGoBack,
}: VerificationCodeProps) {
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
              We sent a 6-digit confirmation code to{' '}
              <span className="text-foreground font-semibold">{pendingEmail}</span>.
            </p>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="p-3.5 bg-error-dim/20 border border-error/30 rounded-xl text-error text-xs flex items-start gap-2.5">
                <Shield className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="code">6-Digit Code</Label>
              <Input
                id="code"
                type="text"
                maxLength={6}
                required
                placeholder="000000"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                disabled={isLoading}
                className="w-full text-center tracking-widest text-lg font-bold h-12 rounded-xl"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              variant="default"
              className="w-full font-semibold rounded-xl py-2.5 px-4 text-sm flex items-center justify-center gap-2 shadow-accent/25 hover:shadow-accent/40 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer h-11"
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
            </Button>
          </form>

          <div className="text-center text-xs text-untyped border-t border-card-border pt-4">
            <Button
              onClick={onGoBack}
              variant="link"
              className="text-untyped hover:text-foreground transition-all cursor-pointer underline p-0 h-auto"
            >
              Go back to form
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}