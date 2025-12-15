// ============================================================
// SINGLE SOURCE OF TRUTH FOR ALL CAREER DATA
// ============================================================

// --------------------- Types ---------------------

export type MetroLineId = 'backend' | 'frontend' | 'cloud' | 'leadership' | 'volunteer'
export type DomainId = 'banking' | 'automotive' | 'enterprise' | 'travel' | 'education' | 'ecommerce' | 'events'
export type Lang = 'en' | 'de'

export interface TaskItem {
	text: string
	keywords: string[]
}

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
		remote?: boolean
		coordinates: { lat: number; lng: number }
	}
	period: {
		start: string
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
		dataConsistency?: string
	}

	technologies: string[]
	highlight?: string

	// Flags
	isVolunteer?: boolean
	isInternship?: boolean
	url?: string
}

export interface Certification {
	id: string
	name: {
		en: string
		de: string
	}
	issuer: string
	year: number
	relatedStationId?: string
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
	category: 'language' | 'framework' | 'database' | 'platform' | 'tool' | 'testing' | 'method' | 'ide'
	stars: 1 | 2 | 3 | 4 | 5
	since: number
}

export interface MetroLine {
	id: MetroLineId
	label: string
	color: string
	pattern: 'solid' | 'dashed' | 'dotted' | 'double-dotted'
	yPosition: number
	stations: string[]
}

export interface Domain {
	id: DomainId
	label: string
	icon: string
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
		id: 'fl-consulting',
		company: 'F&L Consulting',
		role: {
			en: 'Backend Developer',
			de: 'Backend-Entwickler',
		},
		location: { city: 'Cologne', country: 'DE', coordinates: { lat: 50.94, lng: 6.96 } },
		period: { start: 'Jul 2015', end: 'Jan 2017' },
		tenureMonths: 18,
		lines: ['backend', 'frontend'],
		domains: ['enterprise'],
		tasks: {
			en: [
				{ text: 'Implemented website for congress meeting organization.', keywords: ['congress', 'website'] },
				{ text: 'Developed newsletter system for event communication.', keywords: ['newsletter'] },
				{ text: 'Built recruiting website for career events.', keywords: ['recruiting', 'career events'] },
			],
			de: [
				{ text: 'Implementierung der Website für Kongress-Meeting-Organisation.', keywords: ['Kongress', 'Website'] },
				{ text: 'Entwicklung des Newsletter-Systems für Event-Kommunikation.', keywords: ['Newsletter'] },
				{ text: 'Implementierung der Recruiting-Website für Karriere-Events.', keywords: ['Recruiting', 'Karriere-Events'] },
			],
		},
		technologies: ['Java', 'JSP', 'JSF', 'WildFly', 'HTML', 'CSS', 'JavaScript'],
		highlight: 'Congress websites, newsletter systems, recruiting platform',
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
				{ text: 'Implementierung fortgeschrittener JavaScript-Funktionen zur Verbesserung der Interaktivität.', keywords: ['JavaScript'] },
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
		tenureMonths: 72,
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
		period: { start: 'Jan 2024', end: 'Jun 2024' },
		tenureMonths: 6,
		lines: ['volunteer'],
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
		location: { city: 'Remote', country: 'UK', remote: true, coordinates: { lat: 51.51, lng: -0.13 } },
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
				{ text: 'Nutzung der Vercel-Plattform für nahtloses Deployment und Hosting mit hoher Verfügbarkeit.', keywords: ['Vercel'] },
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
		lines: ['backend', 'frontend', 'cloud', 'leadership'],
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
				{ text: 'Implementing Angular-based frontend components for intuitive user experiences.', keywords: ['Angular', 'frontend'] },
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
				{ text: 'Implementierung Angular-basierter Frontend-Komponenten für intuitive Benutzererfahrungen.', keywords: ['Angular'] },
			],
		},
		technologies: ['Java', 'Spring Boot', 'Angular'],
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
		relatedStationId: 'comsysto',
	},
	{
		id: 'flowable-developer',
		name: {
			en: 'Flowable Developer Certification',
			de: 'Flowable Developer Zertifizierung',
		},
		issuer: 'Flowable',
		year: 2025,
		relatedStationId: 'ubs-flowable',
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

export const technicalSkills: TechnicalSkill[] = [
	// Programming Languages
	{ name: 'Java', category: 'language', stars: 5, since: 2014 },
	{ name: 'Kotlin', category: 'language', stars: 5, since: 2019 },
	{ name: 'JavaScript', category: 'language', stars: 4, since: 2013 },
	{ name: 'TypeScript', category: 'language', stars: 4, since: 2019 },
	{ name: 'Python', category: 'language', stars: 3, since: 2015 },

	// Frameworks & Libraries
	{ name: 'Spring (Boot)', category: 'framework', stars: 5, since: 2017 },
	{ name: 'React', category: 'framework', stars: 5, since: 2017 },
	{ name: 'Angular', category: 'framework', stars: 3, since: 2019 },
	{ name: 'Node.js', category: 'framework', stars: 3, since: 2018 },
	{ name: 'JPA', category: 'framework', stars: 4, since: 2017 },

	// Databases
	{ name: 'PostgreSQL', category: 'database', stars: 4, since: 2017 },
	{ name: 'Oracle', category: 'database', stars: 3, since: 2019 },
	{ name: 'ElasticSearch', category: 'database', stars: 3, since: 2018 },
	{ name: 'MySQL', category: 'database', stars: 3, since: 2014 },
	{ name: 'Redis', category: 'database', stars: 2, since: 2019 },

	// Platforms
	{ name: 'AWS', category: 'platform', stars: 4, since: 2018 },
	{ name: 'Docker', category: 'platform', stars: 5, since: 2018 },
	{ name: 'Kubernetes', category: 'platform', stars: 4, since: 2021 },
	{ name: 'Apache Kafka', category: 'platform', stars: 3, since: 2019 },

	// Methods & Concepts
	{ name: 'Agile & Scrum', category: 'method', stars: 4, since: 2014 },
	{ name: 'Microservices', category: 'method', stars: 4, since: 2018 },
	{ name: 'REST', category: 'method', stars: 5, since: 2018 },
	{ name: 'TDD/BDD', category: 'method', stars: 3, since: 2017 },

	// Tools
	{ name: 'Git', category: 'tool', stars: 5, since: 2014 },
	{ name: 'Gradle', category: 'tool', stars: 4, since: 2019 },
	{ name: 'GitLab', category: 'tool', stars: 4, since: 2018 },
	{ name: 'Grafana', category: 'tool', stars: 4, since: 2020 },
	{ name: 'Artifactory', category: 'tool', stars: 3, since: 2020 },

	// Testing
	{ name: 'JUnit', category: 'testing', stars: 4, since: 2014 },
	{ name: 'Mockito', category: 'testing', stars: 4, since: 2017 },
	{ name: 'Cucumber', category: 'testing', stars: 3, since: 2019 },
	{ name: 'Selenium', category: 'testing', stars: 3, since: 2016 },

	// IDE
	{ name: 'IntelliJ', category: 'ide', stars: 5, since: 2017 },
]

export const lines: MetroLine[] = [
	{
		id: 'backend',
		label: 'Backend',
		color: '#e8655a', // Soft coral
		pattern: 'solid',
		yPosition: 60,
		stations: ['silvertours', 'fl-consulting', 'senacor', 'comsysto', 'spreadshirt', 'virtual-identity', 'ubs-flowable', 'peax'],
	},
	{
		id: 'frontend',
		label: 'Frontend',
		color: '#5b9bd5', // Soft blue
		pattern: 'solid',
		yPosition: 120,
		stations: ['silvertours', 'fl-consulting', 'blookery', 'comsysto', 'spreadshirt', 'virtual-identity', 'bicester', 'peax'],
	},
	{
		id: 'cloud',
		label: 'Cloud/DevOps',
		color: '#4db6a0', // Soft teal
		pattern: 'dashed',
		yPosition: 180,
		stations: ['comsysto', 'virtual-identity', 'ubs-flowable', 'peax'],
	},
	{
		id: 'leadership',
		label: 'Leadership',
		color: '#e0a458', // Soft amber
		pattern: 'dotted',
		yPosition: 240,
		stations: ['bicester', 'peax'],
	},
	{
		id: 'volunteer',
		label: 'Volunteer',
		color: '#9d8ec9', // Soft lavender
		pattern: 'double-dotted',
		yPosition: 320,
		stations: ['smartdorm', 'career-break'],
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

/**
 * Get domains for a station by its ID
 */
export function getStationDomains(stationId: string): DomainId[] {
	const station = getStationById(stationId)
	return station?.domains ?? []
}

export const transferStations = [
	{ city: 'Cologne', stations: ['silvertours', 'fl-consulting', 'blookery'] },
	{ city: 'Vienna', stations: ['senacor'] },
	{ city: 'Munich', stations: ['comsysto', 'smartdorm', 'spreadshirt', 'virtual-identity'] },
	{ city: 'Leipzig', stations: ['spreadshirt'] },
	{ city: 'London', stations: ['bicester'] },
	{ city: 'Zurich', stations: ['ubs-flowable', 'peax'] },
]

// --------------------- Helpers ---------------------

const stationIdMapping: Record<string, string> = {
	'silvertours': 'SilverToursGmbH',
	'fl-consulting': 'FLConsulting',
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

const dictionaryKeyMapping: Record<string, string> = {
	SilverToursGmbH: 'silvertours',
	FLConsulting: 'fl-consulting',
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

export function stationIdToDictionaryKey(id: string): string {
	return stationIdMapping[id] || id
}

export function dictionaryKeyToStationId(key: string): string {
	return dictionaryKeyMapping[key] || key
}

export function getStationById(id: string): CareerStation | undefined {
	return stations.find((s) => s.id === id)
}

export function getStationsByLine(lineId: MetroLineId): CareerStation[] {
	return stations.filter((s) => s.lines.includes(lineId))
}

export function getStationsByDomain(domainId: DomainId): CareerStation[] {
	return stations.filter((s) => s.domains.includes(domainId))
}

export function getStationsByCity(city: string): CareerStation[] {
	return stations.filter((s) => s.location.city === city)
}

export function getCertificationsByYear(year: number): Certification[] {
	return certifications.filter((c) => c.year === year)
}

export function getAllTechnologies(): string[] {
	const techs = new Set<string>()
	for (const station of stations) {
		for (const tech of station.technologies) {
			techs.add(tech)
		}
	}
	return Array.from(techs).sort()
}

export function getTotalYearsExperience(): number {
	const firstStation = stations.find((s) => s.id === 'silvertours')
	if (!firstStation) return 0
	const startYear = parseInt(firstStation.period.start.split(' ')[1])
	const currentYear = new Date().getFullYear()
	return currentYear - startYear
}

/**
 * Featured technologies for the About Me section.
 * Returns two columns of technologies to display.
 * Edit this list to change what appears in the About section.
 */
export function getFeaturedTechnologies(): [string[], string[]] {
	// Curated list - edit here to update About Me section
	const column1 = ['Java', 'Kotlin', 'Spring Boot', 'React', 'TypeScript', 'Next.js']
	const column2 = ['AWS', 'PostgreSQL', 'Docker', 'Jenkins', 'GitLab', 'Sanity CMS']
	return [column1, column2]
}

export interface FeaturedTech {
	name: string
	since: number | null
	years: number | null
}

/**
 * Get featured technologies with years of experience
 */
export function getFeaturedTechnologiesWithYears(): [FeaturedTech[], FeaturedTech[]] {
	const currentYear = new Date().getFullYear()
	const column1Names = ['Java', 'Kotlin', 'Spring Boot', 'React', 'TypeScript', 'Next.js']
	const column2Names = ['AWS', 'PostgreSQL', 'Docker', 'Jenkins', 'GitLab', 'Sanity CMS']

	const mapToFeaturedTech = (names: string[]): FeaturedTech[] =>
		names.map((name) => {
			// Map display names to skill names (handle variations)
			const skillName = name === 'Spring Boot' ? 'Spring (Boot)' : name
			const skill = technicalSkills.find((s) => s.name === skillName || s.name === name)
			const since = skill?.since ?? null
			const years = since ? currentYear - since : null
			return { name, since, years }
		})

	return [mapToFeaturedTech(column1Names), mapToFeaturedTech(column2Names)]
}

/**
 * Get current employer (most recent non-volunteer, non-career-break station)
 */
export function getCurrentEmployer(): {
	name: string
	url?: string
	city: string
	country: string
	jobTitle: { en: string; de: string }
} | null {
	const current = stations.find((s) => s.period.end === 'present' && !s.isVolunteer && s.id !== 'career-break')
	if (!current) return null
	return {
		name: current.company,
		url: current.url,
		city: current.location.city,
		country: current.location.country,
		jobTitle: current.role,
	}
}

/**
 * Get top technologies for structured data (JSON-LD knowsAbout)
 */
export function getStructuredDataTechnologies(): string[] {
	// Get 5-star and 4-star skills, prioritizing 5-star
	const topSkills = technicalSkills
		.filter((s) => s.stars >= 4)
		.sort((a, b) => b.stars - a.stars)
		.slice(0, 12)
		.map((s) => s.name)
	return topSkills
}

/**
 * Get education list for structured data
 */
export function getEducationForStructuredData(): Array<{ name: string }> {
	return education.map((e) => ({ name: e.institution }))
}

/**
 * Get notable companies worked with (for SEO descriptions)
 */
export function getNotableCompanies(): string[] {
	// Curated list of notable client/company names for marketing
	return ['Audi', 'Infineon', 'UBS', 'Flowable', 'PEAX']
}

/**
 * Get highlighted terms for hero section (companies + current city)
 */
export function getHeroHighlightedTerms(): string[] {
	const employer = getCurrentEmployer()
	const companies = getNotableCompanies()
	const terms = [...companies]
	if (employer?.city && !terms.includes(employer.city)) {
		terms.push(employer.city)
	}
	return terms
}

/**
 * Get highlighted terms for about me section (technologies + notable companies)
 */
export function getAboutMeHighlightedTerms(): string[] {
	// Technologies mentioned in the specialization text
	const techTerms = ['Spring Boot', 'Kotlin', 'Java', 'React', 'JavaScript', 'TypeScript', 'Jenkins', 'GitLab']
	// Add notable companies mentioned in aboutMe text
	const companyTerms = ['Infineon', 'Audi']
	return [...techTerms, ...companyTerms]
}

export interface ExperienceCompany {
	name: string
	key: string
	location: string
}

/**
 * Get companies for the experience section, sorted by most recent first.
 */
export function getExperienceCompanies(): ExperienceCompany[] {
	const monthOrder: Record<string, number> = {
		Jan: 1,
		Feb: 2,
		Mar: 3,
		Apr: 4,
		May: 5,
		Jun: 6,
		Jul: 7,
		Aug: 8,
		Sep: 9,
		Oct: 10,
		Nov: 11,
		Dec: 12,
	}

	const parseDate = (dateStr: string): number => {
		if (dateStr === 'present') return Date.now()
		const [month, year] = dateStr.split(' ')
		return new Date(parseInt(year), monthOrder[month] - 1).getTime()
	}

	return [...stations]
		.sort((a, b) => parseDate(b.period.start) - parseDate(a.period.start))
		.map((station) => ({
			name: station.company,
			key: stationIdToDictionaryKey(station.id),
			location:
				station.location.country === '4 Continents' ? station.location.city : `${station.location.city}, ${station.location.country}`,
		}))
}

// --------------------- Generators ---------------------

export interface DictionaryRole {
	title: string
	date: string
	url: string
	tasks: TaskItem[]
}

/**
 * Generates the experienceSection.roles object for dictionaries/*.json
 */
export function generateDictionaryRoles(lang: Lang): Record<string, DictionaryRole> {
	const roles: Record<string, DictionaryRole> = {}

	for (const station of stations) {
		const key = stationIdToDictionaryKey(station.id)
		const endDate = station.period.end === 'present' ? (lang === 'en' ? 'Present' : 'Heute') : station.period.end

		roles[key] = {
			title: station.role[lang],
			date: `${station.period.start} - ${endDate}`,
			url: station.url || '',
			tasks: station.tasks[lang],
		}
	}

	return roles
}

/**
 * Get all unique cities in chronological order
 */
export function getCitiesInOrder(): string[] {
	const seen = new Set<string>()
	const cities: string[] = []

	for (const station of stations) {
		if (!seen.has(station.location.city)) {
			seen.add(station.location.city)
			cities.push(station.location.city)
		}
	}

	return cities
}

/**
 * Parse month-year string to Date
 */
export function parseMonthYear(str: string): Date {
	const [month, year] = str.split(' ')
	const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(month)
	return new Date(parseInt(year), monthIndex)
}

/**
 * Get X position on timeline (0-1 normalized)
 */
export function getTimelinePosition(dateStr: string, startYear = 2015, endYear = 2026): number {
	const date = dateStr === 'present' ? new Date() : parseMonthYear(dateStr)
	const startDate = new Date(startYear, 0)
	const endDate = new Date(endYear, 11)
	const totalRange = endDate.getTime() - startDate.getTime()
	const position = date.getTime() - startDate.getTime()
	return Math.max(0, Math.min(1, position / totalRange))
}

// --------------------- Travel Journey (Career Break) ---------------------

export interface TravelDestination {
	country: string
	city: string
	lat: number
	lng: number
}

// Journey: Germany → Greece → Egypt → South Africa → Zambia → Zimbabwe → Fiji → Australia → Chile → Argentina → Colombia → Ecuador → Germany
export const careerBreakJourney: TravelDestination[] = [
	{ country: 'Germany', city: 'Cologne', lat: 50.94, lng: 6.96 },
	{ country: 'Greece', city: 'Athens', lat: 37.98, lng: 23.73 },
	{ country: 'Egypt', city: 'Cairo', lat: 30.04, lng: 31.24 },
	{ country: 'South Africa', city: 'Cape Town', lat: -33.92, lng: 18.42 },
	{ country: 'Zambia', city: 'Livingstone', lat: -17.84, lng: 25.86 },
	{ country: 'Zimbabwe', city: 'Victoria Falls', lat: -17.93, lng: 25.83 },
	{ country: 'Fiji', city: 'Suva', lat: -18.14, lng: 178.44 },
	{ country: 'Australia', city: 'Sydney', lat: -33.87, lng: 151.21 },
	{ country: 'Chile', city: 'Santiago', lat: -33.45, lng: -70.67 },
	{ country: 'Argentina', city: 'Buenos Aires', lat: -34.6, lng: -58.38 },
	{ country: 'Colombia', city: 'Bogotá', lat: 4.71, lng: -74.07 },
	{ country: 'Ecuador', city: 'Quito', lat: -0.18, lng: -78.47 },
	{ country: 'Germany', city: 'Cologne', lat: 50.94, lng: 6.96 },
]

/**
 * Get travel journey as map dots (for WorldMap component)
 */
export function getTravelJourneyDots(): Array<{
	start: { lat: number; lng: number; label?: string }
	end: { lat: number; lng: number; label?: string }
}> {
	const dots = []
	for (let i = 0; i < careerBreakJourney.length - 1; i++) {
		const start = careerBreakJourney[i]
		const end = careerBreakJourney[i + 1]
		dots.push({
			start: { lat: start.lat, lng: start.lng, label: start.city },
			end: { lat: end.lat, lng: end.lng, label: end.city },
		})
	}
	return dots
}

// --------------------- Hero Roles ---------------------

/**
 * Get unique roles for the hero section typewriter animation
 */
export function getHeroRoles(lang: Lang): string[] {
	const rolesByLang: Record<Lang, string[]> = {
		en: ['Software Engineer', 'Solutions Architect', 'Tech Lead'],
		de: ['Software-Ingenieur', 'Lösungsarchitekt', 'Tech Lead'],
		ch: ['Software-Ingenieur', 'Lösungsarchitekt', 'Tech Lead'],
		uk: ['Інженер-програміст', 'Архітектор рішень', 'Технічний керівник'],
	}
	return rolesByLang[lang] ?? rolesByLang.en
}

// --------------------- Impact Metrics ---------------------

export interface DisplayMetric {
	value: string
	label: string
	icon: 'speed' | 'efficiency' | 'code' | 'scale' | 'compliance' | 'data'
}

/**
 * Get displayable metrics for a station by dictionary key
 */
export function getStationMetrics(dictionaryKey: string): DisplayMetric[] {
	const stationId = dictionaryKeyToStationId(dictionaryKey)
	const station = getStationById(stationId)
	if (!station?.metrics) return []

	const metrics: DisplayMetric[] = []
	const m = station.metrics

	if (m.qps) {
		metrics.push({ value: `${m.qps}`, label: 'QPS', icon: 'speed' })
	}
	if (m.efficiencyGain) {
		const match = m.efficiencyGain.match(/(\d+)%/)
		if (match) {
			metrics.push({ value: `${match[1]}%`, label: 'efficiency gain', icon: 'efficiency' })
		}
	}
	if (m.codeReduction) {
		const match = m.codeReduction.match(/(\d+)%/)
		if (match) {
			metrics.push({ value: `${match[1]}%`, label: 'less code', icon: 'code' })
		}
	}
	if (m.responseTimeImprovement) {
		const match = m.responseTimeImprovement.match(/(\d+)%/)
		if (match) {
			metrics.push({ value: `${match[1]}%`, label: 'faster response', icon: 'speed' })
		}
	}
	if (m.dataConsistency) {
		metrics.push({ value: m.dataConsistency, label: 'data consistency', icon: 'data' })
	}

	return metrics
}
