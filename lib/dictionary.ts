import type { Locale } from "@/i18n-config";

export interface OpenGraphImage {
  url: string;
  width: number;
  height: number;
  alt: string;
}

export interface Robots {
  index?: boolean;
  follow?: boolean;
  noarchive?: boolean;
  nosnippet?: boolean;
  noimageindex?: boolean;
  nocache?: boolean;
  notranslate?: boolean;
  indexifembedded?: boolean;
  nositelinkssearchbox?: boolean;
  unavailable_after?: string;
  "max-video-preview"?: number | string;
  "max-image-preview"?: "none" | "standard" | "large";
  "max-snippet"?: number;
}

export interface Metadata {
  title: {
    default: string;
    template: string;
  };
  description: string;
  openGraph: {
    title: string;
    description: string;
    url: string;
    siteName: string;
    images: OpenGraphImage[];
    locale: string;
    type: string;
  };
  robots: Robots;
  icons: {
    icon: Array<{ url: string; type?: string; sizes?: string }>;
    apple: Array<{ url: string; sizes: string; type: string }>;
  };
  alternates: {
    canonical: string;
  };
  keywords: string[];
}

interface Project {
  category: string;
  company: string;
  description: string;
  role: string;
  image: string;
  link: string;
  technologies: string[];
}

interface Company {
  name: string;
  title: string;
  date: string;
  url: string;
  tasks: {
    text: string;
    keywords: string[];
  }[];
}

interface AboutMeSection {
  title: string;
  paragraphs: {
    intro: string;
    specialization: string;
    mindset: string;
    technologies: string;
  };
  highlightedTerms: string[];
}

interface HeroSection {
  name: string;
  greeting: string;
  tagline: string;
  paragraphs: string[];
  highlightedTerms: string[];
  cta: string;
}

interface MenuItem {
  id: string;
  name: string;
  href: string;
}

interface Header {
  menuItems: MenuItem[];
  resumeButton: {
    text: string;
    href: string;
  };
}

interface ExperienceSection {
  title: string;
  sectionNumber: string;
  companies: {
    [key: string]: string;
  };
  roles: {
    [key: string]: Company;
  };
}

interface ProjectsSection {
  title: string;
  sectionNumber: string;
  viewProject: string;
  projects: Project[];
}

interface Dictionary {
  metadata: Metadata;
  header: Header;
  heroSection: HeroSection;
  aboutMeSection: AboutMeSection;
  experienceSection: ExperienceSection;
  projectsSection: ProjectsSection;
}

const dictionaries: Record<Locale, Dictionary> = {
  en: require("@/dictionaries/en.json"),
  de: require("@/dictionaries/de.json"),
  ua: require("@/dictionaries/ua.json"),
  ru: require("@/dictionaries/ru.json"),
};

export function getDictionary(locale: Locale): Dictionary {
  if (!dictionaries[locale]) {
    console.warn(`Locale '${locale}' not found, falling back to 'en'`);
    locale = "en" as Locale;
  }

  return dictionaries[locale];
}
