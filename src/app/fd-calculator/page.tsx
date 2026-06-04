
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AppHeader } from '@/components/app-header';
import { useLanguage } from '@/contexts/language-context';
import { Calculator, IndianRupee } from 'lucide-react';

export default function FDCalculatorPage() {
  const { t } = useLanguage();
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [time, setTime] = useState('');
  const [result, setResult] = useState<{ maturity: number; interest: number } | null>(null);

  const calculateFD = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const t_years = parseFloat(time);

    if (p > 0 && r > 0 && t_years > 0) {
      // Standard FD calculation (Quarterly Compounding)
      // A = P(1 + r/n)^(nt) where n = 4 (quarterly)
      const n = 4;
      const maturity = p * Math.pow(1 + (r / 100) / n, n * t_years);
      const interest = maturity - p;
      setResult({ maturity, interest });
    }
  };

  const formatCurrency = (val: number) => {
    return val.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow container mx-auto max-w-2xl p-4 sm:p-6 animate-in fade-in duration-500">
        <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-6 text-center">{t('fdCalculator')}</h2>
        
        <Card className="shadow-lg mb-8">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('principalAmount')}</label>
              <Input
                type="number"
                placeholder="e.g. 100000"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                className="h-12 text-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('interestRate')}</label>
                <Input
                  type="number"
                  placeholder="e.g. 7.5"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  className="h-12 text-lg"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('timePeriod')}</label>
                <Input
                  type="number"
                  placeholder="e.g. 5"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="h-12 text-lg"
                />
              </div>
            </div>
            <Button onClick={calculateFD} className="w-full h-12 text-lg font-bold" size="lg">
              <Calculator className="mr-2 h-5 w-5" />
              {t('calculate')}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-bottom-4 duration-500">
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{t('totalInterest')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-primary flex items-center">
                  <IndianRupee className="h-5 w-5 mr-1" />
                  {formatCurrency(result.interest).replace('₹', '')}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-accent/5 border-accent/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{t('maturityAmount')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-accent flex items-center">
                  <IndianRupee className="h-5 w-5 mr-1" />
                  {formatCurrency(result.maturity).replace('₹', '')}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
