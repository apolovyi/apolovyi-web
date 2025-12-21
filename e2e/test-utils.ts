import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

import { DEBUG, TIMEOUTS } from './test-config'

// Re-export for backward compatibility
export const VISIBILITY_TIMEOUT = TIMEOUTS.visibility
export const STATE_CHANGE_TIMEOUT = TIMEOUTS.stateChange

// Export all timeouts and debug flag for direct access
export { DEBUG, TIMEOUTS }

/**
 * Wait for loading screen to complete and hero to be fully visible
 */
export async function waitForPageReady(page: Page) {
	// Wait for loading screen to disappear (it has z-[9999] and blocks clicks)
	await page.waitForFunction(
		() => {
			// Helper to check if a CSS value represents zero
			const isZero = (value: string | null) => {
				if (!value || value === 'auto') return false
				const num = parseFloat(value)
				return !Number.isNaN(num) && num === 0
			}

			// Check for any fixed overlay covering the viewport
			const overlays = document.querySelectorAll('.fixed')
			for (const overlay of overlays) {
				const style = window.getComputedStyle(overlay)
				const zIndex = parseInt(style.zIndex, 10)
				// Loading screen has z-index 9999 and covers full viewport
				const coversViewport = isZero(style.top) && isZero(style.right) && isZero(style.bottom) && isZero(style.left)
				if (zIndex >= 9999 && coversViewport) {
					return false
				}
			}
			return true
		},
		{ timeout: TIMEOUTS.pageReady },
	)

	const heroName = page.getByRole('heading', { level: 1 })
	await expect(heroName).toBeVisible({ timeout: TIMEOUTS.visibility })

	await page.waitForFunction(
		() => {
			const el = document.querySelector('h1')
			return el && window.getComputedStyle(el).opacity === '1'
		},
		{ timeout: TIMEOUTS.animation },
	)
}

/**
 * Scroll to a section by ID (handles various naming conventions)
 */
export async function scrollToSection(page: Page, sectionId: string) {
	await page.evaluate((id) => {
		const element =
			document.getElementById(id) ||
			document.getElementById(id + 'Section') ||
			document.getElementById(id.toLowerCase()) ||
			(document.querySelector(`[id*="${id}"]`) as HTMLElement)

		if (element) {
			element.scrollIntoView({ behavior: 'instant', block: 'start' })
		}
	}, sectionId)

	// Wait for section to be in viewport
	await page.waitForFunction(
		(id) => {
			const element =
				document.getElementById(id) ||
				document.getElementById(id + 'Section') ||
				document.getElementById(id.toLowerCase()) ||
				document.querySelector(`[id*="${id}"]`)
			if (!element) return false
			const rect = element.getBoundingClientRect()
			return rect.top >= -50 && rect.top < window.innerHeight
		},
		sectionId,
		{ timeout: TIMEOUTS.scroll },
	)
}
