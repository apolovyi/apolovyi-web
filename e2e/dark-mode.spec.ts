import { expect, test } from '@playwright/test'

import { VISIBILITY_TIMEOUT, waitForPageReady } from './test-utils'

test.describe('Dark Mode', () => {
	test.use({ viewport: { width: 1440, height: 900 } })

	test('theme toggle cycles through modes and persists', async ({ page }) => {
		await page.goto('/en')
		await waitForPageReady(page)

		const themeToggle = page.getByRole('button', { name: /mode.*click/i })
		await expect(themeToggle).toBeVisible({ timeout: VISIBILITY_TIMEOUT })

		// Collect themes as we cycle
		const themes: (string | null)[] = []
		for (let i = 0; i < 3; i++) {
			const currentTheme = await page.evaluate(() => localStorage.getItem('theme'))
			themes.push(currentTheme)
			await themeToggle.click()
			// Wait for theme to change
			await page.waitForFunction((prev) => localStorage.getItem('theme') !== prev, currentTheme, { timeout: 2000 })
		}

		// Should have cycled through different values
		const uniqueThemes = new Set(themes.filter((t) => t !== null))
		expect(uniqueThemes.size).toBeGreaterThanOrEqual(2)
	})

	test('theme toggle updates document dark class', async ({ page }) => {
		await page.goto('/en')
		await waitForPageReady(page)

		const themeToggle = page.getByRole('button', { name: /mode.*click/i })

		// Click through to collect dark class states
		const states: boolean[] = []
		for (let i = 0; i < 4; i++) {
			const currentState = await page.evaluate(() => document.documentElement.classList.contains('dark'))
			states.push(currentState)
			await themeToggle.click()
			// Wait for class to change
			await page
				.waitForFunction((prev) => document.documentElement.classList.contains('dark') !== prev, currentState, { timeout: 2000 })
				.catch(() => {
					// Some cycles may not change dark class (e.g., system mode)
				})
		}

		// Should have seen both true and false states
		expect(states).toContain(true)
		expect(states).toContain(false)
	})

	test('theme toggle has accessible label that updates', async ({ page }) => {
		await page.goto('/en')
		await waitForPageReady(page)

		const themeToggle = page.getByRole('button', { name: /mode.*click/i })
		const initialLabel = await themeToggle.getAttribute('aria-label')

		await themeToggle.click()
		// Wait for label to change
		await expect(themeToggle).not.toHaveAttribute('aria-label', initialLabel ?? '', { timeout: 2000 })

		const newLabel = await themeToggle.getAttribute('aria-label')
		expect(newLabel).toMatch(/mode/i)
	})
})
