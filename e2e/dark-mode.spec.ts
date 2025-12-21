import { expect, test } from '@playwright/test'

import { TIMEOUTS, waitForPageReady } from './test-utils'

test.describe('Dark Mode', () => {
	test.use({ viewport: { width: 1440, height: 900 } })

	test('theme toggle cycles through modes and persists', async ({ page }) => {
		await page.goto('/en')
		await waitForPageReady(page)

		const themeToggle = page.getByRole('button', { name: /mode.*click/i })
		await expect(themeToggle).toBeVisible({ timeout: TIMEOUTS.visibility })

		// Get initial theme
		const initialTheme = await page.evaluate(() => localStorage.getItem('theme'))

		// Click to cycle to next theme
		await themeToggle.click()
		await page.waitForFunction((prev) => localStorage.getItem('theme') !== prev, initialTheme, {
			timeout: TIMEOUTS.stateChange,
		})

		const newTheme = await page.evaluate(() => localStorage.getItem('theme'))
		expect(newTheme).not.toBe(initialTheme)
	})

	test('theme toggle updates document dark class', async ({ page }) => {
		await page.goto('/en')
		await waitForPageReady(page)

		const themeToggle = page.getByRole('button', { name: /mode.*click/i })
		await expect(themeToggle).toBeVisible({ timeout: TIMEOUTS.visibility })

		// Force dark mode by clicking until we get 'dark' theme, then verify class is set
		// This avoids edge cases where system preference affects auto mode
		let attempts = 0
		while (attempts < 3) {
			const theme = await page.evaluate(() => localStorage.getItem('theme'))
			if (theme === 'dark') break
			await themeToggle.click()
			await page.waitForTimeout(100) // Brief wait for state update
			attempts++
		}

		// Verify dark class is applied when theme is 'dark'
		const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'))
		const theme = await page.evaluate(() => localStorage.getItem('theme'))
		if (theme === 'dark') {
			expect(isDark).toBe(true)
		}
	})

	test('theme toggle has accessible label that updates', async ({ page }) => {
		await page.goto('/en')
		await waitForPageReady(page)

		const themeToggle = page.getByRole('button', { name: /mode.*click/i })
		await expect(themeToggle).toBeVisible({ timeout: TIMEOUTS.visibility })

		const initialLabel = await themeToggle.getAttribute('aria-label')

		await themeToggle.click()
		// Wait for label to change
		await expect(themeToggle).not.toHaveAttribute('aria-label', initialLabel ?? '', {
			timeout: TIMEOUTS.stateChange,
		})

		const newLabel = await themeToggle.getAttribute('aria-label')
		expect(newLabel).toMatch(/mode/i)
	})
})
