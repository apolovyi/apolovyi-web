"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { i18n, Locale } from "@/i18n-config";

interface LanguageSwitcherProps {
  currentLang: Locale;
}

function LanguageSwitcher({ currentLang }: LanguageSwitcherProps) {
  const router = useRouter();

  const handleLanguageChange = (newLang: Locale) => {
    localStorage.setItem("detectedLang", newLang);
    router.push(`/${newLang}`);
  };

  return (
    <div className="flex space-x-2">
      {i18n.locales.map((locale) => (
        <button
          key={locale}
          onClick={() => handleLanguageChange(locale)}
          disabled={currentLang === locale}
          className={`rounded px-2 py-1 text-sm ${
            currentLang === locale
              ? "bg-accent-coral text-background-primary"
              : "text-text-secondary hover:text-accent-coral"
          }`}
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

export default LanguageSwitcher;
