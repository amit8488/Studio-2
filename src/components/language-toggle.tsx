'use client';

import { useLanguage } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'gu' : 'en');
  };

  return (
    <Button variant="ghost" onClick={toggleLanguage} className="font-bold text-lg w-12" aria-label="Toggle Language">
      {language === 'en' ? 'ગુ' : 'EN'}
    </Button>
  );
}
