import type { Locale } from '@/i18n-config'
import en from '@/dictionaries/en.json'
import de from '@/dictionaries/de.json'
import ch from '@/dictionaries/ch.json'
import uk from '@/dictionaries/uk.json'
import ru from '@/dictionaries/ru.json'


export interface OpenGraphImage {
	url: string
	width: number
	height: number
	alt: string
}

export interface Metadata {
	title: {
		default: string
		template: string
	}
	description: string
	openGraph: {
		title: string
		description: string
		url: string
		siteName: string
		images: OpenGraphImage[]
	}
	keywords: string[]
}

export interface Project {
	category: string
	company: string
	description: string
	role: string
	image: string
	placeholder?: string
	link: string
	technologies: string[]
}

interface AboutMeSection {
	title: string
	paragraphs: {
		intro: string
		specialization: string
		mindset: string
		technologies: string
	}
	highlightedTerms: string[]
}

interface HeroSection {
	name: string
	greeting: string
	tagline: string
	resumeHref: string
	paragraphs: string[]
	highlightedTerms: string[]
	cta: string
}

interface MenuItem {
	id: string
	name: string
	href: string
}

interface Header {
	menuItems: MenuItem[]
	resumeButton: {
		text: string
		href: string
	}
}

interface ExperienceSection {
	title: string
	roles: {
		[key: string]: Company
	}
}
interface Company {
	name: string
	title: string
	date: string
	url: string
	tasks: {
		text: string
		keywords: string[]
	}[]
}

interface Footer {
	rights: string
}
interface ProjectsSection {
	title: string
	projects: Project[]
}

interface ContactSection {
	title: string
	subtitle: string
	content: string
	formLabels: {
		name: string
		email: string
		message: string
	}
	sendButton: string
	sending: string
	successMessage: string
	errorMessage: string
}

interface Dictionary {
	metadata: Metadata
	header: Header
	heroSection: HeroSection
	aboutMeSection: AboutMeSection
	experienceSection: ExperienceSection
	projectsSection: ProjectsSection
	contactSection: ContactSection
	footer: Footer
}

const dictionaries: Record<Locale, Dictionary> = {
	en,
	de,
	ch,
	uk,
	ru,
}

export function getDictionary(locale: Locale): Dictionary {
	if (!dictionaries[locale]) {
		console.warn(`Locale '${locale}' not found, falling back to 'en'`)
		locale = 'en' as Locale
	}

	return dictionaries[locale]
}
