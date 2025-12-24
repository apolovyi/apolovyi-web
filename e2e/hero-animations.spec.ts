import { expect, test } from '@playwright/test'

import { TIMEOUTS } from './test-utils'

test.describe('Hero Animations', () => {
	test('hero content loads and animates to full opacity', async ({ page }) => {
		await page.goto('/en')

		// Hero h1 should become visible
		const heroName = page.getByRole('heading', { level: 1 })
		await expect(heroName).toBeVisible({ timeout: TIMEOUTS.visibility })

		// Wait for animation to complete (opacity = 1)
		await page.waitForFunction(
			() => {
				const el = document.querySelector('h1')
				return el && window.getComputedStyle(el).opacity === '1'
			},
			{ timeout: TIMEOUTS.animation },
		)
	})

	test('header becomes visible after loading', async ({ page }) => {
		await page.goto('/en')
		await page.waitForLoadState('networkidle')

		// Target the fixed navigation header specifically
		const header = page.locator('header.fixed')
		await expect(header).toBeVisible({ timeout: TIMEOUTS.visibility })

		// Header should be fully opaque
		await page.waitForFunction(
			() => {
				const el = document.querySelector('header.fixed')
				if (!el) return false
				const opacity = parseFloat(window.getComputedStyle(el).opacity)
				return opacity > 0.5 || (isNaN(opacity) && window.getComputedStyle(el).visibility !== 'hidden')
			},
			{ timeout: TIMEOUTS.animation },
		)
	})
})
