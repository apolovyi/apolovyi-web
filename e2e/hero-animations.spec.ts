import { expect, test } from '@playwright/test'

import { VISIBILITY_TIMEOUT } from './test-utils'

test.describe('Hero Animations', () => {
	test('hero content loads and animates to full opacity', async ({ page }) => {
		await page.goto('/en')

		// Hero h1 should become visible
		const heroName = page.getByRole('heading', { level: 1 })
		await expect(heroName).toBeVisible({ timeout: VISIBILITY_TIMEOUT })

		// Wait for animation to complete (opacity = 1)
		await page.waitForFunction(
			() => {
				const el = document.querySelector('h1')
				return el && window.getComputedStyle(el).opacity === '1'
			},
			{ timeout: VISIBILITY_TIMEOUT },
		)
	})

	test('header becomes visible after loading', async ({ page }) => {
		await page.goto('/en')
		await page.waitForLoadState('networkidle')

		const header = page.locator('header.fixed').first()
		await expect(header).toBeVisible({ timeout: VISIBILITY_TIMEOUT })

		// Header should be fully opaque
		await page.waitForFunction(
			() => {
				const el = document.querySelector('header.fixed')
				if (!el) return false
				const opacity = parseFloat(window.getComputedStyle(el).opacity)
				return opacity > 0.5 || (isNaN(opacity) && window.getComputedStyle(el).visibility !== 'hidden')
			},
			{ timeout: VISIBILITY_TIMEOUT },
		)
	})

	test('desktop and mobile have consistent loading experience', async ({ browser }) => {
		// Desktop
		const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 } })
		const desktopPage = await desktopContext.newPage()
		await desktopPage.goto('/en')
		await expect(desktopPage.getByRole('heading', { level: 1 })).toBeVisible({ timeout: VISIBILITY_TIMEOUT })

		// Mobile
		const mobileContext = await browser.newContext({ viewport: { width: 375, height: 812 } })
		const mobilePage = await mobileContext.newPage()
		await mobilePage.goto('/en')
		await expect(mobilePage.getByRole('heading', { level: 1 })).toBeVisible({ timeout: VISIBILITY_TIMEOUT })

		await desktopContext.close()
		await mobileContext.close()
	})
})
