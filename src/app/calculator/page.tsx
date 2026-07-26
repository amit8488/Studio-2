'use client';

import { Divide, Percent, X, Plus, Minus, Calculator as CalcIcon } from 'lucide-react';
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
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
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
      case '/': return <Divide className="h-6 w-6" />;
      case '*': return <X className="h-6 w-6" />;
      case '+': return <Plus className="h-6 w-6" />;
      case '-': return <Minus className="h-6 w-6" />;
      case 'DEL': return <BackspaceIcon className="h-6 w-6" />;
      default: return btn;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background pb-28 sm:pb-8">
      <AppHeader />
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-full max-w-sm space-y-6"
        >
          <div className="flex items-center gap-3 px-4">
            <motion.div 
              initial={{ rotate: -20 }}
              animate={{ rotate: 0 }}
              className="p-2 bg-primary/10 rounded-2xl text-primary"
            >
              <CalcIcon className="h-6 w-6" />
            </motion.div>
            <h1 className="text-xl font-bold tracking-tight">Standard Calculator</h1>
          </div>

          <Card className="rounded-[3rem] glass-card border-none shadow-2xl overflow-hidden">
            <CardContent className="p-6 space-y-6">
              <div className="h-40 flex flex-col justify-end items-end px-4 py-6 bg-muted/30 rounded-[2rem] text-right overflow-hidden border border-white/50 relative">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={input || 'empty'}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-muted-foreground text-xl font-medium break-all"
                  >
                    {input || '0'}
                  </motion.div>
                </AnimatePresence>
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={result || 'no-res'}
                    initial={{ opacity: 0, scale: 0.9, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-primary text-5xl font-black break-all pt-2"
                  >
                    {result}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {buttons.map((btn, idx) => (
                  <motion.div key={idx} whileTap={{ scale: 0.92 }} whileHover={{ scale: 1.05 }}>
                    <Button 
                      onClick={() => handleButtonClick(btn)}
                      className={cn(
                        "w-full h-16 rounded-[1.5rem] text-xl font-bold transition-all shadow-sm",
                        ['/', '*', '-', '+', '='].includes(btn) 
                          ? "bg-primary text-white hover:bg-primary/90 shadow-primary/20" 
                          : btn === 'C' || btn === 'DEL'
                            ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                            : "bg-white dark:bg-slate-800 text-foreground hover:bg-muted"
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