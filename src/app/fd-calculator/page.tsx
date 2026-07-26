
'use client';

import { useState, useMemo, useEffect } from 'react';
import { format, addYears, addMonths, addDays } from 'date-fns';
import { 
  Calendar as CalendarIcon, 
  Calculator, 
  IndianRupee, 
  Clock, 
  ArrowRight, 
  TrendingUp, 
  Info, 
  User as UserIcon, 
  Landmark, 
  Download 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Card, CardContent } from '@/components/ui/card';
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

const formatNumber = (num: number) => {
  if (isNaN(num) || !isFinite(num)) return '0.00';
  return num.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export default function FDCalculatorPage() {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  
  // Input States
  const [customerType, setCustomerType] = useState<'normal' | 'senior'>('normal');
  const [fdType, setFdType] = useState('cumulative');
  const [fdDate, setFdDate] = useState<Date | undefined>(new Date());
  const [principal, setPrincipal] = useState('100000');
  const [interestRate, setInterestRate] = useState('7.5');
  
  // Tenure States
  const [tenureType, setTenureType] = useState<'ymd' | 'days'>('ymd');
  const [years, setYears] = useState([1]);
  const [months, setMonths] = useState([0]);
  const [days, setDays] = useState([0]);
  const [totalDays, setTotalDays] = useState([365]);

  const [result, setResult] = useState<{ maturity: number; interest: number; maturityDate: Date } | null>(null);

  const effectiveRate = useMemo(() => {
    const base = parseFloat(interestRate) || 0;
    return customerType === 'senior' ? base + 0.5 : base;
  }, [interestRate, customerType]);

  const calculateFD = () => {
    const p = parseFloat(principal);
    const r = effectiveRate;
    const baseDate = fdDate || new Date();
    
    let t_years = 0;
    let maturityDate = baseDate;

    if (tenureType === 'ymd') {
      const y = years[0];
      const m = months[0];
      const d = days[0];
      t_years = y + (m / 12) + (d / 365);
      maturityDate = addDays(addMonths(addYears(baseDate, y), m), d);
    } else {
      const d = totalDays[0];
      t_years = d / 365;
      maturityDate = addDays(baseDate, d);
    }

    if (p > 0 && r > 0 && t_years > 0) {
      const n = 4; // quarterly compounding
      const maturity = p * Math.pow(1 + (r / 100) / n, n * t_years);
      const interest = maturity - p;
      setResult({ maturity, interest, maturityDate });
    } else {
      setResult(null);
    }
  };

  useEffect(() => {
    calculateFD();
  }, [principal, effectiveRate, tenureType, years, months, days, totalDays, fdDate]);

  const handleInputChange = (setter: (val: number[]) => void, max: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let valStr = e.target.value.replace(/^0+/, '');
    if (valStr === '') valStr = '0';
    let val = parseInt(valStr, 10);
    if (isNaN(val)) val = 0;
    setter([Math.min(max, Math.max(0, val))]);
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[1, 2, 3].map((s) => (
        <div 
          key={s}
          className={cn(
            "h-2 rounded-full transition-all duration-500",
            step === s ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30"
          )}
        />
      ))}
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow container mx-auto max-w-2xl px-4 pt-8 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-black text-primary mb-2">{t('fdCalculator')}</h2>
          <p className="text-muted-foreground font-medium">Plan your future savings with precision</p>
        </motion.div>

        <StepIndicator />

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <Card className="rounded-[2.5rem] glass-card border-none p-8">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <Label className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                      <UserIcon className="h-4 w-4" />
                      {t('customerType')}
                    </Label>
                    <RadioGroup 
                      value={customerType} 
                      onValueChange={(v) => setCustomerType(v as any)}
                      className="grid grid-cols-2 gap-4"
                    >
                      <Label 
                        htmlFor="normal" 
                        className={cn(
                          "flex items-center justify-center p-4 rounded-2xl border-2 transition-all cursor-pointer font-bold",
                          customerType === 'normal' ? "border-primary bg-primary/5 text-primary" : "border-muted bg-muted/50"
                        )}
                      >
                        <RadioGroupItem value="normal" id="normal" className="sr-only" />
                        {t('normal')}
                      </Label>
                      <Label 
                        htmlFor="senior" 
                        className={cn(
                          "flex items-center justify-center p-4 rounded-2xl border-2 transition-all cursor-pointer font-bold text-center",
                          customerType === 'senior' ? "border-primary bg-primary/5 text-primary" : "border-muted bg-muted/50"
                        )}
                      >
                        <RadioGroupItem value="senior" id="senior" className="sr-only" />
                        {t('seniorCitizen')}
                      </Label>
                    </RadioGroup>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="m3-input-container">
                      <span className="m3-label">{t('fdType')}</span>
                      <Select value={fdType} onValueChange={setFdType}>
                        <SelectTrigger className="m3-input font-bold border-none">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl">
                          <SelectItem value="cumulative">{t('cumulative')}</SelectItem>
                          <SelectItem value="payout">{t('payout')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="m3-input-container">
                      <span className="m3-label">{t('dateOfFd')}</span>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" className="m3-input font-bold flex items-center justify-start border-none">
                            <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                            {fdDate ? format(fdDate, "PPP") : "Select Date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 rounded-2xl">
                          <Calendar mode="single" selected={fdDate} onSelect={setFdDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              </Card>
              <Button onClick={() => setStep(2)} className="w-full h-16 rounded-[1.5rem] text-lg font-black shadow-xl shadow-primary/20">
                Continue <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <Card className="rounded-[2.5rem] glass-card border-none p-8">
                <div className="space-y-8">
                  <div className="m3-input-container">
                    <span className="m3-label left-16">{t('principalAmount')}</span>
                    <div className="relative">
                      <IndianRupee className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
                      <Input
                        type="number"
                        value={principal}
                        onChange={(e) => setPrincipal(e.target.value)}
                        className="m3-input pl-20 text-xl font-black border-none"
                      />
                    </div>
                  </div>

                  <div className="m3-input-container">
                    <span className="m3-label left-16">{t('interestRate')}</span>
                    <div className="relative">
                      <TrendingUp className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
                      <Input
                        type="number"
                        value={interestRate}
                        onChange={(e) => setInterestRate(e.target.value)}
                        className="m3-input pl-20 text-xl font-black border-none"
                      />
                      {customerType === 'senior' && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-accent/10 text-accent text-[10px] font-black px-2 py-1 rounded-lg">
                          +0.5% BONUS
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <Label className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {t('tenure')}
                    </Label>
                    <RadioGroup 
                      value={tenureType} 
                      onValueChange={(v) => setTenureType(v as any)}
                      className="grid grid-cols-2 gap-4"
                    >
                      <Label htmlFor="ymd" className={cn("p-4 rounded-2xl border-2 text-center font-bold cursor-pointer transition-all", tenureType === 'ymd' ? "border-primary bg-primary/5" : "border-muted bg-muted/50")}>
                        <RadioGroupItem value="ymd" id="ymd" className="sr-only" />
                        Y / M / D
                      </Label>
                      <Label htmlFor="days" className={cn("p-4 rounded-2xl border-2 text-center font-bold cursor-pointer transition-all", tenureType === 'days' ? "border-primary bg-primary/5" : "border-muted bg-muted/50")}>
                        <RadioGroupItem value="days" id="days" className="sr-only" />
                        {t('daysOnly')}
                      </Label>
                    </RadioGroup>

                    <div className="space-y-8 pt-4">
                      {tenureType === 'ymd' ? (
                        ['year', 'month', 'day'].map((unit, idx) => {
                          const state = [years, months, days][idx];
                          const setter = [setYears, setMonths, setDays][idx];
                          const max = [10, 11, 29][idx];
                          return (
                            <div key={unit} className="space-y-4">
                              <div className="flex justify-between items-center px-1">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t(unit as any)}</Label>
                                <Input
                                  type="number"
                                  value={state[0].toString()}
                                  onChange={handleInputChange(setter, max)}
                                  className="w-20 h-9 text-center font-black rounded-xl bg-primary/10 border-none text-primary"
                                />
                              </div>
                              <Slider value={state} onValueChange={setter} max={max} step={1} className="py-2" />
                            </div>
                          );
                        })
                      ) : (
                        <div className="space-y-4">
                          <div className="flex justify-between items-center px-1">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t('day')}</Label>
                            <Input
                              type="number"
                              value={totalDays[0].toString()}
                              onChange={handleInputChange(setTotalDays, 999)}
                              className="w-24 h-9 text-center font-black rounded-xl bg-primary/10 border-none text-primary"
                            />
                          </div>
                          <Slider value={totalDays} onValueChange={setTotalDays} max={999} step={1} className="py-2" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="ghost" onClick={() => setStep(1)} className="h-16 rounded-[1.5rem] font-bold">Back</Button>
                <Button onClick={() => setStep(3)} className="h-16 rounded-[1.5rem] text-lg font-black shadow-xl shadow-primary/20">Results</Button>
              </div>
            </motion.div>
          )}

          {step === 3 && result && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <Card className="rounded-[2.5rem] hero-gradient border-none p-8 text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10 space-y-6">
                  <div className="text-center">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] opacity-80 mb-2">{t('maturityAmount')}</p>
                    <h3 className="text-5xl font-black tracking-tight flex items-center justify-center gap-1">
                      <IndianRupee className="h-8 w-8" strokeWidth={3} />
                      {formatNumber(result.maturity).replace('₹', '')}
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-6">
                    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/20">
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">{t('totalInterest')}</p>
                      <p className="text-xl font-black">₹{formatNumber(result.interest).replace('₹', '')}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/20">
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">{t('maturityDate')}</p>
                      <p className="text-xl font-black">{format(result.maturityDate, "dd MMM yyyy")}</p>
                    </div>
                  </div>
                </div>
                <div className="absolute top-0 right-0 p-4 opacity-20">
                  <Landmark className="h-32 w-32 -mr-8 -mt-8" />
                </div>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-14 rounded-2xl font-bold gap-2">
                  <Download className="h-4 w-4" /> PDF
                </Button>
                <Button variant="outline" className="h-14 rounded-2xl font-bold gap-2">
                  Share
                </Button>
              </div>

              <Card className="rounded-[2.5rem] glass-card border-none p-8">
                <div className="space-y-6">
                  <h4 className="text-lg font-bold flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    Investment Summary
                  </h4>
                  <div className="space-y-4">
                    {[
                      { label: 'Principal', value: `₹${parseFloat(principal).toLocaleString('en-IN')}` },
                      { label: 'Interest Rate', value: `${effectiveRate}% p.a.` },
                      { label: 'Compounding', value: 'Quarterly' }
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between items-center py-2 border-b border-muted">
                        <span className="text-sm text-muted-foreground font-medium">{item.label}</span>
                        <span className="text-sm font-bold">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              <Button onClick={() => setStep(1)} className="w-full h-16 rounded-[1.5rem] text-lg font-black shadow-xl shadow-primary/20">
                New Calculation
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
