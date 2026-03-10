import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

import { DEBUG, TIMEOUTS } from './test-config'

// Re-export for direct access
export { DEBUG, TIMEOUTS }

/**
 * Wait for page to be ready (h1 visible and fully opaque)
 */
export async function waitForPageReady(page: Page) {
	const heroName = page.getByRole('heading', { level: 1 })
	await expect(heroName).toBeVisible({ timeout: TIMEOUTS.pageReady })

	await page.waitForFunction(
		() => {
			const el = document.querySelector('h1')
			return el && window.getComputedStyle(el).opacity === '1'
		},
		{ timeout: TIMEOUTS.animation },
	)
}
