import Script from 'next/script'

const StructuredData = () => {
	const personData = {
		'@context': 'https://schema.org',
		'@type': 'Person',
		'name': 'Artem Polovyi',
		'url': 'https://apolovyi.me',
		'image': 'https://apolovyi.me/img/me-circle.webp',
		'description':
			'Full-Stack Software Engineer based in Zurich, Switzerland. 10+ years building enterprise solutions for Audi, Infineon, Flowable, and PEAX using Java, Kotlin, Spring Boot, React, and TypeScript.',
		'email': 'info@apolovyi.me',
		'sameAs': ['https://www.linkedin.com/in/apolovyi', 'https://github.com/apolovyi'],
		'jobTitle': 'Senior Full-Stack Software Engineer',
		'worksFor': {
			'@type': 'Organization',
			'name': 'PEAX AG',
			'url': 'https://peax.ch',
			'address': {
				'@type': 'PostalAddress',
				'addressLocality': 'Zurich',
				'addressCountry': 'CH',
			},
		},
		'address': {
			'@type': 'PostalAddress',
			'addressLocality': 'Zurich',
			'addressRegion': 'ZH',
			'addressCountry': 'CH',
		},
		'alumniOf': [
			{
				'@type': 'EducationalOrganization',
				'name': 'Munich University of Applied Sciences',
			},
			{
				'@type': 'EducationalOrganization',
				'name': 'TH Köln - University of Applied Sciences',
			},
			{
				'@type': 'EducationalOrganization',
				'name': 'Telecommunications University Kyiv',
			},
		],
		'knowsLanguage': [
			{ '@type': 'Language', 'name': 'German', 'alternateName': 'de' },
			{ '@type': 'Language', 'name': 'English', 'alternateName': 'en' },
			{ '@type': 'Language', 'name': 'Ukrainian', 'alternateName': 'uk' },
			{ '@type': 'Language', 'name': 'Russian', 'alternateName': 'ru' },
		],
		'knowsAbout': [
			'Java',
			'Kotlin',
			'Spring Boot',
			'React',
			'TypeScript',
			'Next.js',
			'PostgreSQL',
			'AWS',
			'Docker',
			'Microservices',
			'BPMN',
			'Flowable',
		],
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
