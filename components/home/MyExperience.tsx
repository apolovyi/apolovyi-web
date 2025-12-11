import React, { useRef, useState } from 'react'

import ArrowIcon from '@/components/icons/ArrowIcon'
import { useDictionary } from '@/components/shared/DictionaryContext'
import SectionHeader from '@/components/shared/SectionHeader'
import { useHoverTapMotion } from '@/components/shared/useHoverTapMotion'
import { useMotionInView } from '@/components/shared/useMotionInView'

interface Company {
	name: string
	key: string
}

const companies: Company[] = [
	{ name: 'Flowable Mimacom Group', key: 'Flowable' },
	{ name: 'The Bicester Collection', key: 'TheBicesterCollection' },
	{ name: 'Virtual Identity AG', key: 'VirtualIdentityAG' },
	{ name: 'SmartDorm', key: 'SmartDorm' },
	{ name: 'Spreadshirt', key: 'Spreadshirt' },
	{ name: 'Comsysto Reply GmbH', key: 'ComsystoReplyGmbH' },
	{ name: 'Blookery', key: 'Blookery' },
	{ name: 'SilverTours GmbH', key: 'SilverToursGmbH' },
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

interface JobDescriptionProps {
	company: string
}

const JobDescription = ({ company }: JobDescriptionProps) => {
	const dictionary = useDictionary()
	const job = dictionary.experienceSection.roles[company as keyof typeof dictionary.experienceSection.roles]

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
					<span className="font-body text-lg font-semibold text-text-primary">{job.title}</span>
					<span className="text-base text-accent-coral lg:ml-2 lg:text-lg">
						@ {companies.find((c) => c.key === company)?.name || company}
					</span>
				</div>
				<p className="mt-2 font-tech text-sm text-text-secondary">{job.date}</p>
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
