'use client';

import React from 'react';
import Header from '@/_components/Header';
import SettingsPage from './_components/SettingsPage';
import { Cpu } from 'lucide-react';
import { useAppSelector } from '@/_store/hooks';
import Loading from '@/loading';

export default function Settings() {
  const isPageLoading = useAppSelector((state) => state.config.isPageLoading);

  return (
    <div className="flex-1 flex flex-col justify-between bg-background text-foreground min-h-screen transition-colors duration-300">
      <Header />

      <main className="flex-1 flex flex-col justify-center py-6 relative z-10 animate-in fade-in duration-200">
        {isPageLoading ? <Loading /> : <SettingsPage />}
      </main>

      <footer className="w-full max-w-5xl mx-auto py-6 px-4 border-t border-card-border/60 flex flex-wrap items-center justify-between text-xs text-untyped gap-4 mt-8">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-untyped/70" />
          <span>Monkeycode Engine v1.0.0</span>
        </div>
        <div>&copy; {new Date().getFullYear()} Monkeycode. All rights reserved.</div>
      </footer>
    </div>
  );
}
