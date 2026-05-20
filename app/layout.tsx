import type { Metadata } from 'next'

import '@/app/globals.css'

export const metadata: Metadata = {
	title: 'Artem Polovyi — Enterprise Engineering, AI-first',
	description:
		'Enterprise engineer in Zurich. A decade of systems at Audi, Infineon, UBS, Flowable, and PEAX. Now making AI behave in production.',
	metadataBase: new URL('https://apolovyi.me'),
	openGraph: {
		title: 'Artem Polovyi — Enterprise Engineering, AI-first',
		description:
			'Enterprise engineer in Zurich. A decade of systems at Audi, Infineon, UBS, Flowable, and PEAX. Now making AI behave in production.',
		url: 'https://apolovyi.me',
		siteName: 'Artem Polovyi',
		images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Artem Polovyi — Enterprise Engineering, AI-first' }],
		locale: 'en',
		type: 'website',
	},
	twitter: { card: 'summary_large_image' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return children
}
