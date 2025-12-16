import { expect, test } from '@playwright/test'

// Increase timeout for slower browsers (Firefox)
const VISIBILITY_TIMEOUT = 10000

test.describe('Loading Screen', () => {
	test('should hide loading screen within reasonable time', async ({ page }) => {
		await page.goto('/en')

		// After full load, loading screen should be gone
		// Wait for hero to be visible (indicates loading complete)
		const heroName = page.getByRole('heading', { level: 1 })
		await expect(heroName).toBeVisible({ timeout: VISIBILITY_TIMEOUT })
	})

	test('should dispatch loadingScreenComplete event (hero becomes visible)', async ({ page }) => {
		await page.goto('/en')

		// The loadingScreenComplete event triggers finishedLoading state
		// which makes the hero visible. If hero is visible, event was dispatched.
		const heroName = page.getByRole('heading', { level: 1 })
		await expect(heroName).toBeVisible({ timeout: VISIBILITY_TIMEOUT })

		// Wait for hero opacity animation to complete
		await page.waitForFunction(
			() => {
				const el = document.querySelector('h1')
				if (!el) return false
				const opacity = window.getComputedStyle(el).opacity
				return opacity !== '' && parseFloat(opacity) > 0
			},
			{ timeout: VISIBILITY_TIMEOUT },
		)
	})
})

test.describe('Loading Screen - Mobile', () => {
	test.use({ viewport: { width: 375, height: 812 } })

	test('hero should be visible after loading on mobile', async ({ page }) => {
		await page.goto('/en')

		// Hero should be visible after loading
		const heroName = page.getByRole('heading', { level: 1 })
		await expect(heroName).toBeVisible({ timeout: VISIBILITY_TIMEOUT })
	})
})
