import type { Metadata } from 'next'

import type { Locale } from '@/i18n-config'
import { i18n } from '@/i18n-config'

import ThemeToggle from '@/components/ThemeToggle'

import { getDictionary } from '@/lib/dictionary.server'

export const dynamic = 'error'
export const dynamicParams = false

export function generateStaticParams(): Array<{ lang: string }> {
	return i18n.locales.map((locale) => ({ lang: locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
	const { lang: langParam } = await params
	const lang = (langParam ?? i18n.defaultLocale) as Locale
	const { work } = await getDictionary(lang)

	return {
		title: work.title,
		description: work.intro,
		alternates: {
			canonical: `https://apolovyi.me/${lang}/work`,
			languages: Object.fromEntries(i18n.locales.map((locale) => [locale, `https://apolovyi.me/${locale}/work`])),
		},
	}
}

export default async function WorkPage({ params }: { params: Promise<{ lang: string }> }) {
	const { lang: langParam } = await params
	const lang = (langParam ?? i18n.defaultLocale) as Locale
	const { work } = await getDictionary(lang)

	return (
		<>
			<main className="page-body work-page px-[clamp(1.5rem,1rem+1.5vw,2rem)] py-[clamp(2.5rem,1.5rem+3vw,4rem)]">
				<div className="page-content mx-auto w-full max-w-2xl">
					<a
						href={`/${lang}`}
						className="nav-link"
					>
						{work.back}
					</a>

					<header className="mt-8">
						<h1 className="hero-name leading-[1.05] tracking-tight">{work.title}</h1>
						<p className="hero-body mt-4 max-w-xl leading-relaxed">{work.intro}</p>
					</header>

					<section
						className="mt-[clamp(2.5rem,1.5rem+3vw,3.5rem)]"
						aria-label={work.title}
					>
						{work.projects.map((project) => (
							<article
								key={project.url}
								className="work-card py-6"
							>
								<h2 className="work-title">{project.name}</h2>
								<p className="hero-body mt-2 max-w-xl leading-relaxed">{project.description}</p>
								<a
									href={project.url}
									target="_blank"
									rel="noopener noreferrer"
									className="nav-link mt-3"
								>
									{work.projectLink}
								</a>
							</article>
						))}
					</section>
				</div>
			</main>
			<ThemeToggle />
		</>
	)
}
