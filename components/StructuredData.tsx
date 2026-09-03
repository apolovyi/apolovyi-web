import { LINKS } from '@/lib/constants'

const personData = {
	'@context': 'https://schema.org',
	'@type': 'Person',
	'name': 'Artem Polovyi',
	'url': 'https://apolovyi.me',
	'image': 'https://apolovyi.me/og-image.png',
	'description':
		'Senior software engineer and architect in Zürich, focused on JVM platforms, system modernisation and reliable AI delivery.',
	'email': LINKS.email.replace('mailto:', ''),
	'sameAs': [LINKS.linkedin, LINKS.github],
	'jobTitle': 'Senior Software Engineer and Architect',
	'address': {
		'@type': 'PostalAddress',
		'addressLocality': 'Zurich',
		'addressRegion': 'ZH',
		'addressCountry': 'CH',
	},
	'knowsAbout': [
		'JVM platforms',
		'Java and Kotlin',
		'Spring Boot',
		'TypeScript, React and Angular',
		'AWS and Azure',
		'Docker and Kubernetes',
		'CI/CD',
		'Flowable BPMN and CMMN',
		'Agentic engineering',
		'LLM classification and OCR',
		'Playwright behaviour gates',
	],
	'knowsLanguage': [
		{ '@type': 'Language', 'name': 'German', 'alternateName': 'de' },
		{ '@type': 'Language', 'name': 'English', 'alternateName': 'en' },
		{ '@type': 'Language', 'name': 'Ukrainian', 'alternateName': 'uk' },
	],
}

const StructuredData = () => (
	<script
		type="application/ld+json"
		dangerouslySetInnerHTML={{ __html: JSON.stringify(personData) }}
	/>
)

export default StructuredData
