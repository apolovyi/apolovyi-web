import type { Locale } from '@/i18n-config'
import { i18n } from '@/i18n-config'

import HomeClient from '@/components/home/HomeClient'

export function generateStaticParams() {
	return [{ lang: [] }, ...i18n.locales.map((locale) => ({ lang: [locale] }))]
}

export default async function Page({ params }: { params: Promise<{ lang?: string[] }> }) {
	const resolved = await params
	const lang = ((resolved.lang && resolved.lang[0]) || i18n.defaultLocale) as Locale
	return <HomeClient lang={lang} />
}
