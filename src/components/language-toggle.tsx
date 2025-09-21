'use client';

import { useLanguage } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'gu' : 'en');
  };

  const getSpanClass = (lang: 'en' | 'gu') => {
    if (!isMounted) return 'opacity-0'; 
    const isActive = language === lang;
    return `transition-all duration-300 ease-in-out ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`;
  }

  if (!isMounted) {
    return (
        <Button variant="ghost" size="icon" className="font-bold text-lg w-12" aria-label="Toggle Language" />
    );
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggleLanguage} className="font-bold text-lg w-12 relative overflow-hidden" aria-label="Toggle Language">
      <span className={`absolute inset-0 flex items-center justify-center ${getSpanClass('gu')}`}>
        ગુ
      </span>
      <span className={`absolute inset-0 flex items-center justify-center ${getSpanClass('en')}`}>
        EN
      </span>
    </Button>
  );
}
