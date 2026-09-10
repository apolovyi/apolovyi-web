import { LINKS } from '@/lib/constants'
import type { Dictionary } from '@/lib/dictionary.types'

export function renderProfileMarkdown(dictionary: Dictionary): string {
	const { page } = dictionary

	return [
		`# ${page.name}`,
		'',
		`> ${page.subtitle}`,
		'',
		...page.body.flatMap((line) => [line, '']),
		`## ${page.linksLabel}`,
		'',
		`- [${page.links.linkedin}](${LINKS.linkedin})`,
		`- [${page.links.github}](${LINKS.github})`,
		`- [${page.links.email}](${LINKS.email})`,
		'',
	].join('\n')
}
