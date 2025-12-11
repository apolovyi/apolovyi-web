import React, { useRef, useState } from 'react'

import ArrowIcon from '@/components/icons/ArrowIcon'
import { useDictionary } from '@/components/shared/DictionaryContext'
import SectionHeader from '@/components/shared/SectionHeader'
import { useHoverTapMotion } from '@/components/shared/useHoverTapMotion'
import { useMotionInView } from '@/components/shared/useMotionInView'

interface Company {
	name: string
	key: string
	location: string
}

const companies: Company[] = [
	{ name: 'PEAX AG', key: 'PEAX', location: 'Zurich, CH' },
	{ name: 'Flowable Mimacom Group', key: 'Flowable', location: 'Zurich, CH' },
	{ name: 'The Bicester Collection', key: 'TheBicesterCollection', location: 'London, UK' },
	{ name: 'Career Break', key: 'CareerBreak', location: '11 Countries' },
	{ name: 'Virtual Identity AG', key: 'VirtualIdentityAG', location: 'Munich, DE' },
	{ name: 'SmartDorm', key: 'SmartDorm', location: 'Munich, DE' },
	{ name: 'Spreadshirt', key: 'Spreadshirt', location: 'Leipzig, DE' },
	{ name: 'Comsysto Reply GmbH', key: 'ComsystoReplyGmbH', location: 'Munich, DE' },
	{ name: 'Blookery', key: 'Blookery', location: 'Cologne, DE' },
	{ name: 'SilverTours GmbH', key: 'SilverToursGmbH', location: 'Cologne, DE' },
]

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

				<div className="flex flex-col md:flex-row md:space-x-8">
					<div ref={leftColRef}>
						<CompaniesBar
							companies={companies}
							activeCompany={activeCompany}
							setActiveCompany={setActiveCompany}
						/>
					</div>
					<div
						ref={rightColRef}
						className="mt-6 md:mt-0"
					>
						<JobDescription company={activeCompany} />
					</div>
				</div>
			</div>
		</section>
	)
}

interface CompaniesBarProps {
	companies: Company[]
	activeCompany: string
	setActiveCompany: (key: string) => void
}

const CompaniesBar = ({ companies, activeCompany, setActiveCompany }: CompaniesBarProps) => {
	return (
		<div className="mb-4 flex overflow-x-auto md:mb-0 md:flex-col md:overflow-x-visible">
			{companies.map((company) => (
				<CompanyButton
					key={company.key}
					isActive={activeCompany === company.key}
					onClick={() => setActiveCompany(company.key)}
					companyName={company.name}
				/>
			))}
		</div>
	)
}

interface CompanyButtonProps {
	isActive: boolean
	onClick: () => void
	companyName: string
}

const CompanyButton = ({ isActive, onClick, companyName }: CompanyButtonProps) => {
	const ref = React.useRef<HTMLButtonElement>(null)
	useHoverTapMotion(ref)
	return (
		<button
			ref={ref}
			onClick={onClick}
			className={`whitespace-nowrap px-4 py-2 text-sm transition-colors duration-300 md:text-left lg:text-base ${
				isActive
					? 'bg-accent-coral text-background-primary'
					: 'text-text-secondary hover:bg-accent-coral hover:bg-opacity-10 hover:text-accent-coral'
			}`}
			aria-pressed={isActive}
		>
			{companyName}
		</button>
	)
}

// Simple location pin icon
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

// Globe icon for travel/career break
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
		</div>
	)
}

export default MyExperience
