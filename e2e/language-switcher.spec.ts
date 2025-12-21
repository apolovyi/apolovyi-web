import { expect, test } from '@playwright/test'

import { TIMEOUTS, waitForPageReady } from './test-utils'

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
		await expect(langButton).toBeVisible({ timeout: TIMEOUTS.visibility })
		await langButton.click()

		// Dropdown should show with multiple language options
		const dropdown = page.locator('[role="menu"]')
		await expect(dropdown).toBeVisible({ timeout: TIMEOUTS.visibility })

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
		await expect(ukrainianOption).toBeVisible({ timeout: TIMEOUTS.stateChange })
		await ukrainianOption.click()

		// Should navigate to /uk
		await page.waitForURL('**/uk', { timeout: TIMEOUTS.navigation })
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
		await expect(langButton).toBeVisible({ timeout: TIMEOUTS.visibility })
		await langButton.click()

		const dropdown = page.locator('[role="menu"]')
		await expect(dropdown).toBeVisible({ timeout: TIMEOUTS.visibility })

		// Click outside (on main content area, not at edge where it might miss)
		await page
			.locator('main')
			.first()
			.click({ position: { x: 100, y: 100 } })
		await expect(dropdown).toBeHidden({ timeout: TIMEOUTS.stateChange })
	})
})

test.describe('Locale Verification', () => {
	// Pareto: test 2 locales (en + one non-English) - if routing works, it works for all
	test('/en page loads with correct lang', async ({ page }) => {
		await page.goto('/en')
		await waitForPageReady(page)
		expect(await page.locator('html').getAttribute('lang')).toBe('en')
	})

	test('/de page loads with correct lang', async ({ page }) => {
		await page.goto('/de')
		await waitForPageReady(page)
		expect(await page.locator('html').getAttribute('lang')).toBe('de')
	})
})
