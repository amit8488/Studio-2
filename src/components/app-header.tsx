'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User as UserIcon, LogOut, Search, Settings, Menu } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { motion } from 'framer-motion';

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
import { ThemeToggle } from '@/components/theme-toggle';
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

  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-2xl border-b border-white/10 dark:border-slate-800/10">
      <div className="page-container h-16 md:h-20 flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          <Link href="/" className="flex items-center gap-2 md:gap-3 group">
            <div className="p-1 bg-white dark:bg-slate-900 rounded-full group-hover:scale-105 transition-all duration-500 shadow-lg shadow-primary/5 border-2 border-primary/10">
              <AppLogo className="h-8 w-8 md:h-10 md:w-10" />
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="font-black text-lg md:text-xl tracking-tight text-slate-900 dark:text-slate-50 uppercase">
                {t('appName')}
              </span>
              <span className="hidden xs:block text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Utility Partner</span>
            </div>
          </Link>
        </motion.div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 ml-8">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={cn(
                "text-sm font-bold uppercase tracking-widest transition-colors hover:text-primary",
                pathname === link.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1.5 md:gap-4"
        >
          <div className="hidden xl:flex items-center bg-muted/50 rounded-2xl px-5 py-2.5 border border-white/5 shadow-inner group focus-within:bg-white dark:focus-within:bg-slate-900 transition-all duration-300">
            <Search className="h-4 w-4 text-muted-foreground mr-3 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-transparent border-none outline-none text-sm w-32 focus:w-48 transition-all duration-500 font-medium"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-muted/30 rounded-[1.5rem] md:rounded-[1.75rem] border border-white/10">
            <LanguageToggle />
            <ThemeToggle />
          </div>

          {!loading && (
            user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl p-0 overflow-hidden border-2 border-primary/20 hover:border-primary/50 shadow-xl transition-all duration-300">
                    <Avatar className="h-full w-full rounded-xl md:rounded-2xl">
                      <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || 'User'} className="object-cover" />
                      <AvatarFallback className="bg-primary/5 text-primary font-black">
                        {user.displayName?.charAt(0) || user.email?.charAt(0).toUpperCase() || <UserIcon className="h-5 w-5" />}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 md:w-72 rounded-[1.75rem] md:rounded-[2rem] shadow-[0_50px_100px_rgba(0,0,0,0.2)] border-none p-3 mt-2 glass-card" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal p-4 md:p-6">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-primary/10 flex items-center justify-center font-black text-lg md:text-xl text-primary">
                             {user.displayName?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col space-y-0.5">
                          <p className="text-base md:text-lg font-black leading-none">{user.displayName || 'Account'}</p>
                          <p className="text-[11px] md:text-xs leading-none text-muted-foreground truncate max-w-[140px] md:max-w-[160px]">
                            {user.email}
                          </p>
                        </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-muted/50 my-2" />
                  <DropdownMenuItem className="rounded-xl md:rounded-2xl p-3 md:p-4 cursor-pointer hover:bg-muted font-bold text-sm">
                    <Settings className="mr-3 h-4 w-4 md:h-5 md:w-5 opacity-60" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive rounded-xl md:rounded-2xl p-3 md:p-4 cursor-pointer hover:bg-destructive/10 font-black text-sm">
                    <LogOut className="mr-3 h-4 w-4 md:h-5 md:w-5" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild size="lg" className="rounded-xl md:rounded-2xl px-4 md:px-8 h-10 md:h-12 font-black shadow-xl shadow-primary/20 text-sm">
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