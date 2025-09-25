'use client'

import { useEffect } from 'react'

import { usePathname } from 'next/navigation'

import type { Locale } from '@/i18n-config'
import { i18n } from '@/i18n-config'

import { getCookie, setCookie } from '@/lib/cookies'
import { logger } from '@/lib/logger'

export default function LanguageDetector() {
	const pathname = usePathname()
	logger.warn(`[LanguageDetector] Incoming request for path: ${pathname}`)

	useEffect(() => {
		const setLanguageInCookie = () => {
			const existingLang = getCookie('detectedLang')

			// Only set the language if it's not already in the cookie
			if (!existingLang) {
				const currentLocale = pathname.split('/')[1] as Locale
				if (i18n.locales.includes(currentLocale)) {
					logger.warn(`[LanguageDetector] set locale: ${currentLocale}`)
					setCookie('detectedLang', currentLocale, { days: 365 }) // Set cookie to expire in 1 year
				} else {
					const defaultLocale = i18n.defaultLocale
					setCookie('detectedLang', defaultLocale, { days: 365 })
					logger.warn(`[LanguageDetector] set locale by default: ${defaultLocale}`)
				}
			}
		}

		setLanguageInCookie()
	}, [pathname])

	return null
}
