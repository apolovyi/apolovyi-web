import Script from 'next/script'

import {
	getCurrentEmployer,
	getEducationForStructuredData,
	getNotableCompanies,
	getStructuredDataTechnologies,
	getTotalYearsExperience,
} from '@/lib/career-data'

const StructuredData = () => {
	const employer = getCurrentEmployer()
	const technologies = getStructuredDataTechnologies()
	const educationList = getEducationForStructuredData()
	const notableCompanies = getNotableCompanies()
	const yearsExperience = getTotalYearsExperience()

	const description = `Full-Stack Software Engineer based in ${employer?.city || 'Zurich'}, Switzerland. ${yearsExperience}+ years building enterprise solutions for ${notableCompanies.join(', ')} using Java, Kotlin, Spring Boot, React, and TypeScript.`

	const personData = {
		'@context': 'https://schema.org',
		'@type': 'Person',
		'name': 'Artem Polovyi',
		'url': 'https://apolovyi.me',
		'image': 'https://apolovyi.me/img/me-circle.webp',
		description,
		'email': 'info@apolovyi.me',
		'sameAs': ['https://www.linkedin.com/in/apolovyi', 'https://github.com/apolovyi'],
		'jobTitle': employer?.jobTitle.en || 'Senior Full-Stack Software Engineer',
		'worksFor': employer
			? {
					'@type': 'Organization',
					'name': employer.name,
					'url': employer.url,
					'address': {
						'@type': 'PostalAddress',
						'addressLocality': employer.city,
						'addressCountry': employer.country,
					},
				}
			: undefined,
		'address': {
			'@type': 'PostalAddress',
			'addressLocality': employer?.city || 'Zurich',
			'addressRegion': 'ZH',
			'addressCountry': 'CH',
		},
		'alumniOf': educationList.map((edu) => ({
			'@type': 'EducationalOrganization',
			'name': edu.name,
		})),
		'knowsLanguage': [
			{ '@type': 'Language', 'name': 'German', 'alternateName': 'de' },
			{ '@type': 'Language', 'name': 'English', 'alternateName': 'en' },
			{ '@type': 'Language', 'name': 'Ukrainian', 'alternateName': 'uk' },
		],
		'knowsAbout': technologies,
		'nationality': {
			'@type': 'Country',
			'name': 'Ukraine',
		},
	}

	return (
		<Script
			id="ld-json"
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(personData) }}
		/>
	)
}

export default StructuredData
