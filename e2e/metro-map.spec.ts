import { expect, test } from '@playwright/test'

import { VISIBILITY_TIMEOUT, scrollToSection, waitForPageReady } from './test-utils'

test.describe('Experience Section', () => {
	test('desktop: experience section has interactive metro map', async ({ page }) => {
		const viewport = page.viewportSize()
		test.skip(!viewport || viewport.width < 768, 'Desktop only')

		await page.goto('/en')
		await waitForPageReady(page)
		await scrollToSection(page, 'experienceSection')

		const experienceSection = page.locator('#experienceSection')
		await expect(experienceSection).toBeVisible({ timeout: VISIBILITY_TIMEOUT })

		// Should have interactive elements (stations, filters, etc.)
		const interactiveElements = experienceSection.locator('button, [role="button"]')
		const count = await interactiveElements.count()
		expect(count).toBeGreaterThan(0)
	})

	test('mobile: experience section has content', async ({ page }) => {
		const viewport = page.viewportSize()
		test.skip(!viewport || viewport.width >= 768, 'Mobile only')

		await page.goto('/en')
		await waitForPageReady(page)
		await scrollToSection(page, 'experienceSection')

		const experienceSection = page.locator('#experienceSection')
		await expect(experienceSection).toBeVisible({ timeout: VISIBILITY_TIMEOUT })

		// Should have job/experience content
		const textContent = await experienceSection.textContent()
		expect(textContent?.length).toBeGreaterThan(200)
	})
})
