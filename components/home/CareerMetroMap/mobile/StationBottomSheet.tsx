'use client'

import { useEffect, useRef, useState } from 'react'

import { AnimatePresence, motion } from 'motion/react'

import ArrowIcon from '@/components/icons/ArrowIcon'
import { useDictionary } from '@/components/shared/DictionaryContext'

import { type DisplayMetric, getExperienceCompanies, getStationMetrics } from '@/lib/career-data'

import { ANIMATION_CONFIG, BOTTOM_SHEET_CONFIG, SBB_COLORS } from './constants'

interface StationBottomSheetProps {
	activeStation: string | null
	onAutoScroll?: () => void
}

const companies = getExperienceCompanies()

// Simple icons
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

const ChevronIcon = ({ className, isExpanded }: { className?: string; isExpanded: boolean }) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		className={className}
		style={{
			transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
			transition: 'transform 0.2s ease',
		}}
	>
		<path d="M18 15l-6-6-6 6" />
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

export function StationBottomSheet({ activeStation, onAutoScroll }: StationBottomSheetProps) {
	const [isExpanded, setIsExpanded] = useState(false)
	const dictionary = useDictionary()
	const sheetRef = useRef<HTMLDivElement>(null)

	// Auto-expand and trigger auto-scroll when station changes
	useEffect(() => {
		if (activeStation) {
			// Auto-expand to show job details immediately
			setIsExpanded(true)
			// Trigger auto-scroll callback
			if (onAutoScroll) {
				// Small delay to let the bottom sheet animate in
				setTimeout(() => onAutoScroll(), 100)
			}
		} else {
			setIsExpanded(false)
		}
	}, [activeStation, onAutoScroll])

	// Close on outside click when expanded
	useEffect(() => {
		if (!isExpanded) return

		const handleClick = (e: MouseEvent) => {
			if (sheetRef.current && !sheetRef.current.contains(e.target as Node)) {
				setIsExpanded(false)
			}
		}

		document.addEventListener('mousedown', handleClick)
		return () => document.removeEventListener('mousedown', handleClick)
	}, [isExpanded])

	if (!activeStation) {
		return (
			<div className="fixed bottom-0 left-0 right-0 z-50 bg-background-primary/95 px-4 py-3 text-center backdrop-blur-sm">
				<p className="font-tech text-sm text-text-secondary">Tap a station to see details</p>
			</div>
		)
	}

	const job = dictionary.experienceSection.roles[activeStation as keyof typeof dictionary.experienceSection.roles]
	const companyData = companies.find((c) => c.key === activeStation)
	const metrics = getStationMetrics(activeStation)

	if (!job) {
		return null
	}

	const highlightKeywords = (text: string, keywords: string[]) => {
		let highlightedText = text
		keywords.forEach((keyword) => {
			const regex = new RegExp(keyword, 'gi')
			highlightedText = highlightedText.replace(regex, (match) => `<span class="text-accent-coral">${match}</span>`)
		})
		return highlightedText
	}

	return (
		<motion.div
			ref={sheetRef}
			className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl bg-background-primary shadow-2xl"
			style={{
				boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
			}}
			initial={{ y: '100%' }}
			animate={{
				y: 0,
				height: isExpanded ? BOTTOM_SHEET_CONFIG.expandedHeight : BOTTOM_SHEET_CONFIG.collapsedHeight,
			}}
			transition={{
				duration: ANIMATION_CONFIG.bottomSheetExpand / 1000,
				ease: 'easeOut',
			}}
		>
			{/* Tappable header area - entire collapsed section is clickable to expand */}
			<button
				onClick={() => setIsExpanded(!isExpanded)}
				className="block w-full touch-manipulation text-left active:bg-background-secondary/50"
				aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
				aria-expanded={isExpanded}
			>
				{/* Drag handle indicator */}
				<div className="flex justify-center pb-1 pt-2">
					<div className="h-1 w-8 rounded-full bg-text-secondary/20" />
				</div>

				{/* Header content */}
				<div className="px-4 pb-2">
					<div className="flex items-start justify-between">
						<div className="flex-1">
							<div className="flex items-center gap-2">
								<span
									className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
									style={{ backgroundColor: SBB_COLORS.red }}
								/>
								<span className="font-body text-sm font-semibold leading-tight text-text-primary">{job.title}</span>
							</div>
							<p className="ml-[18px] text-sm text-accent-coral">@ {companyData?.name || activeStation}</p>
							<div className="ml-[18px] mt-0.5 flex items-center gap-2 text-text-secondary">
								<span className="font-tech text-xs">{job.date}</span>
								{companyData?.location && (
									<span className="flex items-center gap-1 font-tech text-xs">
										<LocationPinIcon className="h-3 w-3" />
										{companyData.location}
									</span>
								)}
							</div>
						</div>
						{/* Expand/collapse indicator */}
						<ChevronIcon
							className="h-5 w-5 flex-shrink-0 text-text-secondary/60"
							isExpanded={isExpanded}
						/>
					</div>
				</div>
			</button>

			{/* Expanded content - NOT inside the button so it's scrollable */}
			<AnimatePresence>
				{isExpanded && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="overflow-y-auto px-4 pb-4"
						style={{ maxHeight: BOTTOM_SHEET_CONFIG.expandedHeight - 100 }}
					>
						{/* Metrics */}
						{metrics.length > 0 && (
							<div className="mb-4 flex flex-wrap gap-2">
								{metrics.map((metric) => (
									<div
										key={`${metric.icon}-${metric.value}`}
										className="flex items-center gap-1.5 rounded-md border border-accent-coral/20 bg-accent-coral/5 px-2 py-1"
									>
										<MetricIcon
											type={metric.icon}
											className="h-3.5 w-3.5 text-accent-coral"
										/>
										<span className="font-tech text-xs">
											<span className="font-bold text-accent-coral">{metric.value}</span>
											<span className="ml-1 text-accent-coral/70">{metric.label}</span>
										</span>
									</div>
								))}
							</div>
						)}

						{/* Tasks */}
						<ul className="space-y-2">
							{job.tasks.map((task: { text: string; keywords: string[] }, index: number) => (
								<li
									key={index}
									className="flex items-start gap-2"
								>
									<ArrowIcon className="mt-0.5 h-4 w-4 flex-none text-accent-coral" />
									<span
										className="text-sm text-text-secondary"
										dangerouslySetInnerHTML={{
											__html: highlightKeywords(task.text, task.keywords),
										}}
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
								className="mt-3 block font-tech text-xs text-accent-coral hover:underline"
							>
								{job.url}
							</a>
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	)
}
