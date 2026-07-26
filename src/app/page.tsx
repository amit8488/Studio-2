'use client';

import { useState, useMemo, useEffect } from 'react';
import { History, Trash2, Download, ArrowRight, LayoutGrid, Zap, ShieldCheck, PieChart, Landmark, Calculator } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/language-context';
import { convertArea, UNITS, type ConversionInput } from '@/lib/conversion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { AppHeader } from '@/components/app-header';
import { useHistory } from '@/hooks/use-history';
import { useAuth } from '@/contexts/auth-context';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const formatNumber = (num: number) => {
  if (isNaN(num) || !isFinite(num)) return '0.00';
  return num.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: "easeOut" }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

function CalculatorComponent() {
  const { t } = useLanguage();
  const [inputValue, setInputValue] = useState('');
  const [inputUnit, setInputUnit] = useState<ConversionInput['unit']>(UNITS.HECTARE);
  const { history, addHistory, clearHistory } = useHistory('home');
  const { user, loading: authLoading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      const modalShown = sessionStorage.getItem('loginModalShown');
      if (!modalShown) {
        const timer = setTimeout(() => {
            setShowLoginModal(true);
            sessionStorage.setItem('loginModalShown', 'true');
        }, 1500);
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

  const results = useMemo(() => {
    const value = parseFloat(inputValue);
    if (!value || value <= 0 || isNaN(value)) return null;
    return convertArea({ value, unit: inputUnit });
  }, [inputValue, inputUnit]);

  useEffect(() => {
    const value = parseFloat(inputValue);
    if (results && value > 0) {
      const timer = setTimeout(() => {
        const currentInput = { value, unit: inputUnit };
        if (history[0] && history[0].input.value === currentInput.value && history[0].input.unit === currentInput.unit) return;
        addHistory({ input: currentInput, result: results, sourcePage: 'home' });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [results, inputValue, inputUnit, addHistory, history]);

  const QuickTool = ({ href, icon: Icon, label, color }: any) => (
    <Link href={href}>
      <motion.div 
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.95 }}
        className="flex flex-col items-center gap-2 p-4 glass-card rounded-3xl h-full"
      >
        <div className={`p-4 rounded-2xl ${color} shadow-lg shadow-${color.split('-')[1]}-500/20`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <span className="text-xs font-bold text-center text-slate-700 dark:text-slate-300">{label}</span>
      </motion.div>
    </Link>
  );

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      className="flex flex-col min-h-screen bg-background"
    >
      <AppHeader />
      
      <section className="hero-gradient px-4 pt-12 pb-24 text-white rounded-b-[3rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 0 L100 0 L100 100 Q50 80 0 100 Z" fill="currentColor" />
          </svg>
        </div>
        
        <div className="container mx-auto max-w-4xl relative z-10">
          <motion.div
            variants={fadeInUp}
            className="text-center space-y-4"
          >
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
              {user ? `Welcome, ${user.displayName?.split(' ')[0] || 'Member'}` : t('appName')}
            </h1>
            <p className="text-lg opacity-90 max-w-lg mx-auto font-medium">
              {t('tagline')}
            </p>
          </motion.div>
        </div>
      </section>

      <main className="container mx-auto max-w-4xl px-4 -mt-16 pb-20 space-y-8 relative z-20">
        <motion.div variants={fadeInUp}>
          <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="rounded-[2.5rem] shadow-2xl border-none glass-card overflow-hidden">
              <CardContent className="p-8 space-y-8">
                <div className="flex items-center gap-3 text-primary mb-2">
                  <Zap className="h-6 w-6 fill-current animate-pulse" />
                  <h2 className="text-xl font-bold uppercase tracking-widest">{t('landConverter')}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                  <div className="md:col-span-8 m3-input-container">
                    <Input
                      type="text"
                      inputMode="decimal"
                      placeholder=" "
                      value={inputValue}
                      onChange={handleInputChange}
                      className="peer m3-input text-lg font-bold"
                    />
                    <span className="m3-label">{t('enterArea')}</span>
                  </div>
                  <div className="md:col-span-4 m3-input-container">
                    <Select value={inputUnit} onValueChange={(u) => setInputUnit(u as any)}>
                      <SelectTrigger className="m3-input font-bold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        <SelectItem value={UNITS.HECTARE}>{t('hectare')}</SelectItem>
                        <SelectItem value={UNITS.ARE}>{t('are')}</SelectItem>
                        <SelectItem value={UNITS.SQM}>{t('sqm')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="m3-label -top-0 text-[10px] font-black uppercase tracking-widest text-primary translate-y-2">{t('selectUnit')}</span>
                  </div>
                </div>

                <AnimatePresence>
                  {results && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0, scale: 0.95 }}
                      animate={{ opacity: 1, height: 'auto', scale: 1 }}
                      exit={{ opacity: 0, height: 0, scale: 0.95 }}
                      className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4"
                    >
                      {[
                        { label: t('vigha'), value: results.vigha, color: 'bg-primary/5' },
                        { label: t('guntha'), value: results.guntha, color: 'bg-secondary/5' },
                        { label: t('acre'), value: results.acre, color: 'bg-accent/5' },
                        { label: t('sqm'), value: results.sqm, color: 'bg-muted' }
                      ].map((res, idx) => (
                        <motion.div
                          key={res.label}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className={`p-6 rounded-3xl text-center ${res.color} border border-white/50 shadow-sm`}
                        >
                          <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest mb-2">{res.label}</p>
                          <motion.p 
                            key={res.value}
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className="text-2xl font-black text-primary truncate"
                          >
                            {formatNumber(res.value)}
                          </motion.p>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.section variants={fadeInUp} className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
              <LayoutGrid className="h-5 w-5 text-primary" />
              {t('tools')}
            </h3>
          </div>
          <motion.div variants={stagger} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <QuickTool href="/seven-twelve-to-vigha" icon={PieChart} label="7/12 ViGha" color="bg-orange-500" />
            <QuickTool href="/calculator" icon={Calculator} label={t('standardCalculator')} color="bg-indigo-500" />
            <QuickTool href="/fd-calculator" icon={Landmark} label={t('fdCalculator')} color="bg-teal-500" />
            <a href="https://anyror.gujarat.gov.in/home.aspx" target="_blank" rel="noopener noreferrer">
              <motion.div 
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-2 p-4 glass-card rounded-3xl h-full"
              >
                <div className="p-4 rounded-2xl bg-accent shadow-lg shadow-accent/20">
                  <Download className="h-6 w-6 text-white" />
                </div>
                <span className="text-xs font-bold text-center text-slate-700 dark:text-slate-300">Digital RoR</span>
              </motion.div>
            </a>
          </motion.div>
        </motion.section>

        <motion.div variants={fadeInUp}>
          <Card className="rounded-[2.5rem] shadow-xl border-none glass-card">
            <CardHeader className="flex flex-row items-center justify-between px-8 pt-8">
              <CardTitle className="flex items-center gap-3 text-xl font-bold">
                <History className="text-primary" />
                {t('conversionHistory')}
              </CardTitle>
              {history.length > 0 && (
                <motion.div whileHover={{ rotate: 15 }} whileTap={{ scale: 0.9 }}>
                  <Button variant="ghost" size="icon" onClick={clearHistory} className="rounded-2xl hover:bg-destructive/10 hover:text-destructive">
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </motion.div>
              )}
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <AnimatePresence mode="popLayout">
                {history.length > 0 ? (
                  <motion.div variants={stagger} className="space-y-3">
                    {history.map((item, idx) => (
                      <motion.div 
                        key={item.id} 
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="p-5 bg-muted/30 rounded-[1.5rem] border border-white/50 flex items-center justify-between group hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 shadow-sm hover:shadow-md"
                      >
                        <div className="space-y-1">
                          <p className="font-bold text-sm text-slate-900 dark:text-slate-50">
                            {item.sourcePage === 'seven-twelve' ? '7/12 Conversion' : `${item.input.value} ${t(item.input.unit as any)}`}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-2">
                            <span className="font-semibold text-primary">{formatNumber(item.result.vigha)} Vigha</span>
                            <span className="opacity-50">•</span>
                            <span>{formatNumber(item.result.guntha)} Guntha</span>
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 px-6"
                  >
                    <div className="bg-muted/50 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4">
                      <History className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground font-medium">{t('noHistory')}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="sm:max-w-md rounded-[2.5rem] border-none shadow-2xl glass-card">
            <DialogHeader className="pt-4">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 12 }}
                  className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6"
                >
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </motion.div>
                <DialogTitle className="text-2xl font-black text-center">Welcome Back!</DialogTitle>
                <DialogDescription className="text-center text-base pt-2">
                    Unlock exclusive features and sync your land conversion history across all your devices.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex-col gap-3 pt-6">
                <Button className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20" asChild onClick={() => setShowLoginModal(false)}>
                    <Link href="/login">
                        Log In Now
                    </Link>
                </Button>
                <Button variant="ghost" className="w-full h-12 rounded-2xl font-bold opacity-70" onClick={() => setShowLoginModal(false)}>
                    Later
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

export default function Home() {
  return <CalculatorComponent />;
}