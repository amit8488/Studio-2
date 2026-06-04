
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogIn, LogOut, User as UserIcon, ArrowLeft, LayoutGrid, Calculator, PieChart, Landmark } from 'lucide-react';
import { signOut } from 'firebase/auth';

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

const NavLink = ({ href, children, isBold = false }: { href: string; children: React.ReactNode, isBold?: boolean }) => {
    const pathname = usePathname();
    const isActive = pathname === href;
    return (
      <Link href={href} className={`px-3 py-2 text-sm rounded-md transition-colors ${isActive ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'} ${isBold ? 'font-bold' : 'font-medium'}`}>
        {children}
      </Link>
    );
};

export function AppHeader() {
    const { user, loading } = useAuth();
    const { t } = useLanguage();
    const { toast } = useToast();
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut(auth);
        toast({ title: 'Logged out successfully.' });
    };

    const showBackButton = pathname !== '/';

    return (
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="relative flex items-center h-16">
                    <div className="flex items-center gap-2">
                        {showBackButton && (
                            <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="Go back" className="mr-1">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        )}
                        
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none group">
                                    <AppLogo className="h-8 w-8 group-hover:scale-110 transition-transform" />
                                    <span className="font-bold text-lg text-primary hidden sm:block">Calculator</span>
                                    <LayoutGrid className="h-4 w-4 text-muted-foreground ml-1" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-56">
                                <DropdownMenuLabel>{t('tools')}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/" className="flex items-center gap-2 w-full">
                                        <Landmark className="h-4 w-4" />
                                        <span>{t('landConverter')}</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/seven-twelve-to-vigha" className="flex items-center gap-2 w-full">
                                        <PieChart className="h-4 w-4" />
                                        <span>7/12 ViGha</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/calculator" className="flex items-center gap-2 w-full">
                                        <Calculator className="h-4 w-4" />
                                        <span>{t('standardCalculator')}</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/fd-calculator" className="flex items-center gap-2 w-full">
                                        <Calculator className="h-4 w-4 text-orange-500" />
                                        <span className="font-semibold">{t('fdCalculator')}</span>
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <nav className="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
                        <NavLink href="/" isBold={true}>{t('home')}</NavLink>
                        <NavLink href="/seven-twelve-to-vigha" isBold={true}>7/12 ViGha</NavLink>
                        <NavLink href="/calculator" isBold={true}>{t('standardCalculator')}</NavLink>
                    </nav>

                    <div className="flex items-center gap-2 ml-auto">
                        <LanguageToggle />
                        <ThemeToggle />
                        {!loading && (
                          user ? (
                              <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 overflow-hidden border">
                                          <Avatar className="h-full w-full">
                                              <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || 'User'} />
                                              <AvatarFallback>
                                                  <UserIcon className="h-5 w-5" />
                                              </AvatarFallback>
                                          </Avatar>
                                      </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent className="w-56" align="end" forceMount>
                                      <DropdownMenuLabel className="font-normal">
                                          <div className="flex flex-col space-y-1">
                                              <p className="text-sm font-medium leading-none">{user.displayName || 'User'}</p>
                                              <p className="text-xs leading-none text-muted-foreground">
                                                  {user.email}
                                              </p>
                                          </div>
                                      </DropdownMenuLabel>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                                          <LogOut className="mr-2 h-4 w-4" />
                                          <span>Log out</span>
                                      </DropdownMenuItem>
                                  </DropdownMenuContent>
                              </DropdownMenu>
                          ) : (
                              <Button asChild size="sm">
                                  <Link href="/login">
                                      <LogIn className="h-4 w-4 mr-2" />
                                      Log In
                                  </Link>
                              </Button>
                          )
                        )}
                    </div>
                </div>
                 <nav className="md:hidden flex items-center justify-center gap-1 pb-2 border-t mt-1 pt-2">
                    <NavLink href="/" isBold={true}>{t('home')}</NavLink>
                    <NavLink href="/seven-twelve-to-vigha" isBold={true}>7/12</NavLink>
                    <NavLink href="/calculator" isBold={true}>Calc</NavLink>
                    <NavLink href="/fd-calculator" isBold={true}>FD</NavLink>
                </nav>
            </div>
        </header>
    );
}
