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
			<div className="bg-background-primary/95 fixed right-0 bottom-0 left-0 z-50 px-4 py-4 text-center backdrop-blur-xs">
				<p className="font-tech text-text-secondary text-sm">Tap a station to see details</p>
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
				className="active:bg-background-secondary/50 fixed right-0 bottom-0 left-0 z-50 touch-manipulation text-left"
				initial={{ y: 80, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				exit={{ y: 60, opacity: 0 }}
				transition={{ type: 'spring', stiffness: 400, damping: 30 }}
			>
				<div
					className="bg-background-primary rounded-t-2xl px-4 pt-3 pb-4"
					style={{ boxShadow: '0 -4px 20px rgba(0,0,0,0.15)' }}
				>
					{/* Drag handle / tap indicator */}
					<div className="mb-2 flex justify-center">
						<div className="bg-text-secondary/20 h-1 w-8 rounded-full" />
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
								<span className="font-body text-text-primary truncate text-sm font-semibold">{job.title}</span>
							</div>
							<p className="text-accent-coral ml-[18px] truncate text-sm">@ {companyData?.name || activeStation}</p>

							{/* Date & Location */}
							<div className="text-text-secondary mt-1 ml-[18px] flex items-center gap-3">
								<span className="font-tech text-xs">{job.date}</span>
								{companyData?.location && (
									<span className="font-tech flex items-center gap-1 text-xs">
										<LocationPinIcon className="h-3 w-3" />
										{companyData.location}
									</span>
								)}
							</div>

							{/* Tech tags */}
							{techTags.length > 0 && (
								<div className="mt-2 ml-[18px] flex flex-wrap gap-1.5">
									{techTags.map((tech) => (
										<span
											key={tech}
											className="bg-accent-coral/10 font-tech text-accent-coral rounded-sm px-2 py-0.5 text-[11px]"
										>
											{tech}
										</span>
									))}
									{totalTechCount > 3 && (
										<span className="bg-text-secondary/10 font-tech text-text-secondary rounded-sm px-2 py-0.5 text-[11px]">
											+{totalTechCount - 3}
										</span>
									)}
								</div>
							)}
						</div>

						{/* Tap for more indicator */}
						<div className="text-text-secondary/60 flex flex-col items-center gap-0.5">
							<ChevronUpIcon className="h-5 w-5" />
							<span className="font-tech text-[10px]">More</span>
						</div>
					</div>
				</div>
			</motion.button>
		</AnimatePresence>
	)
}
