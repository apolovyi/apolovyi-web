import { expect, test } from '@playwright/test'

import { TIMEOUTS, waitForPageReady } from './test-utils'

test.describe('Locale Routing', () => {
	test('/en loads with correct lang and English content', async ({ page }) => {
		await page.goto('/en')
		await waitForPageReady(page)

		expect(await page.locator('html').getAttribute('lang')).toBe('en')
		await expect(page.getByText('Enterprise engineering, AI-first.')).toBeVisible({
			timeout: TIMEOUTS.visibility,
		})
	})

	test('/de loads with correct lang and German content', async ({ page }) => {
		await page.goto('/de')
		await waitForPageReady(page)

		expect(await page.locator('html').getAttribute('lang')).toBe('de')
		await expect(page.getByText('Enterprise Engineering, AI-first.')).toBeVisible({
			timeout: TIMEOUTS.visibility,
		})
	})

	test('/ch loads with correct lang', async ({ page }) => {
		await page.goto('/ch')
		await waitForPageReady(page)

		expect(await page.locator('html').getAttribute('lang')).toBe('de-CH')
	})

	test('/uk loads with correct lang', async ({ page }) => {
		await page.goto('/uk')
		await waitForPageReady(page)

		expect(await page.locator('html').getAttribute('lang')).toBe('uk')
	})
})
