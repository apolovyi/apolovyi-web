'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { trackLineToggle, trackMapReplay, trackStationClick } from '@/lib/analytics'
import { type DomainId, type MetroLineId, domains, getStationDomains, lines, stationIdToDictionaryKey } from '@/lib/career-data'
import { cn } from '@/lib/utils'

import { AnimatedTrain } from './AnimatedTrain'
import { DomainFilter } from './DomainFilter'
import { Legend } from './Legend'
import { MetroLine } from './MetroLine'
import { Station } from './Station'
import { TimelineAxis } from './TimelineAxis'
import { ANIMATION_CONFIG, SVG_DIMENSIONS, TIMELINE } from './constants'
import { LINE_Y_POSITIONS, getStationLines, useStationLayout } from './hooks/useStationLayout'
import { MobileTrainJourney } from './mobile/MobileTrainJourney'
import { StationCard } from './mobile/StationCard'
import { StationDetailModal } from './mobile/StationDetailModal'
import type { CareerMetroMapProps } from './types'

// All line IDs for initial state
const ALL_LINE_IDS: MetroLineId[] = ['backend', 'frontend', 'cloud', 'leadership', 'volunteer']

// Stations that should always show labels (notable companies, well-spaced on timeline)
// Only 2 labels to avoid collision: middle (2019) and recent (2025)
const ALWAYS_SHOW_LABEL_STATIONS = ['peax'] // Only current employer

// Minimum X distance between labels to avoid collision (in SVG units)
const LABEL_MIN_DISTANCE = 80

export function CareerMetroMap({ activeStation, onStationSelect, className }: CareerMetroMapProps) {
	const { stationPositions, lineSegments } = useStationLayout()
	const [hoveredStation, setHoveredStation] = useState<string | null>(null)
	const [visibleLines, setVisibleLines] = useState<MetroLineId[]>(ALL_LINE_IDS)
	const [activeDomain, setActiveDomain] = useState<DomainId | null>(null)
	const [animationKey, setAnimationKey] = useState(0)
	const [hasScrolled, setHasScrolled] = useState(false)
	const [showTrain, setShowTrain] = useState(false)
	const [isMobile, setIsMobile] = useState(false)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const scrollContainerRef = useRef<HTMLDivElement>(null)
	const svgRef = useRef<SVGSVGElement>(null)

	// Detect mobile screen width
	useEffect(() => {
		const checkMobile = () => setIsMobile(window.innerWidth < 640)
		checkMobile()
		window.addEventListener('resize', checkMobile)
		return () => window.removeEventListener('resize', checkMobile)
	}, [])

	// Get sorted station IDs for keyboard navigation (by x position = chronological)
	const sortedStationIds = useMemo(() => {
		return Array.from(stationPositions.entries())
			.sort((a, b) => a[1].x - b[1].x)
			.map(([id]) => id)
	}, [stationPositions])

	// Keyboard navigation handler
	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return

			e.preventDefault()
			const _currentIndex = activeStation
				? sortedStationIds.indexOf(stationIdToDictionaryKey(activeStation) === activeStation ? activeStation : '')
				: -1

			// Find current station in sorted list by dictionary key
			let currentIdx = -1
			for (let i = 0; i < sortedStationIds.length; i++) {
				if (stationIdToDictionaryKey(sortedStationIds[i]) === activeStation) {
					currentIdx = i
					break
				}
			}

			let newIndex: number
			if (e.key === 'ArrowRight') {
				newIndex = currentIdx < sortedStationIds.length - 1 ? currentIdx + 1 : 0
			} else {
				newIndex = currentIdx > 0 ? currentIdx - 1 : sortedStationIds.length - 1
			}

			const newStationId = sortedStationIds[newIndex]
			const dictionaryKey = stationIdToDictionaryKey(newStationId)
			onStationSelect(dictionaryKey)
		},
		[activeStation, sortedStationIds, onStationSelect],
	)

	// Track scroll to hide hint
	useEffect(() => {
		const container = scrollContainerRef.current
		if (!container) return

		const handleScroll = () => {
			if (container.scrollLeft > 20) {
				setHasScrolled(true)
			}
		}

		container.addEventListener('scroll', handleScroll)
		return () => container.removeEventListener('scroll', handleScroll)
	}, [])

	// Auto-start train animation when map becomes visible
	const [hasTriggered, setHasTriggered] = useState(false)
	useEffect(() => {
		const svg = svgRef.current
		if (!svg || hasTriggered) return

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					setHasTriggered(true)
					// Start train after lines have drawn
					setTimeout(() => setShowTrain(true), 500)
					observer.disconnect()
				}
			},
			{ threshold: 0.3 },
		)

		observer.observe(svg)
		return () => observer.disconnect()
	}, [hasTriggered])

	// Replay animations
	const handleReplay = useCallback(() => {
		setShowTrain(false)
		setAnimationKey((k) => k + 1)
		// Start train after a brief delay so lines draw first
		setTimeout(() => setShowTrain(true), 500)
		trackMapReplay()
	}, [])

	// Toggle line visibility - solo mode: click to show only that line, click again to show all
	const handleToggleLine = useCallback((lineId: MetroLineId) => {
		setVisibleLines((prev) => {
			// If this line is already solo'd (only visible line), show all lines
			if (prev.length === 1 && prev.includes(lineId)) {
				trackLineToggle(lineId, true)
				return ALL_LINE_IDS
			}
			// Otherwise, solo this line
			trackLineToggle(lineId, false)
			return [lineId]
		})
	}, [])

	// Get active lines based on selected station
	const activeLines = useMemo(() => {
		if (!activeStation) return []
		const pos = stationPositions.get(activeStation)
		if (!pos) return []
		return pos.station.lines
	}, [activeStation, stationPositions])

	// Handle station click - convert to dictionary key
	const handleStationClick = (stationId: string, stationName: string) => {
		const dictionaryKey = stationIdToDictionaryKey(stationId)
		trackStationClick(stationId, stationName)
		onStationSelect(dictionaryKey)
	}

	// Close modal when station changes
	useEffect(() => {
		setIsModalOpen(false)
	}, [activeStation])

	// Mobile: show train journey with compact card + modal
	if (isMobile) {
		return (
			<div className={cn('flex flex-col gap-3 overflow-x-hidden', className)}>
				<MobileTrainJourney
					activeStation={activeStation}
					onStationSelect={onStationSelect}
				/>
				<StationCard
					activeStation={activeStation}
					onCardTap={() => setIsModalOpen(true)}
				/>
				<StationDetailModal
					activeStation={activeStation}
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
				/>
			</div>
		)
	}

	return (
		<div
			className={cn('flex flex-col gap-2', className)}
			style={{ overflow: 'visible' }}
		>
			{/* Scrollable container for tablet, visible overflow on desktop for rocket */}
			<div
				ref={scrollContainerRef}
				className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-600/50 relative overflow-x-auto pb-2 lg:overflow-visible"
			>
				{/* Scroll hint for mobile only (hidden on tablet+) */}
				{!hasScrolled && (
					<div className="bg-background-secondary/80 text-text-secondary/70 pointer-events-none absolute top-1/2 right-2 z-20 flex -translate-y-1/2 items-center gap-1 rounded-full px-2 py-1 backdrop-blur-xs md:hidden">
						<span className="font-tech text-[10px] tracking-wide uppercase">Scroll</span>
						<svg
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							style={{
								animation: 'bounce-x 1s ease-in-out infinite',
							}}
						>
							<style>{`@keyframes bounce-x { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(3px); } }`}</style>
							<path d="M9 18l6-6-6-6" />
						</svg>
					</div>
				)}
				{/* Subtle right fade - mobile only */}
				<div className="from-background-primary pointer-events-none absolute top-0 right-0 z-10 h-full w-8 bg-gradient-to-l to-transparent md:hidden" />
				<svg
					ref={svgRef}
					viewBox={`0 0 ${SVG_DIMENSIONS.width} ${SVG_DIMENSIONS.height}`}
					className="h-auto min-w-[600px] outline-hidden focus:outline-hidden lg:w-full lg:min-w-0"
					style={{ overflow: 'visible' }}
					role="img"
					aria-label="Career timeline visualization as a metro map. Use arrow keys to navigate between positions."
					tabIndex={0}
					onKeyDown={handleKeyDown}
				>
					{/* Timeline axis */}
					<TimelineAxis
						startYear={TIMELINE.start}
						endYear={TIMELINE.end}
						width={SVG_DIMENSIONS.width}
						y={SVG_DIMENSIONS.height - 30}
					/>

					{/* "Now" indicator arrow */}
					{(() => {
						const { width, padding } = SVG_DIMENSIONS
						const usableWidth = width - padding.left - padding.right
						const currentYear = new Date().getFullYear() + new Date().getMonth() / 12
						const nowX = padding.left + ((currentYear - TIMELINE.start) / (TIMELINE.end - TIMELINE.start)) * usableWidth
						return (
							<g>
								{/* Arrow pointing right */}
								<polygon
									points={`${nowX + 8},${SVG_DIMENSIONS.height - 45} ${nowX + 14},${SVG_DIMENSIONS.height - 40} ${nowX + 8},${SVG_DIMENSIONS.height - 35}`}
									fill="var(--text-secondary)"
									opacity={0.6}
								/>
								{/* "Now" text */}
								<text
									x={nowX + 2}
									y={SVG_DIMENSIONS.height - 40}
									textAnchor="end"
									className="fill-text-secondary/60 font-tech text-[8px] uppercase"
								>
									Now
								</text>
							</g>
						)
					})()}

					{/* Metro lines - animate visibility */}
					{lineSegments.map((segment, index) => (
						<MetroLine
							key={`${segment.line.id}-${animationKey}`}
							segment={segment}
							isActive={activeLines.includes(segment.line.id)}
							isVisible={visibleLines.includes(segment.line.id)}
							animationDelay={index * ANIMATION_CONFIG.lineStagger}
						/>
					))}

					{/* Vertical connectors for multi-line stations - only for visible lines */}
					{Array.from(stationPositions.values())
						.filter((pos) => {
							const visibleStationLines = pos.station.lines.filter((l) => visibleLines.includes(l))
							return visibleStationLines.length > 1
						})
						.map((position) => {
							const visibleStationLines = position.station.lines.filter((l) => visibleLines.includes(l))
							const stationLineYs = visibleStationLines.map((lineId) => LINE_Y_POSITIONS[lineId])
							const minY = Math.min(...stationLineYs)
							const maxY = Math.max(...stationLineYs)
							return (
								<line
									key={`connector-${position.id}`}
									x1={position.x}
									y1={minY}
									x2={position.x}
									y2={maxY}
									stroke="#555"
									strokeWidth={1}
									strokeOpacity={0.4}
									strokeDasharray="2 2"
								/>
							)
						})}

					{/* Stations - render on each visible line they belong to */}
					{Array.from(stationPositions.values()).flatMap((position) => {
						const stationLines = getStationLines(position.station).filter((l) => visibleLines.includes(l.id))
						if (stationLines.length === 0) return []

						const dictionaryKey = stationIdToDictionaryKey(position.id)
						const isActive = activeStation === dictionaryKey || hoveredStation === position.id
						const isCurrentEmployer = position.station.period.end === 'present' && !position.station.isVolunteer
						// Show pulse on current employer when it's active OR when nothing else is focused
						const showPulse = isCurrentEmployer && (isActive || (activeStation === null && hoveredStation === null))

						// Check domain filter
						const stationDomains = getStationDomains(position.id)
						const matchesDomain = !activeDomain || stationDomains.includes(activeDomain)
						const isDimmed = activeDomain && !matchesDomain

						// Render a station dot on EACH visible line the station belongs to
						return stationLines.map((line, lineIndex) => {
							const lineY = LINE_Y_POSITIONS[line.id]
							const positionOnLine = { ...position, y: lineY }

							return (
								<g
									key={`${position.id}-${line.id}-${animationKey}`}
									style={{ opacity: isDimmed ? 0.25 : 1, transition: 'opacity 0.3s ease' }}
								>
									<Station
										position={positionOnLine}
										isActive={isActive && !isDimmed}
										lineColors={[line.color]}
										onClick={() => handleStationClick(position.id, position.station.company)}
										onHover={(hovering) => setHoveredStation(hovering ? position.id : null)}
										isPrimary={lineIndex === 0}
										showCurrentJobPulse={showPulse && !isDimmed}
									/>
								</g>
							)
						})
					})}

					{/* Station labels - show always-visible labels + hovered/active */}
					{(() => {
						// Get active/hovered station position for collision detection
						const activePos = activeStation
							? Array.from(stationPositions.values()).find((p) => stationIdToDictionaryKey(p.id) === activeStation)
							: null
						const hoveredPos = hoveredStation ? stationPositions.get(hoveredStation) : null
						const focusedPos = hoveredPos || activePos

						return Array.from(stationPositions.values()).map((position) => {
							// Only show label if station has at least one visible line
							const hasVisibleLine = position.station.lines.some((l) => visibleLines.includes(l))
							if (!hasVisibleLine) return null

							const dictionaryKey = stationIdToDictionaryKey(position.id)
							const isActive = activeStation === dictionaryKey
							const isHovered = hoveredStation === position.id
							const alwaysVisibleIndex = ALWAYS_SHOW_LABEL_STATIONS.indexOf(position.id)
							const isAlwaysVisible = alwaysVisibleIndex !== -1

							// Check for collision with focused station
							const wouldCollide =
								isAlwaysVisible && !isActive && !isHovered && focusedPos && Math.abs(position.x - focusedPos.x) < LABEL_MIN_DISTANCE

							// Show label if: always visible (not colliding), hovered, or active
							const shouldShowLabel = (isAlwaysVisible && !wouldCollide) || (hoveredStation ? isHovered : isActive)

							if (!shouldShowLabel) return null

							// Alternate position for always-visible labels to avoid overlap
							// Odd index = below, even index = above
							const positionBelow = isAlwaysVisible && alwaysVisibleIndex % 2 === 1

							return (
								<StationLabel
									key={`label-${position.id}`}
									position={position}
									isActive={isActive && !hoveredStation}
									isCompact={isAlwaysVisible && !isHovered && !isActive}
									positionBelow={positionBelow}
								/>
							)
						})
					})()}

					{/* Animated train on the backend line - rendered last to be on top */}
					{showTrain && lineSegments.find((s) => s.line.id === 'backend') && (
						<AnimatedTrain
							segment={lineSegments.find((s) => s.line.id === 'backend')!}
							animationKey={animationKey}
							svgWidth={SVG_DIMENSIONS.width}
							svgHeight={SVG_DIMENSIONS.height}
							svgRef={svgRef}
						/>
					)}
				</svg>
			</div>

			<div className="flex flex-col gap-2">
				<div className="flex items-center justify-between gap-4">
					<Legend
						lines={lines}
						activeLines={activeLines}
						visibleLines={visibleLines}
						onToggleLine={handleToggleLine}
					/>
					<button
						onClick={handleReplay}
						className="border-text-secondary/20 text-text-secondary/60 hover:border-text-secondary/40 group hover:text-text-secondary flex flex-shrink-0 items-center gap-1.5 rounded-full border px-2 py-1 transition-all"
						aria-label="Replay animation"
						title="Replay animation"
					>
						<svg
							width="12"
							height="12"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2.5"
						>
							<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
							<path d="M21 3v5h-5" />
						</svg>
						<span className="font-tech text-[9px] tracking-wide uppercase">Replay</span>
					</button>
				</div>
				<DomainFilter
					domains={domains}
					activeDomain={activeDomain}
					onSelectDomain={setActiveDomain}
				/>
			</div>
		</div>
	)
}

// Station label component - minimal, sleek design with edge-aware positioning
function StationLabel({
	position,
	isActive: _isActive,
	isCompact = false,
	positionBelow = false,
}: {
	position: { x: number; y: number; station: { company: string; period: { start: string; end: string }; tenureMonths: number } }
	isActive: boolean
	isCompact?: boolean
	positionBelow?: boolean
}) {
	void _isActive // Keep for potential future use
	const { x, y, station } = position

	// Truncate only very long names
	const displayName = station.company.length > 24 ? station.company.slice(0, 22) + '…' : station.company

	// Format tenure duration
	const formatTenure = (months: number): string => {
		if (months < 12) return `${months}mo`
		const years = Math.floor(months / 12)
		const remainingMonths = months % 12
		if (remainingMonths === 0) return `${years}y`
		return `${years}y ${remainingMonths}mo`
	}
	const tenureText = formatTenure(station.tenureMonths)

	// Edge-aware positioning using SVG dimensions
	const leftEdge = SVG_DIMENSIONS.padding.left + 50
	const rightEdge = SVG_DIMENSIONS.width - SVG_DIMENSIONS.padding.right - 50

	// Position label above or below station (moved up to avoid overlap)
	const labelY = positionBelow ? y + 25 : y - 25

	// Determine text anchor based on position
	let anchor: 'start' | 'middle' | 'end' = 'middle'
	let labelX = x

	if (x < leftEdge) {
		anchor = 'start'
		labelX = Math.max(x, SVG_DIMENSIONS.padding.left + 5)
	} else if (x > rightEdge) {
		anchor = 'end'
		labelX = Math.min(x, SVG_DIMENSIONS.width - SVG_DIMENSIONS.padding.right - 5)
	}

	// Compact version: just company name, smaller and subtler
	if (isCompact) {
		return (
			<g className="pointer-events-none">
				{/* Company name - outline */}
				<text
					x={labelX}
					y={labelY}
					textAnchor={anchor}
					className="font-tech text-[9px]"
					stroke="var(--background-primary)"
					strokeWidth={2}
					fill="none"
				>
					{displayName}
				</text>
				{/* Company name - main */}
				<text
					x={labelX}
					y={labelY}
					textAnchor={anchor}
					className="fill-text-secondary/80 font-tech text-[9px]"
				>
					{displayName}
				</text>
			</g>
		)
	}

	// Full version: company name + tenure (order changes based on position)
	const tenureY = positionBelow ? labelY + 10 : labelY + 10

	return (
		<g className="pointer-events-none">
			{/* Company name - outline */}
			<text
				x={labelX}
				y={labelY}
				textAnchor={anchor}
				className="font-tech text-[10px] font-medium"
				stroke="var(--background-primary)"
				strokeWidth={3}
				fill="none"
			>
				{displayName}
			</text>
			{/* Company name - main */}
			<text
				x={labelX}
				y={labelY}
				textAnchor={anchor}
				className="fill-text-primary font-tech text-[10px] font-medium"
			>
				{displayName}
			</text>
			{/* Tenure duration - outline */}
			<text
				x={labelX}
				y={tenureY}
				textAnchor={anchor}
				className="font-tech text-[8px]"
				stroke="var(--background-primary)"
				strokeWidth={2}
				fill="none"
			>
				{tenureText}
			</text>
			{/* Tenure duration - main */}
			<text
				x={labelX}
				y={tenureY}
				textAnchor={anchor}
				className="fill-text-secondary/70 font-tech text-[8px]"
			>
				{tenureText}
			</text>
		</g>
	)
}

export default CareerMetroMap
