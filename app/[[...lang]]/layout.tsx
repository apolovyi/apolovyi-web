import { Metadata } from 'next'
import { Comfortaa, IBM_Plex_Mono, Merriweather, Quicksand } from 'next/font/google'
import Script from 'next/script'

import { Locale, i18n } from '@/i18n-config'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

import '@/app/globals.css'

import LanguageDetector from '@/components/LanguageDetector'
import StructuredData from '@/components/StructuredData'
import { WebVitals } from '@/components/WebVitals'
import { AppProvider } from '@/components/shared/AppContext'
import { DictionaryProvider } from '@/components/shared/DictionaryContext'

import { getDictionary as getServerDictionary } from '@/lib/dictionary.server'

// Fonts
const comfortaa = Comfortaa({
	subsets: ['latin'],
	variable: '--font-comfortaa',
	display: 'swap',
})

const quicksand = Quicksand({
	subsets: ['latin'],
	variable: '--font-quicksand',
	display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
	subsets: ['latin'],
	variable: '--font-ibm-plex-mono',
	display: 'swap',
	weight: ['400', '600'],
})

const merriweather = Merriweather({
	subsets: ['latin'],
	variable: '--font-merriweather',
	display: 'swap',
	weight: ['400', '700'],
})

export async function generateStaticParams() {
	return [{ lang: [] }, ...i18n.locales.map((locale) => ({ lang: [locale] }))]
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string[] }> }): Promise<Metadata> {
	const resolvedParams = await params
	const lang = resolvedParams.lang?.[0] || i18n.defaultLocale
	const dictionary = await getServerDictionary(lang as Locale)
	const { metadata } = dictionary

	const baseUrl = 'https://apolovyi.me'
	const currentPath = lang === i18n.defaultLocale ? '' : `/${lang}`
	const fullUrl = `${baseUrl}${currentPath}`

	return {
		title: {
			default: metadata.title.default,
			template: metadata.title.template,
		},
		metadataBase: new URL(baseUrl),
		description: metadata.description,
		openGraph: {
			title: metadata.openGraph.title,
			description: metadata.openGraph.description,
			url: fullUrl,
			siteName: metadata.openGraph.siteName,
			images: metadata.openGraph.images,
			locale: lang,
			type: 'website',
		},
		robots: {
			index: true,
			follow: true,
		},
		icons: {
			icon: [
				{ url: '/fav/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
				{ url: '/fav/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
			],
			apple: [{ url: '/fav/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
			other: [{ rel: 'mask-icon', url: '/fav/safari-pinned-tab.svg', color: '#5bbad5' }],
		},
		alternates: {
			canonical: fullUrl,
			languages: {
				'x-default': baseUrl,
				...Object.fromEntries(i18n.locales.map((locale) => [locale, locale === i18n.defaultLocale ? baseUrl : `${baseUrl}/${locale}`])),
			},
		},
		other: {
			'msapplication-TileColor': '#d8f0f9',
		},
		keywords: metadata.keywords,
	}
}

interface LayoutProps {
	children: React.ReactNode
	params: Promise<{ lang: string[] }>
}

const RootLayout = async ({ children, params }: LayoutProps) => {
	const resolvedParams = await params
	const lang = (resolvedParams.lang?.[0] || i18n.defaultLocale) as Locale
	const dictionary = await getServerDictionary(lang)

	return (
		<html
			lang={lang}
			className={`${comfortaa.variable} ${quicksand.variable} ${ibmPlexMono.variable} ${merriweather.variable}`}
		>
			<body>
				<WebVitals />
				<Analytics />
				<LanguageDetector />
				<DictionaryProvider dictionary={dictionary}>
					<AppProvider>{children}</AppProvider>
				</DictionaryProvider>
				<StructuredData />
				<SpeedInsights />
				<Script
					src="https://app.tinyanalytics.io/pixel/ooUXwijEAaOptnOe"
					strategy="afterInteractive"
				/>
			</body>
		</html>
	)
}

export default RootLayout
