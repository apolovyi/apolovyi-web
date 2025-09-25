import type { Locale } from '@/i18n-config'
import { i18n } from '@/i18n-config'

import HomeClient from '@/components/home/HomeClient'

export const dynamic = 'error'
export const dynamicParams = false

export function generateStaticParams(): Array<{ lang: string }> {
	return i18n.locales.map((locale) => ({ lang: locale }))
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
	const { lang: langParam } = await params
	const lang = (langParam ?? i18n.defaultLocale) as Locale
	return <HomeClient lang={lang} />
}
