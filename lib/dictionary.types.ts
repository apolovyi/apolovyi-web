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

export interface Page {
	name: string
	subtitle: string
	body: string[]
	linksLabel: string
	links: {
		linkedin: string
		github: string
		email: string
	}
}

export interface Work {
	title: string
	intro: string
	back: string
	projectLink: string
	projects: Array<{
		name: string
		description: string
		url: string
	}>
}

export interface Dictionary {
	metadata: Metadata
	page: Page
	work: Work
}
