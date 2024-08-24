"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { i18n, Locale } from "@/i18n-config";

function LanguageDetector() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const detectAndRedirect = () => {
      try {
        let detectedLocale: Locale;
        const storedLang = localStorage.getItem("detectedLang") as Locale | null;

        if (storedLang && i18n.locales.includes(storedLang)) {
          detectedLocale = storedLang;
        } else {
          const userLanguage = navigator.language || (navigator as any).userLanguage;
          detectedLocale =
            i18n.locales.find((locale) => userLanguage.toLowerCase().startsWith(locale.toLowerCase())) ||
            i18n.defaultLocale;
          localStorage.setItem("detectedLang", detectedLocale);
        }

        const currentLocale = pathname.split("/")[1] as Locale;
        if (!i18n.locales.includes(currentLocale) && detectedLocale !== i18n.defaultLocale) {
          router.push(`/${detectedLocale}${pathname}`);
        }
      } catch (error) {
        console.error("Error in language detection:", error);
      }
    };

    detectAndRedirect();
  }, [router, pathname]);

  return null;
}

export default React.memo(LanguageDetector);
