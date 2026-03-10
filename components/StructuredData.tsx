import { LINKS } from '@/lib/constants'

const personData = {
	'@context': 'https://schema.org',
	'@type': 'Person',
	'name': 'Artem Polovyi',
	'url': 'https://apolovyi.me',
	'image': 'https://apolovyi.me/apple-icon.png',
	'description': 'Full-Stack Software Engineer based in Zurich, Switzerland.',
	'email': LINKS.email.replace('mailto:', ''),
	'sameAs': [LINKS.linkedin, LINKS.github],
	'jobTitle': 'Senior Full-Stack Software Engineer',
	'address': {
		'@type': 'PostalAddress',
		'addressLocality': 'Zurich',
		'addressRegion': 'ZH',
		'addressCountry': 'CH',
	},
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
