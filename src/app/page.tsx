'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { History, Trash2, Download } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { convertArea, UNITS, type ConversionResult, type ConversionInput } from '@/lib/conversion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { translations } from '@/lib/translations';
import Link from 'next/link';
import { AppHeader } from '@/components/app-header';
import { useHistory, type HistoryItem } from '@/hooks/use-history';
import { useAuth } from '@/contexts/auth-context';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';


const formatNumber = (num: number) => {
  if (isNaN(num) || !isFinite(num)) return '0.00';
  return num.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

function CalculatorComponent() {
  const { t } = useLanguage();
  const [inputValue, setInputValue] = useState('');
  const [inputUnit, setInputUnit] = useState<ConversionInput['unit']>(UNITS.HECTARE);
  const { history, addHistory, clearHistory } = useHistory('home');
  const { user, loading: authLoading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    // Show login prompt on first visit this session if not logged in
    if (!authLoading && !user) {
      const modalShown = sessionStorage.getItem('loginModalShown');
      if (!modalShown) {
        // Use a timeout to avoid being too intrusive immediately on load
        const timer = setTimeout(() => {
            setShowLoginModal(true);
            sessionStorage.setItem('loginModalShown', 'true');
        }, 1500); // 1.5 second delay
        return () => clearTimeout(timer);
      }
    }
  }, [user, authLoading]);

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
        const currentInput = { value, unit: inputUnit };

        // Prevent adding if it's the same as the most recent entry
        if (history[0] && history[0].input.value === currentInput.value && history[0].input.unit === currentInput.unit) {
          return;
        }

        addHistory({
          input: { value, unit: inputUnit },
          result: results,
          sourcePage: 'home',
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [results, inputValue, inputUnit, addHistory, history]);


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
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
       <AppHeader />
      <main className="flex-grow container mx-auto max-w-4xl p-4 sm:p-6 animate-in fade-in duration-500">
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
                <div className="flex justify-center">
                  <Button size="lg" className="w-full max-w-sm" asChild>
                    <Link href="https://anyror.gujarat.gov.in/home.aspx" target="_blank" rel="noopener noreferrer">
                      <Download className="mr-2 h-4 w-4" />
                      {t('digitalRoR')}
                    </Link>
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
                    {history.length > 0 && (
                        <Button variant="ghost" size="icon" onClick={clearHistory} className="h-8 w-8">
                        <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                </CardHeader>
                <CardContent>
                {history.length > 0 ? (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
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
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Welcome to ViGha Calculate!</DialogTitle>
                <DialogDescription>
                    Log in to save your conversion history and access it from any device.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button variant="outline" onClick={() => setShowLoginModal(false)}>
                    Maybe Later
                </Button>
                <Button asChild onClick={() => setShowLoginModal(false)}>
                    <Link href="/login">
                        Log In
                    </Link>
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function Home() {
  return (
      <CalculatorComponent />
  );
}
