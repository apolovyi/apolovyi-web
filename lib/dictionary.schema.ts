import { z } from 'zod'

// Minimal schema to catch gross inconsistencies while keeping maintenance light
export const openGraphImageSchema = z.object({
	url: z.string(),
	width: z.number(),
	height: z.number(),
	alt: z.string(),
})

export const metadataSchema = z.object({
	title: z.object({
		default: z.string(),
		template: z.string(),
	}),
	description: z.string(),
	openGraph: z.object({
		title: z.string(),
		description: z.string(),
		siteName: z.string(),
		images: z.array(openGraphImageSchema),
	}),
	keywords: z.array(z.string()),
})

// Expanded schema that validates key sections strictly
const menuItemSchema = z.object({ id: z.string(), name: z.string(), href: z.string() })
const headerSchema = z.object({
	menuItems: z.array(menuItemSchema),
	resumeButton: z.object({ text: z.string(), href: z.string() }),
})

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
	paragraphs: z.object({
		intro: z.string(),
		specialization: z.string(),
		mindset: z.string(),
		technologies: z.string(),
	}),
	highlightedTerms: z.array(z.string()),
})

const roleTaskSchema = z.object({ text: z.string(), keywords: z.array(z.string()) })
const roleSchema = z.object({
	title: z.string(),
	date: z.string(),
	url: z.string().optional(),
	subtitle: z.string().optional(),
	tasks: z.array(roleTaskSchema),
})
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

export const dictionarySchema = z.object({
	metadata: metadataSchema,
	header: headerSchema,
	heroSection: heroSectionSchema,
	aboutMeSection: aboutMeSectionSchema,
	experienceSection: experienceSectionSchema,
	projectsSection: projectsSectionSchema,
	contactSection: contactSectionSchema,
	footer: z.object({ rights: z.string() }),
})
