'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Calculator, History, Trash2, HomeIcon, FileTextIcon } from 'lucide-react';
import { LanguageProvider, useLanguage } from '@/contexts/language-context';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageToggle } from '@/components/language-toggle';
import { RegionalStandards } from '@/components/regional-standards';
import { convertArea, UNITS, type ConversionResult, type ConversionInput } from '@/lib/conversion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { translations } from '@/lib/translations';
import { Sidebar, SidebarTrigger, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader } from '@/components/ui/sidebar';

type HistoryItem = {
  id: string;
  input: ConversionInput;
  result: ConversionResult;
};

const formatNumber = (num: number) => {
  if (isNaN(num) || !isFinite(num)) return '0.00';
  return num.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

function CalculatorComponent() {
  const { t, language } = useLanguage();
  const [inputValue, setInputValue] = useState('');
  const [inputUnit, setInputUnit] = useState<ConversionInput['unit']>(UNITS.HECTARE);
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
        const currentConversion = {
          id: new Date().toISOString(),
          input: { value, unit: inputUnit },
          result: results,
        };
        if (history.length === 0 || history[0].input.value !== value || history[0].input.unit !== inputUnit) {
          updateHistory(currentConversion);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [results, inputValue, inputUnit, history, updateHistory]);

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

  return (
    <div className="flex h-full">
      <Sidebar>
        <SidebarContent>
            <SidebarHeader>
                <h2 className="text-xl font-semibold">ViGha Calculate</h2>
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

        <main className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
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
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 animate-in fade-in duration-500">
                        <ResultCard title={t('vigha')} value={results.vigha} />
                        <ResultCard title={t('guntha')} value={results.guntha} />
                        <ResultCard title={t('acre')} value={results.acre} />
                        <ResultCard title={t('sqft')} value={results.sqft} />
                        </div>
                    )}
                    </CardContent>
                </Card>

                <RegionalStandards areaValue={inputValue} areaUnit={t(inputUnit as keyof typeof translations.en)} />
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
                            <p className="font-semibold">{item.input.value} {t(item.input.unit as keyof typeof translations.en)}</p>
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

export default function Home() {
  return (
    <LanguageProvider>
      <CalculatorComponent />
    </LanguageProvider>
  );
}
