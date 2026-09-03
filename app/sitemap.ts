import type { MetadataRoute } from 'next'

import { i18n } from '@/i18n-config'

export const dynamic = 'force-static'

const BASE_URL = 'https://apolovyi.me'

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: BASE_URL,
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 1,
		},
		...i18n.locales.map((locale) => ({
			url: `${BASE_URL}/${locale}`,
			lastModified: new Date(),
			changeFrequency: 'weekly' as const,
			priority: 0.8,
		})),
		...i18n.locales.map((locale) => ({
			url: `${BASE_URL}/${locale}/work`,
			lastModified: new Date(),
			changeFrequency: 'monthly' as const,
			priority: 0.7,
		})),
	]
}
