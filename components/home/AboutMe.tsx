import React, { useRef } from 'react'

import type { Locale } from '@/i18n-config'
import { animate } from 'motion'
import type { DOMKeyframesDefinition } from 'motion'

import ArrowIcon from '@/components/icons/ArrowIcon'
import { useDictionary } from '@/components/shared/DictionaryContext'
import SectionHeader from '@/components/shared/SectionHeader'
import { useMotionInView } from '@/components/shared/useMotionInView'

import { type FeaturedTech, getFeaturedTechnologiesWithYears } from '@/lib/career-data'

const technologies = getFeaturedTechnologiesWithYears()

interface AboutMeProps {
	lang: Locale
}

type TechListProps = {
	techs: FeaturedTech[]
}

const formatYears = (years: number | null): { display: string; ariaLabel: string } | null => {
	if (years === null) return null
	if (years >= 10) return { display: '10+', ariaLabel: '10 or more years of experience' }
	if (years >= 5) return { display: `${years}`, ariaLabel: `${years} years of experience` }
	return null // Don't show badge for < 5 years
}

const TechList = ({ techs }: TechListProps) => (
	<ul className="flex flex-col space-y-2">
		{techs.map((tech) => {
			const years = formatYears(tech.years)
			return (
				<li
					key={tech.name}
					className="flex items-center gap-2"
				>
					<ArrowIcon className="h-3 w-3 flex-shrink-0 text-accent-coral" />
					<span className="text-base text-text-secondary md:text-lg">{tech.name}</span>
					{years && (
						<span
							className="rounded bg-accent-coral/10 px-1.5 py-0.5 font-tech text-[11px] text-accent-coral"
							aria-label={years.ariaLabel}
						>
							{years.display}y
						</span>
					)}
				</li>
			)
		})}
	</ul>
)

const ProfileImage = () => (
	<div className="relative mx-auto h-60 w-60 sm:h-80 sm:w-80">
		<div className="group absolute inset-0">
			<div className="absolute h-full w-full translate-x-5 translate-y-5 rounded border-2 border-accent-coral transition-all duration-300 group-hover:translate-x-3 group-hover:translate-y-3"></div>
			<div className="absolute h-full w-full overflow-hidden rounded">
				<div className="absolute inset-0 bg-accent-coral opacity-10 transition-opacity duration-300 group-hover:opacity-0"></div>
				<picture>
					<source
						srcSet="/img/me-bg.avif"
						type="image/avif"
					/>
					<source
						srcSet="/img/me-bg.webp"
						type="image/webp"
					/>
					<img
						src="/img/me-bg.jpg"
						alt="Artem Polovyi"
						loading="lazy"
						className="absolute inset-0 h-full w-full rounded object-cover opacity-100"
						onLoad={(e) => animate(e.currentTarget as HTMLImageElement, { opacity: 1 } as DOMKeyframesDefinition, { duration: 0.35 })}
					/>
				</picture>
			</div>
		</div>
	</div>
)

const AboutMe = ({ lang: _lang }: AboutMeProps) => {
	const { aboutMeSection } = useDictionary()
	const sectionRef = useRef<HTMLElement>(null)
	const headerRef = useRef<HTMLElement>(null)
	const contentRef = useRef<HTMLDivElement>(null)
	const profileRef = useRef<HTMLDivElement>(null)
	useMotionInView(sectionRef, 'fade-up', { mode: 'toggle' })
	useMotionInView(headerRef, 'fade-up', { mode: 'toggle' })
	useMotionInView(contentRef, 'fade-right', { mode: 'toggle' })
	useMotionInView(profileRef, 'fade-left', { mode: 'toggle' })

	const highlightTerms = (text: string) => {
		let highlightedText = text
		aboutMeSection.highlightedTerms.forEach((term) => {
			const regex = new RegExp(`\\b(${term})\\b`, 'gi')
			highlightedText = highlightedText.replace(regex, '<span class="font-tech text-accent-coral">$1</span>')
		})
		return (
			<p
				className="text-text-secondary"
				dangerouslySetInnerHTML={{ __html: highlightedText }}
			/>
		)
	}

	return (
		<section
			ref={sectionRef}
			id="aboutSection"
			className="flex w-full flex-col space-y-12 px-4 py-32 sm:px-16 md:px-16 lg:px-24 xl:space-y-28 2xl:px-72"
		>
			<div className="mx-auto flex w-full max-w-5xl flex-col px-4 sm:px-6 lg:px-8">
				<SectionHeader
					number="01."
					title={aboutMeSection.title}
					headerRef={headerRef}
				/>

				<div className="mt-8 flex flex-col items-start lg:flex-row lg:space-x-12">
					<div
						ref={contentRef}
						className="w-full lg:w-3/5"
					>
						<div className="space-y-4 font-body text-base sm:text-lg">
							<p className="text-text-secondary">{aboutMeSection.paragraphs.intro}</p>
							{highlightTerms(aboutMeSection.paragraphs.specialization)}
							<p className="text-text-secondary">{aboutMeSection.paragraphs.mindset}</p>
							<p className="text-text-secondary">{aboutMeSection.paragraphs.technologies}</p>
							<div className="flex space-x-16 font-tech">
								{technologies.map((techList, index) => (
									<TechList
										key={index}
										techs={techList}
									/>
								))}
							</div>
						</div>
					</div>
					<div
						ref={profileRef}
						className="mt-12 w-full lg:mt-0 lg:w-2/5"
					>
						<ProfileImage />
					</div>
				</div>
			</div>
		</section>
	)
}

export default AboutMe
