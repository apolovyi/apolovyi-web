export const i18n = {
  defaultLocale: "en" as const,
  locales: ["en", "de", "de_CH", "ua", "ru"] as const,
  localeNames: {
    en: "English",
    de: "Deutsch",
    de_CH: "Schweizerdeutsch",
    ua: "Українська",
    ru: "Русский",
  },
  localeEmojis: {
    en: "🇬🇧",
    de: "🇩🇪",
    de_CH: "🇨🇭",
    ua: "🇺🇦",
    ru: "🇷🇺",
  },
};

export type Locale = (typeof i18n)["locales"][number];
