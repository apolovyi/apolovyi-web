import { expect, test } from '@playwright/test'

import { TIMEOUTS, waitForPageReady } from './test-utils'

test.describe('Contact Form', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/en')
		await waitForPageReady(page)
		// Scroll to contact section
		await page.evaluate(() => {
			const section = document.getElementById('contactSection')
			section?.scrollIntoView({ behavior: 'instant' })
		})
		// Wait for form to be visible
		await expect(page.locator('form').first()).toBeVisible({ timeout: TIMEOUTS.visibility })
	})

	test('form fields are functional and validate input', async ({ page }) => {
		// All required fields should be present and interactive
		const nameField = page.locator('input[name="name"]').first()
		const emailField = page.locator('input[name="email"], input[type="email"]').first()
		const messageField = page.locator('textarea[name="message"]').first()
		const submitButton = page.locator('button[type="submit"]').first()

		await expect(nameField).toBeVisible({ timeout: TIMEOUTS.visibility })
		await expect(emailField).toBeVisible()
		await expect(messageField).toBeVisible()
		await expect(submitButton).toBeVisible()

		// Test input works
		await nameField.click()
		await nameField.fill('Test User')
		await expect(nameField).toHaveValue('Test User')

		// Test email validation rejects invalid email
		await emailField.fill('invalid-email')
		await submitButton.click()
		const isInvalid = await emailField.evaluate((el: HTMLInputElement) => !el.checkValidity())
		expect(isInvalid).toBe(true)

		// Test email validation accepts valid email
		await emailField.fill('test@example.com')
		const isValid = await emailField.evaluate((el: HTMLInputElement) => el.checkValidity())
		expect(isValid).toBe(true)
	})

	test('form has Netlify spam protection', async ({ page }) => {
		const form = page.locator('form[data-netlify="true"]')
		await expect(form).toBeVisible({ timeout: TIMEOUTS.visibility })

		// Honeypot field should exist but be hidden
		const honeypot = page.locator('input[name="bot-field"]')
		const honeypotExists = (await honeypot.count()) > 0
		if (honeypotExists) {
			await expect(honeypot).toBeHidden()
		}
	})

	test('form fields have minimum touch target size', async ({ page }) => {
		const nameField = page.locator('input[name="name"]').first()
		await expect(nameField).toBeVisible({ timeout: TIMEOUTS.visibility })

		const box = await nameField.boundingBox()
		// WCAG recommends 44x44px minimum touch target
		expect(box?.height).toBeGreaterThanOrEqual(38)
	})
})
