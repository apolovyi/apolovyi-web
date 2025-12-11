import type { Metadata } from 'next'

import '@/app/globals.css'

export const metadata: Metadata = {
	title: { default: 'apolovyi.me', template: '%s | apolovyi.me' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return children
}
