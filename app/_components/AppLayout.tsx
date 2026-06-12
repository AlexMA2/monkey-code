'use client';

import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Loading from '../loading';
import { useAppSelector } from '@store/hooks';
import { useResultsSync } from '@hooks/useResultsSync';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const isPageLoading = useAppSelector((state) => state.config.isPageLoading);

  // Initialize results sync logic at layout level
  useResultsSync();

  return (
    <div className="flex-1 flex flex-col justify-between bg-background text-foreground min-h-screen transition-colors duration-300">
      <Header />
      {isPageLoading ? (
        <main className="flex-1 flex flex-col justify-center py-6 relative z-10 animate-in fade-in duration-200">
          <Loading />
        </main>
      ) : (
        children
      )}
      <Footer />
    </div>
  );
}
