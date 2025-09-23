import type { Locale } from '@/i18n-config'
import 'server-only'

import { logger } from '@/lib/logger'

import { dictionarySchema } from './dictionary.schema'
import type { Dictionary } from './dictionary.types'

async function importLocale(locale: string): Promise<Dictionary> {
	switch (locale) {
		case 'en':
			return (await import('@/dictionaries/en.json')).default as Dictionary
		case 'de':
			return (await import('@/dictionaries/de.json')).default as Dictionary
		case 'ch':
			return (await import('@/dictionaries/ch.json')).default as Dictionary
		case 'uk':
			return (await import('@/dictionaries/uk.json')).default as Dictionary
		case 'ru':
			return (await import('@/dictionaries/ru.json')).default as Dictionary
		default:
			return (await import('@/dictionaries/en.json')).default as Dictionary
	}
}

export async function getDictionary(locale: Locale): Promise<Dictionary> {
	const dict = await importLocale(locale)

	if (process.env.NODE_ENV !== 'production') {
		const parsed = dictionarySchema.safeParse(dict)
		if (!parsed.success) {
			logger.warn('[dictionary] Validation warning for locale', locale, parsed.error.format())
		}
	}

	return dict
}
