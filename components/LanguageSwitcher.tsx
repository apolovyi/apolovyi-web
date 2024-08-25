'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { i18n, Locale } from '@/i18n-config';
import Cookies from 'js-cookie';
import { useDetectLanguage, useOutsideClick } from '@/lib/hooks';

interface LanguageSwitcherProps {
  currentLang?: Locale;
}

const LanguageOption = ({ locale, currentLanguage, onClick, getFlag, getDisplayName }) => (
  <button
    onClick={() => onClick(locale)}
    className={`block w-full px-4 py-2 text-left text-sm ${
      currentLanguage === locale
        ? 'bg-accent-coral bg-opacity-10 text-accent-coral'
        : 'text-text-secondary hover:bg-accent-coral hover:bg-opacity-10 hover:text-accent-coral'
    }`}
    role="menuitem"
  >
    <span className="whitespace-nowrap">
      <span className="mr-2">{getFlag(locale)}</span>
      {getDisplayName(locale)}
    </span>
  </button>
);

function LanguageSwitcher({ currentLang }: LanguageSwitcherProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, isUS } = useDetectLanguage(currentLang);
  const dropdownRef = useOutsideClick(() => setIsOpen(false));

  const handleLanguageChange = (newLang: Locale) => {
    Cookies.set('detectedLang', newLang, { expires: 365 }); // Set cookie to expire in 1 year
    setLanguage(newLang);
    router.push(`/${newLang}`);
    setIsOpen(false);
  };

  const getDisplayName = useMemo(() => (locale: Locale) => i18n.localeNames[locale], []);
  const getFlag = useMemo(() => (locale: Locale) => locale === 'en' && isUS ? '🇺🇸' : i18n.localeEmojis[locale], [isUS]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 rounded px-3 py-2 text-sm text-text-secondary hover:bg-accent-coral hover:bg-opacity-10 hover:text-accent-coral"
      >
        <span>{getFlag(language)}</span>
        <span>{getDisplayName(language)}</span>
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
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
              <LanguageOption
                key={locale}
                locale={locale}
                currentLanguage={language}
                onClick={handleLanguageChange}
                getFlag={getFlag}
                getDisplayName={getDisplayName}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;
