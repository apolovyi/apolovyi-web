import { z } from 'zod'

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
	}),
	keywords: z.array(z.string()),
})

const pageSectionSchema = z.object({
	name: z.string(),
	subtitle: z.string(),
	body: z.array(z.string()),
	linksLabel: z.string(),
	links: z.object({
		linkedin: z.string(),
		github: z.string(),
		email: z.string(),
	}),
})

const workSectionSchema = z.object({
	title: z.string(),
	intro: z.string(),
	back: z.string(),
	projectLink: z.string(),
	projects: z.array(
		z.object({
			name: z.string(),
			description: z.string(),
			url: z.string().url(),
		}),
	),
})

export const dictionarySchema = z.object({
	metadata: metadataSchema,
	page: pageSectionSchema,
	work: workSectionSchema,
})
