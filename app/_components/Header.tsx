'use client';

import { Moon, Settings2, Sun, Terminal } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../_store/hooks';
import { toggleTheme } from '../_store/configSlice';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.config.theme);

  const activeTab = 
    pathname === '/settings' 
      ? 'settings' 
      : pathname === '/coding' 
      ? 'coding' 
      : 'home';

  return (
    <header className="w-full max-w-5xl mx-auto flex flex-col gap-6 py-6 px-4 relative z-50">
      {/* Brand logo & tagline */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-card-border pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-accent/20 p-2.5 rounded-xl border border-accent/40 caret-pulse">
            <Terminal className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              monkey<span className="text-accent">code</span>
            </h1>
            <p className="text-xs text-untyped">Exclusively tailored for typing code</p>
          </div>
        </div>

        {/* Header Navigation Tab Menu & Theme Toggle */}
        <div className="flex items-center gap-3">
          <nav className="flex items-center gap-1.5 bg-card-bg border border-card-border p-1 rounded-xl">
            <button
              onClick={() => router.push('/')}
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
              onClick={() => router.push('/coding')}
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
              onClick={() => router.push('/settings')}
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
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
