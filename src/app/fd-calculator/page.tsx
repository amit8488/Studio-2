'use client';

import { useState, useMemo, useEffect } from 'react';
import { format, addYears, addMonths, addDays } from 'date-fns';
import { 
  Calendar as CalendarIcon, 
  IndianRupee, 
  Clock, 
  ArrowRight, 
  TrendingUp, 
  Info, 
  User as UserIcon, 
  Landmark, 
  Download,
  Share2,
  ChevronLeft
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
  
  const [customerType, setCustomerType] = useState<'normal' | 'senior'>('normal');
  const [fdType, setFdType] = useState('cumulative');
  const [fdDate, setFdDate] = useState<Date | undefined>(new Date());
  const [principal, setPrincipal] = useState('100000');
  const [interestRate, setInterestRate] = useState('7.5');
  
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
      const n = 4;
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

  return (
    <div className="flex flex-col min-h-screen bg-background pb-32">
      <AppHeader />
      <main className="flex-grow page-container max-w-2xl pt-8 md:pt-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 md:mb-12"
        >
          <div className="p-4 bg-primary/10 rounded-[1.75rem] md:rounded-[2rem] w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/5">
            <Landmark className="h-8 w-8 md:h-10 md:w-10 text-primary" />
          </div>
          <h2 className="mb-2 uppercase tracking-tight">{t('fdCalculator')}</h2>
          <p className="text-muted-foreground font-medium text-base md:text-lg leading-relaxed max-w-sm mx-auto">Optimize your savings with premium investment insights</p>
        </motion.div>

        <div className="flex items-center justify-center gap-3 mb-8 md:mb-12">
          {[1, 2, 3].map((s) => (
            <motion.div 
              key={s}
              animate={{
                width: step === s ? 40 : 10,
                backgroundColor: step === s ? 'hsl(var(--primary))' : 'rgba(100, 116, 139, 0.2)'
              }}
              className="h-2.5 rounded-full transition-all duration-500"
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 md:space-y-8"
            >
              <Card className="card-rounded premium-shadow border-none glass-card p-6 md:p-12">
                <div className="space-y-8 md:space-y-10">
                  <div className="space-y-6">
                    <Label className="text-[10px] md:text-xs font-black uppercase tracking-[0.25em] text-primary flex items-center gap-3">
                      <UserIcon className="h-4 w-4" />
                      {t('customerType')}
                    </Label>
                    <RadioGroup 
                      value={customerType} 
                      onValueChange={(v) => setCustomerType(v as any)}
                      className="grid grid-cols-2 gap-4 md:gap-6"
                    >
                      {['normal', 'senior'].map((type) => (
                        <motion.label 
                          key={type}
                          whileTap={{ scale: 0.96 }}
                          htmlFor={type} 
                          className={cn(
                            "flex items-center justify-center p-4 md:p-6 rounded-2xl md:rounded-[2rem] border-2 transition-all cursor-pointer font-black text-sm md:text-lg",
                            customerType === type ? "border-primary bg-primary/5 text-primary shadow-xl shadow-primary/5" : "border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 opacity-60"
                          )}
                        >
                          <RadioGroupItem value={type} id={type} className="sr-only" />
                          {type === 'normal' ? t('normal') : t('seniorCitizen')}
                        </motion.label>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div className="m3-input-container">
                      <Select value={fdType} onValueChange={setFdType}>
                        <SelectTrigger className="m3-input font-bold border-none h-[64px] md:h-[72px] rounded-2xl md:rounded-3xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-[1.5rem] md:rounded-[2rem] border-none shadow-2xl">
                          <SelectItem value="cumulative">{t('cumulative')}</SelectItem>
                          <SelectItem value="payout">{t('payout')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <span className="m3-label active">{t('fdType')}</span>
                    </div>

                    <div className="m3-input-container">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" className="m3-input font-bold flex items-center justify-start border-none h-[64px] md:h-[72px] rounded-2xl md:rounded-3xl w-full bg-slate-100/50 dark:bg-slate-800/40">
                            <CalendarIcon className="mr-3 h-5 w-5 text-primary opacity-60" />
                            {fdDate ? format(fdDate, "dd MMM yyyy") : "Select Date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 rounded-[1.5rem] md:rounded-[2rem] border-none shadow-[0_50px_100px_rgba(0,0,0,0.2)]">
                          <Calendar mode="single" selected={fdDate} onSelect={setFdDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                      <span className="m3-label active">{t('dateOfFd')}</span>
                    </div>
                  </div>
                </div>
              </Card>
              <Button onClick={() => setStep(2)} className="w-full h-16 md:h-20 rounded-[1.75rem] md:rounded-[2rem] text-lg md:text-xl font-black shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                Continue <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 md:space-y-8"
            >
              <Card className="card-rounded premium-shadow border-none glass-card p-6 md:p-12">
                <div className="space-y-8 md:space-y-10">
                  <div className="m3-input-container">
                    <Input
                      type="number"
                      placeholder=" "
                      value={principal}
                      onChange={(e) => setPrincipal(e.target.value)}
                      className="peer m3-input has-icon text-xl md:text-2xl font-black border-none"
                    />
                    <IndianRupee className="m3-icon h-5 w-5 md:h-6 md:w-6" />
                    <span className="m3-label">{t('principalAmount')}</span>
                  </div>

                  <div className="m3-input-container">
                    <Input
                      type="number"
                      placeholder=" "
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                      className="peer m3-input has-icon text-xl md:text-2xl font-black border-none"
                    />
                    <TrendingUp className="m3-icon h-5 w-5 md:h-6 md:w-6" />
                    <span className="m3-label">{t('interestRate')}</span>
                    {customerType === 'senior' && (
                      <div className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 bg-accent/15 text-accent text-[9px] md:text-[10px] font-black px-2.5 py-1 rounded-lg z-20 uppercase tracking-widest">
                        +0.5% BONUS
                      </div>
                    )}
                  </div>

                  <div className="space-y-8">
                    <Label className="text-[10px] md:text-xs font-black uppercase tracking-[0.25em] text-primary flex items-center gap-3">
                      <Clock className="h-4 w-4" />
                      {t('tenure')}
                    </Label>
                    <RadioGroup 
                      value={tenureType} 
                      onValueChange={(v) => setTenureType(v as any)}
                      className="grid grid-cols-2 gap-4 md:gap-6"
                    >
                      <Label htmlFor="ymd" className={cn("p-4 md:p-6 rounded-2xl md:rounded-[2rem] border-2 text-center font-black text-sm md:text-lg cursor-pointer transition-all", tenureType === 'ymd' ? "border-primary bg-primary/5 text-primary shadow-xl shadow-primary/5" : "border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 opacity-60")}>
                        <RadioGroupItem value="ymd" id="ymd" className="sr-only" />
                        Y / M / D
                      </Label>
                      <Label htmlFor="days" className={cn("p-4 md:p-6 rounded-2xl md:rounded-[2rem] border-2 text-center font-black text-sm md:text-lg cursor-pointer transition-all", tenureType === 'days' ? "border-primary bg-primary/5 text-primary shadow-xl shadow-primary/5" : "border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 opacity-60")}>
                        <RadioGroupItem value="days" id="days" className="sr-only" />
                        {t('daysOnly')}
                      </Label>
                    </RadioGroup>

                    <div className="space-y-8 pt-2">
                      <AnimatePresence mode="wait">
                        {tenureType === 'ymd' ? (
                          <motion.div 
                            key="ymd-inputs"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                          >
                            {['year', 'month', 'day'].map((unit, idx) => {
                              const state = [years, months, days][idx];
                              const setter = [setYears, setMonths, setDays][idx];
                              const max = [10, 11, 29][idx];
                              return (
                                <div key={unit} className="space-y-4">
                                  <div className="flex justify-between items-center px-1">
                                    <Label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground">{t(unit as any)}</Label>
                                    <div className="bg-primary/5 px-4 py-1.5 md:px-5 md:py-2 rounded-xl">
                                      <input
                                        type="number"
                                        value={state[0].toString()}
                                        onChange={handleInputChange(setter, max)}
                                        className="w-12 bg-transparent text-center font-black text-primary border-none focus:outline-none text-sm md:text-base"
                                      />
                                    </div>
                                  </div>
                                  <Slider value={state} onValueChange={setter} max={max} step={1} className="py-2" />
                                </div>
                              );
                            })}
                          </motion.div>
                        ) : (
                          <motion.div 
                            key="days-inputs"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                          >
                            <div className="flex justify-between items-center px-1">
                              <Label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground">{t('day')}</Label>
                               <div className="bg-primary/5 px-4 py-1.5 md:px-5 md:py-2 rounded-xl">
                                <input
                                  type="number"
                                  value={totalDays[0].toString()}
                                  onChange={handleInputChange(setTotalDays, 999)}
                                  className="w-14 bg-transparent text-center font-black text-primary border-none focus:outline-none text-sm md:text-base"
                                />
                              </div>
                            </div>
                            <Slider value={totalDays} onValueChange={setTotalDays} max={999} step={1} className="py-2" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </Card>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
                <Button variant="ghost" onClick={() => setStep(1)} className="h-16 md:h-20 rounded-[1.75rem] md:rounded-[2rem] font-black text-base md:text-lg group">
                    <ChevronLeft className="mr-2 h-5 w-5 md:h-6 md:w-6 group-hover:-translate-x-1 transition-transform" /> Back
                </Button>
                <div className="md:col-span-3">
                  <Button onClick={() => setStep(3)} className="h-16 md:h-20 rounded-[1.75rem] md:rounded-[2rem] text-lg md:text-xl font-black shadow-2xl shadow-primary/20 w-full hover:scale-[1.02] transition-all">Show Results</Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && result && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 md:space-y-8"
            >
              <Card className="card-rounded hero-gradient border-none p-8 md:p-14 text-white shadow-[0_30px_60px_rgba(0,0,0,0.15)] md:shadow-[0_50px_100px_rgba(0,0,0,0.2)] relative overflow-hidden">
                <div className="relative z-10 space-y-8 md:space-y-10">
                  <div className="text-center">
                    <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] opacity-80 mb-3 md:mb-4">{t('maturityAmount')}</p>
                    <h3 className="text-4xl md:text-7xl font-black tracking-tighter flex items-center justify-center gap-2">
                      <IndianRupee className="h-8 w-8 md:h-14 md:w-14" strokeWidth={4} />
                      {formatNumber(result.maturity)}
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 md:gap-6">
                    <div className="bg-white/10 backdrop-blur-2xl rounded-2xl md:card-rounded p-5 md:p-6 border border-white/20">
                      <p className="text-[10px] md:text-[11px] font-black uppercase tracking-widest opacity-80 mb-1.5 md:mb-2">{t('totalInterest')}</p>
                      <p className="text-xl md:text-2xl font-black">₹{formatNumber(result.interest)}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-2xl rounded-2xl md:card-rounded p-5 md:p-6 border border-white/20">
                      <p className="text-[10px] md:text-[11px] font-black uppercase tracking-widest opacity-80 mb-1.5 md:mb-2">{t('maturityDate')}</p>
                      <p className="text-xl md:text-2xl font-black">{format(result.maturityDate, "dd MMM yyyy")}</p>
                    </div>
                  </div>
                </div>
                <div className="absolute top-0 right-0 p-6 opacity-10 hidden sm:block">
                  <Landmark className="h-40 w-40 md:h-48 md:w-48 -mr-10 -mt-10 md:-mr-12 md:-mt-12" />
                </div>
              </Card>

              <div className="grid grid-cols-2 gap-4 md:gap-6">
                <Button variant="outline" className="h-14 md:h-16 rounded-2xl md:rounded-[1.75rem] font-black text-sm md:text-lg gap-2.5 md:gap-3 border-2 premium-shadow">
                  <Download className="h-4 w-4 md:h-5 md:w-5" /> Report
                </Button>
                <Button variant="outline" className="h-14 md:h-16 rounded-2xl md:rounded-[1.75rem] font-black text-sm md:text-lg gap-2.5 md:gap-3 border-2 premium-shadow">
                  <Share2 className="h-4 w-4 md:h-5 md:w-5" /> Share
                </Button>
              </div>

              <Card className="card-rounded premium-shadow border-none glass-card p-8 md:p-10">
                <div className="space-y-8 md:space-y-10">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <h4 className="text-xl md:text-2xl font-black flex items-center gap-3 md:gap-4">
                        <div className="p-2.5 md:p-3 bg-primary/10 rounded-xl md:rounded-2xl">
                           <Info className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                        </div>
                        Investment Details
                      </h4>
                      <div className="bg-primary/5 text-primary text-[9px] md:text-[10px] font-black uppercase tracking-widest px-3 py-1.5 md:px-4 md:py-2 rounded-full">Quarterly Compounding</div>
                  </div>
                  <div className="space-y-1">
                    {[
                      { label: 'Principal', value: `₹${parseFloat(principal).toLocaleString('en-IN')}`, icon: IndianRupee },
                      { label: 'Interest Rate', value: `${effectiveRate}% p.a.`, icon: TrendingUp },
                      { label: 'Customer Type', value: customerType === 'senior' ? 'Senior (+0.5%)' : 'Standard', icon: UserIcon }
                    ].map((item, i) => (
                      <div 
                        key={item.label} 
                        className="flex justify-between items-center py-4 border-b border-muted group last:border-none"
                      >
                        <div className="flex items-center gap-3 md:gap-4">
                           <item.icon className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                           <span className="text-sm md:text-base text-muted-foreground font-semibold">{item.label}</span>
                        </div>
                        <span className="text-base md:text-lg font-black text-slate-900 dark:text-slate-50">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              <Button onClick={() => setStep(1)} className="w-full h-16 md:h-20 rounded-[2rem] md:rounded-[2.5rem] text-lg md:text-xl font-black shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-all mb-12">
                New Calculation
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}