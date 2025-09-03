'use client';
import { usePathname } from 'next/navigation';
import { HomeIcon, FileTextIcon, Calculator, History, Trash2 } from 'lucide-react';
import { LanguageProvider, useLanguage } from '@/contexts/language-context';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageToggle } from '@/components/language-toggle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { convertArea, type ConversionResult, type ConversionInput, UNITS } from '@/lib/conversion';
import { Button } from '@/components/ui/button';
import { translations } from '@/lib/translations';

const formatNumber = (num: number) => {
    if (isNaN(num) || !isFinite(num)) return '0.00';
    return num.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

type HistoryItem = {
    id: string;
    input: ConversionInput;
    result: ConversionResult;
    sourcePage: 'home' | 'seven-twelve';
    sevenTwelveInput?: { hectare: string; are: string; sqm: string };
};
  
function SevenTwelveToVighaComponent() {
  const { t } = useLanguage();
  const pathname = usePathname();

  const [hectare, setHectare] = useState('');
  const [are, setAre] = useState('');
  const [sqm, setSqm] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('conversionHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to parse history from localStorage", error);
      setHistory([]);
    }
  }, []);

  const updateHistory = useCallback((item: HistoryItem) => {
    setHistory(prevHistory => {
      const newHistory = [item, ...prevHistory].slice(0, 10);
      localStorage.setItem('conversionHistory', JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);


  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      const integerPart = value.split('.')[0];
      if (integerPart.length <= 3) {
        setter(value);
      }
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

  useEffect(() => {
    if (results && totalSqm > 0) {
      const timer = setTimeout(() => {
        const currentConversion: HistoryItem = {
          id: new Date().toISOString(),
          input: { value: totalSqm, unit: UNITS.SQM },
          result: results,
          sourcePage: 'seven-twelve',
          sevenTwelveInput: { hectare, are, sqm }
        };
        // To prevent duplicate entries when component re-renders
        if (history.length === 0 || history[0].input.value !== totalSqm || history[0].sourcePage !== 'seven-twelve') {
            updateHistory(currentConversion);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [results, totalSqm, hectare, are, sqm, history, updateHistory]);

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('conversionHistory');
  };

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

  const renderHistoryItemTitle = (item: HistoryItem) => {
    if (item.sourcePage === 'seven-twelve' && item.sevenTwelveInput) {
        const { hectare, are, sqm } = item.sevenTwelveInput;
        return `${hectare || 0} ${t('hectareLabel')} ${are || 0} ${t('areLabel')} ${sqm || 0} ${t('sqmLabel')}`;
    }
    return `${item.input.value} ${t(item.input.unit as keyof typeof translations.en)}`;
  };


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
        <main className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 flex flex-col items-center text-center">
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
            </div>
            <div className="space-y-8">
                <Card className="shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <History />
                            {t('conversionHistory')}
                        </CardTitle>
                        {history.length > 0 && (
                            <Button variant="ghost" size="icon" onClick={clearHistory} className="h-8 w-8">
                            <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent>
                    {history.length > 0 ? (
                        <div className="space-y-2">
                        {history.map((item) => (
                            <div key={item.id} className="p-3 bg-muted/50 rounded-lg text-sm">
                            <p className="font-semibold">{renderHistoryItemTitle(item)}</p>
                            <p className="text-muted-foreground">{t('vigha')}: {formatNumber(item.result.vigha)}, {t('guntha')}: {formatNumber(item.result.guntha)}</p>
                            </div>
                        ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-center p-4">{t('noHistory')}</p>
                    )}
                    </CardContent>
                </Card>
            </div>
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
