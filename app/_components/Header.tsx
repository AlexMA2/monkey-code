'use client';

import { useAuthContext } from '@/_context/AuthContext';
import { Button } from '@components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@components/ui/dialog';
import { setPageLoading, toggleTheme } from '@store/configSlice';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { LogIn, LogOut, Menu, Moon, Settings2, Sun, Terminal, UserPlus, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.config.theme);
  const { isAuthenticated, user, logout, isLoading } = useAuthContext();
  
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeTab = 
    pathname === '/settings' 
      ? 'settings' 
      : pathname === '/coding' 
      ? 'coding' 
      : pathname === '/login'
      ? 'login'
      : pathname === '/register'
      ? 'register'
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
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2 cursor-pointer" onClick={() => handleNavigation('/')}>
              Monkey<span className="text-accent">Code</span>
            </h1>
          </div>
        </div>

        {/* Header Navigation Tab Menu & Theme Toggle */}
        <div className="flex items-center gap-3">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 bg-card-bg border border-card-border p-1 rounded-xl">
            <Button
              onClick={() => handleNavigation('/')}
              variant={activeTab === 'home' ? 'accentSubtle' : 'ghost'}
              size="sm"
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold"
            >
              <Terminal className="w-3.5 h-3.5" />
              Home
            </Button>
            <Button
              onClick={() => handleNavigation('/coding')}
              variant={activeTab === 'coding' ? 'accentSubtle' : 'ghost'}
              size="sm"
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold"
            >
              <Terminal className="w-3.5 h-3.5" />
              Coding
            </Button>
            <Button
              onClick={() => handleNavigation('/settings')}
              variant={activeTab === 'settings' ? 'accentSubtle' : 'ghost'}
              size="sm"
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold"
            >
              <Settings2 className="w-3.5 h-3.5" />
              Settings
            </Button>
          </nav>

          {/* Desktop Auth Controls */}
          <div className="hidden md:flex items-center gap-2">
            {isLoading ? (
              <div className="flex items-center justify-center bg-card-bg border border-card-border h-[38px] w-[150px] rounded-xl">
                <Loader2 className="w-4 h-4 animate-spin text-accent" />
              </div>
            ) : isAuthenticated && user ? (
              <div className="flex items-center gap-3 bg-card-bg border border-card-border px-3 py-1.5 rounded-xl">
                <Image
                  src={user.imageUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.email}`}
                  alt={user.username}
                  width={20}
                  height={20}
                  className="rounded-full border border-accent/30 bg-card-muted"
                />
                <span className="text-xs font-semibold text-foreground max-w-[100px] truncate">
                  {user.username}
                </span>
                <Button
                  onClick={() => setShowLogoutModal(true)}
                  variant="ghost"
                  size="icon"
                  aria-label="Logout"
                  className="h-7 w-7 text-untyped hover:text-error pl-1 border-l border-card-border rounded-none"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 bg-card-bg border border-card-border p-1 rounded-xl">
                <Button
                  onClick={() => handleNavigation('/login')}
                  variant={activeTab === 'login' ? 'accentSubtle' : 'ghost'}
                  size="sm"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold"
                >
                  <LogIn className="w-3 h-3" />
                  Sign In
                </Button>
                <Button
                  onClick={() => handleNavigation('/register')}
                  variant={activeTab === 'register' ? 'accentSubtle' : 'ghost'}
                  size="sm"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold"
                >
                  <UserPlus className="w-3 h-3" />
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          <Button
            onClick={() => dispatch(toggleTheme())}
            variant="outline"
            size="icon"
            aria-label="Toggle Theme"
            className="flex items-center justify-center p-2.5 rounded-xl bg-card-bg border border-card-border text-untyped hover:text-accent hover:border-accent/40 transition-all duration-200"
          >
            {!mounted ? (
              <div className="w-4 h-4" />
            ) : theme === 'dark' ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>

          {/* Mobile Menu Hamburger Button */}
          <Button
            onClick={() => setIsOpen(!isOpen)}
            variant="outline"
            size="icon"
            aria-label="Toggle Menu"
            className="hidden max-md:flex items-center justify-center p-2.5 rounded-xl bg-card-bg border border-card-border text-untyped hover:text-accent hover:border-accent/40 transition-all duration-200"
          >
            {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isOpen && (
        <nav className="hidden max-md:flex flex-col gap-1.5 bg-card-bg border border-card-border p-2 rounded-2xl absolute top-20 right-4 w-48 shadow-xl z-50 backdrop-blur-md">
          <Button
            onClick={() => {
              handleNavigation('/');
              setIsOpen(false);
            }}
            variant={activeTab === 'home' ? 'accentSubtle' : 'ghost'}
            className="flex items-center gap-2.5 px-4 py-2.5 justify-start text-sm font-semibold w-full"
          >
            <Terminal className="w-4 h-4" />
            Home
          </Button>
          <Button
            onClick={() => {
              handleNavigation('/coding');
              setIsOpen(false);
            }}
            variant={activeTab === 'coding' ? 'accentSubtle' : 'ghost'}
            className="flex items-center gap-2.5 px-4 py-2.5 justify-start text-sm font-semibold w-full"
          >
            <Terminal className="w-4 h-4" />
            Coding
          </Button>
          <Button
            onClick={() => {
              handleNavigation('/settings');
              setIsOpen(false);
            }}
            variant={activeTab === 'settings' ? 'accentSubtle' : 'ghost'}
            className="flex items-center gap-2.5 px-4 py-2.5 justify-start text-sm font-semibold w-full"
          >
            <Settings2 className="w-4 h-4" />
            Settings
          </Button>

          {/* Mobile Auth Controls */}
          <div className="h-[1px] bg-card-border my-1"></div>
          {isLoading ? (
            <div className="flex justify-center py-3">
              <Loader2 className="w-5 h-5 animate-spin text-accent" />
            </div>
          ) : isAuthenticated && user ? (
            <div className="flex flex-col gap-1 px-1">
              <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-foreground">
                <Image
                  src={user.imageUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.email}`}
                  alt={user.username}
                  width={18}
                  height={18}
                  className="rounded-full border border-accent/30"
                />
                <span className="truncate">{user.username}</span>
              </div>
              <Button
                onClick={() => {
                  setShowLogoutModal(true);
                  setIsOpen(false);
                }}
                variant="ghost"
                className="flex items-center gap-2.5 px-4 py-2.5 justify-start text-sm font-semibold text-error hover:bg-error-dim/10 w-full"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <Button
                onClick={() => {
                  handleNavigation('/login');
                  setIsOpen(false);
                }}
                variant={activeTab === 'login' ? 'accentSubtle' : 'ghost'}
                className="flex items-center gap-2.5 px-4 py-2.5 justify-start text-sm font-semibold w-full"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Button>
              <Button
                onClick={() => {
                  handleNavigation('/register');
                  setIsOpen(false);
                }}
                variant={activeTab === 'register' ? 'accentSubtle' : 'ghost'}
                className="flex items-center gap-2.5 px-4 py-2.5 justify-start text-sm font-semibold w-full"
              >
                <UserPlus className="w-4 h-4" />
                Sign Up
              </Button>
            </div>
          )}
        </nav>
      )}

      <Dialog open={showLogoutModal} onOpenChange={setShowLogoutModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="bg-error/10 p-2.5 rounded-xl border border-error/20 text-error flex items-center justify-center">
                <LogOut className="w-5 h-5" />
              </div>
              <DialogTitle>Confirm Sign Out</DialogTitle>
            </div>
            <DialogDescription className="text-xs text-untyped mt-2">
              Are you sure you want to log out of your session?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex flex-row justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => setShowLogoutModal(false)}
              className="text-xs font-semibold px-4 py-2"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setShowLogoutModal(false);
                logout();
              }}
              className="text-xs font-semibold px-4 py-2"
            >
              Sign Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}
