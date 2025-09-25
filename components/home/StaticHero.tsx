'use client'

import type { Locale } from '@/i18n-config'

import { useDictionary } from '@/components/shared/DictionaryContext'

interface StaticHeroProps {
	finishedLoading: boolean
	lang: Locale
}

export default function StaticHero(_props: StaticHeroProps) {
	const dictionary = useDictionary()
	const { heroSection } = dictionary

	return (
		<div className="mx-8 flex min-h-screen flex-col justify-center pt-20 md:mx-28 lg:mx-32 xl:mx-56 2xl:mx-72 tall:pt-0">
			<div className="z-10">
				<div className="font-tech tracking-wider text-accent-coral lg:text-lg">{heroSection.greeting}</div>
				<div className="mt-12">
					<a
						href={heroSection.resumeHref}
						target="_blank"
						rel="noreferrer"
					>
						<button className="relative p-[2px]">
							<div className="absolute inset-0 rounded-md bg-gradient-to-r from-primary to-secondary" />
							<div className="group relative rounded-[6px] bg-white px-8 py-3 font-heading text-accent-coral transition duration-200 hover:bg-transparent hover:text-white">
								{heroSection.cta}
							</div>
						</button>
					</a>
				</div>
			</div>
		</div>
	)
}
