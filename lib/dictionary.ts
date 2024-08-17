import type { Locale } from "@/i18n-config";

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
  sectionNumber: string;
  paragraphs: {
    intro: string;
    specialization: string;
    mindset: string;
    technologies: string;
  };
  highlightedTerms: string[];
}

interface Dictionary {
  aboutMeSection: AboutMeSection;
  experienceSection: {
    title: string;
    sectionNumber: string;
    companies: {
      [key: string]: string;
    };
    roles: {
      [key: string]: Company;
    };
  };
  projectsSection: {
    title: string;
    sectionNumber: string;
    viewProject: string;
    projects: Project[];
  };
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
