import { expect, test } from '@playwright/test'

import { VISIBILITY_TIMEOUT, waitForPageReady } from './test-utils'

test.describe('Language Switcher', () => {
	test.use({ viewport: { width: 1440, height: 900 } })

	test('language dropdown opens and shows all locales', async ({ page }) => {
		await page.goto('/en')
		await waitForPageReady(page)

		// Find and click language switcher
		const langButton = page
			.locator('nav button')
			.filter({ hasText: /English|Deutsch|Українська/ })
			.first()
		await expect(langButton).toBeVisible({ timeout: VISIBILITY_TIMEOUT })
		await langButton.click()

		// Dropdown should show with multiple language options
		const dropdown = page.locator('[role="menu"]')
		await expect(dropdown).toBeVisible({ timeout: VISIBILITY_TIMEOUT })

		const menuItems = page.locator('[role="menuitem"]')
		const count = await menuItems.count()
		expect(count).toBeGreaterThanOrEqual(3)
	})

	test('selecting language navigates to that locale', async ({ page }) => {
		await page.goto('/en')
		await waitForPageReady(page)

		// Open dropdown
		const langButton = page
			.locator('nav button')
			.filter({ hasText: /English|Deutsch|Українська/ })
			.first()
		await langButton.click()

		// Wait for dropdown and click Ukrainian option
		const ukrainianOption = page.locator('[role="menuitem"]').filter({ hasText: 'Українська' })
		await expect(ukrainianOption).toBeVisible({ timeout: 2000 })
		await ukrainianOption.click()

		// Should navigate to /uk
		await page.waitForURL('**/uk', { timeout: 10000 })
		expect(page.url()).toContain('/uk')

		// HTML lang should be updated
		const htmlLang = await page.locator('html').getAttribute('lang')
		expect(htmlLang).toBe('uk')
	})

	test('dropdown closes when clicking outside', async ({ page }) => {
		await page.goto('/en')
		await waitForPageReady(page)

		const langButton = page
			.locator('nav button')
			.filter({ hasText: /English|Deutsch|Українська/ })
			.first()
		await langButton.click()

		const dropdown = page.locator('[role="menu"]')
		await expect(dropdown).toBeVisible()

		// Click outside
		await page.locator('body').click({ position: { x: 10, y: 10 } })
		await expect(dropdown).toBeHidden()
	})
})

test.describe('Locale Verification', () => {
	const locales = [
		{ code: 'en', lang: 'en' },
		{ code: 'de', lang: 'de' },
		{ code: 'uk', lang: 'uk' },
		{ code: 'ch', lang: 'ch' },
	]

	for (const { code, lang } of locales) {
		test(`/${code} page loads with correct lang="${lang}"`, async ({ page }) => {
			await page.goto(`/${code}`)
			await waitForPageReady(page)

			const htmlLang = await page.locator('html').getAttribute('lang')
			expect(htmlLang).toBe(lang)
		})
	}
})
