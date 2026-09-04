import type { Locale } from '@/i18n-config'
import { localeLanguageTags } from '@/i18n-config'

import { LINKS } from '@/lib/constants'
import type { Work } from '@/lib/dictionary.types'

const PERSON_ID = 'https://apolovyi.me/#person'

const personData = {
	'@type': 'Person',
	'@id': PERSON_ID,
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

function JsonLd({ data }: { data: object }) {
	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
		/>
	)
}

export function ProfileStructuredData({ locale, name, description }: { locale: Locale; name: string; description: string }) {
	const url = `https://apolovyi.me/${locale}`

	return (
		<JsonLd
			data={{
				'@context': 'https://schema.org',
				'@graph': [
					personData,
					{
						'@type': 'ProfilePage',
						'@id': `${url}#profile`,
						url,
						name,
						description,
						'inLanguage': localeLanguageTags[locale],
						'mainEntity': { '@id': PERSON_ID },
					},
				],
			}}
		/>
	)
}

export function WorkStructuredData({ locale, work }: { locale: Locale; work: Work }) {
	const url = `https://apolovyi.me/${locale}/work`
	const itemListId = `${url}#projects`

	return (
		<JsonLd
			data={{
				'@context': 'https://schema.org',
				'@graph': [
					personData,
					{
						'@type': 'CollectionPage',
						'@id': `${url}#page`,
						url,
						'name': work.title,
						'description': work.intro,
						'inLanguage': localeLanguageTags[locale],
						'author': { '@id': PERSON_ID },
						'mainEntity': { '@id': itemListId },
					},
					{
						'@type': 'ItemList',
						'@id': itemListId,
						'itemListElement': work.projects.map((project, index) => ({
							'@type': 'ListItem',
							'position': index + 1,
							'item': {
								'@type': 'SoftwareSourceCode',
								'name': project.name,
								'description': project.description,
								'codeRepository': project.url,
							},
						})),
					},
				],
			}}
		/>
	)
}
