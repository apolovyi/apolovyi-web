import type { Locale } from '@/i18n-config'
import { i18n } from '@/i18n-config'

import ThemeToggle from '@/components/ThemeToggle'

import { LINKS } from '@/lib/constants'
import { getDictionary } from '@/lib/dictionary.server'

export const dynamic = 'error'
export const dynamicParams = false

export function generateStaticParams(): Array<{ lang: string }> {
	return i18n.locales.map((locale) => ({ lang: locale }))
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
	const { lang: langParam } = await params
	const lang = (langParam ?? i18n.defaultLocale) as Locale
	const dictionary = await getDictionary(lang)
	const { page } = dictionary

	return (
		<>
			<main className="page-body flex items-center justify-center px-[clamp(1.5rem,1rem+1.5vw,2rem)]">
				<div className="page-content w-full max-w-lg -translate-y-[4%] text-center">
					<h1 className="hero-name leading-[1.05] tracking-tight">{page.name}</h1>

					<div className="hero-line mx-auto mt-[clamp(1.5rem,1rem+1.5vw,2rem)] w-[clamp(8rem,5rem+10vw,12rem)]" />

					<p className="hero-subtitle mt-[clamp(1.25rem,1rem+0.75vw,1.5rem)] leading-tight tracking-[0.06em]">{page.subtitle}</p>

					<p className="hero-body mx-auto mt-[clamp(1.5rem,1rem+1.5vw,2rem)] max-w-sm leading-relaxed">
						{page.body.map((line, i) => (
							<span
								key={i}
								className="block"
							>
								{line}
							</span>
						))}
					</p>

					<nav
						className="mt-[clamp(2.5rem,1.5rem+3vw,3.5rem)] flex items-center justify-center gap-0"
						aria-label={page.linksLabel}
					>
						<a
							href={LINKS.linkedin}
							target="_blank"
							rel="noopener noreferrer"
							className="nav-link px-2.5 sm:px-3"
						>
							{page.links.linkedin}
						</a>
						<span
							className="nav-dot"
							aria-hidden="true"
						>
							·
						</span>
						<a
							href={LINKS.github}
							target="_blank"
							rel="noopener noreferrer"
							className="nav-link px-2.5 sm:px-3"
						>
							{page.links.github}
						</a>
						<span
							className="nav-dot"
							aria-hidden="true"
						>
							·
						</span>
						<a
							href={LINKS.email}
							className="nav-link px-2.5 sm:px-3"
						>
							{page.links.email}
						</a>
					</nav>
				</div>
			</main>
			<ThemeToggle />
		</>
	)
}
