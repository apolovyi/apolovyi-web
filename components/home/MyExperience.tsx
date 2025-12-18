import React, { useRef, useState } from 'react'

import { CareerMetroMap } from '@/components/home/CareerMetroMap'
import ArrowIcon from '@/components/icons/ArrowIcon'
import { useDictionary } from '@/components/shared/DictionaryContext'
import SectionHeader from '@/components/shared/SectionHeader'
import { useMotionInView } from '@/components/shared/useMotionInView'
import { WorldMap } from '@/components/ui/world-map'

import {
	type DisplayMetric,
	type ExperienceCompany,
	getExperienceCompanies,
	getStationMetrics,
	getTravelJourneyDots,
} from '@/lib/career-data'

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
			<div className="mx-auto flex w-full max-w-5xl flex-col px-4 sm:px-6 lg:px-8 2xl:max-w-6xl">
				<SectionHeader
					number="02."
					title={experienceSectionTitle}
					headerRef={headerRef}
					className="mb-8"
				/>

				{/* Metro Map - All screen sizes (scrollable on mobile) */}
				<div
					ref={leftColRef}
					className="mb-4 overflow-x-hidden lg:mb-6 lg:overflow-visible"
				>
					<CareerMetroMap
						activeStation={activeCompany}
						onStationSelect={setActiveCompany}
					/>
				</div>

				{/* Job description - hidden on mobile since bottom sheet shows it */}
				<div
					ref={rightColRef}
					className="mt-0 hidden sm:block"
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

const MetricIcon = ({ type, className }: { type: DisplayMetric['icon']; className?: string }) => {
	const icons: Record<DisplayMetric['icon'], React.ReactNode> = {
		speed: (
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				className={className}
			>
				<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
			</svg>
		),
		efficiency: (
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				className={className}
			>
				<path d="M22 12h-4l-3 9L9 3l-3 9H2" />
			</svg>
		),
		code: (
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				className={className}
			>
				<polyline points="16 18 22 12 16 6" />
				<polyline points="8 6 2 12 8 18" />
			</svg>
		),
		scale: (
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				className={className}
			>
				<rect
					x="3"
					y="3"
					width="18"
					height="18"
					rx="2"
				/>
				<path d="M3 9h18M9 21V9" />
			</svg>
		),
		compliance: (
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				className={className}
			>
				<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
				<path d="M9 12l2 2 4-4" />
			</svg>
		),
		data: (
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				className={className}
			>
				<ellipse
					cx="12"
					cy="5"
					rx="9"
					ry="3"
				/>
				<path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
				<path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
			</svg>
		),
	}
	return <>{icons[type]}</>
}

const ImpactMetrics = ({ metrics }: { metrics: DisplayMetric[] }) => {
	if (metrics.length === 0) return null

	return (
		<div
			className="flex flex-wrap gap-3"
			role="group"
			aria-label="Key achievements"
		>
			{metrics.map((metric) => (
				<div
					key={`${metric.icon}-${metric.value}`}
					className="flex items-center gap-2 rounded-lg border border-accent-coral/20 bg-accent-coral/5 px-3 py-2"
				>
					<MetricIcon
						type={metric.icon}
						className="h-4 w-4 flex-shrink-0 text-accent-coral"
					/>
					<span className="font-tech">
						<span className="text-base font-bold text-accent-coral">{metric.value}</span>
						<span className="ml-1 text-sm text-accent-coral/70">{metric.label}</span>
					</span>
				</div>
			))}
		</div>
	)
}

interface JobDescriptionProps {
	company: string
}

const JobDescription = ({ company }: JobDescriptionProps) => {
	const dictionary = useDictionary()
	const job = dictionary.experienceSection.roles[company as keyof typeof dictionary.experienceSection.roles]
	const companyData = companies.find((c) => c.key === company)
	const isCareerBreak = company === 'CareerBreak'
	const metrics = getStationMetrics(company)

	const highlightKeywords = (text: string, keywords: string[]) => {
		let highlightedText = text
		keywords.forEach((keyword) => {
			const regex = new RegExp(keyword, 'gi')
			highlightedText = highlightedText.replace(regex, (match) => `<span class="text-accent-coral">${match}</span>`)
		})
		return highlightedText
	}

	return (
		<div className="flex min-h-[350px] flex-col space-y-4 2xl:px-4">
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
			{metrics.length > 0 && (
				<div className="pt-1">
					<ImpactMetrics metrics={metrics} />
				</div>
			)}
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
				<div className="shadow-xs mt-4 overflow-hidden rounded-lg border border-neutral-light-gray bg-background-secondary">
					<div className="aspect-[2/1] w-full">
						<WorldMap dots={getTravelJourneyDots()} />
					</div>
					<div className="bg-background-primary/50 border-t border-neutral-light-gray px-3 py-2">
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
