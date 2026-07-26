'use client';

import { useState, useMemo, useEffect } from 'react';
import { History, Trash2, Download, ArrowRight, LayoutGrid, Zap, ShieldCheck, PieChart, Landmark, Calculator, AlertCircle } from 'lucide-react';
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
import { Skeleton } from '@/components/ui/skeleton';

const formatNumber = (num: number) => {
  if (isNaN(num) || !isFinite(num)) return '0.00';
  return num.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  const { t } = useLanguage();
  const [inputValue, setInputValue] = useState('');
  const [inputUnit, setInputUnit] = useState<ConversionInput['unit']>(UNITS.HECTARE);
  const { history, addHistory, clearHistory, loading: historyLoading } = useHistory('home');
  const { user, loading: authLoading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      const modalShown = sessionStorage.getItem('loginModalShown');
      if (!modalShown) {
        const timer = setTimeout(() => {
            setShowLoginModal(true);
            sessionStorage.setItem('loginModalShown', 'true');
        }, 3000);
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
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [results, inputValue, inputUnit, addHistory, history]);

  const QuickTool = ({ href, icon: Icon, label, color }: any) => (
    <Link href={href} className="w-full">
      <motion.div 
        whileHover={{ scale: 1.02, y: -8 }}
        whileTap={{ scale: 0.98 }}
        className="flex flex-col items-center gap-4 p-6 glass-card card-rounded h-full premium-shadow group"
      >
        <div className={`p-5 rounded-3xl ${color} shadow-2xl transition-all duration-500 group-hover:rotate-6`}>
          <Icon className="h-7 w-7 text-white" />
        </div>
        <span className="text-sm font-bold text-center text-slate-700 dark:text-slate-300">{label}</span>
      </motion.div>
    </Link>
  );

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      className="flex flex-col min-h-screen bg-background overflow-x-hidden"
    >
      <AppHeader />
      
      <section className="hero-gradient px-6 pt-16 pb-32 text-white rounded-b-[4rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <circle cx="20" cy="20" r="40" fill="currentColor" />
            <circle cx="80" cy="80" r="30" fill="currentColor" />
          </svg>
        </div>
        
        <div className="container mx-auto max-w-4xl relative z-10">
          <motion.div
            variants={fadeInUp}
            className="text-center space-y-6"
          >
            <h1 className="text-4xl sm:text-7xl font-black tracking-tight leading-tight">
              {user ? (
                <span>Hello, <span className="text-accent-foreground/90">{user.displayName?.split(' ')[0] || 'User'}</span></span>
              ) : t('appName')}
            </h1>
            <p className="text-lg sm:text-xl opacity-90 max-w-xl mx-auto font-medium leading-relaxed">
              {t('tagline')}
            </p>
          </motion.div>
        </div>
      </section>

      <main className="container mx-auto max-w-4xl px-6 -mt-20 pb-32 space-y-12 relative z-20">
        <motion.div variants={fadeInUp}>
          <Card className="card-rounded premium-shadow border-none glass-card overflow-hidden">
            <CardContent className="p-8 sm:p-12 space-y-10">
              <div className="flex items-center gap-4 text-primary">
                <div className="p-3 bg-primary/10 rounded-2xl">
                  <Zap className="h-6 w-6 fill-current animate-pulse" />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-widest">{t('landConverter')}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
                <div className="md:col-span-8 m3-input-container">
                  <Input
                    type="text"
                    inputMode="decimal"
                    placeholder=" "
                    value={inputValue}
                    onChange={handleInputChange}
                    className="peer m3-input text-xl font-bold"
                  />
                  <span className="m3-label">{t('enterArea')}</span>
                </div>
                <div className="md:col-span-4 m3-input-container">
                  <Select value={inputUnit} onValueChange={(u) => setInputUnit(u as any)}>
                    <SelectTrigger className="m3-input font-bold border-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-[2rem] border-none shadow-2xl">
                      <SelectItem value={UNITS.HECTARE}>{t('hectare')}</SelectItem>
                      <SelectItem value={UNITS.ARE}>{t('are')}</SelectItem>
                      <SelectItem value={UNITS.SQM}>{t('sqm')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="m3-label -top-0 text-[11px] font-black uppercase tracking-widest text-primary translate-y-3">{t('selectUnit')}</span>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {results ? (
                  <motion.div 
                    key="results"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4"
                  >
                    {[
                      { label: t('vigha'), value: results.vigha, color: 'bg-primary/5', iconColor: 'text-primary' },
                      { label: t('guntha'), value: results.guntha, color: 'bg-secondary/5', iconColor: 'text-secondary' },
                      { label: t('acre'), value: results.acre, color: 'bg-accent/5', iconColor: 'text-accent' },
                      { label: t('sqm'), value: results.sqm, color: 'bg-muted/50', iconColor: 'text-slate-500' }
                    ].map((res, idx) => (
                      <motion.div
                        key={res.label}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: idx * 0.1, type: "spring", stiffness: 200 }}
                        className={`p-6 card-rounded text-center ${res.color} border border-white/40 shadow-sm relative overflow-hidden group`}
                      >
                        <p className="text-[11px] font-black uppercase text-muted-foreground tracking-[0.2em] mb-3">{res.label}</p>
                        <motion.p 
                          key={res.value}
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          className={`text-3xl font-black ${res.iconColor} truncate`}
                        >
                          {formatNumber(res.value)}
                        </motion.p>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-muted-foreground/40 border-2 border-dashed border-muted rounded-[2.5rem]"
                  >
                    <Zap className="h-12 w-12 mb-4" />
                    <p className="font-bold text-sm uppercase tracking-widest">Enter area to begin conversion</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        <motion.section variants={fadeInUp} className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-50 flex items-center gap-3">
              <LayoutGrid className="h-6 w-6 text-primary" />
              {t('tools')}
            </h3>
          </div>
          <motion.div variants={stagger} className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <QuickTool href="/seven-twelve-to-vigha" icon={PieChart} label="7/12 ViGha" color="bg-orange-500" />
            <QuickTool href="/calculator" icon={Calculator} label={t('standardCalculator')} color="bg-indigo-500" />
            <QuickTool href="/fd-calculator" icon={Landmark} label={t('fdCalculator')} color="bg-teal-500" />
            <a href="https://anyror.gujarat.gov.in/home.aspx" target="_blank" rel="noopener noreferrer" className="w-full">
              <motion.div 
                whileHover={{ scale: 1.02, y: -8 }}
                whileTap={{ scale: 0.98 }}
                className="flex flex-col items-center gap-4 p-6 glass-card card-rounded h-full premium-shadow group"
              >
                <div className="p-5 rounded-3xl bg-accent shadow-2xl transition-all duration-500 group-hover:rotate-6">
                  <Download className="h-7 w-7 text-white" />
                </div>
                <span className="text-sm font-bold text-center text-slate-700 dark:text-slate-300">Digital RoR</span>
              </motion.div>
            </a>
          </motion.div>
        </motion.section>

        <motion.div variants={fadeInUp}>
          <Card className="card-rounded premium-shadow border-none glass-card">
            <CardHeader className="flex flex-row items-center justify-between p-8 sm:p-10 pb-4">
              <CardTitle className="flex items-center gap-4 text-2xl font-black">
                <div className="p-3 bg-primary/10 rounded-2xl">
                  <History className="text-primary h-6 w-6" />
                </div>
                {t('conversionHistory')}
              </CardTitle>
              {history.length > 0 && (
                <motion.div whileHover={{ rotate: 15 }} whileTap={{ scale: 0.9 }}>
                  <Button variant="ghost" size="icon" onClick={clearHistory} className="rounded-2xl w-12 h-12 hover:bg-destructive/10 hover:text-destructive">
                    <Trash2 className="h-6 w-6" />
                  </Button>
                </motion.div>
              )}
            </CardHeader>
            <CardContent className="p-8 sm:p-10 pt-4">
              <AnimatePresence mode="popLayout">
                {historyLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full rounded-3xl" />)}
                  </div>
                ) : history.length > 0 ? (
                  <motion.div variants={stagger} className="space-y-4">
                    {history.map((item) => (
                      <motion.div 
                        key={item.id} 
                        layout
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="p-6 bg-muted/30 rounded-[2rem] border border-white/50 flex items-center justify-between group hover:bg-white dark:hover:bg-slate-800 transition-all duration-500 shadow-sm hover:shadow-xl"
                      >
                        <div className="space-y-2">
                          <p className="font-black text-lg text-slate-900 dark:text-slate-50">
                            {item.sourcePage === 'seven-twelve' ? '7/12 Land Conversion' : `${item.input.value} ${t(item.input.unit as any)}`}
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center gap-3">
                            <span className="font-black text-primary bg-primary/5 px-3 py-1 rounded-full">{formatNumber(item.result.vigha)} Vigha</span>
                            <span className="opacity-30">•</span>
                            <span className="font-bold">{formatNumber(item.result.guntha)} Guntha</span>
                          </p>
                        </div>
                        <div className="bg-primary/5 p-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:translate-x-0 translate-x-4">
                          <ArrowRight className="h-6 w-6 text-primary" />
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20 px-8"
                  >
                    <div className="bg-muted/50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                      <History className="h-10 w-10 text-muted-foreground/30" />
                    </div>
                    <p className="text-muted-foreground font-black text-lg uppercase tracking-widest">{t('noHistory')}</p>
                    <p className="text-sm text-muted-foreground/60 mt-2">Your recent land calculations will appear here.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="sm:max-w-md card-rounded border-none shadow-[0_50px_100px_rgba(0,0,0,0.3)] glass-card p-0 overflow-hidden">
            <div className="hero-gradient p-10 text-white text-center">
                <motion.div 
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", damping: 15 }}
                  className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-white/30"
                >
                  <ShieldCheck className="h-10 w-10" />
                </motion.div>
                <DialogTitle className="text-3xl font-black">Personalize Experience</DialogTitle>
                <DialogDescription className="text-white/80 text-lg mt-2">
                    Save your history and access premium tools anywhere.
                </DialogDescription>
            </div>
            <div className="p-8 space-y-4">
                <Button className="w-full h-16 rounded-2xl text-lg font-black shadow-xl shadow-primary/20" asChild onClick={() => setShowLoginModal(false)}>
                    <Link href="/login">
                        Log In Now
                    </Link>
                </Button>
                <Button variant="ghost" className="w-full h-14 rounded-2xl font-bold opacity-60 hover:opacity-100" onClick={() => setShowLoginModal(false)}>
                    Maybe Later
                </Button>
            </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}