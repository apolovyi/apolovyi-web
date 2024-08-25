import { i18n, Locale } from '@/i18n-config';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export const useDetectLanguage = (currentLang?: Locale) => {
  const [language, setLanguage] = useState<Locale>(currentLang || i18n.defaultLocale);
  const [isUS, setIsUS] = useState(false);

  useEffect(() => {
    const userLanguage = navigator.language || (navigator as any).userLanguage;
    setIsUS(userLanguage.startsWith('en-US'));

    if (!currentLang) {
      const detectedLang = Cookies.get('detectedLang') as Locale | undefined;
      const browserLang = userLanguage.split('-')[0] as Locale;

      setLanguage(
        detectedLang && i18n.locales.includes(detectedLang)
          ? detectedLang
          : i18n.locales.includes(browserLang)
          ? browserLang
          : i18n.defaultLocale,
      );
    }
  }, [currentLang]);

  return { language, setLanguage, isUS };
};
