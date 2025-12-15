// Centralized dictionary types that can be safely imported by client and server code
// Keep this file types-only; do not import JSON here.

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
		url?: string
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

export interface MenuItem {
	id: string
	name: string
	href: string
}
export interface Header {
	menuItems: MenuItem[]
	resumeButton: { text: string; href: string }
}

export interface HeroSection {
	name: string
	greeting: string
	tagline: string
	roles: string[]
	resumeHref: string
	paragraphs: string[]
	highlightedTerms: string[]
	cta: string
}

export interface AboutMeSection {
	title: string
	paragraphs: {
		intro: string
		specialization: string
		mindset: string
		technologies: string
	}
	highlightedTerms: string[]
}

export interface RoleTask {
	text: string
	keywords: string[]
}
export interface Role {
	title: string
	date: string
	url?: string
	subtitle?: string
	tasks: RoleTask[]
}
export interface ExperienceSection {
	title: string
	roles: Record<string, Role>
}

export interface ProjectsSection {
	title: string
	projects: Project[]
}

export interface ContactSection {
	title: string
	subtitle: string
	content: string
	formLabels: { name: string; email: string; message: string }
	sendButton: string
	sending: string
	successMessage: string
	errorMessage: string
}

export interface Footer {
	rights: string
}

export interface Dictionary {
	metadata: Metadata
	header: Header
	heroSection: HeroSection
	aboutMeSection: AboutMeSection
	experienceSection: ExperienceSection
	projectsSection: ProjectsSection
	contactSection: ContactSection
	footer: Footer
}
