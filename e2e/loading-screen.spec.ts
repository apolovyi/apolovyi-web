import { expect, test } from '@playwright/test'

import { VISIBILITY_TIMEOUT } from './test-utils'

test.describe('Loading Screen', () => {
	test('loading completes and hero becomes visible', async ({ page }) => {
		await page.goto('/en')

		// Hero should be visible after loading
		const heroName = page.getByRole('heading', { level: 1 })
		await expect(heroName).toBeVisible({ timeout: VISIBILITY_TIMEOUT })

		// Hero opacity should reach 1 (animation complete)
		await page.waitForFunction(
			() => {
				const el = document.querySelector('h1')
				if (!el) return false
				return window.getComputedStyle(el).opacity === '1'
			},
			{ timeout: VISIBILITY_TIMEOUT },
		)
	})

	test('loading works on mobile viewport', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 812 })
		await page.goto('/en')

		const heroName = page.getByRole('heading', { level: 1 })
		await expect(heroName).toBeVisible({ timeout: VISIBILITY_TIMEOUT })
	})
})
