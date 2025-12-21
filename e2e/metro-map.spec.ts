import { expect, test } from '@playwright/test'

import { TIMEOUTS, scrollToSection, waitForPageReady } from './test-utils'

test.describe('Experience Section - Desktop', () => {
	test.use({ viewport: { width: 1440, height: 900 } })

	test('experience section has interactive metro map', async ({ page }) => {
		await page.goto('/en')
		await waitForPageReady(page)
		await scrollToSection(page, 'experienceSection')

		const experienceSection = page.locator('#experienceSection')
		await expect(experienceSection).toBeVisible({ timeout: TIMEOUTS.visibility })

		// Should have interactive elements (stations, filters, etc.)
		const interactiveElements = experienceSection.locator('button, [role="button"]')
		const count = await interactiveElements.count()
		expect(count).toBeGreaterThan(0)
	})
})

test.describe('Experience Section - Mobile', () => {
	test.use({ viewport: { width: 375, height: 812 } })

	test('experience section has content', async ({ page }) => {
		await page.goto('/en')
		await waitForPageReady(page)
		await scrollToSection(page, 'experienceSection')

		const experienceSection = page.locator('#experienceSection')
		await expect(experienceSection).toBeVisible({ timeout: TIMEOUTS.visibility })

		// Should have job/experience content
		const textContent = await experienceSection.textContent()
		expect(textContent?.length).toBeGreaterThan(200)
	})
})
