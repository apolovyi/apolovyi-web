import React, { useRef, useState } from 'react'

import { CareerMetroMap } from '@/components/home/CareerMetroMap'
import ArrowIcon from '@/components/icons/ArrowIcon'
import { useDictionary } from '@/components/shared/DictionaryContext'
import SectionHeader from '@/components/shared/SectionHeader'
import { useMotionInView } from '@/components/shared/useMotionInView'
import { WorldMap } from '@/components/ui/world-map'

import { type ExperienceCompany, getExperienceCompanies, getTravelJourneyDots } from '@/lib/career-data'

const companies: ExperienceCompany[] = getExperienceCompanies()

const MyExperience = () => {
	const dictionary = useDictionary()
	const experienceSectionTitle = dictionary.experienceSection.title
	const [activeCompany, setActiveCompany] = useState(companies[0].key)
	const sectionRef = useRef<HTMLElement>(null)
	const headerRef = useRef<HTMLElement>(null)
	const leftColRef = useRef<HTMLDivElement>(null)
	const rightColRef = useRef<HTMLDivElement>(null)
	useMotionInView(sectionRef, 'fade-up', { mode: 'toggle' })
	useMotionInView(headerRef, 'fade-up', { mode: 'toggle' })
	useMotionInView(leftColRef, 'fade-right', { mode: 'toggle' })
	useMotionInView(rightColRef, 'fade-left', { mode: 'toggle' })

	return (
		<section
			ref={sectionRef}
			id="experienceSection"
			className="flex w-full flex-col space-y-12 px-4 py-32 sm:px-16 md:px-16 lg:px-24 xl:space-y-28 2xl:px-72"
		>
			<div className="mx-auto flex w-full max-w-5xl flex-col px-4 sm:px-6 lg:px-8">
				<SectionHeader
					number="02."
					title={experienceSectionTitle}
					headerRef={headerRef}
					className="mb-8"
				/>

				{/* Metro Map - All screen sizes (scrollable on mobile) */}
				<div
					ref={leftColRef}
					className="mb-4 lg:mb-6"
				>
					<CareerMetroMap
						activeStation={activeCompany}
						onStationSelect={setActiveCompany}
					/>
				</div>

				<div
					ref={rightColRef}
					className="mt-0"
				>
					<JobDescription company={activeCompany} />
				</div>
			</div>
		</section>
	)
}

const LocationPinIcon = ({ className }: { className?: string }) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
		aria-hidden="true"
	>
		<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
		<circle
			cx="12"
			cy="10"
			r="3"
		/>
	</svg>
)

const GlobeIcon = ({ className }: { className?: string }) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
		aria-hidden="true"
	>
		<circle
			cx="12"
			cy="12"
			r="10"
		/>
		<path d="M2 12h20" />
		<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
	</svg>
)

interface JobDescriptionProps {
	company: string
}

const JobDescription = ({ company }: JobDescriptionProps) => {
	const dictionary = useDictionary()
	const job = dictionary.experienceSection.roles[company as keyof typeof dictionary.experienceSection.roles]
	const companyData = companies.find((c) => c.key === company)
	const isCareerBreak = company === 'CareerBreak'

	const highlightKeywords = (text: string, keywords: string[]) => {
		let highlightedText = text
		keywords.forEach((keyword) => {
			const regex = new RegExp(keyword, 'gi')
			highlightedText = highlightedText.replace(regex, (match) => `<span class="text-accent-coral">${match}</span>`)
		})
		return highlightedText
	}

	return (
		<div className="flex min-h-[350px] flex-col space-y-4">
			<div>
				<div className="flex flex-col lg:flex-row lg:items-center">
					{isCareerBreak && <GlobeIcon className="mb-2 h-6 w-6 text-accent-coral lg:mb-0 lg:mr-2" />}
					<span className="font-body text-lg font-semibold text-text-primary">{job.title}</span>
					{!isCareerBreak && <span className="text-base text-accent-coral lg:ml-2 lg:text-lg">@ {companyData?.name || company}</span>}
				</div>
				{job.subtitle && <p className="mt-1 font-tech text-xs italic text-text-secondary">{job.subtitle}</p>}
				<div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
					<p className="font-tech text-sm text-text-secondary">{job.date}</p>
					{companyData?.location && (
						<span className="flex items-center gap-1 font-tech text-sm text-neutral-medium-gray">
							{isCareerBreak ? <GlobeIcon className="h-3.5 w-3.5" /> : <LocationPinIcon className="h-3.5 w-3.5" />}
							{companyData.location}
						</span>
					)}
				</div>
				{job.url ? (
					<a
						href={job.url}
						target="_blank"
						rel="noopener noreferrer"
						className="font-tech text-xs text-accent-coral hover:underline"
					>
						{job.url}
					</a>
				) : null}
			</div>
			<ul className="space-y-2">
				{job.tasks.map((task: { text: string; keywords: string[] }, index: number) => (
					<li
						key={index}
						className="flex items-start space-x-2"
					>
						<ArrowIcon className="mt-1 h-5 w-4 flex-none text-accent-coral" />
						<span
							className="text-sm text-text-secondary lg:text-base"
							dangerouslySetInnerHTML={{
								__html: highlightKeywords(task.text, task.keywords),
							}}
						/>
					</li>
				))}
			</ul>

			{/* Travel map for career break */}
			{isCareerBreak && (
				<div className="mt-4 overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900/50">
					<div className="aspect-[2/1] w-full">
						<WorldMap dots={getTravelJourneyDots()} />
					</div>
					<div className="border-t border-neutral-800 px-3 py-2">
						<p className="font-tech text-xs text-text-secondary">
							11 countries visited: Greece, Egypt, South Africa, Zambia, Zimbabwe, Fiji, Australia, Chile, Argentina, Colombia, Ecuador
						</p>
					</div>
				</div>
			)}
		</div>
	)
}

export default MyExperience
