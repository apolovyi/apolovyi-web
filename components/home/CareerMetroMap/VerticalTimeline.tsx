'use client'

import { motion } from 'motion/react'

import { type MetroLineId, lines, stationIdToDictionaryKey, stations } from '@/lib/career-data'
import { cn } from '@/lib/utils'

interface VerticalTimelineProps {
	activeStation: string | null
	onStationSelect: (stationId: string) => void
	visibleLines: MetroLineId[]
}

// Get color for a line
function getLineColor(lineId: MetroLineId): string {
	return lines.find((l) => l.id === lineId)?.color || '#888'
}

export function VerticalTimeline({ activeStation, onStationSelect, visibleLines }: VerticalTimelineProps) {
	// Sort stations chronologically (most recent first for mobile)
	const sortedStations = [...stations]
		.filter((s) => s.lines.some((l) => visibleLines.includes(l)))
		.sort((a, b) => {
			// Parse dates for comparison - most recent first
			const parseDate = (dateStr: string) => {
				if (dateStr.toLowerCase() === 'present') return new Date()
				const [month, year] = dateStr.split(' ')
				const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(month)
				return new Date(parseInt(year), monthIndex)
			}
			return parseDate(b.period.start).getTime() - parseDate(a.period.start).getTime()
		})

	return (
		<div className="relative pl-6">
			{/* Vertical connecting line */}
			<div className="absolute bottom-2 left-2 top-2 w-0.5 bg-gradient-to-b from-text-secondary/30 via-text-secondary/20 to-text-secondary/10" />

			{/* Stations */}
			<div className="space-y-3">
				{sortedStations.map((station, index) => {
					const dictionaryKey = stationIdToDictionaryKey(station.id)
					const isActive = activeStation === dictionaryKey
					const primaryColor = getLineColor(station.lines[0])
					const isCurrentJob = station.period.end.toLowerCase() === 'present'

					return (
						<motion.button
							key={station.id}
							initial={{ opacity: 0, x: -10 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: index * 0.05 }}
							onClick={() => onStationSelect(dictionaryKey)}
							className={cn(
								'relative flex w-full items-start gap-3 rounded-lg p-2 text-left transition-all',
								'hover:bg-background-secondary/50',
								isActive && 'bg-background-secondary/70',
							)}
						>
							{/* Node dot */}
							<div
								className={cn(
									'relative z-10 mt-1.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full',
									isActive ? 'ring-2 ring-offset-1 ring-offset-background-primary' : '',
								)}
								style={{
									backgroundColor: isActive ? primaryColor : 'transparent',
									borderColor: primaryColor,
									borderWidth: 2,
									borderStyle: 'solid',
									// Ring color applied via CSS custom property
									['--tw-ring-color' as string]: primaryColor,
								}}
							>
								{/* Pulse for current job */}
								{isCurrentJob && !isActive && (
									<span
										className="absolute inset-0 animate-ping rounded-full opacity-40"
										style={{ backgroundColor: primaryColor }}
									/>
								)}
							</div>

							{/* Content */}
							<div className="min-w-0 flex-1">
								<div className="flex items-center gap-2">
									<span className={cn('font-tech text-xs font-medium', isActive ? 'text-text-primary' : 'text-text-secondary')}>
										{station.company}
									</span>
									{isCurrentJob && (
										<span className="bg-accent-primary/20 text-accent-primary rounded px-1.5 py-0.5 font-tech text-[9px]">Now</span>
									)}
								</div>
								<div className="mt-0.5 font-tech text-[10px] text-text-secondary/70">
									{station.period.start} — {station.period.end === 'present' ? 'Present' : station.period.end}
								</div>
								{/* Line badges */}
								<div className="mt-1 flex flex-wrap gap-1">
									{station.lines
										.filter((l) => visibleLines.includes(l))
										.map((lineId) => (
											<span
												key={lineId}
												className="rounded px-1 py-0.5 font-tech text-[8px] uppercase"
												style={{
													backgroundColor: `${getLineColor(lineId)}20`,
													color: getLineColor(lineId),
												}}
											>
												{lineId}
											</span>
										))}
								</div>
							</div>
						</motion.button>
					)
				})}
			</div>
		</div>
	)
}
