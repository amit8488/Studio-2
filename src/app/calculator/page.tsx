
'use client';
import { usePathname } from 'next/navigation';
import { HomeIcon, FileTextIcon, CalculatorIcon, DivideIcon, PercentIcon, XIcon, PlusIcon, MinusIcon } from 'lucide-react';
import { LanguageProvider, useLanguage } from '@/contexts/language-context';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageToggle } from '@/components/language-toggle';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AppLogo } from '@/components/app-logo';
import Link from 'next/link';

function evaluateExpression(expression: string): number {
  expression = expression.replace(/(\d+(\.\d+)?)%(\d+(\.\d+)?)/g, (match, p1, _, p3) => {
    return `(${p3} / 100 * ${p1})`;
  });

  expression = expression.replace(/(\d+(\.\d+)?)%/g, (match, p1) => {
    return `(${p1}/100)`;
  });

  try {
    const result = new Function('return ' + expression)();
    if (typeof result !== 'number' || !isFinite(result)) {
      throw new Error("Invalid calculation");
    }
    return result;
  } catch (e) {
    throw new Error("Invalid expression");
  }
}


function StandardCalculatorComponent() {
  const { t } = useLanguage();
  const pathname = usePathname();

  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handleButtonClick = (value: string) => {
    if (value === '=') {
      try {
        const evalResult = evaluateExpression(input);
        setResult(evalResult.toString());
      } catch (error) {
        setResult('Error');
      }
    } else if (value === 'C') {
      setInput('');
      setResult('');
    } else if (value === 'DEL') {
      setInput(input.slice(0, -1));
    } else {
      setInput(input + value);
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
      case '/': return <DivideIcon className="h-8 w-8" />;
      case '*': return <XIcon className="h-6 w-6" />;
      case '%': return <PercentIcon className="h-6 w-6" />;
      case '+': return <PlusIcon className="h-8 w-8" />;
      case '-': return <MinusIcon className="h-8 w-8" />;
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

  return (
      <div className="flex flex-col h-screen bg-background">
        <header className="border-b">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-6">
                        <Link href="/" className="flex items-center gap-2">
                            <AppLogo className="h-8 w-8 text-primary" />
                            <span className="font-bold text-lg text-primary hidden sm:block">ViGha Calculate</span>
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
                    <div className="bg-muted rounded-lg p-4 mb-4 text-right">
                        <div className="text-muted-foreground text-xl h-7 break-all">{input || '0'}</div>
                        <div className="text-foreground font-bold text-4xl h-12 break-all">{result}</div>
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
