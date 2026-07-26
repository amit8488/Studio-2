
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, User as UserIcon, LogOut, Search } from 'lucide-react';
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

export function AppHeader() {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut(auth);
    toast({ title: 'Logged out successfully.' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-xl border-b border-white/10 dark:border-slate-800/10">
      <div className="container mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-primary/10 rounded-2xl group-hover:scale-105 transition-transform duration-300">
              <AppLogo className="h-8 w-8 text-primary" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-slate-50 hidden sm:block">
              {t('appName')}
            </span>
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 sm:gap-4"
        >
          <div className="hidden sm:flex items-center bg-muted/50 rounded-full px-4 py-1.5 border border-white/5 shadow-inner">
            <Search className="h-4 w-4 text-muted-foreground mr-2" />
            <input 
              type="text" 
              placeholder="Search tools..." 
              className="bg-transparent border-none outline-none text-sm w-32 focus:w-48 transition-all duration-300"
            />
          </div>

          <Button variant="ghost" size="icon" className="rounded-full relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-background" />
          </Button>

          <LanguageToggle />
          <ThemeToggle />

          {!loading && (
            user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-2xl p-0 overflow-hidden border shadow-sm hover:shadow-md transition-all">
                    <Avatar className="h-full w-full rounded-2xl">
                      <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || 'User'} />
                      <AvatarFallback className="bg-primary/5 text-primary">
                        <UserIcon className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 rounded-2xl shadow-2xl p-2" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal p-4">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-bold leading-none">{user.displayName || 'User'}</p>
                      <p className="text-xs leading-none text-muted-foreground pt-1">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive rounded-xl p-3">
                    <LogOut className="mr-3 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild size="sm" className="rounded-full px-6 shadow-lg shadow-primary/20">
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
