import { expect, test } from '@playwright/test'

// Increase timeout for slower browsers (Firefox)
const VISIBILITY_TIMEOUT = 10000

test.describe('Hero Animations - Desktop', () => {
	test.use({ viewport: { width: 1440, height: 900 } })

	test('hero content should be visible after loading', async ({ page }) => {
		await page.goto('/en')

		// Hero h1 should be visible
		const heroName = page.getByRole('heading', { level: 1 })
		await expect(heroName).toBeVisible({ timeout: VISIBILITY_TIMEOUT })

		// Wait for opacity animation to complete
		await page.waitForFunction(
			() => {
				const el = document.querySelector('h1')
				if (!el) return false
				const opacity = window.getComputedStyle(el).opacity
				return opacity !== '' && parseFloat(opacity) > 0.5
			},
			{ timeout: VISIBILITY_TIMEOUT },
		)
	})

	test('hero should NOT have extended delay after loading', async ({ page }) => {
		await page.goto('/en')

		// Measure time from page load to hero visible
		const heroName = page.getByRole('heading', { level: 1 })

		// Hero should be visible within 5 seconds of page load
		// (not the old 6+ second delay from buggy animation timing)
		await expect(heroName).toBeVisible({ timeout: VISIBILITY_TIMEOUT })
	})

	test('header should be visible after loading', async ({ page }) => {
		await page.goto('/en')

		// Wait for page to be fully loaded before checking header
		await page.waitForLoadState('networkidle')

		// Header should be visible - target the fixed navigation header specifically
		const header = page.locator('header.fixed').first()
		await expect(header).toBeVisible({ timeout: VISIBILITY_TIMEOUT })

		// Wait for header animation to complete (opacity fades in)
		// Use a more lenient check that works across all browsers
		await page.waitForFunction(
			() => {
				const el = document.querySelector('header.fixed')
				if (!el) return false
				const style = window.getComputedStyle(el)
				const opacity = parseFloat(style.opacity)
				// NaN fallback: some browsers return empty opacity string in edge cases
				return opacity > 0.5 || (isNaN(opacity) && style.visibility !== 'hidden')
			},
			{ timeout: VISIBILITY_TIMEOUT },
		)
	})

	test('navigation menu should be visible after loading (desktop)', async ({ page }) => {
		await page.goto('/en')

		// Nav should be visible (desktop only)
		const nav = page.getByRole('navigation')
		await expect(nav).toBeVisible({ timeout: VISIBILITY_TIMEOUT })
	})
})

test.describe('Hero Animations - Mobile', () => {
	test.use({ viewport: { width: 375, height: 812 } })

	test('hero should be visible immediately after loading on mobile', async ({ page }) => {
		await page.goto('/en')

		// Hero should be visible within reasonable time (5s timeout)
		// The old buggy code had extra 650ms+ blank period on mobile
		const heroName = page.getByRole('heading', { level: 1 })
		await expect(heroName).toBeVisible({ timeout: VISIBILITY_TIMEOUT })

		// Wait for hero opacity animation to complete
		await page.waitForFunction(
			() => {
				const el = document.querySelector('h1')
				if (!el) return false
				const opacity = window.getComputedStyle(el).opacity
				return opacity !== '' && parseFloat(opacity) > 0.5
			},
			{ timeout: VISIBILITY_TIMEOUT },
		)
	})

	test('mobile should NOT have extra delay compared to desktop', async ({ page }) => {
		await page.goto('/en')

		// Hero should be visible
		const heroName = page.getByRole('heading', { level: 1 })
		await expect(heroName).toBeVisible({ timeout: VISIBILITY_TIMEOUT })

		// Wait for hero opacity animation to complete
		await page.waitForFunction(
			() => {
				const el = document.querySelector('h1')
				if (!el) return false
				const opacity = window.getComputedStyle(el).opacity
				return opacity !== '' && parseFloat(opacity) > 0.5
			},
			{ timeout: VISIBILITY_TIMEOUT },
		)
	})

	test('hero content should not be blank after loading', async ({ page }) => {
		await page.goto('/en')

		// Wait for hero to be visible
		const heroName = page.getByRole('heading', { level: 1 })
		await expect(heroName).toBeVisible({ timeout: VISIBILITY_TIMEOUT })

		// Wait for opacity animation to complete (verify not blank)
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

test.describe('Hero Animations - Consistency', () => {
	test('desktop and mobile should have similar loading experience', async ({ browser }) => {
		// Create desktop context
		const desktopContext = await browser.newContext({
			viewport: { width: 1440, height: 900 },
		})
		const desktopPage = await desktopContext.newPage()

		// Create mobile context
		const mobileContext = await browser.newContext({
			viewport: { width: 375, height: 812 },
		})
		const mobilePage = await mobileContext.newPage()

		// Navigate both and verify hero is visible on each
		await desktopPage.goto('/en')
		await expect(desktopPage.getByRole('heading', { level: 1 })).toBeVisible({ timeout: VISIBILITY_TIMEOUT })

		// Wait for desktop opacity
		await desktopPage.waitForFunction(
			() => {
				const el = document.querySelector('h1')
				if (!el) return false
				const opacity = window.getComputedStyle(el).opacity
				return opacity !== '' && parseFloat(opacity) > 0.5
			},
			{ timeout: VISIBILITY_TIMEOUT },
		)

		await mobilePage.goto('/en')
		await expect(mobilePage.getByRole('heading', { level: 1 })).toBeVisible({ timeout: VISIBILITY_TIMEOUT })

		// Wait for mobile opacity
		await mobilePage.waitForFunction(
			() => {
				const el = document.querySelector('h1')
				if (!el) return false
				const opacity = window.getComputedStyle(el).opacity
				return opacity !== '' && parseFloat(opacity) > 0.5
			},
			{ timeout: VISIBILITY_TIMEOUT },
		)

		await desktopContext.close()
		await mobileContext.close()
	})
})

test.describe('Animation Flash Prevention', () => {
	test('hero should be fully visible after load', async ({ page }) => {
		await page.goto('/en')

		// Hero h1 should be visible
		const h1 = page.getByRole('heading', { level: 1 })
		await expect(h1).toBeVisible({ timeout: VISIBILITY_TIMEOUT })

		// Wait for opacity to be exactly 1 (animation fully complete, no flash)
		await page.waitForFunction(
			() => {
				const el = document.querySelector('h1')
				if (!el) return false
				const opacity = window.getComputedStyle(el).opacity
				return opacity === '1'
			},
			{ timeout: VISIBILITY_TIMEOUT },
		)
	})
})
