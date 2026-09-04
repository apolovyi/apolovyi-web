export const i18n = {
	defaultLocale: 'en' as const,
	locales: ['en', 'de', 'ch', 'uk'] as const,
	localeNames: {
		en: 'English',
		de: 'Deutsch',
		ch: 'Schweizerdeutsch',
		uk: 'Українська',
	},
	localeEmojis: {
		en: '🇬🇧',
		de: '🇩🇪',
		ch: '🇨🇭',
		uk: '🇺🇦',
	},
}

export type Locale = (typeof i18n)['locales'][number]

export const localeLanguageTags: Record<Locale, string> = {
	en: 'en',
	de: 'de',
	ch: 'de-CH',
	uk: 'uk',
}

export function isValidLocale(tested: string): tested is Locale {
	return i18n.locales.includes(tested as Locale)
}
