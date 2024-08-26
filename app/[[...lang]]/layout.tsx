import { Metadata } from 'next'
import { Comfortaa, IBM_Plex_Mono, Merriweather, Quicksand } from 'next/font/google'
import Script from 'next/script'

import { Locale, i18n } from '@/i18n-config'
import { SpeedInsights } from '@vercel/speed-insights/next'

import '@/app/globals.css'

import LanguageDetector from '@/components/LanguageDetector'
import StructuredData from '@/components/StructuredData'
import { WebVitals } from '@/components/WebVitals'
import { AppProvider } from '@/components/shared/AppContext'

import { getDictionary } from '@/lib/dictionary'

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
	weight: ['100', '200', '300', '400', '500', '600', '700'],
})

const merriweather = Merriweather({
	subsets: ['latin'],
	variable: '--font-merriweather',
	display: 'swap',
	weight: ['300', '400', '700', '900'],
})

export async function generateStaticParams() {
	return i18n.locales.map((locale) => ({ lang: [locale] }))
}

export function generateMetadata({ params }: { params: { lang: string[] } }): Metadata {
	const lang = (params.lang?.[0] || i18n.defaultLocale) as Locale
	const dictionary = getDictionary(lang)
	const { metadata } = dictionary

	const baseUrl = 'https://apolovyi.me'
	const currentPath = `/${lang}`

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
			url: `${baseUrl}${currentPath}`,
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
			canonical: `${baseUrl}${currentPath}`,
			languages: {
				'x-default': baseUrl,
				...Object.fromEntries(i18n.locales.map((locale) => [locale, `${baseUrl}/${locale}`])),
			},
		},
		other: {
			'msapplication-TileColor': '#d8f0f9',
		},
		keywords: metadata.keywords,
	}
}

const RootLayout = ({ children, params }: { children: React.ReactNode; params: { lang: string[] } }) => {
	const lang = (params.lang?.[0] || i18n.defaultLocale) as Locale

	return (
		<html
			lang={lang}
			className={`${comfortaa.variable} ${quicksand.variable} ${ibmPlexMono.variable} ${merriweather.variable}`}
		>
			<body>
				<WebVitals />
				<LanguageDetector />
				<AppProvider>{children}</AppProvider>
				<StructuredData />
				<SpeedInsights />
				<Script
					src="https://app.tinyanalytics.io/pixel/ooUXwijEAaOptnOe"
					strategy="afterInteractive"
					defer
				/>
			</body>
		</html>
	)
}

export default RootLayout
