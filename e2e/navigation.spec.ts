import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

import { DEBUG, TIMEOUTS, waitForPageReady } from './test-utils'

/**
 * Wait for element to be scrolled into view with debug diagnostics
 */
async function waitForSectionInView(page: Page, sectionId: string) {
	const startTime = Date.now()

	// First check: does the element exist?
	const elementExists = await page.evaluate((id) => !!document.getElementById(id), sectionId)
	if (!elementExists) {
		throw new Error(`[Scroll Debug] Element #${sectionId} does not exist in DOM`)
	}

	// Get initial scroll position and element position
	const initialState = await page.evaluate((id) => {
		const el = document.getElementById(id)!
		const rect = el.getBoundingClientRect()
		return {
			scrollY: window.scrollY,
			elementTop: rect.top,
			elementBottom: rect.bottom,
			viewportHeight: window.innerHeight,
			isInView: rect.top < window.innerHeight && rect.bottom > 0,
		}
	}, sectionId)

	if (DEBUG) {
		console.log(`[Scroll Debug] Initial state for #${sectionId}:`, initialState)
	}

	// If already in view, return immediately
	if (initialState.isInView) {
		if (DEBUG) console.log(`[Scroll Debug] #${sectionId} already in view`)
		return
	}

	// Wait for scroll with polling to capture state changes
	try {
		await page.waitForFunction(
			(id) => {
				const el = document.getElementById(id)
				if (!el) return false
				const rect = el.getBoundingClientRect()
				return rect.top < window.innerHeight && rect.bottom > 0
			},
			sectionId,
			{ timeout: TIMEOUTS.scrollIntoView, polling: 100 },
		)

		if (DEBUG) {
			const elapsed = Date.now() - startTime
			console.log(`[Scroll Debug] #${sectionId} scrolled into view in ${elapsed}ms`)
		}
	} catch (error) {
		// On timeout, capture diagnostic info
		const finalState = await page.evaluate((id) => {
			const el = document.getElementById(id)!
			const rect = el.getBoundingClientRect()
			const lenis = (window as unknown as { lenis?: { isScrolling: boolean; velocity: number } }).lenis
			return {
				scrollY: window.scrollY,
				elementTop: rect.top,
				elementBottom: rect.bottom,
				viewportHeight: window.innerHeight,
				isInView: rect.top < window.innerHeight && rect.bottom > 0,
				lenisScrolling: lenis?.isScrolling,
				lenisVelocity: lenis?.velocity,
			}
		}, sectionId)

		const elapsed = Date.now() - startTime
		console.error(`[Scroll Debug] TIMEOUT after ${elapsed}ms for #${sectionId}`)
		console.error(`[Scroll Debug] Initial:`, initialState)
		console.error(`[Scroll Debug] Final:`, finalState)
		console.error(
			`[Scroll Debug] Scroll delta: ${finalState.scrollY - initialState.scrollY}px, Element moved: ${initialState.elementTop - finalState.elementTop}px`,
		)

		throw error
	}
}

test.describe('Navigation - Desktop', () => {
	test.use({ viewport: { width: 1440, height: 900 } })

	test.beforeEach(async ({ page }) => {
		await page.goto('/en')
		await waitForPageReady(page)
	})

	test('navigation scrolls to About section', async ({ page }) => {
		const nav = page.getByRole('navigation')
		await expect(nav).toBeVisible({ timeout: TIMEOUTS.visibility })

		const aboutLink = nav.getByText('About')
		await aboutLink.waitFor({ state: 'visible', timeout: TIMEOUTS.visibility })
		await aboutLink.click()
		await waitForSectionInView(page, 'aboutSection')
	})

	test('navigation scrolls to Contact section', async ({ page }) => {
		const nav = page.getByRole('navigation')
		await expect(nav).toBeVisible({ timeout: TIMEOUTS.visibility })

		const contactLink = nav.getByText('Contact')
		await contactLink.waitFor({ state: 'visible', timeout: TIMEOUTS.visibility })
		await contactLink.click()
		await waitForSectionInView(page, 'contactSection')
	})

	test('Resume link opens in new tab with security attributes', async ({ page }) => {
		const nav = page.getByRole('navigation')
		const resumeLink = nav.getByRole('link', { name: /Resume|CV/i })
		await expect(resumeLink).toBeVisible({ timeout: TIMEOUTS.visibility })

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
		await expect(menuButton).toBeVisible({ timeout: TIMEOUTS.visibility })
		await menuButton.click()

		// All nav items should be visible (wait for menu animation)
		await expect(page.getByText('About').first()).toBeVisible({ timeout: TIMEOUTS.stateChange })
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
		await expect(page.getByText('About').first()).toBeVisible({ timeout: TIMEOUTS.stateChange })

		// Mobile menu uses CSS transforms that position links outside viewport
		// Use JS click which ignores viewport constraints
		await page.evaluate(() => {
			const link = document.querySelector('a[href*="about"], a[href*="About"]') as HTMLAnchorElement | null
			if (!link) throw new Error('Mobile navigation "About" link not found')
			link.click()
		})

		// Verify scroll happened
		await waitForSectionInView(page, 'aboutSection')
	})
})

test.describe('Header', () => {
	test.use({ viewport: { width: 1440, height: 900 } })

	test('header remains fixed on scroll', async ({ page }) => {
		await page.goto('/en')
		await waitForPageReady(page)

		// Navigate to a section to trigger scroll (Lenis intercepts window.scrollTo)
		const nav = page.getByRole('navigation')
		const contactLink = nav.getByText('Contact')
		await contactLink.waitFor({ state: 'visible', timeout: TIMEOUTS.visibility })
		await contactLink.click()
		await waitForSectionInView(page, 'contactSection')

		// Header should still be visible and fixed at top
		const header = page.locator('header').first()
		await expect(header).toBeVisible({ timeout: TIMEOUTS.visibility })

		const box = await header.boundingBox()
		expect(box).not.toBeNull()
		if (box) {
			expect(box.y).toBeLessThanOrEqual(10) // Should be at top of viewport
		}
	})
})
