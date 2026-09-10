import { i18n, isValidLocale } from '@/i18n-config'

import { renderProfileMarkdown } from '@/lib/agent-content'
import { getDictionary } from '@/lib/dictionary.server'

export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams(): Array<{ lang: string }> {
	return i18n.locales.map((locale) => ({ lang: locale }))
}

export async function GET(_request: Request, { params }: { params: Promise<{ lang: string }> }) {
	const { lang } = await params
	if (!isValidLocale(lang)) return new Response('Not found', { status: 404 })

	const dictionary = await getDictionary(lang)

	return new Response(renderProfileMarkdown(dictionary), {
		headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
	})
}
