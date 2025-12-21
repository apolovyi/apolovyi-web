import { expect, test } from '@playwright/test'

import { VISIBILITY_TIMEOUT, waitForPageReady } from './test-utils'

test.describe('Navigation - Desktop', () => {
	test.use({ viewport: { width: 1440, height: 900 } })

	test.beforeEach(async ({ page }) => {
		await page.goto('/en')
		await waitForPageReady(page)
	})

	test('navigation links scroll to correct sections', async ({ page }) => {
		const nav = page.getByRole('navigation')
		await expect(nav).toBeVisible({ timeout: VISIBILITY_TIMEOUT })

		// Test About navigation
		await nav.getByText('About').click()
		await expect(page.locator('#aboutSection').first()).toBeInViewport({ ratio: 0.2, timeout: 5000 })

		// Test Experience navigation
		await nav.getByText('Experience').click()
		await expect(page.locator('#experienceSection').first()).toBeInViewport({ ratio: 0.2, timeout: 5000 })

		// Test Contact navigation
		await nav.getByText('Contact').click()
		await expect(page.locator('#contactSection').first()).toBeInViewport({ ratio: 0.2, timeout: 5000 })
	})

	test('Resume link opens in new tab with security attributes', async ({ page }) => {
		const nav = page.getByRole('navigation')
		const resumeLink = nav.getByRole('link', { name: /Resume|CV/i })
		await expect(resumeLink).toBeVisible({ timeout: VISIBILITY_TIMEOUT })

		const target = await resumeLink.getAttribute('target')
		const rel = await resumeLink.getAttribute('rel')

		expect(target).toBe('_blank')
		expect(rel).toContain('noopener')
	})
})

test.describe('Navigation - Mobile', () => {
	test.use({ viewport: { width: 375, height: 812 } })

	test('mobile menu opens and contains all navigation items', async ({ page }) => {
		await page.goto('/en')
		await waitForPageReady(page)

		// Open menu
		const menuButton = page.locator('header button').first()
		await expect(menuButton).toBeVisible({ timeout: VISIBILITY_TIMEOUT })
		await menuButton.click()

		// All nav items should be visible (wait for menu animation)
		await expect(page.getByText('About').first()).toBeVisible({ timeout: 2000 })
		await expect(page.getByText('Experience').first()).toBeVisible()
		await expect(page.getByText('Projects').first()).toBeVisible()
		await expect(page.getByText('Contact').first()).toBeVisible()
	})

	test('mobile navigation scrolls to section', async ({ page }) => {
		await page.goto('/en')
		await waitForPageReady(page)

		const menuButton = page.locator('header button').first()
		await menuButton.click()

		// Wait for menu to open
		await expect(page.getByText('About').first()).toBeVisible({ timeout: 2000 })

		// Click About link via JavaScript (mobile menu may use transform positioning)
		await page.evaluate(() => {
			const link = document.querySelector('a[href*="about"], a[href*="About"]') as HTMLAnchorElement
			link?.click()
		})

		// Wait for scroll to complete
		await page.waitForFunction(() => window.scrollY > 50, { timeout: 5000 })
	})
})

test.describe('Header', () => {
	test('header remains fixed on scroll', async ({ page }) => {
		await page.goto('/en')
		await waitForPageReady(page)

		// Scroll down and wait for scroll to complete
		await page.evaluate(() => window.scrollTo(0, 500))
		await page.waitForFunction(() => window.scrollY >= 400, { timeout: 2000 })

		// Header should still be visible and fixed
		const header = page.locator('header.fixed').first()
		await expect(header).toBeVisible()

		const box = await header.boundingBox()
		expect(box?.y).toBeLessThanOrEqual(10) // Should be at top of viewport
	})
})
