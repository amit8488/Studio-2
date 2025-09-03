'use client';
import Link from 'next/link';
import { HomeIcon, FileTextIcon } from 'lucide-react';
import { LanguageProvider, useLanguage } from '@/contexts/language-context';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageToggle } from '@/components/language-toggle';

function SevenTwelveToVighaComponent() {
  const { t } = useLanguage();

  return (
    <div className="flex h-full">
      <Sidebar>
        <SidebarContent>
            <SidebarHeader>
                <h2 className="text-xl font-semibold">{t('appName')}</h2>
            </SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/">
                  <HomeIcon />
                  Home
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/seven-twelve-to-vigha">
                  <FileTextIcon />
                  7/12 થી વિઘા
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <div className="container mx-auto max-w-4xl p-4 sm:p-6">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <h1 className="text-2xl sm:text-3xl font-bold font-headline text-primary">7/12 થી વિઘા</h1>
          </div>
          <div className="flex items-center gap-1">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </header>
        <main>
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
