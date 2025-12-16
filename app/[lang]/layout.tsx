import type { Metadata } from 'next'
import { Comfortaa, IBM_Plex_Mono } from 'next/font/google'

import type { Locale } from '@/i18n-config'
import { i18n } from '@/i18n-config'

import LanguageDetector from '@/components/LanguageDetector'
import StructuredData from '@/components/StructuredData'
import { WebVitals } from '@/components/WebVitals'
import { AppProvider } from '@/components/shared/AppContext'
import { DictionaryProvider } from '@/components/shared/DictionaryContext'
import { LoadingScreen } from '@/components/shared/LoadingScreen'
import SmoothScrollProvider from '@/components/shared/SmoothScrollProvider'
import { ThemeProvider } from '@/components/shared/ThemeProvider'

import { getDictionary as getServerDictionary } from '@/lib/dictionary.server'

const ENABLE_TINY_ANALYTICS = process.env.NODE_ENV === 'production'

// Fonts
const comfortaa = Comfortaa({
	subsets: ['latin', 'cyrillic'],
	variable: '--font-comfortaa',
	display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
	subsets: ['latin'],
	variable: '--font-ibm-plex-mono',
	display: 'swap',
	weight: ['400', '600'],
})

export async function generateMetadata({ params }: { params: Promise<{ lang: string[] }> }): Promise<Metadata> {
	const resolvedParams = await params
	const lang = resolvedParams.lang?.[0] || i18n.defaultLocale
	const dictionary = await getServerDictionary(lang as Locale)
	const { metadata } = dictionary

	const baseUrl = 'https://apolovyi.me'
	const currentPath = lang === i18n.defaultLocale ? '' : `/${lang}`
	const fullUrl = `${baseUrl}${currentPath}`

	return {
		title: { default: metadata.title.default, template: metadata.title.template },
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
		robots: { index: true, follow: true },
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
				...Object.fromEntries(i18n.locales.map((l) => [l, l === i18n.defaultLocale ? baseUrl : `${baseUrl}/${l}`])),
			},
		},
		other: { 'msapplication-TileColor': '#d8f0f9' },
		keywords: metadata.keywords,
	}
}

export default async function LangLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
	const { lang: langParam } = await params
	const lang = (langParam || i18n.defaultLocale) as Locale
	const dictionary = await getServerDictionary(lang)

	return (
		<html
			lang={lang}
			className={`${comfortaa.variable} ${ibmPlexMono.variable} overflow-x-hidden`}
			suppressHydrationWarning
		>
			<head>
				{/* Prevent flash of wrong theme */}
				<script
					dangerouslySetInnerHTML={{
						__html: `
							(function() {
								try {
									var theme = localStorage.getItem('theme');
									var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
									if (theme === 'dark' || (!theme && prefersDark)) {
										document.documentElement.classList.add('dark');
									}
								} catch (e) {}
							})();
						`,
					}}
				/>
			</head>
			<body className="overflow-x-hidden">
				<ThemeProvider>
					<LoadingScreen />
					<WebVitals />
					<LanguageDetector />
					<DictionaryProvider dictionary={dictionary}>
						<AppProvider>
							<SmoothScrollProvider>{children}</SmoothScrollProvider>
						</AppProvider>
					</DictionaryProvider>
					<StructuredData />
				</ThemeProvider>
				{ENABLE_TINY_ANALYTICS && (
					<script
						src="https://app.tinyanalytics.io/pixel/ooUXwijEAaOptnOe"
						defer
					/>
				)}
			</body>
		</html>
	)
}
