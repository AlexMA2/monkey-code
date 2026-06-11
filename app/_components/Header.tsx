'use client';

import React, { useEffect, useState } from 'react';
import { Moon, Settings2, Sun, Terminal, Menu, X } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../_store/hooks';
import { toggleTheme, setPageLoading } from '../_store/configSlice';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.config.theme);
  const [isOpen, setIsOpen] = useState(false);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeTab = 
    pathname === '/settings' 
      ? 'settings' 
      : pathname === '/coding' 
      ? 'coding' 
      : 'home';

  const handleNavigation = (path: string) => {
    if (pathname !== path) {
      dispatch(setPageLoading(true));
      router.push(path);
    }
  };

  return (
    <header className="w-full max-w-5xl mx-auto flex flex-col gap-6 py-6 px-4 relative z-50">
      {/* Brand logo & tagline */}
      <div className="flex items-center justify-between gap-4 border-b border-card-border pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-accent/20 p-2.5 rounded-xl border border-accent/40">
            <Terminal className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              Monkey<span className="text-accent">Code</span>
            </h1>
          </div>
        </div>

        {/* Header Navigation Tab Menu & Theme Toggle */}
        <div className="flex items-center gap-3">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 bg-card-bg border border-card-border p-1 rounded-xl">
            <button
              onClick={() => handleNavigation('/')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                activeTab === 'home' 
                  ? 'bg-accent/15 text-accent border border-accent/20' 
                  : 'text-untyped hover:bg-card-muted hover:text-foreground border border-transparent'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              Home
            </button>
            <button
              onClick={() => handleNavigation('/coding')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                activeTab === 'coding' 
                  ? 'bg-accent/15 text-accent border border-accent/20' 
                  : 'text-untyped hover:bg-card-muted hover:text-foreground border border-transparent'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              Coding
            </button>
            <button
              onClick={() => handleNavigation('/settings')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                activeTab === 'settings' 
                  ? 'bg-accent/15 text-accent border border-accent/20' 
                  : 'text-untyped hover:bg-card-muted hover:text-foreground border border-transparent'
              }`}
            >
              <Settings2 className="w-3.5 h-3.5" />
              Settings
            </button>
          </nav>

          <button
            onClick={() => dispatch(toggleTheme())}
            aria-label="Toggle Theme"
            className="flex items-center justify-center p-2.5 rounded-xl bg-card-bg border border-card-border text-untyped hover:text-accent hover:border-accent/40 cursor-pointer transition-all duration-200"
          >
            {!mounted ? (
              <div className="w-4 h-4" />
            ) : theme === 'dark' ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
            className="hidden max-md:flex items-center justify-center p-2.5 rounded-xl bg-card-bg border border-card-border text-untyped hover:text-accent hover:border-accent/40 cursor-pointer transition-all duration-200"
          >
            {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isOpen && (
        <nav className="hidden max-md:flex flex-col gap-1.5 bg-card-bg border border-card-border p-2 rounded-2xl absolute top-20 right-4 w-48 shadow-xl z-50 backdrop-blur-md">
          <button
            onClick={() => {
              handleNavigation('/');
              setIsOpen(false);
            }}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-all ${
              activeTab === 'home' 
                ? 'bg-accent/15 text-accent border border-accent/20' 
                : 'text-untyped hover:bg-card-muted hover:text-foreground border border-transparent'
            }`}
          >
            <Terminal className="w-4 h-4" />
            Home
          </button>
          <button
            onClick={() => {
              handleNavigation('/coding');
              setIsOpen(false);
            }}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-all ${
              activeTab === 'coding' 
                ? 'bg-accent/15 text-accent border border-accent/20' 
                : 'text-untyped hover:bg-card-muted hover:text-foreground border border-transparent'
            }`}
          >
            <Terminal className="w-4 h-4" />
            Coding
          </button>
          <button
            onClick={() => {
              handleNavigation('/settings');
              setIsOpen(false);
            }}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-all ${
              activeTab === 'settings' 
                ? 'bg-accent/15 text-accent border border-accent/20' 
                : 'text-untyped hover:bg-card-muted hover:text-foreground border border-transparent'
            }`}
          >
            <Settings2 className="w-4 h-4" />
            Settings
          </button>
        </nav>
      )}
    </header>
  );
}
