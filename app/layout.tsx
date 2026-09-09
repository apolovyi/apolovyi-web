import type { Metadata } from 'next'

import '@/app/globals.css'

export const metadata: Metadata = {
	title: 'Artem Polovyi | Senior Software Engineer & Architect, Zürich',
	description:
		'Senior software engineer and architect in Zürich. Enterprise platforms, system modernisation and reliable AI delivery. Experience across Audi, Infineon, UBS, Flowable and PEAX.',
	metadataBase: new URL('https://apolovyi.me'),
	openGraph: {
		title: 'Artem Polovyi | Senior Software Engineer & Architect, Zürich',
		description:
			'Senior software engineer and architect in Zürich. Enterprise platforms, system modernisation and reliable AI delivery. Experience across Audi, Infineon, UBS, Flowable and PEAX.',
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
