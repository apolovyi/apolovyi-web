import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

// Standard timeout for visibility checks (loading screen max 3s + buffer)
export const VISIBILITY_TIMEOUT = 5000

/**
 * Wait for loading screen to complete and hero to be fully visible
 */
export async function waitForPageReady(page: Page) {
	const heroName = page.getByRole('heading', { level: 1 })
	await expect(heroName).toBeVisible({ timeout: VISIBILITY_TIMEOUT })

	await page.waitForFunction(
		() => {
			const el = document.querySelector('h1')
			return el && window.getComputedStyle(el).opacity === '1'
		},
		{ timeout: VISIBILITY_TIMEOUT },
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
		{ timeout: 2000 },
	)
}
