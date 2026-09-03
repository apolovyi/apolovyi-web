import { expect, test } from '@playwright/test'

const ROBOTS = `User-agent: *
Content-Signal: ai-train=no, search=yes, ai-input=yes
Allow: /

Sitemap: https://apolovyi.me/sitemap.xml
`

const PROJECTS = [
	['apolovyi-web', 'https://github.com/apolovyi/apolovyi-web'],
	['Pi', 'https://github.com/apolovyi/pi'],
	['TurkeyNomad', 'https://github.com/apolovyi/turkeynomad-blog'],
	['OpenStrap Edge', 'https://github.com/apolovyi/openstrap-src'],
] as const

test('work route resolves to the localized page and links selected projects', async ({ page }) => {
	await page.goto('/work')

	await expect(page).toHaveURL(/\/en\/work$/)
	await expect(page.getByRole('heading', { level: 1, name: 'Selected work' })).toBeVisible()

	for (const [name, url] of PROJECTS) {
		const project = page.locator('article').filter({ has: page.getByRole('heading', { name }) })
		await expect(project).toBeVisible()
		await expect(project.getByRole('link', { name: 'View on GitHub' })).toHaveAttribute('href', url)
	}
})

test('agent-readable entry points expose the intended public profile', async ({ request }) => {
	const llms = await request.get('/llms.txt')
	expect(llms.ok()).toBeTruthy()
	expect(await llms.text()).toContain('# Artem Polovyi')
	expect(await llms.text()).toContain('https://apolovyi.me/profile.md')

	const profile = await request.get('/profile.md')
	expect(profile.ok()).toBeTruthy()
	expect(await profile.text()).toContain('Senior software engineer and architect in Zürich.')
	expect(await profile.text()).toContain('https://github.com/apolovyi/openstrap-src')
})

test('crawler policy and sitemap expose the work pages', async ({ request }) => {
	const robots = await request.get('/robots.txt')
	expect(robots.ok()).toBeTruthy()
	expect(await robots.text()).toBe(ROBOTS)

	const sitemap = await request.get('/sitemap.xml')
	expect(sitemap.ok()).toBeTruthy()
	const sitemapText = await sitemap.text()

	for (const locale of ['en', 'de', 'ch', 'uk']) {
		expect(sitemapText).toContain(`<loc>https://apolovyi.me/${locale}/work</loc>`)
	}
})

test('structured data matches the public positioning', async ({ page }) => {
	await page.goto('/en')
	const structuredData = await page.locator('script[type="application/ld+json"]').textContent()
	const person = JSON.parse(structuredData ?? '{}')

	expect(person.jobTitle).toBe('Senior Software Engineer and Architect')
	expect(person.description).toContain('JVM platforms, system modernisation and reliable AI delivery')
	expect(person.knowsAbout).toContain('Flowable BPMN and CMMN')
})
