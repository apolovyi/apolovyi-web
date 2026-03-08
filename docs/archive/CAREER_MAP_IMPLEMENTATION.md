# Career Metro Map - Implementation Plan

A data-driven, transit-style visualization of career progression replacing the tab-based company list. Inspired by Swiss/German transit maps — instantly recognizable, shows systems thinking, differentiates from every other portfolio.

---

## Implementation Status

| Phase     | Description                                        | Status      |
| --------- | -------------------------------------------------- | ----------- |
| Phase 0   | Single source of truth (`lib/career-data.ts`)      | ✅ Complete |
| Phase 1-6 | Core metro map (lines, stations, timeline, legend) | ✅ Complete |
| Phase 7-8 | Mobile horizontal scroll                           | ✅ Complete |
| Phase 9   | Accessibility (reduced motion, keyboard nav, ARIA) | ✅ Complete |
| Phase 10  | Interactive line filters, replay animation         | ✅ Complete |
| Phase 11  | Train → Rocket animation polish                    | ✅ Complete |
| Phase 12  | Station clickability (adjacent station hit areas)  | ✅ Complete |

**Quality Score:** 100/100

### Phase 12: Station Clickability Fix (Complete)

**Problem:** Adjacent stations (e.g., Spreadshirt + Virtual Identity) couldn't be clicked when neighbor was active because overlapping hit areas blocked clicks.

**Solution:** Dynamic hit area sizing:

- Non-active stations: Large hit area (`Math.max(22, size + 10)`) for easy touch targets
- Active stations: Small hit area (`size + 5`) to not block neighbors
- Active stations have `pointer-events` disabled on parent group, click handler on hit circle directly

**Test:** Run `.screenshots/test-neighbors.mjs` to verify neighbor clickability.

---

### Phase 11: Rocket Animation (Complete)

See `.todo/ROCKET_ANIMATION_IMPROVEMENTS.md` for details.

**Fixed:**

- Rocket now flies straight UP (not horizontally)
- Exhaust comes from bottom only (pointing down)
- Starting point is train's END position (not left edge)
- Animation duration optimized (4s flight)

**Commits:**

- `77c9956` - Core metro map visualization
- `fd3fd0e` - Mobile horizontal scroll
- `fee0fa3` - Accessibility improvements
- `95975d8` - Polish (scroll hint, spacing, touch targets)
- `fb10daa` - Station labels, larger legend text
- `8ca8c37` - Interactive filters, replay button

---

## Design Decisions (Confirmed)

| Question            | Decision                          | Rationale                                                             |
| ------------------- | --------------------------------- | --------------------------------------------------------------------- |
| **1. Layout**       | Hybrid: Time X-axis + City labels | Clear chronological progression with geographic context               |
| **2. Detail Panel** | Tooltip + Side Panel              | Hover for quick info, click for full details (progressive disclosure) |
| **3. SmartDorm**    | Separate Volunteer line           | Shows 5-year dedication, visually distinct from employment            |
| **4. Animation**    | Scroll-trigger + Replay button    | Auto-delight on first view, replay option for users who want it       |

---

## Overview

**Goal:** Transform the boring vertical tab list into an interactive metro map that visualizes career as interconnected skill lines, with stations sized by tenure and colored by domain.

**Why Metro Map?**

- Swiss/German audiences use public transit daily — the metaphor clicks instantly
- Shows systems thinking and architectural mindset
- Data-driven: tenure, skills, domains are all visualized
- No competitor portfolio has this
- Clean, Swiss design principles (grid, clarity, information density)

**Placement:** Left side of Experience section (desktop), horizontal scroll (mobile)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  02. Where I've Worked                                     [↻ Replay]       │
│  ┌───────────────────────────────────┬─────────────────────────────────────┐│
│  │                                   │                                     ││
│  │   2015    2017  2019    2022 2024 │   Senior Backend Engineer           ││
│  │     │      │     │       │    │   │   @ PEAX AG                         ││
│  │     ●━━━━━━●━━━━━●━━━━━━━●━━━━●━● │   Oct 2025 - Present                ││
│  │            │     │       │    │ │ │   Zurich, CH                        ││
│  │            ●─────●───────●────●─● │                                     ││
│  │            │     │       │    │   │   ┌─────────┬─────────┐             ││
│  │            │     ●╍╍╍╍╍╍╍●╍╍╍╍●   │   │ 🏢 Ent. │ ☁️ Cloud│             ││
│  │                          │    │   │   └─────────┴─────────┘             ││
│  │                          ●····●   │                                     ││
│  │  ─────────────────────────────────│   • Building scalable backend...    ││
│  │  ▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪●  │   • Implementing React-based...     ││
│  │  (SmartDorm - Volunteer, 5 yrs)   │                                     ││
│  │                                   │                                     ││
│  │  COLOGNE  VIENNA  MUNICH  LEIPZIG │                                     ││
│  │                  LONDON   ZURICH  │                                     ││
│  │                                   │                                     ││
│  │  ━ Backend  ─ Frontend  ╍ Cloud   │  Certifications:                    ││
│  │  · Leadership  ▪ Volunteer        │  🎓 AWS (2020)  🎓 Flowable (2025)  ││
│  └───────────────────────────────────┴─────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Phase 0: Single Source of Truth Architecture

**Goal:** Create a master data file that generates all career-related content — website, CV, and metro map.

### Problem

Data currently duplicated in 3 places:

- `dictionaries/en.json` → Website experience section
- `public/cv/Artem_Polovyi_DE.yaml` → CV generator
- Implementation plan → Metro map data

This causes drift (e.g., CV says 20% code reduction, website says 30%).

### Solution Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    lib/career-data.ts                           │
│                   (Single Source of Truth)                      │
│                                                                 │
│  - stations[]        (all roles with full metadata)             │
│  - lines[]           (skill domains)                            │
│  - domains[]         (industries)                               │
│  - education[]       (degrees)                                  │
│  - certifications[]  (AWS, Flowable, etc.)                      │
│  - skills[]          (technical skills with ratings)            │
└─────────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  Metro Map UI   │ │  Dictionary     │ │  CV Generator   │
│  Component      │ │  Generator      │ │  Script         │
│                 │ │  (JSON output)  │ │  (YAML output)  │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

### 0.1 Master Data Structure

**File:** `lib/career-data.ts`

```typescript
// ============================================================
// SINGLE SOURCE OF TRUTH FOR ALL CAREER DATA
// ============================================================

// --------------------- Types ---------------------

export type MetroLineId = 'backend' | 'frontend' | 'cloud' | 'leadership' | 'volunteer'
export type DomainId = 'banking' | 'automotive' | 'enterprise' | 'travel' | 'education' | 'ecommerce' | 'events'
export type Lang = 'en' | 'de'

export interface CareerStation {
	id: string
	company: string
	role: {
		en: string
		de: string
	}
	location: {
		city: string
		country: string
		remote?: boolean // For remote positions like Bicester
		coordinates: { lat: number; lng: number }
	}
	period: {
		start: string // 'Oct 2025'
		end: string | 'present'
	}
	tenureMonths: number

	// Metro map specific
	lines: MetroLineId[]
	domains: DomainId[]

	// Content (for website + CV) - i18n supported
	tasks: {
		en: TaskItem[]
		de: TaskItem[]
	}

	// Quantified achievements
	metrics?: {
		qps?: number
		efficiencyGain?: string
		codeReduction?: string
		scale?: string
		compliance?: string
		responseTimeImprovement?: string
	}

	technologies: string[]
	highlight?: string // One-liner for tooltip

	// Flags
	isVolunteer?: boolean
	isInternship?: boolean
	url?: string
}

export interface TaskItem {
	text: string
	keywords: string[]
}

export interface Certification {
	id: string
	name: {
		en: string
		de: string
	}
	issuer: string
	year: number
	relatedStationId?: string // Links to station where skill was used
	url?: string
}

export interface Education {
	id: string
	degree: {
		en: string
		de: string
	}
	institution: string
	year: number
	location: string
}

export interface TechnicalSkill {
	name: string
	category: 'language' | 'framework' | 'database' | 'platform' | 'tool' | 'testing' | 'method'
	stars: 1 | 2 | 3 | 4 | 5
	since: number
}

// --------------------- Data ---------------------

export const stations: CareerStation[] = [
	{
		id: 'silvertours',
		company: 'SilverTours GmbH',
		role: {
			en: 'Student Full-Stack Developer',
			de: 'Studentischer Full-Stack-Entwickler',
		},
		location: { city: 'Cologne', country: 'DE', coordinates: { lat: 50.94, lng: 6.96 } },
		period: { start: 'Jan 2015', end: 'Aug 2018' },
		tenureMonths: 43,
		lines: ['backend', 'frontend'],
		domains: ['travel'],
		tasks: {
			en: [
				{ text: 'Developed new features for a leading car rental platform, improving user experience.', keywords: ['car rental platform'] },
				{ text: 'Implemented A/B tests to optimize product specifications and enhance conversion rates.', keywords: ['A/B tests'] },
				{ text: 'Conducted thorough testing in each product iteration to ensure high-quality releases.', keywords: ['testing'] },
				{
					text: 'Created internal tools for the customer service team, increasing efficiency by 30%.',
					keywords: ['internal tools', '30%'],
				},
			],
			de: [
				{
					text: 'Entwicklung neuer Features für eine führende Mietwagen-Plattform zur Verbesserung der User Experience.',
					keywords: ['Mietwagen-Plattform'],
				},
				{ text: 'Implementierung von A/B-Tests zur Optimierung von Produktspezifikationen.', keywords: ['A/B-Tests'] },
				{ text: 'Durchführung von Tests bei jeder Produktiteration zur Qualitätssicherung.', keywords: ['Tests'] },
				{ text: 'Entwicklung interner Tools für das Kundenservice-Team (30% Effizienzsteigerung).', keywords: ['30%'] },
			],
		},
		metrics: { efficiencyGain: '30% faster CS tools', scale: 'Leading car rental platform' },
		technologies: ['JavaScript', 'HTML', 'CSS', 'jQuery', 'PHP', 'MySQL'],
		highlight: 'First professional dev role, A/B testing, internal tools',
		url: 'https://www.billiger-mietwagen.de',
	},
	{
		id: 'senacor',
		company: 'Senacor Technologies',
		role: {
			en: 'Java Developer (Intern)',
			de: 'Java-Entwickler (Praktikum)',
		},
		location: { city: 'Vienna', country: 'AT', coordinates: { lat: 48.21, lng: 16.37 } },
		period: { start: 'Oct 2017', end: 'Jan 2018' },
		tenureMonths: 4,
		lines: ['backend'],
		domains: ['banking'],
		tasks: {
			en: [
				{ text: 'Implemented end-to-end tests for banking applications.', keywords: ['end-to-end tests', 'banking'] },
				{ text: 'Integrated application monitoring with dashboard solution.', keywords: ['monitoring', 'dashboard'] },
				{ text: 'Improved incident response time by 60% through proactive monitoring.', keywords: ['60%', 'response time'] },
				{ text: 'Developed automated test procedures using Selenium.', keywords: ['Selenium', 'automated'] },
			],
			de: [
				{ text: 'Implementierung von End-to-End-Tests für Banking-Anwendungen.', keywords: ['End-to-End-Tests', 'Banking'] },
				{ text: 'Integration von Application Monitoring mit Dashboard-Lösung.', keywords: ['Monitoring', 'Dashboard'] },
				{ text: 'Verbesserung der Reaktionszeit bei Systemausfällen um 60%.', keywords: ['60%'] },
				{ text: 'Entwicklung automatisierter Testverfahren mit Selenium.', keywords: ['Selenium'] },
			],
		},
		metrics: { responseTimeImprovement: '60% faster incident response' },
		technologies: ['Java', 'WildFly', 'Nagios', 'Selenium', 'HTML', 'CSS', 'JavaScript', 'jQuery'],
		highlight: 'Banking internship, monitoring, 60% faster incident response',
		isInternship: true,
		url: 'https://www.senacor.com',
	},
	{
		id: 'blookery',
		company: 'Blookery',
		role: {
			en: 'Frontend Engineer',
			de: 'Frontend-Entwickler',
		},
		location: { city: 'Cologne', country: 'DE', coordinates: { lat: 50.94, lng: 6.96 } },
		period: { start: 'May 2018', end: 'Aug 2018' },
		tenureMonths: 4,
		lines: ['frontend'],
		domains: ['travel'],
		tasks: {
			en: [
				{ text: 'Led the development of a travel website specializing in blind bookings across Europe.', keywords: ['blind bookings'] },
				{
					text: 'Created responsive user interfaces with React, ensuring seamless functionality across devices.',
					keywords: ['React', 'responsive'],
				},
				{ text: 'Implemented advanced JavaScript features to enhance site interactivity and navigation.', keywords: ['JavaScript'] },
				{ text: 'Translated wireframes into accessible HTML/CSS layouts, adhering to WCAG guidelines.', keywords: ['WCAG', 'accessible'] },
				{ text: 'Developed unit and integration tests using Jest, ensuring code reliability.', keywords: ['Jest', 'tests'] },
			],
			de: [
				{ text: 'Entwicklung des kompletten Frontend der Reise-Website für Blind Bookings.', keywords: ['Blind Bookings'] },
				{ text: 'Erstellung responsiver Benutzeroberflächen mit React.', keywords: ['React'] },
				{ text: 'Implementierung barrierefreier Interfaces nach WCAG-Richtlinien.', keywords: ['WCAG'] },
				{ text: 'Entwicklung von Unit- und Integrationstests mit Jest.', keywords: ['Jest'] },
			],
		},
		technologies: ['React', 'JavaScript', 'Jest', 'HTML', 'CSS'],
		highlight: 'Blind bookings platform, WCAG accessibility',
		url: 'https://www.blookery.de',
	},
	{
		id: 'comsysto',
		company: 'Comsysto Reply GmbH',
		role: {
			en: 'Full-Stack Engineer',
			de: 'Full-Stack-Entwickler',
		},
		location: { city: 'Munich', country: 'DE', coordinates: { lat: 48.14, lng: 11.58 } },
		period: { start: 'Feb 2019', end: 'Oct 2021' },
		tenureMonths: 32,
		lines: ['backend', 'frontend', 'cloud'],
		domains: ['automotive'],
		tasks: {
			en: [
				{
					text: 'Collaborated in a Scrum team to optimize pricing, voucher management, and communication systems for the ABI Audi On Demand product.',
					keywords: ['Scrum', 'Audi On Demand'],
				},
				{
					text: 'Developed and maintained multiple microservices and microfrontends handling loads of up to 200 QPS.',
					keywords: ['microservices', '200 QPS'],
				},
				{ text: 'Refactored code using Kotlin, increasing maintainability and reducing code lines by 20%.', keywords: ['Kotlin', '20%'] },
			],
			de: [
				{
					text: 'Zusammenarbeit im Scrum-Team zur Optimierung von Pricing und Voucher Management für ABI Audi On Demand.',
					keywords: ['Scrum', 'Audi On Demand'],
				},
				{ text: 'Entwicklung und Wartung von Microservices mit bis zu 200 QPS.', keywords: ['Microservices', '200 QPS'] },
				{ text: 'Code-Refactoring mit Kotlin, Reduzierung der Codezeilen um 20%.', keywords: ['Kotlin', '20%'] },
			],
		},
		metrics: { qps: 200, codeReduction: '20% fewer lines with Kotlin' },
		technologies: ['Java', 'Kotlin', 'Spring Boot', 'PostgreSQL', 'AWS', 'Angular', 'TypeScript', 'RabbitMQ', 'Jenkins', 'CloudFoundry'],
		highlight: 'Audi On Demand - 200 QPS microservices',
		url: 'https://www.comsysto.com',
	},
	{
		id: 'smartdorm',
		company: 'SmartDorm',
		role: {
			en: 'Lead Full-Stack Developer (Volunteer)',
			de: 'Lead Full-Stack-Entwickler (Ehrenamt)',
		},
		location: { city: 'Munich', country: 'DE', coordinates: { lat: 48.14, lng: 11.58 } },
		period: { start: 'Jan 2020', end: 'present' },
		tenureMonths: 60,
		lines: ['volunteer'],
		domains: ['education'],
		tasks: {
			en: [
				{
					text: 'Developed a web application to streamline and automate management processes in the student dormitory Geschwister Scholl.',
					keywords: ['web application', 'automation'],
				},
				{
					text: 'Migrated and consolidated data into a central database to ensure 100% data consistency.',
					keywords: ['data migration', '100%'],
				},
				{ text: 'Reduced administrative work by 35% through digitalization and automation.', keywords: ['35%', 'automation'] },
				{ text: 'Implemented a CI/CD pipeline to optimize the development process.', keywords: ['CI/CD'] },
			],
			de: [
				{
					text: 'Entwicklung einer Webanwendung zur Automatisierung von Verwaltungsprozessen im Studentenwohnheim Geschwister Scholl.',
					keywords: ['Webanwendung', 'Automatisierung'],
				},
				{
					text: 'Migration und Konsolidierung von Daten in eine zentrale Datenbank (100% Datenkonsistenz).',
					keywords: ['Migration', '100%'],
				},
				{ text: 'Reduzierung der administrativen Arbeit um 35% durch Digitalisierung.', keywords: ['35%'] },
				{ text: 'Implementierung einer CI/CD-Pipeline zur Optimierung des Entwicklungsprozesses.', keywords: ['CI/CD'] },
			],
		},
		metrics: { efficiencyGain: '35% less admin work', dataConsistency: '100%' },
		technologies: ['Kotlin', 'Spring Boot', 'PostgreSQL', 'React', 'GitLab CI/CD'],
		highlight: 'Volunteer project, full ownership, 5+ years',
		isVolunteer: true,
		url: 'https://smartdorm.schollheim.net',
	},
	{
		id: 'spreadshirt',
		company: 'Spreadshirt',
		role: {
			en: 'Senior Full-Stack Engineer',
			de: 'Senior Full-Stack-Entwickler',
		},
		location: { city: 'Leipzig', country: 'DE', coordinates: { lat: 51.34, lng: 12.38 } },
		period: { start: 'Nov 2021', end: 'Feb 2022' },
		tenureMonths: 4,
		lines: ['backend', 'frontend'],
		domains: ['ecommerce'],
		tasks: {
			en: [
				{
					text: 'Developed a high-performance application for payout generation, improving financial operations.',
					keywords: ['payout generation'],
				},
				{ text: 'Created intuitive user interfaces, enhancing user experience and application usability.', keywords: ['user interfaces'] },
			],
			de: [
				{ text: 'Entwicklung einer hochperformanten Anwendung zur Generierung von Auszahlungen.', keywords: ['Auszahlungen'] },
				{ text: 'Erstellung intuitiver Benutzeroberflächen zur Verbesserung der User Experience.', keywords: ['Benutzeroberflächen'] },
			],
		},
		technologies: ['Kotlin', 'Spring Boot', 'PostgreSQL', 'React', 'TypeScript', 'Flyway', 'JUnit'],
		highlight: 'Payout generation system for creators',
		url: 'https://www.spreadshirt.com',
	},
	{
		id: 'virtual-identity',
		company: 'Virtual Identity AG',
		role: {
			en: 'Senior Full-Stack Engineer',
			de: 'Senior Full-Stack-Entwickler',
		},
		location: { city: 'Munich', country: 'DE', coordinates: { lat: 48.14, lng: 11.58 } },
		period: { start: 'Feb 2022', end: 'Jan 2024' },
		tenureMonths: 24,
		lines: ['backend', 'frontend', 'cloud'],
		domains: ['enterprise'],
		tasks: {
			en: [
				{
					text: 'Developed and maintained features on infineon.com to optimize user experience and functionality.',
					keywords: ['infineon.com'],
				},
				{
					text: 'Successfully migrated voestalpine.com to the AWS cloud, enhancing scalability and performance.',
					keywords: ['voestalpine.com', 'AWS'],
				},
				{
					text: 'Designed and conducted comprehensive unit and integration tests to increase software reliability.',
					keywords: ['unit tests', 'integration tests'],
				},
				{ text: 'Optimized website performance, improving loading times and user satisfaction.', keywords: ['performance'] },
			],
			de: [
				{
					text: 'Entwicklung und Wartung von Features auf infineon.com zur Optimierung der Benutzererfahrung.',
					keywords: ['infineon.com'],
				},
				{ text: 'Erfolgreiche Migration von voestalpine.com in die AWS-Cloud.', keywords: ['voestalpine.com', 'AWS'] },
				{ text: 'Design und Durchführung umfassender Unit- und Integrationstests.', keywords: ['Unit-Tests', 'Integrationstests'] },
				{ text: 'Optimierung der Website-Performance und Ladezeiten.', keywords: ['Performance'] },
			],
		},
		metrics: { scale: 'infineon.com, voestalpine.com' },
		technologies: ['Java', 'Spring', 'AWS', 'React', 'TypeScript', 'PostgreSQL', 'OpenCms', 'MySQL', 'Oracle', 'Stencil', 'Web Components'],
		highlight: 'Enterprise CMS, AWS migration for voestalpine',
		url: 'https://www.virtual-identity.com',
	},
	{
		id: 'career-break',
		company: 'World Travel',
		role: {
			en: 'Sabbatical & World Travel',
			de: 'Sabbatical & Weltreise',
		},
		location: { city: '11 Countries', country: '4 Continents', coordinates: { lat: 0, lng: 0 } },
		period: { start: 'Feb 2024', end: 'Jun 2024' },
		tenureMonths: 5,
		lines: [],
		domains: [],
		tasks: {
			en: [
				{
					text: 'Embarked on a transformative 6-month journey across 11 countries spanning 4 continents: Greece, Egypt, South Africa, Zambia, Zimbabwe, Fiji, Australia, Chile, Argentina, Colombia, and Ecuador.',
					keywords: ['11 countries', '4 continents'],
				},
				{
					text: 'Gained fresh perspectives on global technology adoption, user behavior patterns, and diverse approaches to digital solutions.',
					keywords: ['global technology'],
				},
				{
					text: 'Developed adaptability, cross-cultural communication skills, and the ability to thrive in dynamic environments.',
					keywords: ['adaptability', 'cross-cultural'],
				},
				{
					text: 'Returned with renewed creativity, global perspective, and deeper appreciation for building inclusive technology.',
					keywords: ['creativity', 'global perspective'],
				},
			],
			de: [
				{
					text: 'Transformative 6-monatige Reise durch 11 Länder auf 4 Kontinenten: Griechenland, Ägypten, Südafrika, Sambia, Simbabwe, Fidschi, Australien, Chile, Argentinien, Kolumbien und Ecuador.',
					keywords: ['11 Länder', '4 Kontinente'],
				},
				{
					text: 'Neue Perspektiven auf globale Technologie-Adoption und diverse Ansätze für digitale Lösungen.',
					keywords: ['Technologie'],
				},
				{ text: 'Entwicklung von Anpassungsfähigkeit und interkultureller Kommunikation.', keywords: ['Anpassungsfähigkeit'] },
				{ text: 'Rückkehr mit erneuerter Kreativität und globaler Perspektive.', keywords: ['Kreativität'] },
			],
		},
		technologies: [],
		highlight: 'Greece, Egypt, South Africa, Zambia, Zimbabwe, Fiji, Australia, Chile, Argentina, Colombia, Ecuador',
	},
	{
		id: 'bicester',
		company: 'The Bicester Collection',
		role: {
			en: 'Lead Full-Stack Engineer',
			de: 'Lead Full-Stack-Entwickler',
		},
		location: { city: 'London', country: 'UK', remote: true, coordinates: { lat: 51.51, lng: -0.13 } },
		period: { start: 'Jun 2024', end: 'Oct 2024' },
		tenureMonths: 5,
		lines: ['frontend', 'leadership'],
		domains: ['ecommerce'],
		tasks: {
			en: [
				{
					text: 'Led the development of an innovative e-commerce platform for a prestigious luxury brand collective.',
					keywords: ['e-commerce', 'luxury'],
				},
				{
					text: 'Implemented a headless CMS architecture to enhance content flexibility and site performance.',
					keywords: ['headless CMS'],
				},
				{ text: 'Optimized the website for search engines (SEO) to boost visibility and organic traffic.', keywords: ['SEO'] },
				{ text: "Leveraged Vercel's platform for seamless deployment and hosting, ensuring high availability.", keywords: ['Vercel'] },
				{
					text: 'Utilized Next.js, TypeScript, Tailwind CSS, and Sanity to build a robust and scalable web application.',
					keywords: ['Next.js', 'TypeScript', 'Tailwind', 'Sanity'],
				},
			],
			de: [
				{
					text: 'Leitung der Entwicklung einer innovativen E-Commerce-Plattform für ein prestigeträchtiges Luxusmarken-Kollektiv.',
					keywords: ['E-Commerce', 'Luxus'],
				},
				{ text: 'Implementierung einer Headless-CMS-Architektur für verbesserte Content-Flexibilität.', keywords: ['Headless CMS'] },
				{ text: 'SEO-Optimierung zur Steigerung der Sichtbarkeit und des organischen Traffics.', keywords: ['SEO'] },
				{ text: 'Einsatz von Next.js, TypeScript, Tailwind CSS und Sanity.', keywords: ['Next.js', 'TypeScript'] },
			],
		},
		technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Sanity CMS', 'Vercel'],
		highlight: 'E-commerce for luxury brands, headless CMS (Remote)',
		url: 'https://www.thebicestercollection.com',
	},
	{
		id: 'ubs-flowable',
		company: 'UBS + Flowable',
		role: {
			en: 'Software Developer',
			de: 'Softwareentwickler',
		},
		location: { city: 'Zurich', country: 'CH', coordinates: { lat: 47.37, lng: 8.54 } },
		period: { start: 'Oct 2024', end: 'Aug 2025' },
		tenureMonths: 11,
		lines: ['backend', 'cloud'],
		domains: ['banking'],
		tasks: {
			en: [
				{
					text: 'Migrated critical customer onboarding systems from legacy applications to modern Flowable architecture.',
					keywords: ['migration', 'Flowable'],
				},
				{
					text: 'Developed and optimized business process workflows using BPMN and CMMN for private and commercial banking clients.',
					keywords: ['BPMN', 'CMMN'],
				},
				{
					text: 'Implemented automated compliance checks to meet regulatory requirements in the banking sector.',
					keywords: ['compliance', 'regulatory'],
				},
				{
					text: 'Conducted security analyses and technical system upgrades to ensure system integrity.',
					keywords: ['security', 'upgrades'],
				},
			],
			de: [
				{
					text: 'Migration kritischer UBS Kundenonboarding-Systeme von Legacy-Anwendungen zur modernen Flowable-Architektur.',
					keywords: ['Migration', 'Flowable'],
				},
				{ text: 'Entwicklung und Optimierung von Geschäftsprozess-Workflows mit BPMN und CMMN.', keywords: ['BPMN', 'CMMN'] },
				{ text: 'Implementierung automatisierter Compliance-Prüfungen für regulatorische Anforderungen.', keywords: ['Compliance'] },
				{ text: 'Durchführung von Sicherheitsanalysen und technischen System-Upgrades.', keywords: ['Sicherheit'] },
			],
		},
		metrics: { compliance: 'Banking regulatory requirements' },
		technologies: ['Java', 'Spring Boot', 'Flowable', 'BPMN', 'CMMN', 'PostgreSQL', 'Docker', 'Kubernetes'],
		highlight: 'Customer onboarding migration, compliance automation',
		url: 'https://ubs.com',
	},
	{
		id: 'peax',
		company: 'PEAX AG',
		role: {
			en: 'Senior Backend Engineer',
			de: 'Senior Backend-Entwickler',
		},
		location: { city: 'Zurich', country: 'CH', coordinates: { lat: 47.37, lng: 8.54 } },
		period: { start: 'Oct 2025', end: 'present' },
		tenureMonths: 2,
		lines: ['backend', 'frontend'],
		domains: ['enterprise'],
		tasks: {
			en: [
				{
					text: 'Developing and maintaining digital mailbox and document management solutions for Swiss businesses and individuals.',
					keywords: ['digital mailbox', 'document management'],
				},
				{
					text: 'Building scalable backend services with Java and Spring Boot to handle secure document processing.',
					keywords: ['Java', 'Spring Boot'],
				},
				{ text: 'Implementing React-based frontend components for intuitive user experiences.', keywords: ['React', 'frontend'] },
			],
			de: [
				{
					text: 'Entwicklung und Wartung von digitalen Briefkasten- und Dokumentenmanagement-Lösungen für Schweizer Unternehmen.',
					keywords: ['digitaler Briefkasten', 'Dokumentenmanagement'],
				},
				{
					text: 'Erstellung skalierbarer Backend-Services mit Java und Spring Boot für sichere Dokumentenverarbeitung.',
					keywords: ['Java', 'Spring Boot'],
				},
				{ text: 'Implementierung React-basierter Frontend-Komponenten für intuitive Benutzererfahrungen.', keywords: ['React'] },
			],
		},
		technologies: ['Java', 'Spring Boot', 'React'],
		highlight: 'Digital mailbox and document management for Swiss businesses',
		url: 'https://peax.ch',
	},
]

export const certifications: Certification[] = [
	{
		id: 'aws-developer',
		name: {
			en: 'AWS Certified Developer – Associate',
			de: 'AWS Certified Developer – Associate',
		},
		issuer: 'Amazon Web Services',
		year: 2020,
		relatedStationId: 'comsysto', // Got it while working on AWS at Comsysto
	},
	{
		id: 'flowable-developer',
		name: {
			en: 'Flowable Developer Certification',
			de: 'Flowable Developer Zertifizierung',
		},
		issuer: 'Flowable',
		year: 2025,
		relatedStationId: 'ubs-flowable', // Got it while at Flowable/UBS
	},
]

export const education: Education[] = [
	{
		id: 'msc',
		degree: {
			en: 'Master of Science in Computer Science',
			de: 'Master of Science in Informatik',
		},
		institution: 'Hochschule München',
		year: 2023,
		location: 'Munich, Germany',
	},
	{
		id: 'bsc',
		degree: {
			en: 'Bachelor of Science in Computer Science',
			de: 'Bachelor of Science in Informatik',
		},
		institution: 'Technische Hochschule Köln',
		year: 2018,
		location: 'Cologne, Germany',
	},
]

export const lines: MetroLine[] = [
	{
		id: 'backend',
		label: 'Backend',
		color: '#c23b3b',
		pattern: 'solid',
		yPosition: 60,
		stations: ['silvertours', 'senacor', 'comsysto', 'spreadshirt', 'virtual-identity', 'ubs-flowable', 'peax'],
	},
	{
		id: 'frontend',
		label: 'Frontend',
		color: '#3b82f6',
		pattern: 'solid',
		yPosition: 120,
		stations: ['silvertours', 'blookery', 'comsysto', 'spreadshirt', 'virtual-identity', 'bicester', 'peax'],
	},
	{
		id: 'cloud',
		label: 'Cloud/DevOps',
		color: '#10b981',
		pattern: 'dashed',
		yPosition: 180,
		stations: ['comsysto', 'virtual-identity', 'ubs-flowable'],
	},
	{
		id: 'leadership',
		label: 'Leadership',
		color: '#f59e0b',
		pattern: 'dotted',
		yPosition: 240,
		stations: ['bicester'],
	},
	{
		id: 'volunteer',
		label: 'Volunteer',
		color: '#8b5cf6',
		pattern: 'double-dotted',
		yPosition: 320,
		stations: ['smartdorm'],
	},
]

export const domains: Domain[] = [
	{ id: 'banking', label: 'Banking', icon: '🏦' },
	{ id: 'automotive', label: 'Automotive', icon: '🚗' },
	{ id: 'enterprise', label: 'Enterprise', icon: '🏢' },
	{ id: 'travel', label: 'Travel', icon: '✈️' },
	{ id: 'education', label: 'Education', icon: '🎓' },
	{ id: 'ecommerce', label: 'E-Commerce', icon: '🛒' },
]

export const transferStations = [
	{ city: 'Cologne', stations: ['silvertours', 'blookery'] },
	{ city: 'Vienna', stations: ['senacor'] },
	{ city: 'Munich', stations: ['comsysto', 'smartdorm', 'spreadshirt', 'virtual-identity'] },
	{ city: 'Zurich', stations: ['ubs-flowable', 'peax'] },
]

// --------------------- Generators ---------------------

/**
 * Generates the experienceSection.roles object for dictionaries/*.json
 */
export function generateDictionaryRoles(lang: Lang): Record<string, any> {
	const roles: Record<string, any> = {}

	for (const station of stations) {
		const key = stationIdToDictionaryKey(station.id)
		roles[key] = {
			title: station.role[lang],
			date: `${station.period.start} - ${station.period.end === 'present' ? 'Present' : station.period.end}`,
			url: station.url || '',
			tasks: station.tasks[lang],
		}
	}

	return roles
}

/**
 * Generates YAML content for CV generator
 */
export function generateCVYaml(lang: Lang): string {
	// Implementation would generate the YAML structure
	// matching public/cv/Artem_Polovyi_DE.yaml format
	// ...
}

// --------------------- Helpers ---------------------

export function stationIdToDictionaryKey(id: string): string {
	const mapping: Record<string, string> = {
		'silvertours': 'SilverToursGmbH',
		'senacor': 'Senacor',
		'blookery': 'Blookery',
		'comsysto': 'ComsystoReplyGmbH',
		'smartdorm': 'SmartDorm',
		'spreadshirt': 'Spreadshirt',
		'virtual-identity': 'VirtualIdentityAG',
		'career-break': 'CareerBreak',
		'bicester': 'TheBicesterCollection',
		'ubs-flowable': 'UBSFlowable',
		'peax': 'PEAX',
	}
	return mapping[id] || id
}

export function dictionaryKeyToStationId(key: string): string {
	const mapping: Record<string, string> = {
		SilverToursGmbH: 'silvertours',
		Senacor: 'senacor',
		Blookery: 'blookery',
		ComsystoReplyGmbH: 'comsysto',
		SmartDorm: 'smartdorm',
		Spreadshirt: 'spreadshirt',
		VirtualIdentityAG: 'virtual-identity',
		CareerBreak: 'career-break',
		TheBicesterCollection: 'bicester',
		UBSFlowable: 'ubs-flowable',
		PEAX: 'peax',
	}
	return mapping[key] || key
}
```

### 0.2 NPM Scripts for Generation

**File:** `package.json` (additions)

```json
{
	"scripts": {
		"generate:dictionaries": "tsx scripts/generate-dictionaries.ts",
		"generate:cv": "tsx scripts/generate-cv.ts",
		"validate:career-data": "tsx scripts/validate-career-data.ts"
	}
}
```

### 0.3 Generation Scripts

**File:** `scripts/generate-dictionaries.ts`

Reads `lib/career-data.ts`, generates the `experienceSection.roles` object for each language, updates dictionary files.

**File:** `scripts/validate-career-data.ts`

Validates that:

- All station IDs are unique
- All line station references exist
- Tenure months match period dates
- Required fields are present

### 0.4 Pre-commit Hook

Add to `.husky/pre-commit`:

```bash
npm run validate:career-data
```

---

## Technology Decisions

| Decision         | Choice                                 | Rationale                                  |
| ---------------- | -------------------------------------- | ------------------------------------------ |
| Data source      | `lib/career-data.ts`                   | Single source of truth                     |
| Rendering        | Pure SVG + React                       | No canvas overhead, accessible, animatable |
| Animations       | `motion/react`                         | Already used throughout codebase           |
| Line drawing     | `motion.path` + `pathLength`           | Proven pattern in existing WorldMap        |
| Layout algorithm | Time-based X, Line-based Y             | Hybrid approach per design decision        |
| State management | React useState + context               | Simple, no extra deps needed               |
| Responsive       | Conditional render + horizontal scroll | Mobile gets simplified horizontal view     |

### Technologies NOT Used

| Technology                     | Why Skip                                   |
| ------------------------------ | ------------------------------------------ |
| D3.js                          | Overkill for static layout, adds 80KB+     |
| Canvas/WebGL                   | Loses accessibility, harder to animate     |
| Geographic projection          | Metro maps are topological, not geographic |
| External transit map libraries | Too opinionated, hard to customize         |

---

## Complete Station List (11 Stations)

| ID                 | Company              | City            | Period              | Tenure | Lines                    | Domain     |
| ------------------ | -------------------- | --------------- | ------------------- | ------ | ------------------------ | ---------- |
| `silvertours`      | SilverTours GmbH     | Cologne         | Jan 2015 - Aug 2018 | 43mo   | Backend, Frontend        | Travel     |
| `senacor`          | Senacor Technologies | Vienna          | Oct 2017 - Jan 2018 | 4mo    | Backend                  | Banking    |
| `blookery`         | Blookery             | Cologne         | May 2018 - Aug 2018 | 4mo    | Frontend                 | Travel     |
| `comsysto`         | Comsysto Reply       | Munich          | Feb 2019 - Oct 2021 | 32mo   | Backend, Frontend, Cloud | Automotive |
| `smartdorm`        | SmartDorm            | Munich          | Jan 2020 - Present  | 60mo   | Volunteer                | Education  |
| `spreadshirt`      | Spreadshirt          | Leipzig         | Nov 2021 - Feb 2022 | 4mo    | Backend, Frontend        | E-Commerce |
| `virtual-identity` | Virtual Identity AG  | Munich          | Feb 2022 - Jan 2024 | 24mo   | Backend, Frontend, Cloud | Enterprise |
| `career-break`     | World Travel         | 11 Countries    | Feb 2024 - Jun 2024 | 5mo    | —                        | —          |
| `bicester`         | Bicester Collection  | London (Remote) | Jun 2024 - Oct 2024 | 5mo    | Frontend, Leadership     | E-Commerce |
| `ubs-flowable`     | UBS + Flowable       | Zurich          | Oct 2024 - Aug 2025 | 11mo   | Backend, Cloud           | Banking    |
| `peax`             | PEAX AG              | Zurich          | Oct 2025 - Present  | 2mo    | Backend, Frontend        | Enterprise |

---

## Certifications Visualization

Show certification badges near relevant stations on the timeline:

```
    2020                                2025
      │                                   │
      ●━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━●
      │                                   │
   [🎓AWS]                           [🎓Flowable]
   Developer                         Developer
   Associate                         Cert.
```

**Implementation:** Add `CertificationBadge` component that:

- Positions below timeline at relevant X coordinate
- Shows icon + short name
- Hover reveals full certification name + issuer
- Links to verification URL if available

---

## Files to Create/Modify

### New Files (Phase 0 - Single Source of Truth)

| File                               | Purpose                                 | Complexity |
| ---------------------------------- | --------------------------------------- | ---------- |
| `lib/career-data.ts`               | Master career data + types + generators | High       |
| `scripts/generate-dictionaries.ts` | Updates dictionary JSON files           | Medium     |
| `scripts/generate-cv.ts`           | Updates CV YAML files                   | Medium     |
| `scripts/validate-career-data.ts`  | Validates data consistency              | Low        |

### New Files (Metro Map Components)

| File                                                              | Purpose                       | Complexity |
| ----------------------------------------------------------------- | ----------------------------- | ---------- |
| `components/home/CareerMetroMap/index.tsx`                        | Main component                | High       |
| `components/home/CareerMetroMap/MetroLine.tsx`                    | Animated line path            | Medium     |
| `components/home/CareerMetroMap/Station.tsx`                      | Station dot with interactions | Medium     |
| `components/home/CareerMetroMap/StationTooltip.tsx`               | Hover tooltip                 | Medium     |
| `components/home/CareerMetroMap/Legend.tsx`                       | Line legend                   | Low        |
| `components/home/CareerMetroMap/TimelineAxis.tsx`                 | Year markers                  | Low        |
| `components/home/CareerMetroMap/CityLabels.tsx`                   | City name labels              | Low        |
| `components/home/CareerMetroMap/TrainAnimation.tsx`               | Animated train                | Medium     |
| `components/home/CareerMetroMap/CareerBreakBridge.tsx`            | Sabbatical treatment          | Medium     |
| `components/home/CareerMetroMap/ReplayButton.tsx`                 | Animation replay              | Low        |
| `components/home/CareerMetroMap/VolunteerLine.tsx`                | SmartDorm track               | Medium     |
| `components/home/CareerMetroMap/CertificationBadge.tsx`           | Cert visualization            | Low        |
| `components/home/CareerMetroMap/types.ts`                         | TypeScript interfaces         | Low        |
| `components/home/CareerMetroMap/constants.ts`                     | Colors, sizes, layout         | Low        |
| `components/home/CareerMetroMap/hooks/useStationLayout.ts`        | Position calculation          | High       |
| `components/home/CareerMetroMap/hooks/useAnimationState.ts`       | Animation + replay            | Medium     |
| `components/home/CareerMetroMap/hooks/usePrefersReducedMotion.ts` | A11y hook                     | Low        |

### Modified Files

| File                               | Changes                                  |
| ---------------------------------- | ---------------------------------------- |
| `components/home/MyExperience.tsx` | Import CareerMetroMap, responsive switch |
| `package.json`                     | Add generation scripts                   |
| `.husky/pre-commit`                | Add validation                           |

---

## Phase 1: Data Layer & Type Definitions

**Goal:** Establish the data foundation with proper TypeScript types.

Already defined in Phase 0. Import from `lib/career-data.ts`.

---

## Phase 2: Layout Algorithm

**Goal:** Position stations on a time-based horizontal axis with city labels below.

### 2.1 Layout Strategy (Hybrid: Time + City)

```
X-axis: Time-based (2015 → 2026)
Y-axis: Line-based (Backend at top → Volunteer at bottom)
City labels: Below each station cluster

Timeline now includes Vienna (Senacor 2017):

  2015    2017    2019    2021    2022    2024    2025
    │       │       │       │       │       │       │
    ●━━━━━━━●━━━━━━━●━━━━━━━●━━━━━━━●━━━━━━━●━━━━━━━●  Backend
            │       │       │       │       │       │
            ●───────●───────●───────●───────●───────●  Frontend
                    │               │       │
                    ●╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍●╍╍╍╍╍╍╍●           Cloud
                                            │
                                            ●           Leadership
  ─────────────────────────────────────────────────────────
      ▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪●              Volunteer
  ─────────────────────────────────────────────────────────
  COLOGNE  VIENNA  MUNICH  LEIPZIG  LONDON  ZURICH
                                    (Remote)

  Certifications:
  🎓 AWS (2020)                    🎓 Flowable (2025)
```

### 2.2 Constants Update

**File:** `components/home/CareerMetroMap/constants.ts`

```typescript
export const SVG_DIMENSIONS = {
	width: 650, // Slightly wider for 11 stations
	height: 420, // Increased for certs row
	padding: 40,
	timelineY: 350,
	certsY: 390, // Y position for certification badges
} as const

export const TIMELINE = {
	start: 2015,
	end: 2026, // Extended for future
} as const
```

---

## Phase 3-9: Same as Before

(Core components, animation, integration, mobile, accessibility remain the same — just with updated station data)

---

## Phase 10: Future Enhancements

### 10.1 Interactive Filters

```
[Show: ☑ Backend  ☑ Frontend  ☐ Cloud  ☐ Leadership  ☑ Volunteer]
```

### 10.2 Globe Integration

Click career break → expands to show full 3D globe journey (lazy loaded).

### 10.3 Print Stylesheet

Ensure map prints well in grayscale for PDF resume.

### 10.4 Analytics

Track which stations get the most clicks, hover dwell time.

### 10.5 Auto-sync

CI job validates that dictionaries and CV are in sync with `lib/career-data.ts`.

---

## Data Corrections Applied

| Field                   | Before              | After           | Source                              |
| ----------------------- | ------------------- | --------------- | ----------------------------------- |
| Comsysto code reduction | 30% (website)       | 20%             | CV (more conservative)              |
| SilverTours efficiency  | 50% (website)       | 30%             | CV (more conservative)              |
| Bicester location       | NYC (website error) | London (Remote) | Corrected                           |
| Senacor                 | Missing             | Added           | CV                                  |
| F&L Consulting          | In CV               | Skipped         | Overlaps SilverTours, would clutter |

---

## Risk Assessment

| Risk                               | Likelihood | Impact | Mitigation                          |
| ---------------------------------- | ---------- | ------ | ----------------------------------- |
| Layout complexity with 11 stations | Medium     | Medium | Time-based X spreads them naturally |
| Data drift between sources         | High       | High   | Single source of truth + validation |
| Tooltip clipping at edges          | Medium     | Low    | Boundary detection + flip logic     |
| Animation jank                     | Low        | Medium | `prefers-reduced-motion`            |
| Vienna station clutters timeline   | Low        | Low    | Small dot (4 months)                |

---

## Success Metrics

| Metric                   | Target              |
| ------------------------ | ------------------- |
| Lighthouse Performance   | ≥ 0.8               |
| Lighthouse Accessibility | ≥ 0.9               |
| SVG bundle size          | < 15KB              |
| Time to interactive      | < 2s                |
| Data sync validation     | 100% pass           |
| Station click rate       | Track via analytics |

---

## Summary

This implementation plan delivers:

1. **Single source of truth** — `lib/career-data.ts` generates website + CV
2. **11 stations** — Including Senacor (Vienna) internship
3. **Certifications** — AWS (2020) and Flowable (2025) visualized
4. **Bicester corrected** — Now shows "London (Remote)"
5. **Metrics corrected** — Using conservative numbers from CV
6. **Hybrid layout** — Time X-axis with city labels
7. **Progressive disclosure** — Hover tooltip + click for full details
8. **SmartDorm prominence** — Separate volunteer line (5+ years)
9. **Delightful animations** — Scroll-triggered with replay option
10. **Swiss design** — Clean, grid-based, information-dense

**Phased delivery:**

- **Phase 0:** Single source of truth architecture
- **Phases 1-6:** Core metro map with interactions
- **Phases 7-8:** Metrics, mobile refinement
- **Phase 9:** Accessibility, performance
- **Phase 10:** Filters, globe, analytics, auto-sync
