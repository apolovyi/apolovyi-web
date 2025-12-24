/**
 * Shared Playwright test fixtures
 *
 * Usage:
 *   import { test, expect } from './fixtures'
 *   test('my test', async ({ homePage }) => { ... })
 */

/* eslint-disable react-hooks/rules-of-hooks */
import type { Page } from '@playwright/test'
import { test as base, expect } from '@playwright/test'

import { TIMEOUTS, waitForPageReady } from './test-utils'

// Export expect for convenience
export { expect }

/**
 * Extended test with custom fixtures for common page states
 */
export const test = base.extend<{
	/** Page loaded at /en with loading screen complete */
	homePage: Page
	/** Page scrolled to contact section with form visible */
	contactSection: Page
	/** Page with mobile menu open (375x812 viewport) */
	mobileMenuOpen: Page
}>({
	homePage: async ({ page }, use) => {
		await page.goto('/en')
		await waitForPageReady(page)
		await use(page)
	},

	contactSection: async ({ page }, use) => {
		await page.goto('/en')
		await waitForPageReady(page)
		// Scroll to contact section
		await page.evaluate(() => {
			const section = document.getElementById('contactSection')
			section?.scrollIntoView({ behavior: 'instant' })
		})
		// Wait for form to be visible
		await expect(page.getByTestId('contact-form')).toBeVisible({
			timeout: TIMEOUTS.visibility,
		})
		await use(page)
	},

	mobileMenuOpen: async ({ page }, use) => {
		await page.setViewportSize({ width: 375, height: 812 })
		await page.goto('/en')
		await waitForPageReady(page)
		// Open mobile menu
		const menuButton = page.getByTestId('mobile-menu-toggle')
		await menuButton.click()
		// Wait for menu animation
		const mobileMenu = page.getByTestId('mobile-menu')
		await expect(mobileMenu.getByText('About')).toBeVisible({
			timeout: TIMEOUTS.stateChange,
		})
		await use(page)
	},
})
