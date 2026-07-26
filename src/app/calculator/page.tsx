'use client';

import { Divide, Percent, X, Plus, Minus, Calculator as CalcIcon, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppHeader } from '@/components/app-header';
import { cn } from '@/lib/utils';

function evaluateExpression(expression: string): number {
  try {
    expression = expression.replace(/(\d*\.?\d+)%(\d*\.?\d+)/g, (match, p1, p2) => `(${p1} / 100 * ${p2})`);
    expression = expression.replace(/(\d*\.?\d+)%/g, (match, p1) => `(${p1}/100)`);
    const result = new Function('return ' + expression)();
    if (typeof result !== 'number' || !isFinite(result)) throw new Error("Invalid");
    return result;
  } catch (e) {
    throw new Error("Invalid");
  }
}

const BackspaceIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" {...props}>
    <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
    <line x1="18" y1="9" x2="12" y2="15" /><line x1="12" y1="9" x2="18" y2="15" />
  </svg>
);

export default function StandardCalculatorPage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [justEvaluated, setJustEvaluated] = useState(false);

  const handleButtonClick = (value: string) => {
    const isOperator = ['/', '*', '-', '+'].includes(value);
    if (value === '=') {
      if (input) {
        try {
          const evalResult = evaluateExpression(input);
          setResult(Number(evalResult.toFixed(10)).toString());
          setJustEvaluated(true);
        } catch {
          setResult('Error');
          setJustEvaluated(true);
        }
      }
    } else if (value === 'C') {
      setInput('');
      setResult('');
      setJustEvaluated(false);
    } else if (value === 'DEL') {
      if (justEvaluated) {
        setInput('');
        setResult('');
        setJustEvaluated(false);
      } else {
        setInput(input.slice(0, -1));
      }
    } else {
      if (justEvaluated) {
        setInput(isOperator ? (result === 'Error' ? '' : result + value) : value);
        setResult('');
        setJustEvaluated(false);
      } else {
        setInput(input + value);
      }
    }
  };

  const buttons = [
    'C', 'DEL', '%', '/',
    '7', '8', '9', '*',
    '4', '5', '6', '-',
    '1', '2', '3', '+',
    '0', '00', '.', '='
  ];

  const renderIcon = (btn: string) => {
    switch (btn) {
      case '/': return <Divide className="h-7 w-7" />;
      case '*': return <X className="h-7 w-7" />;
      case '+': return <Plus className="h-7 w-7" />;
      case '-': return <Minus className="h-7 w-7" />;
      case 'DEL': return <BackspaceIcon className="h-7 w-7" />;
      default: return btn;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background pb-32">
      <AppHeader />
      <main className="flex-grow flex flex-col items-center justify-center p-6 sm:p-8">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md space-y-8"
        >
          <div className="flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <motion.div 
                initial={{ rotate: -20, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                className="p-3 bg-primary/10 rounded-2xl text-primary"
              >
                <CalcIcon className="h-7 w-7" strokeWidth={2.5} />
              </motion.div>
              <h1 className="text-2xl font-black tracking-tight">Standard Calc</h1>
            </div>
            <Button variant="ghost" size="icon" onClick={() => handleButtonClick('C')} className="rounded-2xl text-muted-foreground hover:text-destructive">
               <Trash2 className="h-5 w-5" />
            </Button>
          </div>

          <Card className="card-rounded glass-card border-none shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="h-48 flex flex-col justify-end items-end px-6 py-8 bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] text-right overflow-hidden border border-white/40 dark:border-slate-800/40 relative shadow-inner">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={input || 'empty'}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-muted-foreground text-2xl font-bold break-all opacity-60"
                  >
                    {input || '0'}
                  </motion.div>
                </AnimatePresence>
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={result || 'no-res'}
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-primary text-6xl font-black break-all pt-2 tracking-tighter"
                  >
                    {result || '0'}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {buttons.map((btn, idx) => (
                  <motion.div 
                    key={idx} 
                    whileTap={{ scale: 0.94 }} 
                    whileHover={{ scale: 1.05 }}
                    className={cn(idx === buttons.length - 1 ? "" : "")}
                  >
                    <Button 
                      onClick={() => handleButtonClick(btn)}
                      className={cn(
                        "w-full h-20 rounded-[1.75rem] text-2xl font-black transition-all duration-300",
                        ['/', '*', '-', '+', '='].includes(btn) 
                          ? "bg-primary text-white hover:bg-primary/90 shadow-2xl shadow-primary/30" 
                          : btn === 'C' || btn === 'DEL'
                            ? "bg-destructive/10 text-destructive hover:bg-destructive/20 border-none"
                            : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm border-none"
                      )}
                      variant="ghost"
                    >
                      {renderIcon(btn)}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}