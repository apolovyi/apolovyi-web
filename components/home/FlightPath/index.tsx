'use client'

import { useRef } from 'react'

import type { Locale } from '@/i18n-config'

import { useDictionary } from '@/components/shared/DictionaryContext'
import SectionHeader from '@/components/shared/SectionHeader'
import { useMotionInView } from '@/components/shared/useMotionInView'

import { CertificationCard } from './CertificationCard'
import { EducationCard } from './EducationCard'
import { FlightPathSVG } from './FlightPathSVG'

interface FlightPathProps {
	lang: Locale
}

export default function FlightPath({ lang: _lang }: FlightPathProps) {
	const dict = useDictionary()
	const { flightPathSection } = dict

	const sectionRef = useRef<HTMLElement>(null)
	const headerRef = useRef<HTMLElement>(null)
	const svgRef = useRef<HTMLDivElement>(null)
	const cardsRef = useRef<HTMLDivElement>(null)

	useMotionInView(sectionRef, 'fade-up', { threshold: 0.01, rootMargin: '0px 0px 25% 0px' })
	useMotionInView(headerRef, 'fade-up', { threshold: 0.01, rootMargin: '0px 0px 25% 0px' })
	useMotionInView(svgRef, 'fade-up', { threshold: 0.1, rootMargin: '0px 0px 20% 0px' })
	useMotionInView(cardsRef, 'fade-up', { threshold: 0.1, rootMargin: '0px 0px 20% 0px' })

	return (
		<section
			ref={sectionRef}
			id="learningJourney"
			className="flex w-full flex-col px-4 py-24 sm:px-16 md:px-16 lg:px-24 2xl:px-72"
		>
			<div className="mx-auto flex w-full max-w-5xl flex-col px-4 sm:px-6 lg:px-8">
				<SectionHeader
					number="02.5"
					title={flightPathSection.title}
					headerRef={headerRef}
					className="mb-8"
				/>

				{/* SVG Visualization */}
				<div
					ref={svgRef}
					className="mb-12 flex justify-center"
				>
					<FlightPathSVG />
				</div>

				{/* Cards Grid */}
				<div
					ref={cardsRef}
					className="grid gap-8 lg:grid-cols-2"
				>
					{/* Education Column */}
					<div>
						<h3 className="font-heading text-text-primary mb-4 flex items-center gap-2 text-lg font-semibold">
							<span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/10">
								<svg
									className="h-3.5 w-3.5 text-amber-600"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								>
									<path d="M22 10v6M2 10l10-5 10 5-10 5z" />
									<path d="M6 12v5c0 1.5 2.5 3 6 3s6-1.5 6-3v-5" />
								</svg>
							</span>
							{flightPathSection.education.title}
						</h3>
						<div className="flex flex-col gap-4">
							{flightPathSection.education.items.map((item, index) => (
								<EducationCard
									key={index}
									item={item}
								/>
							))}
						</div>
					</div>

					{/* Certifications Column */}
					<div>
						<h3 className="font-heading text-text-primary mb-4 flex items-center gap-2 text-lg font-semibold">
							<span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/10">
								<svg
									className="h-3.5 w-3.5 text-indigo-600"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								>
									<circle
										cx="12"
										cy="8"
										r="6"
									/>
									<path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
								</svg>
							</span>
							{flightPathSection.certifications.title}
						</h3>
						<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
							{flightPathSection.certifications.items.map((item, index) => (
								<CertificationCard
									key={index}
									item={item}
								/>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
