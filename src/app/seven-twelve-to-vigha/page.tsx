'use client';

import { useState, useMemo, useEffect } from 'react';
import { History, Trash2, PieChart, Info, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/language-context';
import { convertArea, UNITS } from '@/lib/conversion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AppHeader } from '@/components/app-header';
import { useHistory } from '@/hooks/use-history';

const formatNumber = (num: number) => {
  if (isNaN(num) || !isFinite(num)) return '0.00';
  return num.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export default function SevenTwelveToVighaPage() {
  const { t } = useLanguage();
  const [hectare, setHectare] = useState('');
  const [are, setAre] = useState('');
  const [sqm, setSqm] = useState('');
  const { history, addHistory, clearHistory } = useHistory('seven-twelve');

  const handleInputChange = (setter: any) => (e: any) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) setter(value);
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
        if (history[0]?.sevenTwelveInput?.hectare === hectare && history[0]?.sevenTwelveInput?.are === are) return;
        addHistory({
            input: { value: totalSqm, unit: UNITS.SQM },
            result: results,
            sourcePage: 'seven-twelve',
            sevenTwelveInput: { hectare, are, sqm },
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [results, totalSqm, hectare, are, sqm, addHistory, history]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow container mx-auto max-w-5xl p-4 sm:p-8 space-y-8 pb-28 md:pb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <PieChart className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl font-black text-primary">7/12 to ViGha</h2>
          <p className="text-muted-foreground font-medium max-w-md mx-auto">Convert traditional land record measurements instantly</p>
        </motion.div>

        <div className="grid md:grid-cols-12 gap-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="md:col-span-8"
          >
            <Card className="rounded-[2.5rem] glass-card border-none p-8 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { id: 'hectare', label: t('hectareLabel'), val: hectare, set: setHectare },
                  { id: 'are', label: t('areLabel'), val: are, set: setAre },
                  { id: 'sqm', label: t('sqmLabel'), val: sqm, set: setSqm }
                ].map((input) => (
                  <div key={input.id} className="m3-input-container">
                    <Input
                      type="text"
                      inputMode="decimal"
                      placeholder=" "
                      value={input.val}
                      onChange={handleInputChange(input.set)}
                      className="peer m3-input text-center text-xl font-black border-none"
                    />
                    <span className="m3-label">{input.label}</span>
                  </div>
                ))}
              </div>

              <AnimatePresence>
                {results && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-2 gap-4 pt-4"
                  >
                    {[
                      { label: t('vigha'), value: results.vigha, color: 'bg-primary' },
                      { label: t('guntha'), value: results.guntha, color: 'bg-secondary' }
                    ].map((res) => (
                      <div key={res.label} className={`${res.color} rounded-[2rem] p-8 text-white shadow-xl shadow-primary/10 relative overflow-hidden`}>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80 mb-2">{res.label}</p>
                        <p className="text-3xl font-black">{formatNumber(res.value)}</p>
                        <div className="absolute -bottom-4 -right-4 opacity-10">
                          <PieChart className="h-24 w-24 rotate-12" />
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="bg-muted/50 rounded-3xl p-6 flex gap-4 items-start border border-white/20">
                <Info className="h-5 w-5 text-primary shrink-0 mt-1" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Enter the Hectare, Are, and Square Meter values exactly as they appear on your 7/12 land record to get the corresponding Vigha and Guntha measurements.
                </p>
              </div>
            </Card>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-4"
          >
            <Card className="rounded-[2.5rem] glass-card border-none h-full">
              <CardHeader className="p-8 pb-0 flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <History className="h-5 w-5 text-primary" />
                  {t('conversionHistory')}
                </CardTitle>
                {history.length > 0 && (
                  <Button variant="ghost" size="icon" onClick={clearHistory} className="rounded-xl">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent className="p-8">
                {history.length > 0 ? (
                  <div className="space-y-4">
                    {history.map((item) => (
                      <div key={item.id} className="p-4 bg-muted/40 rounded-2xl border border-white/40 shadow-sm flex items-center justify-between">
                        <div>
                          <p className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-1">
                            {item.sevenTwelveInput?.hectare || 0}H {item.sevenTwelveInput?.are || 0}A
                          </p>
                          <p className="font-black text-primary text-sm">{formatNumber(item.result.vigha)} Vigha</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground opacity-50" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 opacity-50">
                    <p className="text-sm font-medium">{t('noHistory')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
