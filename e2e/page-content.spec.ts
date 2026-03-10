import { expect, test } from './fixtures'
import { TIMEOUTS } from './test-utils'

test.describe('Page Content', () => {
	test('displays name, subtitle, and body text', async ({ homePage: page }) => {
		const h1 = page.getByRole('heading', { level: 1 })
		await expect(h1).toHaveText('Artem Polovyi')

		// Subtitle and body text should be visible
		await expect(page.getByText('Software Engineer in Zurich.')).toBeVisible()
		await expect(page.getByText(/10 years building enterprise systems/)).toBeVisible()
	})

	test('has three external links with correct attributes', async ({ homePage: page }) => {
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

	test('links have minimum touch target size', async ({ homePage: page }) => {
		const nav = page.getByRole('navigation')
		const links = nav.getByRole('link')
		const count = await links.count()

		for (let i = 0; i < count; i++) {
			const box = await links.nth(i).boundingBox()
			expect(box).not.toBeNull()
			// WCAG recommends 44px minimum touch target
			expect(box!.height).toBeGreaterThanOrEqual(44)
		}
	})

	test('nav has accessible label', async ({ homePage: page }) => {
		const nav = page.getByRole('navigation')
		const label = await nav.getAttribute('aria-label')
		expect(label).toBeTruthy()
	})
})
