"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { i18n, Locale } from "@/i18n-config";

export default function LanguageDetector() {
  const pathname = usePathname();
  console.log(`[LanguageDetector] Incoming request for path: ${pathname}`);

  useEffect(() => {
    const setLanguageInLocalStorage = () => {
      const existingLang = localStorage.getItem("detectedLang");

      // Only set the language if it's not already in localStorage
      if (!existingLang) {
        const currentLocale = pathname.split("/")[1] as Locale;
        if (i18n.locales.includes(currentLocale)) {
          localStorage.setItem("detectedLang", currentLocale);
        } else {
          const defaultLocale = i18n.defaultLocale;
          localStorage.setItem("detectedLang", defaultLocale);
        }
      }
    };

    setLanguageInLocalStorage();
  }, [pathname]);

  return null;
}
