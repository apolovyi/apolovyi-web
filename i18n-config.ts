export const i18n = {
  defaultLocale: "en" as const,
  locales: ["en", "de", "ch", "uk", "ru"] as const,
  localeNames: {
    en: "English",
    de: "Deutsch",
    ch: "Schweizerdeutsch",
    uk: "Українська",
    ru: "Русский",
  },
  localeEmojis: {
    en: "🇬🇧",
    de: "🇩🇪",
    ch: "🇨🇭",
    uk: "🇺🇦",
    ru: "🇷🇺",
  },
};

export type Locale = (typeof i18n)["locales"][number];
