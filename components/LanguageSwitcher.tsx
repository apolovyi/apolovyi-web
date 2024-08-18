"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { i18n, Locale } from "@/i18n-config";

interface LanguageSwitcherProps {
  currentLang?: Locale;
}

function LanguageSwitcher({ currentLang }: LanguageSwitcherProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isUS, setIsUS] = useState(false);
  const [language, setLanguage] = useState<Locale>(currentLang || i18n.defaultLocale);

  useEffect(() => {
    const userLanguage = navigator.language || (navigator as any).userLanguage;
    console.log(userLanguage);
    setIsUS(userLanguage.startsWith("en-US"));

    // If currentLang is not provided, try to detect the language
    if (!currentLang) {
      const detectedLang = localStorage.getItem("detectedLang") as Locale | null;
      if (detectedLang && i18n.locales.includes(detectedLang)) {
        setLanguage(detectedLang);
      } else {
        // If no detected language, use the browser language or default
        const browserLang = userLanguage.split("-")[0] as Locale;
        setLanguage(i18n.locales.includes(browserLang) ? browserLang : i18n.defaultLocale);
      }
    }
  }, [currentLang]);

  const handleLanguageChange = (newLang: Locale) => {
    localStorage.setItem("detectedLang", newLang);
    setLanguage(newLang);
    router.push(`/${newLang}`);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getDisplayName = (locale: Locale) => {
    return i18n.localeNames[locale];
  };

  const getFlag = (locale: Locale) => {
    if (locale === "en" && isUS) {
      return "🇺🇸";
    }
    return i18n.localeEmojis[locale];
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 rounded px-3 py-2 text-sm text-text-secondary hover:bg-accent-coral hover:bg-opacity-10 hover:text-accent-coral"
      >
        <span>{getFlag(language)}</span>
        <span>{getDisplayName(language)}</span>
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="w-55 absolute right-0 mt-2 rounded-md bg-background-primary shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {i18n.locales.map((locale) => (
              <button
                key={locale}
                onClick={() => handleLanguageChange(locale)}
                className={`block w-full px-4 py-2 text-left text-sm ${
                  language === locale
                    ? "bg-accent-coral bg-opacity-10 text-accent-coral"
                    : "text-text-secondary hover:bg-accent-coral hover:bg-opacity-10 hover:text-accent-coral"
                }`}
                role="menuitem"
              >
                <span className="whitespace-nowrap">
                  <span className="mr-2">{getFlag(locale)}</span>
                  {getDisplayName(locale)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;
