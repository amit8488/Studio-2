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
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    toast({ title: 'Success', description: 'Logged out successfully.' });
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
          ? "bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] py-2" 
          : "bg-transparent py-4"
      )}
    >
      <div className="page-container flex items-center justify-between px-4 sm:px-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-1.5 bg-white rounded-2xl group-hover:scale-105 transition-all duration-500 shadow-xl border border-primary/5">
              <AppLogo className="h-8 w-8 md:h-10 md:w-10" />
            </div>
            <div className="flex flex-col -space-y-1">
              <span className={cn(
                "font-black text-lg md:text-xl tracking-tight uppercase transition-colors",
                isScrolled ? "text-slate-900" : (isDarkHero ? "text-white" : "text-slate-900")
              )}>
                {t('appName')}
              </span>
              <span className={cn(
                "hidden xs:block text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] transition-opacity",
                isScrolled ? "text-muted-foreground" : (isDarkHero ? "text-white/70" : "text-muted-foreground")
              )}>
                Utility Partner
              </span>
            </div>
          </Link>
        </motion.div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-10 ml-8">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={cn(
                "text-xs font-black uppercase tracking-[0.2em] transition-all hover:scale-105",
                pathname === link.href 
                  ? (isScrolled ? "text-primary" : (isDarkHero ? "text-white underline underline-offset-8" : "text-primary"))
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
          <div className="hidden xl:flex items-center bg-black/5 rounded-2xl px-5 py-2.5 backdrop-blur-md border border-white/10 group focus-within:bg-white transition-all duration-300">
            <Search className={cn(
              "h-4 w-4 mr-3 transition-colors",
              isScrolled ? "text-slate-400" : (isDarkHero ? "text-white/60" : "text-slate-400")
            )} />
            <input 
              type="text" 
              placeholder="Search tools..." 
              className={cn(
                "bg-transparent border-none outline-none text-sm w-32 focus:w-48 transition-all duration-500 font-bold placeholder:font-medium",
                isScrolled ? "text-slate-900" : (isDarkHero ? "text-white placeholder:text-white/60" : "text-slate-900")
              )}
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-black/5 rounded-full border border-white/10">
            <LanguageToggle />
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "hidden sm:flex rounded-full transition-colors",
              isScrolled ? "text-slate-500" : (isDarkHero ? "text-white hover:bg-white/10" : "text-slate-500")
            )}
          >
            <Bell className="h-5 w-5" />
          </Button>

          {!loading && (
            user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 md:h-12 md:w-12 rounded-full p-0 overflow-hidden border-2 border-white/20 hover:border-white/50 shadow-xl transition-all duration-300">
                    <Avatar className="h-full w-full rounded-full">
                      <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || 'User'} className="object-cover" />
                      <AvatarFallback className="bg-primary text-white font-black">
                        {user.displayName?.charAt(0) || user.email?.charAt(0).toUpperCase() || <UserIcon className="h-5 w-5" />}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 md:w-72 rounded-[2rem] shadow-[0_50px_100px_rgba(0,0,0,0.2)] border-none p-4 mt-4 glass-card" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal p-2">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center font-black text-xl text-primary">
                             {user.displayName?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <p className="text-base font-black leading-tight text-slate-900">{user.displayName || 'Account'}</p>
                          <p className="text-[11px] text-muted-foreground truncate max-w-[140px] font-bold">
                            {user.email}
                          </p>
                        </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-4" />
                  <DropdownMenuItem className="rounded-xl p-3 cursor-pointer font-bold text-sm">
                    <Settings className="mr-3 h-4 w-4 opacity-60" />
                    <span>Account Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive rounded-xl p-3 cursor-pointer hover:bg-destructive/10 font-black text-sm">
                    <LogOut className="mr-3 h-4 w-4" />
                    <span>Log Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild size="lg" className="rounded-full px-8 h-10 md:h-12 font-black shadow-2xl shadow-primary/20 text-sm bg-gradient-to-r from-[#0F766E] to-[#14B8A6] hover:scale-105 transition-all">
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