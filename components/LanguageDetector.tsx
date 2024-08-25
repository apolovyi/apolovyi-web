"use client";

import React, { useEffect } from "react";
import { i18n, isValidLocale } from "@/i18n-config";

function LanguageDetector() {
  useEffect(() => {
    const detectLanguage = () => {
      const storedLang = localStorage.getItem("detectedLang");

      if (!storedLang || !isValidLocale(storedLang)) {
        const userLanguage = navigator.language || (navigator as any).userLanguage;
        const detectedLocale =
          i18n.locales.find((locale) => userLanguage.toLowerCase().startsWith(locale.toLowerCase())) ||
          i18n.defaultLocale;

        localStorage.setItem("detectedLang", detectedLocale);
        document.cookie = `NEXT_LOCALE=${detectedLocale}; path=/; max-age=31536000`; // Set cookie for 1 year
      }
    };

    detectLanguage();
  }, []);

  return null;
}

export default React.memo(LanguageDetector);
