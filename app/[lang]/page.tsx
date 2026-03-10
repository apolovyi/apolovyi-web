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
			<main className="page-body flex items-center justify-center px-6 sm:px-8">
				<div className="page-content w-full max-w-lg -translate-y-[4%] text-center">
					<h1 className="hero-name text-5xl leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">{page.name}</h1>

					<div className="hero-line mx-auto mt-6 w-32 sm:mt-8 sm:w-48" />

					<p className="hero-subtitle mt-5 text-base tracking-[0.08em] sm:mt-6 sm:text-lg">{page.subtitle}</p>

					<p className="hero-body mx-auto mt-6 max-w-sm text-sm leading-relaxed sm:mt-8 sm:text-base">{page.body}</p>

					<nav
						className="mt-10 flex items-center justify-center gap-0 text-xs tracking-[0.2em] uppercase sm:mt-14 sm:text-sm"
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
