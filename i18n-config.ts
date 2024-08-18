export const i18n = {
  defaultLocale: "en" as const,
  locales: ["en", "de", "ua", "ru"] as const,
};

export type Locale = (typeof i18n)["locales"][number];
