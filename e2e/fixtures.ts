/**
 * Shared Playwright test fixtures
 *
 * Usage:
 *   import { test, expect } from './fixtures'
 *   test('my test', async ({ homePage }) => { ... })
 */

/* eslint-disable react-hooks/rules-of-hooks */
import type { Page } from '@playwright/test'
import { test as base, expect } from '@playwright/test'

import { waitForPageReady } from './test-utils'

// Export expect for convenience
export { expect }

/**
 * Extended test with custom fixtures for common page states
 */
export const test = base.extend<{
	/** Page loaded at /en with content visible */
	homePage: Page
}>({
	homePage: async ({ page }, use) => {
		await page.goto('/en')
		await waitForPageReady(page)
		await use(page)
	},
})
