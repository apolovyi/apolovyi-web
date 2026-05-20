import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'

import type { Locale } from '@/i18n-config'
import { i18n } from '@/i18n-config'

import StructuredData from '@/components/StructuredData'
import { ThemeProvider } from '@/components/shared/ThemeProvider'

import { getDictionary as getServerDictionary } from '@/lib/dictionary.server'

const bcp47Map: Record<string, string> = { ch: 'de-CH' }

const outfit = Outfit({
	subsets: ['latin', 'latin-ext'],
	variable: '--font-outfit',
	display: 'swap',
	weight: ['200', '300', '400'],
})

const ENABLE_TINY_ANALYTICS = process.env.NODE_ENV === 'production'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
	const resolvedParams = await params
	const lang = resolvedParams.lang || i18n.defaultLocale
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
			images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Artem Polovyi — Enterprise Engineering, AI-first' }],
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
		twitter: { card: 'summary_large_image' },
		other: { 'msapplication-TileColor': '#d8f0f9' },
		keywords: metadata.keywords,
	}
}

export default async function LangLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
	const { lang: langParam } = await params
	const lang = (langParam || i18n.defaultLocale) as Locale

	return (
		<html
			lang={bcp47Map[lang] ?? lang}
			suppressHydrationWarning
		>
			<head>
				<StructuredData />
				<script
					dangerouslySetInnerHTML={{
						__html: `
							(function() {
								try {
									var theme = localStorage.getItem('theme');
									var isDark = false;
									if (theme === 'dark') {
										isDark = true;
									} else if (theme === 'light') {
										isDark = false;
									} else if (theme === 'system') {
										isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
									} else {
										var h = new Date().getHours();
										isDark = h >= 19 || h < 7;
									}
									if (isDark) {
										document.documentElement.classList.add('dark');
									}
								} catch (e) {}
							})();
						`,
					}}
				/>
			</head>
			<body
				className={outfit.variable}
				style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
			>
				<ThemeProvider>{children}</ThemeProvider>
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
