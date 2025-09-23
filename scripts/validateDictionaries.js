const fs = require('fs')
const path = require('path')
const { z } = require('zod')

// Keep this schema aligned with lib/dictionary.schema.ts
const openGraphImageSchema = z.object({ url: z.string(), width: z.number(), height: z.number(), alt: z.string() })
const metadataSchema = z.object({
	title: z.object({ default: z.string(), template: z.string() }),
	description: z.string(),
	openGraph: z.object({ title: z.string(), description: z.string(), siteName: z.string(), images: z.array(openGraphImageSchema) }),
	keywords: z.array(z.string()),
})
const menuItemSchema = z.object({ id: z.string(), name: z.string(), href: z.string() })
const headerSchema = z.object({ menuItems: z.array(menuItemSchema), resumeButton: z.object({ text: z.string(), href: z.string() }) })
const heroSectionSchema = z.object({
	name: z.string(),
	greeting: z.string(),
	tagline: z.string(),
	resumeHref: z.string(),
	paragraphs: z.array(z.string()),
	highlightedTerms: z.array(z.string()),
	cta: z.string(),
})
const aboutMeSectionSchema = z.object({
	title: z.string(),
	paragraphs: z.object({ intro: z.string(), specialization: z.string(), mindset: z.string(), technologies: z.string() }),
	highlightedTerms: z.array(z.string()),
})
const roleTaskSchema = z.object({ text: z.string(), keywords: z.array(z.string()) })
const roleSchema = z.object({ title: z.string(), date: z.string(), url: z.string().optional(), tasks: z.array(roleTaskSchema) })
const experienceSectionSchema = z.object({ title: z.string(), roles: z.record(z.string(), roleSchema) })
const projectSchema = z.object({
	category: z.string(),
	company: z.string(),
	description: z.string(),
	role: z.string(),
	image: z.string(),
	link: z.string(),
	placeholder: z.string().optional(),
	technologies: z.array(z.string()),
})
const projectsSectionSchema = z.object({ title: z.string(), projects: z.array(projectSchema) })
const contactSectionSchema = z.object({
	title: z.string(),
	subtitle: z.string(),
	content: z.string(),
	formLabels: z.object({ name: z.string(), email: z.string(), message: z.string() }),
	sendButton: z.string(),
	sending: z.string(),
	successMessage: z.string(),
	errorMessage: z.string(),
})
const dictionarySchema = z.object({
	metadata: metadataSchema,
	header: headerSchema,
	heroSection: heroSectionSchema,
	aboutMeSection: aboutMeSectionSchema,
	experienceSection: experienceSectionSchema,
	projectsSection: projectsSectionSchema,
	contactSection: contactSectionSchema,
	footer: z.object({ rights: z.string() }),
})

function validateDictionaries() {
	const dictDir = path.join(process.cwd(), 'dictionaries')
	const files = fs.readdirSync(dictDir).filter((f) => f.endsWith('.json'))

	let ok = true
	for (const file of files) {
		const filePath = path.join(dictDir, file)
		try {
			const raw = fs.readFileSync(filePath, 'utf8')
			const json = JSON.parse(raw)
			const res = dictionarySchema.safeParse(json)
			if (!res.success) {
				ok = false
				console.error(`\n❌ Validation errors in ${file}:`)
				console.error(JSON.stringify(res.error.format(), null, 2))
			} else {
				console.log(`✅ ${file} valid`)
			}
		} catch (e) {
			ok = false
			console.error(`\n❌ Failed to read/parse ${file}:`, e.message)
		}
	}

	if (!ok) {
		console.error('\nDictionary validation failed.')
		process.exit(1)
	} else {
		console.log('\nAll dictionaries validated successfully.')
	}
}

if (require.main === module) {
	validateDictionaries()
}
