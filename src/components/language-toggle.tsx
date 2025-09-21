'use client';

import { useLanguage } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'gu' : 'en');
  };

  const transitionClasses = hasMounted ? 'transition-all duration-300 ease-in-out' : '';

  return (
    <Button variant="ghost" onClick={toggleLanguage} className="font-bold text-lg w-12 relative overflow-hidden" aria-label="Toggle Language">
      <span className={`absolute ${transitionClasses} ${language === 'en' ? 'opacity-100 scale-100' : 'opacity-0 scale-0 -rotate-90'}`}>
        ગુ
      </span>
      <span className={`absolute ${transitionClasses} ${language === 'gu' ? 'opacity-100 scale-100' : 'opacity-0 scale-0 rotate-90'}`}>
        EN
      </span>
    </Button>
  );
}
