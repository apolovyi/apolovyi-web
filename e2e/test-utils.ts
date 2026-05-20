import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

const isCI = process.env.CI === 'true'

export const TIMEOUTS = {
	pageReady: isCI ? 3000 : 1500,
	visibility: isCI ? 2000 : 1000,
	animation: isCI ? 1600 : 800,
} as const

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
