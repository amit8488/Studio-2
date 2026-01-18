'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogIn, LogOut, User as UserIcon, ArrowLeft } from 'lucide-react';
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

const NavLink = ({ href, children, isBold = false }: { href: string; children: React.ReactNode, isBold?: boolean }) => {
    const pathname = usePathname();
    const isActive = pathname === href;
    return (
      <Link href={href} className={`px-3 py-2 text-sm rounded-md ${isActive ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'} ${isBold ? 'font-bold' : 'font-medium'}`}>
        {children}
      </Link>
    );
};

export function AppHeader() {
    const { user, loading } = useAuth();
    const { toast } = useToast();
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut(auth);
        toast({ title: 'Logged out successfully.' });
    };

    const showBackButton = pathname !== '/';

    return (
        <header className="border-b">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="relative flex items-center h-16">
                    <div className="flex items-center gap-4">
                        {showBackButton && (
                            <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="Go back">
                                <ArrowLeft className="h-6 w-6" />
                            </Button>
                        )}
                        <Link href="/" className="flex items-center gap-2">
                            <AppLogo className="h-8 w-8" />
                            <span className="font-bold text-lg text-primary hidden sm:block">Calculator</span>
                        </Link>
                    </div>

                    <nav className="hidden md:flex items-center gap-4 absolute left-1/2 -translate-x-1/2">
                        <NavLink href="/" isBold={true}>Home</NavLink>
                        <NavLink href="/seven-twelve-to-vigha" isBold={true}>7/12 ViGha</NavLink>
                        <NavLink href="/calculator" isBold={true}>Calculator</NavLink>
                    </nav>

                    <div className="flex items-center gap-2 ml-auto">
                        <LanguageToggle />
                        <ThemeToggle />
                        {!loading && (
                          user ? (
                              <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                          <Avatar className="h-8 w-8">
                                              <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || 'User'} />
                                              <AvatarFallback>
                                                  <UserIcon className="h-4 w-4" />
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
                                      <DropdownMenuItem onClick={handleLogout}>
                                          <LogOut className="mr-2 h-4 w-4" />
                                          <span>Log out</span>
                                      </DropdownMenuItem>
                                  </DropdownMenuContent>
                              </DropdownMenu>
                          ) : (
                              <Button asChild>
                                  <Link href="/login">
                                      <LogIn className="h-4 w-4 mr-2" />
                                      Log In
                                  </Link>
                              </Button>
                          )
                        )}
                    </div>
                </div>
                 <nav className="md:hidden flex items-center justify-center gap-2 pb-2">
                    <NavLink href="/" isBold={true}>Home</NavLink>
                    <NavLink href="/seven-twelve-to-vigha" isBold={true}>7/12 ViGha</NavLink>
                    <NavLink href="/calculator" isBold={true}>Calculator</NavLink>
                </nav>
            </div>
        </header>
    );
}
