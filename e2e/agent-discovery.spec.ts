import { expect, test } from '@playwright/test'

const ROBOTS = `User-agent: *
Content-Signal: ai-train=no, search=yes, ai-input=yes
Allow: /

Sitemap: https://apolovyi.me/sitemap.xml
`

const LOCALES = ['en', 'de', 'ch', 'uk'] as const

const PRIVATE_CV_PATHS = ['/cv/Artem_Polovyi_DE.yaml', '/cv/CV_Artem_Polovyi_DE_WEB.pdf', '/cv/CV_Artem_Polovyi_EN_WEB.pdf'] as const

const SEARCH_METADATA = [
	[
		'en',
		'Artem Polovyi | Senior Software Engineer & Architect, Zürich',
		'Senior software engineer and architect in Zürich. Enterprise platforms, system modernisation and reliable AI delivery. Experience across Audi, Infineon, UBS, Flowable and PEAX.',
	],
	[
		'de',
		'Artem Polovyi | Senior Software Engineer & Architekt, Zürich',
		'Senior Software Engineer und Architekt in Zürich. Enterprise-Plattformen, Systemmodernisierung und zuverlässiger KI-Einsatz. Projekterfahrung bei Audi, Infineon, UBS, Flowable und PEAX.',
	],
	[
		'ch',
		'Artem Polovyi | Senior Software Engineer & Architekt, Zürich',
		'Senior Software Engineer und Architekt in Zürich. Enterprise-Plattformen, Systemmodernisierung und zuverlässiger KI-Einsatz. Projekterfahrung bei Audi, Infineon, UBS, Flowable und PEAX.',
	],
	[
		'uk',
		'Artem Polovyi | Старший інженер-програміст та архітектор, Цюріх',
		'Старший інженер-програміст та архітектор у Цюріху. Корпоративні платформи, модернізація систем і надійне впровадження ШІ. Досвід проєктів в Audi, Infineon, UBS, Flowable та PEAX.',
	],
] as const

for (const [locale, title, description] of SEARCH_METADATA) {
	test(`search metadata presents the engineering profile in ${locale}`, async ({ page }) => {
		await page.goto(`/${locale}`)

		await expect(page).toHaveTitle(title)
		await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', description)
		await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', title)
		await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', description)
	})
}

test('root redirect includes the engineering search metadata', async ({ request }) => {
	const response = await request.get('/')
	const html = await response.text()

	expect(html.match(/<title>(.*?)<\/title>/)?.[1]).toBe('Artem Polovyi | Senior Software Engineer &amp; Architect, Zürich')
	expect(html.match(/<meta name="description" content="([^"]*)"/)?.[1]).toBe(SEARCH_METADATA[0][2])
})

test('agent-readable entry points expose the intended public profile', async ({ request }) => {
	const llms = await request.get('/llms.txt')
	expect(llms.ok()).toBeTruthy()
	const llmsText = await llms.text()
	expect(llmsText).toContain('# Artem Polovyi')
	expect(llmsText).toContain('https://apolovyi.me/profile.md')

	const profile = await request.get('/profile.md')
	expect(profile.ok()).toBeTruthy()
	expect(await profile.text()).toContain('Senior software engineer and architect in Zürich.')

	for (const locale of LOCALES) {
		const path = `/${locale}/index.md`
		expect(llmsText).toContain(`https://apolovyi.me${path}`)
		const response = await request.get(path)
		expect(response.ok()).toBeTruthy()
		expect(response.headers()['content-type']).toContain('text/markdown')
		expect(await response.text()).toContain('# Artem Polovyi')
	}
})

test('public CV artifacts are unavailable and unlinked', async ({ request }) => {
	for (const path of PRIVATE_CV_PATHS) {
		expect((await request.get(path)).status()).toBe(404)
	}

	for (const path of ['/llms.txt', '/profile.md']) {
		const content = await (await request.get(path)).text()
		expect(content).not.toContain('/cv/')
		expect(content).not.toContain('Web CV')
	}
})

test('crawler policy and sitemap expose the homepages', async ({ request }) => {
	const robots = await request.get('/robots.txt')
	expect(robots.ok()).toBeTruthy()
	expect(await robots.text()).toBe(ROBOTS)

	const sitemap = await request.get('/sitemap.xml')
	expect(sitemap.ok()).toBeTruthy()
	const sitemapText = await sitemap.text()

	for (const locale of LOCALES) {
		expect(sitemapText).toContain(`<loc>https://apolovyi.me/${locale}</loc>`)
	}
})

test('HTML pages advertise LLM descriptions and Markdown alternatives', async ({ page }) => {
	await page.goto('/en')
	await expect(page.locator('link[rel="describedby"]')).toHaveAttribute('href', '/llms.txt')
	await expect(page.locator('link[rel="alternate"][type="text/markdown"]')).toHaveAttribute('href', 'https://apolovyi.me/en/index.md')
})

test('structured data describes the profile', async ({ page }) => {
	await page.goto('/en')
	const structuredData = await page.locator('script[type="application/ld+json"]').textContent()
	const graph = JSON.parse(structuredData ?? '{}')['@graph']
	const person = graph.find((entry: { '@type': string }) => entry['@type'] === 'Person')
	const profile = graph.find((entry: { '@type': string }) => entry['@type'] === 'ProfilePage')

	expect(person.jobTitle).toBe('Senior Software Engineer and Architect')
	expect(person.description).toContain('JVM platforms, system modernisation and reliable AI delivery')
	expect(person.knowsAbout).toContain('Flowable BPMN and CMMN')
	expect(profile.mainEntity['@id']).toBe(person['@id'])
	expect(profile.inLanguage).toBe('en')
})
