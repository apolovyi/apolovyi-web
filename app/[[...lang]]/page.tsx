import type { Locale } from '@/i18n-config'

import HomeClient from '@/components/home/HomeClient'

export default async function Page({ params }: { params: Promise<{ lang?: Locale }> }) {
	const resolved = await params
	const lang = (resolved.lang ?? 'en') as Locale
	return <HomeClient lang={lang} />
}
