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
		<div className="mx-8 flex min-h-screen flex-col justify-center pt-20 tall:pt-0 md:mx-28 lg:mx-32 xl:mx-56 2xl:mx-72">
			<div className="z-10">
				<div className="font-tech tracking-wider text-accent-coral lg:text-lg">{heroSection.greeting}</div>
				<div className="mt-12">
					<a
						href={heroSection.resumeHref}
						target="_blank"
						rel="noreferrer"
					>
						<button className="active:scale-98 group relative overflow-hidden rounded-md p-[2px] shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-accent-coral/25 dark:shadow-accent-coral/10 dark:hover:shadow-accent-coral/30">
							<div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-accent-blue via-accent-coral to-accent-blue bg-[length:200%_100%]" />
							<div className="relative rounded-[5px] bg-background-primary px-8 py-3 font-heading text-accent-coral transition-all duration-300 group-hover:bg-transparent group-hover:text-white">
								{heroSection.cta}
							</div>
						</button>
					</a>
				</div>
			</div>
		</div>
	)
}
