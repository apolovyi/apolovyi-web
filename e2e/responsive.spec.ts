import { expect, test } from '@playwright/test'

import { TIMEOUTS, waitForPageReady } from './test-utils'

const VIEWPORTS = [
	{ name: 'mobile-s', width: 320, height: 568 },
	{ name: 'mobile-m', width: 375, height: 667 },
]

for (const vp of VIEWPORTS) {
	test.describe(`Responsive - ${vp.name} (${vp.width}x${vp.height})`, () => {
		test.use({ viewport: { width: vp.width, height: vp.height } })

		test('content is fully visible without horizontal scroll', async ({ page }) => {
			await page.goto('/en')
			await waitForPageReady(page)

			await expect(page.getByRole('heading', { level: 1 })).toBeVisible({
				timeout: TIMEOUTS.visibility,
			})
			await expect(page.getByRole('navigation')).toBeVisible({
				timeout: TIMEOUTS.visibility,
			})

			const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
			expect(hasOverflow).toBe(false)
		})
	})
}
