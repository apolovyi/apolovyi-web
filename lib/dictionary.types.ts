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

export interface Dictionary {
  metadata: Metadata
  header: any
  heroSection: any
  aboutMeSection: any
  experienceSection: any
  projectsSection: { title: string; projects: Project[] }
  contactSection: any
  footer: { rights: string }
}

