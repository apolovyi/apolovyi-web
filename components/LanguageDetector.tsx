"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { i18n, Locale } from "@/i18n-config";

export default function LanguageDetector() {
  const router = useRouter();

  useEffect(() => {
    const detectedLang = localStorage.getItem("detectedLang") as Locale | null;

    if (!detectedLang) {
      fetch("/api/detect-language")
        .then((response) => response.json())
        .then((data) => {
          const detectedLocale = data.locale as Locale;
          localStorage.setItem("detectedLang", detectedLocale);

          if (detectedLocale !== i18n.defaultLocale) {
            router.push(`/${detectedLocale}`);
          }
        });
    }
  }, [router]);

  return null;
}
