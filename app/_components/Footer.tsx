'use client';

import { Cpu, Keyboard } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const isCoding = pathname === '/coding';

  return (
    <footer className="w-full max-w-5xl mx-auto py-6 px-4 border-t border-card-border/60 flex flex-wrap items-center justify-between text-xs text-untyped gap-4 mt-8">
      <div className="flex items-center gap-2">
        <Cpu className="w-4 h-4 text-untyped/70" />
        <span>Monkeycode Engine v1.0.0</span>
      </div>
      <div className="flex items-center gap-4">
        {isCoding && (
          <span className="flex items-center gap-1">
            <Keyboard className="w-3.5 h-3.5" />{' '}
            <kbd className="px-1.5 py-0.5 bg-card-muted rounded text-foreground/70 border border-card-border">Tab</kbd>{' '}
            +{' '}
            <kbd className="px-1.5 py-0.5 bg-card-muted rounded text-foreground/70 border border-card-border">Enter</kbd>{' '}
            to restart
          </span>
        )}
        <span>&copy; {new Date().getFullYear()} Monkeycode. All rights reserved.</span>
      </div>
    </footer>
  );
}
