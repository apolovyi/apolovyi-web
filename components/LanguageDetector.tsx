'use client'

import { useEffect } from 'react'

import { usePathname } from 'next/navigation'

import { Locale, i18n } from '@/i18n-config'
import Cookies from 'js-cookie'

export default function LanguageDetector() {
	const pathname = usePathname()
	console.log(`[LanguageDetector] Incoming request for path: ${pathname}`)

	useEffect(() => {
		const setLanguageInCookie = () => {
			const existingLang = Cookies.get('detectedLang')

			// Only set the language if it's not already in the cookie
			if (!existingLang) {
				const currentLocale = pathname.split('/')[1] as Locale
				if (i18n.locales.includes(currentLocale)) {
					console.log(`[LanguageDetector] set locale: ${currentLocale}`)
					Cookies.set('detectedLang', currentLocale, { expires: 365 }) // Set cookie to expire in 1 year
				} else {
					const defaultLocale = i18n.defaultLocale
					Cookies.set('detectedLang', defaultLocale, { expires: 365 })
					console.log(`[LanguageDetector] set locale by default: ${defaultLocale}`)
				}
			}
		}

		setLanguageInCookie()
	}, [pathname])

	return null
}
