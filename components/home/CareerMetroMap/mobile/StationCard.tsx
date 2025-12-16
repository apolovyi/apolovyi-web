'use client'

import { AnimatePresence, motion } from 'motion/react'

import { useDictionary } from '@/components/shared/DictionaryContext'

import { dictionaryKeyToStationId, getExperienceCompanies, getStationById } from '@/lib/career-data'

import { SBB_COLORS } from './constants'

interface StationCardProps {
	activeStation: string | null
	onCardTap: () => void
}

const companies = getExperienceCompanies()

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

const ChevronUpIcon = ({ className }: { className?: string }) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		className={className}
	>
		<path d="M18 15l-6-6-6 6" />
	</svg>
)

export function StationCard({ activeStation, onCardTap }: StationCardProps) {
	const dictionary = useDictionary()

	if (!activeStation) {
		return (
			<div className="fixed bottom-0 left-0 right-0 z-50 bg-background-primary/95 px-4 py-4 text-center backdrop-blur-sm">
				<p className="font-tech text-sm text-text-secondary">Tap a station to see details</p>
			</div>
		)
	}

	const job = dictionary.experienceSection.roles[activeStation as keyof typeof dictionary.experienceSection.roles]
	const companyData = companies.find((c) => c.key === activeStation)
	const stationId = dictionaryKeyToStationId(activeStation)
	const station = getStationById(stationId)

	if (!job) {
		return null
	}

	// Get first 3 technologies for the compact view
	const techTags = station?.technologies?.slice(0, 3) || []
	const totalTechCount = station?.technologies?.length || 0

	return (
		<AnimatePresence mode="popLayout">
			<motion.button
				key={activeStation}
				onClick={onCardTap}
				className="fixed bottom-0 left-0 right-0 z-50 touch-manipulation text-left active:bg-background-secondary/50"
				initial={{ y: 80, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				exit={{ y: 60, opacity: 0 }}
				transition={{ type: 'spring', stiffness: 400, damping: 30 }}
			>
				<div
					className="rounded-t-2xl bg-background-primary px-4 pb-4 pt-3"
					style={{ boxShadow: '0 -4px 20px rgba(0,0,0,0.15)' }}
				>
					{/* Drag handle / tap indicator */}
					<div className="mb-2 flex justify-center">
						<div className="h-1 w-8 rounded-full bg-text-secondary/20" />
					</div>

					{/* Main content */}
					<div className="flex items-start justify-between gap-3">
						<div className="min-w-0 flex-1">
							{/* Title & Company */}
							<div className="flex items-center gap-2">
								<span
									className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
									style={{ backgroundColor: SBB_COLORS.red }}
								/>
								<span className="truncate font-body text-sm font-semibold text-text-primary">{job.title}</span>
							</div>
							<p className="ml-[18px] truncate text-sm text-accent-coral">@ {companyData?.name || activeStation}</p>

							{/* Date & Location */}
							<div className="ml-[18px] mt-1 flex items-center gap-3 text-text-secondary">
								<span className="font-tech text-xs">{job.date}</span>
								{companyData?.location && (
									<span className="flex items-center gap-1 font-tech text-xs">
										<LocationPinIcon className="h-3 w-3" />
										{companyData.location}
									</span>
								)}
							</div>

							{/* Tech tags */}
							{techTags.length > 0 && (
								<div className="ml-[18px] mt-2 flex flex-wrap gap-1.5">
									{techTags.map((tech) => (
										<span
											key={tech}
											className="rounded bg-accent-coral/10 px-2 py-0.5 font-tech text-[11px] text-accent-coral"
										>
											{tech}
										</span>
									))}
									{totalTechCount > 3 && (
										<span className="rounded bg-text-secondary/10 px-2 py-0.5 font-tech text-[11px] text-text-secondary">
											+{totalTechCount - 3}
										</span>
									)}
								</div>
							)}
						</div>

						{/* Tap for more indicator */}
						<div className="flex flex-col items-center gap-0.5 text-text-secondary/60">
							<ChevronUpIcon className="h-5 w-5" />
							<span className="font-tech text-[10px]">More</span>
						</div>
					</div>
				</div>
			</motion.button>
		</AnimatePresence>
	)
}
