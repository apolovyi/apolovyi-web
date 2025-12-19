'use client'

import { useEffect } from 'react'

import { AnimatePresence, motion } from 'motion/react'

import ArrowIcon from '@/components/icons/ArrowIcon'
import { useDictionary } from '@/components/shared/DictionaryContext'
import { HighlightedText } from '@/components/shared/HighlightedText'

import { type DisplayMetric, dictionaryKeyToStationId, getExperienceCompanies, getStationById, getStationMetrics } from '@/lib/career-data'

import { SBB_COLORS } from './constants'

interface StationDetailModalProps {
	activeStation: string | null
	isOpen: boolean
	onClose: () => void
}

const companies = getExperienceCompanies()

const CloseIcon = ({ className }: { className?: string }) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		className={className}
	>
		<path d="M18 6L6 18M6 6l12 12" />
	</svg>
)

const LocationPinIcon = ({ className }: { className?: string }) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		className={className}
	>
		<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
		<circle
			cx="12"
			cy="10"
			r="3"
		/>
	</svg>
)

const MetricIcon = ({ type, className }: { type: DisplayMetric['icon']; className?: string }) => {
	const paths: Record<DisplayMetric['icon'], string> = {
		speed: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
		efficiency: 'M22 12h-4l-3 9L9 3l-3 9H2',
		code: 'M16 18l6-6-6-6M8 6l-6 6 6 6',
		scale: 'M3 3h18v18H3zM3 9h18M9 21V9',
		compliance: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4',
		data: 'M12 5a9 3 0 0 1 9 3v8a9 3 0 0 1-9 3 9 3 0 0 1-9-3V8a9 3 0 0 1 9-3z',
	}
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			className={className}
		>
			<path d={paths[type]} />
		</svg>
	)
}

export function StationDetailModal({ activeStation, isOpen, onClose }: StationDetailModalProps) {
	const dictionary = useDictionary()

	// Lock body scroll when modal is open
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = ''
		}
		return () => {
			document.body.style.overflow = ''
		}
	}, [isOpen])

	// Close on escape key
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose()
		}
		if (isOpen) {
			document.addEventListener('keydown', handleEscape)
			return () => document.removeEventListener('keydown', handleEscape)
		}
	}, [isOpen, onClose])

	if (!activeStation) return null

	const job = dictionary.experienceSection.roles[activeStation as keyof typeof dictionary.experienceSection.roles]
	const companyData = companies.find((c) => c.key === activeStation)
	const stationId = dictionaryKeyToStationId(activeStation)
	const station = getStationById(stationId)
	const metrics = getStationMetrics(activeStation)

	if (!job) return null

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Backdrop */}
					<motion.div
						className="fixed inset-0 z-[60] bg-black/50"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
					/>

					{/* Modal */}
					<motion.div
						className="bg-background-primary fixed right-0 bottom-0 left-0 z-[70] max-h-[85vh] overflow-hidden rounded-t-2xl"
						style={{ boxShadow: '0 -4px 30px rgba(0,0,0,0.25)' }}
						initial={{ y: '100%' }}
						animate={{ y: 0 }}
						exit={{ y: '100%' }}
						transition={{ type: 'spring', damping: 30, stiffness: 200, mass: 0.8 }}
					>
						{/* Header */}
						<div className="bg-background-primary sticky top-0 z-10 px-4 pt-4 pb-3">
							{/* Drag handle */}
							<div className="mb-3 flex justify-center">
								<div className="bg-text-secondary/20 h-1 w-10 rounded-full" />
							</div>

							<div className="flex items-start justify-between gap-3">
								<div className="min-w-0 flex-1">
									<div className="flex items-center gap-2">
										<span
											className="h-3 w-3 flex-shrink-0 rounded-full"
											style={{ backgroundColor: SBB_COLORS.red }}
										/>
										<h2 className="font-body text-text-primary truncate text-lg font-semibold">{job.title}</h2>
									</div>
									<p className="text-accent-coral ml-5 text-base">@ {companyData?.name || activeStation}</p>
									<div className="text-text-secondary mt-1 ml-5 flex items-center gap-3">
										<span className="font-tech text-sm">{job.date}</span>
										{companyData?.location && (
											<span className="font-tech flex items-center gap-1 text-sm">
												<LocationPinIcon className="h-4 w-4" />
												{companyData.location}
											</span>
										)}
									</div>
								</div>

								{/* Close button */}
								<button
									onClick={onClose}
									className="text-text-secondary hover:bg-background-secondary active:bg-background-secondary rounded-full p-2"
									aria-label="Close"
								>
									<CloseIcon className="h-5 w-5" />
								</button>
							</div>
						</div>

						{/* Scrollable content */}
						<div className="overflow-y-auto px-4 pt-2 pb-8">
							{/* Technologies */}
							{station?.technologies && station.technologies.length > 0 && (
								<div className="mb-4 flex flex-wrap gap-2">
									{station.technologies.map((tech) => (
										<span
											key={tech}
											className="bg-accent-coral/10 font-tech text-accent-coral rounded-md px-2.5 py-1 text-xs"
										>
											{tech}
										</span>
									))}
								</div>
							)}

							{/* Metrics */}
							{metrics.length > 0 && (
								<div className="mb-5 flex flex-wrap gap-2">
									{metrics.map((metric) => (
										<div
											key={`${metric.icon}-${metric.value}`}
											className="border-accent-coral/20 bg-accent-coral/5 flex items-center gap-1.5 rounded-md border px-2.5 py-1.5"
										>
											<MetricIcon
												type={metric.icon}
												className="text-accent-coral h-4 w-4"
											/>
											<span className="font-tech text-sm">
												<span className="text-accent-coral font-bold">{metric.value}</span>
												<span className="text-accent-coral/70 ml-1">{metric.label}</span>
											</span>
										</div>
									))}
								</div>
							)}

							{/* Tasks */}
							<ul className="space-y-3">
								{job.tasks.map((task: { text: string; keywords: string[] }, index: number) => (
									<li
										key={index}
										className="flex items-start gap-2"
									>
										<ArrowIcon className="text-accent-coral mt-1 h-4 w-4 flex-none" />
										<HighlightedText
											text={task.text}
											terms={task.keywords}
											className="text-text-secondary text-sm leading-relaxed"
											highlightClassName="text-accent-coral"
										/>
									</li>
								))}
							</ul>

							{/* URL */}
							{job.url && (
								<a
									href={job.url}
									target="_blank"
									rel="noopener noreferrer"
									className="font-tech text-accent-coral mt-4 block text-sm hover:underline"
								>
									{job.url}
								</a>
							)}
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	)
}
