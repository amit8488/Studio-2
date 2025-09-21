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
    if (!isMounted) return '';
    const isActive = language === lang;
    return `transition-all duration-300 ease-in-out ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`;
  }

  if (!isMounted) {
    return (
        <Button variant="ghost" className="font-bold text-lg w-12 relative" aria-label="Toggle Language">
            <span>{language === 'en' ? 'ગુ' : 'EN'}</span>
        </Button>
    );
  }

  return (
    <Button variant="ghost" onClick={toggleLanguage} className="font-bold text-lg w-12 relative overflow-hidden" aria-label="Toggle Language">
      <span className={`absolute ${getSpanClass('gu')} ${language === 'en' ? '' : 'rotate-0'} ${language === 'gu' ? '-rotate-90' : ''}`}>
        ગુ
      </span>
      <span className={`absolute ${getSpanClass('en')} ${language === 'gu' ? '' : 'rotate-0'} ${language === 'en' ? 'rotate-90' : ''}`}>
        EN
      </span>
    </Button>
  );
}
