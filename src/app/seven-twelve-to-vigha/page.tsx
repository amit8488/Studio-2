'use client';
import { usePathname } from 'next/navigation';
import { HomeIcon, FileTextIcon, Calculator } from 'lucide-react';
import { LanguageProvider, useLanguage } from '@/contexts/language-context';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageToggle } from '@/components/language-toggle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState, useMemo } from 'react';
import { convertArea, type ConversionResult } from '@/lib/conversion';

const formatNumber = (num: number) => {
    if (isNaN(num) || !isFinite(num)) return '0.00';
    return num.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };
  

function SevenTwelveToVighaComponent() {
  const { t } = useLanguage();
  const pathname = usePathname();

  const [hectare, setHectare] = useState('');
  const [are, setAre] = useState('');
  const [sqm, setSqm] = useState('');

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
        setter(value);
    }
  };

  const totalSqm = useMemo(() => {
    const h = parseFloat(hectare) || 0;
    const a = parseFloat(are) || 0;
    const s = parseFloat(sqm) || 0;
    return (h * 10000) + (a * 100) + s;
  }, [hectare, are, sqm]);


  const results = useMemo(() => {
    if (totalSqm <= 0) return null;
    return convertArea({ value: totalSqm, unit: 'sqm' });
  }, [totalSqm]);

  const ResultCard = ({ title, value }: { title: string; value: number }) => (
    <Card className="text-center shadow-md bg-card">
      <CardHeader className="p-4">
        <CardTitle className="text-base font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-3xl lg:text-4xl font-bold text-primary">{formatNumber(value)}</p>
      </CardContent>
    </Card>
  );

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
            <Card className="w-full max-w-lg shadow-lg">
                <CardContent className="p-6">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <label htmlFor="hectare-input" className="block text-lg font-medium text-foreground mb-2">{t('hectareLabel')}</label>
                            <Input
                                id="hectare-input"
                                type="text"
                                inputMode="decimal"
                                value={hectare}
                                onChange={handleInputChange(setHectare)}
                                className="text-lg h-16 w-full text-center"
                            />
                        </div>
                        <div>
                            <label htmlFor="are-input" className="block text-lg font-medium text-foreground mb-2">{t('areLabel')}</label>
                            <Input
                                id="are-input"
                                type="text"
                                inputMode="decimal"
                                value={are}
                                onChange={handleInputChange(setAre)}
                                className="text-lg h-16 w-full text-center"
                            />
                        </div>
                        <div>
                            <label htmlFor="sqm-input" className="block text-lg font-medium text-foreground mb-2">{t('sqmLabel')}</label>
                            <Input
                                id="sqm-input"
                                type="text"
                                inputMode="decimal"
                                value={sqm}
                                onChange={handleInputChange(setSqm)}
                                className="text-lg h-16 w-full text-center"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {results && (
                <div className="grid grid-cols-2 w-full max-w-lg gap-4 pt-8 animate-in fade-in duration-500">
                    <ResultCard title={t('vigha')} value={results.vigha} />
                    <ResultCard title={t('guntha')} value={results.guntha} />
                </div>
            )}
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
