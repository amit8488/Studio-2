
'use client';

import { useState, useMemo, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Calculator, IndianRupee, ChevronDown } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Slider } from '@/components/ui/slider';
import { AppHeader } from '@/components/app-header';
import { useLanguage } from '@/contexts/language-context';
import { cn } from '@/lib/utils';

export default function FDCalculatorPage() {
  const { t } = useLanguage();
  
  // Input States
  const [customerType, setCustomerType] = useState<'normal' | 'senior'>('normal');
  const [fdType, setFdType] = useState('cumulative');
  const [fdDate, setFdDate] = useState<Date | undefined>(new Date());
  const [principal, setPrincipal] = useState('5000');
  const [interestRate, setInterestRate] = useState('7.0');
  
  // Tenure States
  const [tenureType, setTenureType] = useState<'ymd' | 'days'>('ymd');
  const [years, setYears] = useState([1]);
  const [months, setMonths] = useState([0]);
  const [days, setDays] = useState([0]);
  const [totalDays, setTotalDays] = useState([365]);

  const [result, setResult] = useState<{ maturity: number; interest: number } | null>(null);

  // Auto-calculate interest rate adjustment for senior citizens
  const effectiveRate = useMemo(() => {
    const base = parseFloat(interestRate) || 0;
    return customerType === 'senior' ? base + 0.5 : base;
  }, [interestRate, customerType]);

  const calculateFD = () => {
    const p = parseFloat(principal);
    const r = effectiveRate;
    
    let t_years = 0;
    if (tenureType === 'ymd') {
      t_years = years[0] + (months[0] / 12) + (days[0] / 365);
    } else {
      t_years = totalDays[0] / 365;
    }

    if (p > 0 && r > 0 && t_years > 0) {
      // Standard FD calculation (Quarterly Compounding for Cumulative)
      const n = 4; // quarterly
      const maturity = p * Math.pow(1 + (r / 100) / n, n * t_years);
      const interest = maturity - p;
      setResult({ maturity, interest });
    }
  };

  // Run calculation on input changes for instant feedback
  useEffect(() => {
    calculateFD();
  }, [principal, effectiveRate, tenureType, years, months, days, totalDays]);

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
        
        <Card className="shadow-lg mb-8 overflow-hidden border-orange-200 dark:border-orange-900">
          <CardContent className="p-6 space-y-8">
            
            {/* Customer Type */}
            <div className="space-y-3">
              <Label className="text-muted-foreground font-semibold">{t('customerType')}:</Label>
              <RadioGroup 
                value={customerType} 
                onValueChange={(v) => setCustomerType(v as 'normal' | 'senior')}
                className="flex gap-8"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="normal" id="normal" className="border-orange-500 text-orange-500" />
                  <Label htmlFor="normal" className="font-medium cursor-pointer">{t('normal')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="senior" id="senior" className="border-orange-500 text-orange-500" />
                  <Label htmlFor="senior" className="font-medium cursor-pointer">{t('seniorCitizen')}</Label>
                </div>
              </RadioGroup>
            </div>

            {/* FD Type and Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-muted-foreground font-semibold">{t('fdType')}:</Label>
                <Select value={fdType} onValueChange={setFdType}>
                  <SelectTrigger className="border-orange-500 focus:ring-orange-500 rounded-full h-11">
                    <SelectValue placeholder={t('fdType')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cumulative">{t('cumulative')}</SelectItem>
                    <SelectItem value="payout">{t('payout')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-muted-foreground font-semibold">{t('dateOfFd')}:</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal border-orange-500 rounded-full h-11",
                        !fdDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-orange-500" />
                      {fdDate ? format(fdDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={fdDate}
                      onSelect={setFdDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Amount and Rate */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-muted-foreground font-semibold">{t('principalAmount')}:</Label>
                <Input
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                  className="border-orange-500 rounded-full h-11 focus:ring-orange-500"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-muted-foreground font-semibold">{t('interestRate')}:</Label>
                <div className="relative">
                  <Input
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    className="border-orange-500 rounded-full h-11 focus:ring-orange-500 pr-12"
                  />
                  {customerType === 'senior' && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-orange-600">
                      +0.5%
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-orange-100 dark:border-orange-900 pt-6">
               <h3 className="text-xl font-bold text-primary mb-6">{t('tenure')}</h3>
               
               <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-muted-foreground font-semibold">{t('selectTenureType')}</Label>
                    <RadioGroup 
                      value={tenureType} 
                      onValueChange={(v) => setTenureType(v as 'ymd' | 'days')}
                      className="flex gap-8"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ymd" id="ymd" className="border-orange-500 text-orange-500" />
                        <Label htmlFor="ymd" className="font-medium cursor-pointer">{t('yearsMonthsDays')}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="days" id="days" className="border-orange-500 text-orange-500" />
                        <Label htmlFor="days" className="font-medium cursor-pointer">{t('daysOnly')}</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {tenureType === 'ymd' ? (
                    <div className="space-y-8">
                      {/* Year Slider */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <Label className="font-medium text-muted-foreground">{t('year')}:</Label>
                          <span className="bg-orange-50 dark:bg-orange-950 px-6 py-1 rounded-full text-orange-700 dark:text-orange-400 font-bold border border-orange-200">{years[0]}</span>
                        </div>
                        <Slider
                          value={years}
                          onValueChange={setYears}
                          max={10}
                          step={1}
                          className="py-4"
                        />
                        <div className="flex justify-between text-[10px] text-muted-foreground">
                          <span>0</span>
                          <span>10</span>
                        </div>
                      </div>

                      {/* Month Slider */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <Label className="font-medium text-muted-foreground">{t('month')}:</Label>
                          <span className="bg-orange-50 dark:bg-orange-950 px-6 py-1 rounded-full text-orange-700 dark:text-orange-400 font-bold border border-orange-200">{months[0]}</span>
                        </div>
                        <Slider
                          value={months}
                          onValueChange={setMonths}
                          max={11}
                          step={1}
                          className="py-4"
                        />
                        <div className="flex justify-between text-[10px] text-muted-foreground">
                          <span>0</span>
                          <span>11</span>
                        </div>
                      </div>

                      {/* Day Slider */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <Label className="font-medium text-muted-foreground">{t('day')}:</Label>
                          <span className="bg-orange-50 dark:bg-orange-950 px-6 py-1 rounded-full text-orange-700 dark:text-orange-400 font-bold border border-orange-200">{days[0]}</span>
                        </div>
                        <Slider
                          value={days}
                          onValueChange={setDays}
                          max={29}
                          step={1}
                          className="py-4"
                        />
                        <div className="flex justify-between text-[10px] text-muted-foreground">
                          <span>0</span>
                          <span>29</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-8 animate-in slide-in-from-left-2 duration-300">
                       <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <Label className="font-medium text-muted-foreground">{t('day')}:</Label>
                          <span className="bg-orange-50 dark:bg-orange-950 px-6 py-1 rounded-full text-orange-700 dark:text-orange-400 font-bold border border-orange-200">{totalDays[0]}</span>
                        </div>
                        <Slider
                          value={totalDays}
                          onValueChange={setTotalDays}
                          max={3650}
                          step={1}
                          className="py-4"
                        />
                        <div className="flex justify-between text-[10px] text-muted-foreground">
                          <span>1</span>
                          <span>3650</span>
                        </div>
                      </div>
                    </div>
                  )}
               </div>
            </div>

            <Button onClick={calculateFD} className="w-full h-14 text-xl font-bold bg-primary hover:bg-primary/90 rounded-xl shadow-lg" size="lg">
              <Calculator className="mr-2 h-6 w-6" />
              {t('calculate')}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-bottom-4 duration-500 mb-10">
            <Card className="bg-primary/5 border-primary/20 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{t('totalInterest')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary flex items-center">
                  <IndianRupee className="h-6 w-6 mr-1" />
                  {formatCurrency(result.interest).replace('₹', '')}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-accent/5 border-accent/20 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{t('maturityAmount')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-accent flex items-center">
                  <IndianRupee className="h-6 w-6 mr-1" />
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
