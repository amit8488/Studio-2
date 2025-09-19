
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { History, Trash2, Download } from 'lucide-react';
import { LanguageProvider, useLanguage } from '@/contexts/language-context';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageToggle } from '@/components/language-toggle';
import { convertArea, UNITS, type ConversionResult, type ConversionInput } from '@/lib/conversion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { translations } from '@/lib/translations';
import Link from 'next/link';
import { AppLogo } from '@/components/app-logo';
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';

type HistoryItem = {
  id: string;
  input: ConversionInput;
  result: ConversionResult;
  sourcePage: 'home' | 'seven-twelve';
  sevenTwelveInput?: { hectare: string; are: string; sqm: string };
};

const formatNumber = (num: number) => {
  if (isNaN(num) || !isFinite(num)) return '0.00';
  return num.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

function CalculatorComponent() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [inputValue, setInputValue] = useState('');
  const [inputUnit, setInputUnit] = useState<ConversionInput['unit']>(UNITS.HECTARE);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const { toast } = useToast();

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

  const updateHistory = useCallback((newItems: HistoryItem[]) => {
    const updatedHistory = [...newItems].slice(0, 10);
    setHistory(updatedHistory);
    localStorage.setItem('conversionHistory', JSON.stringify(updatedHistory));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setInputValue(value);
    }
  };

  const handleUnitChange = (unit: string) => {
    setInputUnit(unit as ConversionInput['unit']);
  };

  const results = useMemo(() => {
    const value = parseFloat(inputValue);
    if (!value || value <= 0 || isNaN(value)) {
      return null;
    }
    return convertArea({ value, unit: inputUnit });
  }, [inputValue, inputUnit]);

  useEffect(() => {
    const value = parseFloat(inputValue);
    if (results && value > 0) {
      const timer = setTimeout(() => {
        const currentConversion: HistoryItem = {
          id: new Date().toISOString(),
          input: { value, unit: inputUnit },
          result: results,
          sourcePage: 'home'
        };
        
        const historyWithoutCurrent = history.filter(item => !(item.sourcePage === 'home' && item.input.unit === inputUnit && item.input.value === value));
        const newHistory = [currentConversion, ...historyWithoutCurrent];
        updateHistory(newHistory);

      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [results, inputValue, inputUnit, history, updateHistory]);

  const clearHistory = () => {
    const homeHistory = history.filter(item => item.sourcePage === 'home');
    const newHistory = history.filter(item => !homeHistory.includes(item));
    updateHistory(newHistory);
  };

  const ResultCard = ({ title, value }: { title: string; value: number }) => {
    const formattedValue = formatNumber(value);
    const valueLength = formattedValue.length;
    let fontSize = 'text-3xl lg:text-4xl';
    if (valueLength > 12) {
        fontSize = 'text-xl lg:text-2xl';
    } else if (valueLength > 9) {
        fontSize = 'text-2xl lg:text-3xl';
    }

    return (
        <Card className="text-center shadow-md bg-card">
          <CardHeader className="p-4">
            <CardTitle className="text-base font-medium text-muted-foreground">{title}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className={`font-bold text-primary break-all ${fontSize}`}>{formattedValue}</p>
          </CardContent>
        </Card>
      );
  }
  
  const renderHistoryItemTitle = (item: HistoryItem) => {
    if (item.sourcePage === 'seven-twelve' && item.sevenTwelveInput) {
        const { hectare, are, sqm } = item.sevenTwelveInput;
        return `${hectare || 0} ${t('hectareLabel')} ${are || 0} ${t('areLabel')} ${sqm || 0} ${t('sqmLabel')}`;
    }
    return `${item.input.value} ${t(item.input.unit as keyof typeof translations.en)}`;
  };
  
    const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const isActive = pathname === href;
    return (
      <Link href={href} className={`px-3 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'}`}>
        {children}
      </Link>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
       <header className="border-b">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-6">
                        <Link href="/" className="flex items-center gap-2">
                            <AppLogo className="h-8 w-8" />
                            <span className="font-bold text-lg text-primary hidden sm:block">Calculator</span>
                        </Link>
                        <nav className="hidden md:flex items-center gap-4">
                            <NavLink href="/">Home</NavLink>
                            <NavLink href="/seven-twelve-to-vigha">7/12 ViGha</NavLink>
                            <NavLink href="/calculator">Calculator</NavLink>
                        </nav>
                    </div>
                    <div className="flex items-center gap-1">
                        <LanguageToggle />
                        <ThemeToggle />
                    </div>
                </div>
                 <nav className="md:hidden flex items-center justify-center gap-2 pb-2">
                    <NavLink href="/">Home</NavLink>
                    <NavLink href="/seven-twelve-to-vigha">7/12 ViGha</NavLink>
                    <NavLink href="/calculator">Calculator</NavLink>
                </nav>
            </div>
        </header>
      <main className="flex-grow container mx-auto max-w-4xl p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-1 space-y-8">
                <Card className="w-full shadow-lg">
                    <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div className="md:col-span-2">
                        <label htmlFor="area-input" className="block text-sm font-medium text-foreground mb-1">{t('enterArea')}</label>
                        <Input
                            id="area-input"
                            type="text"
                            inputMode="decimal"
                            placeholder="e.g. 1.25"
                            value={inputValue}
                            onChange={handleInputChange}
                            className="text-lg h-12"
                        />
                        </div>
                        <div>
                        <label htmlFor="unit-select" className="block text-sm font-medium text-foreground mb-1">{t('selectUnit')}</label>
                        <Select value={inputUnit} onValueChange={handleUnitChange}>
                            <SelectTrigger id="unit-select" className="text-lg h-12">
                            <SelectValue placeholder={t('selectUnit')} />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem value={UNITS.HECTARE}>{t('hectare')}</SelectItem>
                            <SelectItem value={UNITS.ARE}>{t('are')}</SelectItem>
                            <SelectItem value={UNITS.SQM}>{t('sqm')}</SelectItem>
                            </SelectContent>
                        </Select>
                        </div>
                    </div>

                    {results && (
                        <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 pt-4 animate-in fade-in duration-500">
                        <ResultCard title={t('vigha')} value={results.vigha} />
                        <ResultCard title={t('guntha')} value={results.guntha} />
                        <ResultCard title={t('acre')} value={results.acre} />
                        <ResultCard title={t('sqm')} value={results.sqm} />
                        </div>
                    )}
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-8">
                 <Card className="shadow-lg">
                    <CardContent className="p-4">
                        <div className="aspect-[4/1] relative">
                            <Image
                                src="https://i.ibb.co/v4cmczR2/01.jpg"
                                alt="Advertisement"
                                fill
                                className="rounded-md object-cover"
                                data-ai-hint="advertisement banner"
                            />
                        </div>
                    </CardContent>
                </Card>
                <div className="flex justify-center">
                    <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg font-bold">
                        <Download className="mr-2 h-5 w-5" />
                        {t('digitalRoR')}
                    </Button>
                </div>
            </div>
        </div>
        <div className="mt-8">
            <Card className="shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <History />
                        {t('conversionHistory')}
                    </CardTitle>
                    {history.filter(h => h.sourcePage === 'home').length > 0 && (
                        <Button variant="ghost" size="icon" onClick={clearHistory} className="h-8 w-8">
                        <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                </CardHeader>
                <CardContent>
                {history.filter(h => h.sourcePage === 'home').length > 0 ? (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                    {history.filter(h => h.sourcePage === 'home').map((item) => (
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
  );
}

export default function Home() {
  return (
    <LanguageProvider>
      <CalculatorComponent />
    </LanguageProvider>
  );
}

    