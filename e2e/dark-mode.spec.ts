import { expect, test } from '@playwright/test'

import { TIMEOUTS, waitForPageReady } from './test-utils'

test.describe('Dark Mode', () => {
	test('applies dark class when localStorage theme is dark', async ({ page }) => {
		await page.goto('/en')
		await page.evaluate(() => localStorage.setItem('theme', 'dark'))
		await page.reload()
		await waitForPageReady(page)

		const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'))
		expect(isDark).toBe(true)
	})

	test('no dark class when localStorage theme is light', async ({ page }) => {
		await page.goto('/en')
		await page.evaluate(() => localStorage.setItem('theme', 'light'))
		await page.reload()
		await waitForPageReady(page)

		const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'))
		expect(isDark).toBe(false)
	})

	test('system mode respects prefers-color-scheme', async ({ page }) => {
		await page.emulateMedia({ colorScheme: 'dark' })
		await page.goto('/en')
		await page.evaluate(() => localStorage.setItem('theme', 'system'))
		await page.reload()
		await waitForPageReady(page)

		const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'))
		expect(isDark).toBe(true)
	})

	test('content is visible in both themes', async ({ page }) => {
		for (const theme of ['light', 'dark']) {
			await page.goto('/en')
			await page.evaluate((t) => localStorage.setItem('theme', t), theme)
			await page.reload()
			await waitForPageReady(page)

			await expect(page.getByRole('heading', { level: 1 })).toBeVisible({
				timeout: TIMEOUTS.visibility,
			})
			await expect(page.getByRole('navigation')).toBeVisible({
				timeout: TIMEOUTS.visibility,
			})
		}
	})
})
