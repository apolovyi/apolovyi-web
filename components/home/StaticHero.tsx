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
		<div className="tall:pt-0 mx-8 flex min-h-screen flex-col justify-center pt-20 md:mx-28 lg:mx-32 xl:mx-56 2xl:mx-72">
			<div className="z-10">
				<div className="font-tech text-accent-coral tracking-wider lg:text-lg">{heroSection.greeting}</div>
				<div className="mt-12">
					<a
						href={heroSection.resumeHref}
						target="_blank"
						rel="noreferrer"
					>
						<button className="group hover:shadow-accent-coral/25 dark:shadow-accent-coral/10 dark:hover:shadow-accent-coral/30 relative overflow-hidden rounded-md p-[2px] shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-98">
							<div className="animate-shimmer from-accent-blue via-accent-coral to-accent-blue absolute inset-0 bg-gradient-to-r bg-[length:200%_100%]" />
							<div className="bg-background-primary font-heading text-accent-coral relative rounded-[5px] px-8 py-3 transition-all duration-300 group-hover:bg-transparent group-hover:text-white">
								{heroSection.cta}
							</div>
						</button>
					</a>
				</div>
			</div>
		</div>
	)
}
