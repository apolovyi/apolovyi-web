import type { Metadata } from 'next'

import '@/app/globals.css'

export const metadata: Metadata = {
	title: 'Artem Polovyi — Software Engineer in Zurich',
	description: 'Software Engineer in Zurich. 10 years building enterprise systems.',
	metadataBase: new URL('https://apolovyi.me'),
	openGraph: {
		title: 'Artem Polovyi — Software Engineer in Zurich',
		description: 'Software Engineer in Zurich. 10 years building enterprise systems.',
		url: 'https://apolovyi.me',
		siteName: 'Artem Polovyi',
		images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Artem Polovyi — Software Engineer in Zurich' }],
		locale: 'en',
		type: 'website',
	},
	twitter: { card: 'summary_large_image' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return children
}
