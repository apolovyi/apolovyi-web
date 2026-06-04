import { expect, test } from '@playwright/test'

import { waitForPageReady } from './test-utils'

const LOCALES = [
	{ path: '/en', lang: 'en' },
	{ path: '/de', lang: 'de' },
	{ path: '/ch', lang: 'de-CH' },
	{ path: '/uk', lang: 'uk' },
]

test('all locales set correct lang attribute', async ({ page }) => {
	for (const { path, lang } of LOCALES) {
		await page.goto(path)
		await waitForPageReady(page)
		expect(await page.locator('html').getAttribute('lang')).toBe(lang)
	}
})
