'use client';
import { usePathname } from 'next/navigation';
import { HomeIcon, FileTextIcon, CalculatorIcon } from 'lucide-react';
import { LanguageProvider, useLanguage } from '@/contexts/language-context';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageToggle } from '@/components/language-toggle';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AppLogo } from '@/components/app-logo';

function StandardCalculatorComponent() {
  const { t } = useLanguage();
  const pathname = usePathname();

  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handleButtonClick = (value: string) => {
    if (value === '=') {
      try {
        // Avoid using eval in production. This is for demonstration.
        // A safer approach would be to use a math expression parser library.
        const evalResult = new Function('return ' + input)();
        setResult(evalResult.toString());
      } catch (error) {
        setResult('Error');
      }
    } else if (value === 'C') {
      setInput('');
      setResult('');
    } else if (value === 'DEL') {
      setInput(input.slice(0, -1));
    }
    else {
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

  return (
    <div className="flex h-full bg-background">
      <Sidebar>
        <SidebarContent>
            <SidebarHeader>
                <h2 className="text-xl font-semibold">ViGha Calculate</h2>
            </SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href="/" isActive={pathname === '/'}>
                <HomeIcon />
                Home
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/seven-twelve-to-vigha" isActive={pathname === '/seven-twelve-to-vigha'}>
                <FileTextIcon />
                7/12 ViGha
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/calculator" isActive={pathname === '/calculator'}>
                <CalculatorIcon />
                Calculator
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="p-4 sm:p-6 flex flex-col h-full">
            <header className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <SidebarTrigger />
                    <div className="bg-primary p-2 rounded-lg hidden sm:block">
                        <AppLogo className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold font-headline text-primary">ViGha Calculate</h1>
                </div>
                <div className="flex items-center gap-1">
                    <LanguageToggle />
                    <ThemeToggle />
                </div>
            </header>
            <main className="flex flex-1 justify-center items-center">
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
                                    {btn}
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
      </SidebarInset>
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
