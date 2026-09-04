import type { Locale } from '@/i18n-config'

import { LINKS } from '@/lib/constants'
import type { Dictionary } from '@/lib/dictionary.types'

const BASE_URL = 'https://apolovyi.me'

export function renderProfileMarkdown(dictionary: Dictionary, locale: Locale): string {
	const { page, work } = dictionary

	return [
		`# ${page.name}`,
		'',
		`> ${page.subtitle}`,
		'',
		...page.body.flatMap((line) => [line, '']),
		`## ${work.title}`,
		'',
		`- [${work.title}](${BASE_URL}/${locale}/work.md): ${work.intro}`,
		'',
		`## ${page.linksLabel}`,
		'',
		`- [${page.links.linkedin}](${LINKS.linkedin})`,
		`- [${page.links.github}](${LINKS.github})`,
		`- [${page.links.email}](${LINKS.email})`,
		'',
	].join('\n')
}

export function renderWorkMarkdown(dictionary: Dictionary, locale: Locale): string {
	const { page, work } = dictionary
	const projects = work.projects.flatMap((project) => [
		`## ${project.name}`,
		'',
		project.description,
		'',
		`- [${work.projectLink}](${project.url})`,
		'',
	])

	return [
		`# ${work.title}`,
		'',
		`> ${work.intro}`,
		'',
		...projects,
		`## ${page.name}`,
		'',
		`- [${page.name}](${BASE_URL}/${locale}/index.md)`,
		'',
	].join('\n')
}
