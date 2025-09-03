'use client';
import { usePathname } from 'next/navigation';
import { HomeIcon, FileTextIcon, Calculator } from 'lucide-react';
import { LanguageProvider, useLanguage } from '@/contexts/language-context';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageToggle } from '@/components/language-toggle';

function SevenTwelveToVighaComponent() {
  const { t } = useLanguage();
  const pathname = usePathname();

  return (
    <div className="flex h-full">
      <Sidebar>
        <SidebarContent>
            <SidebarHeader>
                <h2 className="text-xl font-semibold">ViGha Calculate</h2>
            </SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href="/" isActive={pathname === '/'}>
                <HomeIcon />
                Home
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/seven-twelve-to-vigha" isActive={pathname === '/seven-twelve-to-vigha'}>
                <FileTextIcon />
                7/12 થી વિઘા
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <div className="container mx-auto max-w-4xl p-4 sm:p-6">
        <header className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
                <SidebarTrigger />
                <div className="bg-primary/10 p-2 rounded-lg hidden sm:block">
                    <Calculator className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold font-headline text-primary">ViGha Calculate</h1>
            </div>
            <div className="flex items-center gap-1">
                <LanguageToggle />
                <ThemeToggle />
            </div>
        </header>
        <main className="flex flex-col items-center text-center">
          <h2 className="text-2xl sm:text-3xl font-bold font-headline text-primary mb-8">7/12 થી વિઘા</h2>
          <p>This page is under construction.</p>
        </main>
      </div>
    </div>
  );
}

export default function SevenTwelveToVighaPage() {
    return (
        <LanguageProvider>
            <SevenTwelveToVighaComponent />
        </LanguageProvider>
    )
}
