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

// We validate strictly for metadata and projects, and keep other sections flexible (any)
export const dictionarySchema = z.object({
  metadata: metadataSchema,
  header: z.any(),
  heroSection: z.any(),
  aboutMeSection: z.any(),
  experienceSection: z.any(),
  projectsSection: z.object({
    title: z.string(),
    projects: z.array(
      z.object({
        category: z.string(),
        company: z.string(),
        description: z.string(),
        role: z.string(),
        image: z.string(),
        link: z.string(),
        placeholder: z.string().optional(),
        technologies: z.array(z.string()),
      }),
    ),
  }),
  contactSection: z.any(),
  footer: z.object({ rights: z.string() }),
})

