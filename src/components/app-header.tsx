'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { User as UserIcon, LogOut, Search, Settings, Bell } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';

import { AppLogo } from '@/components/app-logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LanguageToggle } from '@/components/language-toggle';
import { useAuth } from '@/contexts/auth-context';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/language-context';
import { cn } from '@/lib/utils';

export function AppHeader() {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: 'Success', description: 'Logged out successfully.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to logout.' });
    }
  };

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/seven-twelve-to-vigha', label: '7/12' },
    { href: '/calculator', label: t('standardCalculator') },
    { href: '/fd-calculator', label: t('fdCalculator') },
  ];

  const isDarkHero = pathname === '/' || pathname === '/login' || pathname === '/signup';

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 ease-in-out",
        isScrolled 
          ? "bg-white/80 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] py-2" 
          : "bg-transparent py-4"
      )}
    >
      <div className="page-container flex items-center justify-between px-4 sm:px-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-1 bg-white rounded-xl group-hover:scale-105 transition-all duration-500 shadow-sm border border-primary/5">
              <AppLogo className="h-8 w-8 md:h-10 md:w-10" />
            </div>
            <div className="flex flex-col -space-y-0.5 hidden md:flex">
              <span className={cn(
                "font-black text-base md:text-xl tracking-tight uppercase transition-colors",
                isScrolled ? "text-slate-900" : (isDarkHero ? "text-white" : "text-slate-900")
              )}>
                {t('appName')}
              </span>
              <span className={cn(
                "text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] transition-opacity",
                isScrolled ? "text-muted-foreground" : (isDarkHero ? "text-white/70" : "text-muted-foreground")
              )}>
                Utility Partner
              </span>
            </div>
          </Link>
        </motion.div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={cn(
                "text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:scale-105",
                pathname === link.href 
                  ? (isScrolled ? "text-primary underline underline-offset-8" : (isDarkHero ? "text-white underline underline-offset-8" : "text-primary"))
                  : (isScrolled ? "text-slate-500 hover:text-primary" : (isDarkHero ? "text-white/80 hover:text-white" : "text-slate-500 hover:text-primary"))
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 md:gap-4"
        >
          <div className="flex items-center gap-1 p-0.5 bg-black/5 rounded-full border border-white/10 backdrop-blur-sm">
            <LanguageToggle />
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "rounded-full transition-colors",
              isScrolled ? "text-slate-500" : (isDarkHero ? "text-white hover:bg-white/10" : "text-slate-500")
            )}
          >
            <Bell className="h-5 w-5" />
          </Button>

          {!loading && (
            user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 md:h-11 md:w-11 rounded-full p-0 overflow-hidden border border-white/20 hover:border-white/50 shadow-sm transition-all duration-300">
                    <Avatar className="h-full w-full rounded-full">
                      <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || 'User'} className="object-cover" />
                      <AvatarFallback className="bg-primary text-white font-black">
                        {user.displayName?.charAt(0) || user.email?.charAt(0).toUpperCase() || <UserIcon className="h-5 w-5" />}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 rounded-[1.75rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-none p-4 mt-2 glass-card" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal p-2">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center font-black text-lg text-primary">
                             {user.displayName?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <p className="text-sm font-black leading-tight text-slate-900">{user.displayName || 'Account'}</p>
                          <p className="text-[10px] text-muted-foreground truncate max-w-[120px] font-bold">
                            {user.email}
                          </p>
                        </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-2" />
                  <DropdownMenuItem className="rounded-xl p-3 cursor-pointer font-bold text-xs">
                    <Settings className="mr-3 h-4 w-4 opacity-60" />
                    <span>Account Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive rounded-xl p-3 cursor-pointer hover:bg-destructive/10 font-black text-xs">
                    <LogOut className="mr-3 h-4 w-4" />
                    <span>Log Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild className="rounded-full px-6 h-10 md:h-11 font-black shadow-lg shadow-primary/20 text-xs bg-gradient-to-r from-[#0F766E] to-[#14B8A6] hover:scale-105 transition-all">
                <Link href="/login">
                  Log In
                </Link>
              </Button>
            )
          )}
        </motion.div>
      </div>
    </header>
  );
}
