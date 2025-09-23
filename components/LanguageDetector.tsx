'use client'

import { useEffect } from 'react'

import { usePathname } from 'next/navigation'

import type { Locale } from '@/i18n-config'
import { i18n } from '@/i18n-config'
import Cookies from 'js-cookie'

import { logger } from '@/lib/logger'

export default function LanguageDetector() {
	const pathname = usePathname()
	logger.warn(`[LanguageDetector] Incoming request for path: ${pathname}`)

	useEffect(() => {
		const setLanguageInCookie = () => {
			const existingLang = Cookies.get('detectedLang')

			// Only set the language if it's not already in the cookie
			if (!existingLang) {
				const currentLocale = pathname.split('/')[1] as Locale
				if (i18n.locales.includes(currentLocale)) {
					logger.warn(`[LanguageDetector] set locale: ${currentLocale}`)
					Cookies.set('detectedLang', currentLocale, { expires: 365 }) // Set cookie to expire in 1 year
				} else {
					const defaultLocale = i18n.defaultLocale
					Cookies.set('detectedLang', defaultLocale, { expires: 365 })
					logger.warn(`[LanguageDetector] set locale by default: ${defaultLocale}`)
				}
			}
		}

		setLanguageInCookie()
	}, [pathname])

	return null
}
