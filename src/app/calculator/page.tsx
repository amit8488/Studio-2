
'use client';
import { usePathname } from 'next/navigation';
import { Divide, Percent, X, Plus, Minus } from 'lucide-react';
import { LanguageProvider, useLanguage } from '@/contexts/language-context';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageToggle } from '@/components/language-toggle';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AppLogo } from '@/components/app-logo';

function evaluateExpression(expression: string): number {
  try {
    // This is a safer way to evaluate expressions than new Function('return ' + expression)
    // It tokenizes and calculates based on operator precedence
    
    // 1. Handle percentages: 500%5 -> (500/100)*5
    expression = expression.replace(/(\d*\.?\d+)%(\d*\.?\d+)/g, (match, p1, p2) => {
      return `(${p1} / 100 * ${p2})`;
    });

    // Handle single percentage: 50% -> 0.5
    expression = expression.replace(/(\d*\.?\d+)%/g, (match, p1) => {
        return `(${p1}/100)`;
    });

    const tokens = expression.match(/(\d+\.?\d*|[\+\-\*\/]|\(|\))/g);
    if (!tokens) throw new Error("Invalid characters");

    const precedence: {[key: string]: number} = {'+': 1, '-': 1, '*': 2, '/': 2};
    const rpn: (string|number)[] = [];
    const operators: string[] = [];

    for (const token of tokens) {
      if (!isNaN(parseFloat(token))) {
        rpn.push(parseFloat(token));
      } else if (token === '(') {
        operators.push(token);
      } else if (token === ')') {
        while (operators.length && operators[operators.length - 1] !== '(') {
          rpn.push(operators.pop()!);
        }
        operators.pop(); // Pop '('
      } else { // Operator
        while (operators.length && precedence[operators[operators.length - 1]] >= precedence[token]) {
          rpn.push(operators.pop()!);
        }
        operators.push(token);
      }
    }

    while (operators.length) {
      rpn.push(operators.pop()!);
    }

    const stack: number[] = [];
    for (const token of rpn) {
      if (typeof token === 'number') {
        stack.push(token);
      } else {
        const b = stack.pop()!;
        const a = stack.pop()!;
        switch (token) {
          case '+': stack.push(a + b); break;
          case '-': stack.push(a - b); break;
          case '*': stack.push(a * b); break;
          case '/': 
            if (b === 0) throw new Error("Division by zero");
            stack.push(a / b); 
            break;
        }
      }
    }

    const result = stack[0];
    if (typeof result !== 'number' || !isFinite(result)) {
      throw new Error("Invalid calculation");
    }
    return result;
  } catch (e) {
    // For simplicity, we keep using new Function as a fallback for complex cases it might handle.
    // A full parser implementation would be more robust.
     try {
        const result = new Function('return ' + expression)();
        if (typeof result !== 'number' || !isFinite(result)) {
            throw new Error("Invalid calculation");
        }
        return result;
     } catch(finalError) {
        console.error("Calculation Error:", finalError);
        throw new Error("Invalid expression");
     }
  }
}

const BackspaceIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path>
      <line x1="18" y1="9" x2="12" y2="15"></line>
      <line x1="12" y1="9" x2="18" y2="15"></line>
    </svg>
  );


function StandardCalculatorComponent() {
  const { t } = useLanguage();
  const pathname = usePathname();

  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [justEvaluated, setJustEvaluated] = useState(false);

  const handleButtonClick = (value: string) => {
    const isOperator = ['/', '*', '-', '+'].includes(value);

    if (value === '=') {
      if (input) {
        try {
          const evalResult = evaluateExpression(input);
          const formattedResult = Number(evalResult.toFixed(10)).toString(); // Fix floating point issues
          setResult(formattedResult);
          setInput(input);
          setJustEvaluated(true);
        } catch (error) {
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
          if (isOperator) {
            setInput(result === 'Error' ? '' : result + value);
          } else {
            setInput(value);
          }
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
    '00', '0', '.', '=',
  ];

  const getButtonClass = (btn: string) => {
    if (['/', '*', '-', '+', '='].includes(btn)) {
      return 'bg-accent text-accent-foreground hover:bg-accent/90';
    }
    if (['C', 'DEL'].includes(btn)) {
        return 'bg-destructive/80 text-destructive-foreground hover:bg-destructive/90'
    }
    return 'bg-primary/10 text-primary hover:bg-primary/20';
  }

  const renderButtonContent = (btn: string) => {
    switch (btn) {
      case '/': return <Divide className="h-8 w-8" />;
      case '*': return <X className="h-6 w-6" />;
      case '%': return <Percent className="h-6 w-6" />;
      case '+': return <Plus className="h-8 w-8" />;
      case '-': return <Minus className="h-8 w-8" />;
      case 'DEL': return <BackspaceIcon className="h-8 w-8" />;
      default: return btn;
    }
  };

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const isActive = pathname === href;
    return (
      <Link href={href} className={`px-3 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'}`}>
        {children}
      </Link>
    );
  };
  
  const getDisplayFontSize = (text: string) => {
      const len = text.length;
      if (len > 20) return 'text-xl';
      if (len > 15) return 'text-2xl';
      if (len > 10) return 'text-3xl';
      return 'text-4xl';
  }

  return (
      <div className="flex flex-col h-screen bg-background">
        <header className="border-b">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-6">
                        <Link href="/" className="flex items-center gap-2">
                            <AppLogo className="h-8 w-8" />
                            <span className="font-bold text-lg text-primary hidden sm:block">Calculator</span>
                        </Link>
                        <nav className="hidden md:flex items-center gap-4">
                            <NavLink href="/">Home</NavLink>
                            <NavLink href="/seven-twelve-to-vigha">7/12 ViGha</NavLink>
                            <NavLink href="/calculator">Calculator</NavLink>
                        </nav>
                    </div>
                    <div className="flex items-center gap-1">
                        <LanguageToggle />
                        <ThemeToggle />
                    </div>
                </div>
                 <nav className="md:hidden flex items-center justify-center gap-2 pb-2">
                    <NavLink href="/">Home</NavLink>
                    <NavLink href="/seven-twelve-to-vigha">7/12 ViGha</NavLink>
                    <NavLink href="/calculator">Calculator</NavLink>
                </nav>
            </div>
        </header>

        <main className="flex flex-1 justify-center items-center p-4">
            <Card className="w-full max-w-sm shadow-lg">
                <CardContent className="p-4">
                    <div className="bg-muted rounded-lg p-4 mb-4 text-right overflow-hidden">
                        <div className="text-muted-foreground text-xl h-7 break-all" style={{fontSize: getDisplayFontSize(input).includes('xl') ? '1rem' : '1.25rem'}}>{input || '0'}</div>
                        <div className={`text-foreground font-bold h-12 break-all ${getDisplayFontSize(result)}`}>{result}</div>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        {buttons.map((btn) => (
                            <Button 
                                key={btn}
                                onClick={() => handleButtonClick(btn)}
                                className={`h-16 text-2xl font-bold ${getButtonClass(btn)}`}
                                variant="outline"
                            >
                                {renderButtonContent(btn)}
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </main>
      </div>
  );
}

export default function StandardCalculatorPage() {
    return (
        <LanguageProvider>
            <StandardCalculatorComponent />
        </LanguageProvider>
    )
}
