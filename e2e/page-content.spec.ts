import { expect, test } from '@playwright/test'

import { TIMEOUTS, waitForPageReady } from './test-utils'

test.describe('Page Content', () => {
	test('displays name, subtitle, and body text', async ({ page }) => {
		await page.goto('/en')
		await waitForPageReady(page)

		const h1 = page.getByRole('heading', { level: 1 })
		await expect(h1).toHaveText('Artem Polovyi')

		await expect(page.getByText('Enterprise engineering, AI-first.')).toBeVisible()
		await expect(page.getByText(/a decade of enterprise systems/)).toBeVisible()
	})

	test('has three external links with correct attributes', async ({ page }) => {
		await page.goto('/en')
		await waitForPageReady(page)

		const nav = page.getByRole('navigation')
		await expect(nav).toBeVisible({ timeout: TIMEOUTS.visibility })

		const linkedIn = nav.getByRole('link', { name: 'LinkedIn' })
		await expect(linkedIn).toBeVisible()
		await expect(linkedIn).toHaveAttribute('href', 'https://www.linkedin.com/in/apolovyi/')
		await expect(linkedIn).toHaveAttribute('target', '_blank')
		await expect(linkedIn).toHaveAttribute('rel', /noopener/)

		const github = nav.getByRole('link', { name: 'GitHub' })
		await expect(github).toBeVisible()
		await expect(github).toHaveAttribute('href', 'https://github.com/apolovyi')
		await expect(github).toHaveAttribute('target', '_blank')

		const email = nav.getByRole('link', { name: 'Email' })
		await expect(email).toBeVisible()
		await expect(email).toHaveAttribute('href', 'mailto:info@apolovyi.me')
	})
})
