'use client'

import { useCallback, useMemo, useState } from 'react'

import { type MetroLineId, lines, stationIdToDictionaryKey } from '@/lib/career-data'
import { cn } from '@/lib/utils'

import { Legend } from './Legend'
import { MetroLine } from './MetroLine'
import { Station } from './Station'
import { TimelineAxis } from './TimelineAxis'
import { ANIMATION_CONFIG, SVG_DIMENSIONS, TIMELINE } from './constants'
import { LINE_Y_POSITIONS, getStationLines, useStationLayout } from './hooks/useStationLayout'
import type { CareerMetroMapProps } from './types'

// All line IDs for initial state
const ALL_LINE_IDS: MetroLineId[] = ['backend', 'frontend', 'cloud', 'leadership', 'volunteer']

export function CareerMetroMap({ activeStation, onStationSelect, className }: CareerMetroMapProps) {
	const { stationPositions, lineSegments } = useStationLayout()
	const [hoveredStation, setHoveredStation] = useState<string | null>(null)
	const [visibleLines, setVisibleLines] = useState<MetroLineId[]>(ALL_LINE_IDS)
	const [animationKey, setAnimationKey] = useState(0)

	// Replay animations
	const handleReplay = useCallback(() => {
		setAnimationKey((k) => k + 1)
	}, [])

	// Toggle line visibility
	const handleToggleLine = useCallback((lineId: MetroLineId) => {
		setVisibleLines((prev) => {
			if (prev.includes(lineId)) {
				// Don't allow hiding all lines
				if (prev.length === 1) return prev
				return prev.filter((id) => id !== lineId)
			}
			return [...prev, lineId]
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
	const handleStationClick = (stationId: string) => {
		const dictionaryKey = stationIdToDictionaryKey(stationId)
		onStationSelect(dictionaryKey)
	}

	return (
		<div className={cn('flex flex-col gap-2', className)}>
			{/* Scrollable container for mobile with fade hint */}
			<div className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-600/50 relative overflow-x-auto pb-2">
				{/* Right fade gradient - scroll hint for mobile */}
				<div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-background-primary to-transparent lg:hidden" />
				<svg
					viewBox={`0 0 ${SVG_DIMENSIONS.width} ${SVG_DIMENSIONS.height}`}
					className="h-auto min-w-[600px] lg:w-full lg:min-w-0"
					role="img"
					aria-label="Career timeline visualization as a metro map"
				>
					{/* Timeline axis */}
					<TimelineAxis
						startYear={TIMELINE.start}
						endYear={TIMELINE.end}
						width={SVG_DIMENSIONS.width}
						y={SVG_DIMENSIONS.height - 30}
					/>

					{/* Metro lines - filtered by visibility */}
					{lineSegments
						.filter((segment) => visibleLines.includes(segment.line.id))
						.map((segment, index) => (
							<MetroLine
								key={`${segment.line.id}-${animationKey}`}
								segment={segment}
								isActive={activeLines.includes(segment.line.id)}
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
									stroke="#666"
									strokeWidth={3}
									strokeOpacity={0.7}
									strokeLinecap="round"
								/>
							)
						})}

					{/* Stations - render on each visible line they belong to */}
					{Array.from(stationPositions.values()).flatMap((position) => {
						const stationLines = getStationLines(position.station).filter((l) => visibleLines.includes(l.id))
						if (stationLines.length === 0) return []

						const dictionaryKey = stationIdToDictionaryKey(position.id)
						const isActive = activeStation === dictionaryKey || hoveredStation === position.id

						// Render a station dot on EACH visible line the station belongs to
						return stationLines.map((line, lineIndex) => {
							const lineY = LINE_Y_POSITIONS[line.id]
							const positionOnLine = { ...position, y: lineY }

							return (
								<Station
									key={`${position.id}-${line.id}-${animationKey}`}
									position={positionOnLine}
									isActive={isActive}
									lineColors={[line.color]}
									onClick={() => handleStationClick(position.id)}
									onHover={(hovering) => setHoveredStation(hovering ? position.id : null)}
									isPrimary={lineIndex === 0}
								/>
							)
						})
					})}

					{/* Station labels for active/hovered stations on visible lines */}
					{Array.from(stationPositions.values()).map((position) => {
						// Only show label if station has at least one visible line
						const hasVisibleLine = position.station.lines.some((l) => visibleLines.includes(l))
						if (!hasVisibleLine) return null

						const dictionaryKey = stationIdToDictionaryKey(position.id)
						const isActive = activeStation === dictionaryKey
						const isHovered = hoveredStation === position.id

						if (!isActive && !isHovered) return null

						return (
							<StationLabel
								key={`label-${position.id}`}
								position={position}
								isActive={isActive}
							/>
						)
					})}
				</svg>
			</div>

			<div className="flex items-center justify-between gap-4">
				<Legend
					lines={lines}
					activeLines={activeLines}
					visibleLines={visibleLines}
					onToggleLine={handleToggleLine}
				/>
				<button
					onClick={handleReplay}
					className="flex-shrink-0 rounded-md p-1.5 text-text-secondary transition-colors hover:bg-neutral-800/50 hover:text-text-primary"
					aria-label="Replay animation"
					title="Replay animation"
				>
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
						<path d="M21 3v5h-5" />
					</svg>
				</button>
			</div>
		</div>
	)
}

// Station label component - shows company name near station
function StationLabel({
	position,
	isActive,
}: {
	position: { x: number; y: number; station: { company: string; period: { start: string; end: string } } }
	isActive: boolean
}) {
	const { x, y, station } = position

	// Truncate long names
	const displayName = station.company.length > 18 ? station.company.slice(0, 16) + '…' : station.company

	// Estimate text width (approx 6px per char for 11px font)
	const textWidth = displayName.length * 6.5 + 12

	// Position label above station, offset to avoid overlap
	const labelY = y - 22
	const anchor: 'start' | 'middle' | 'end' = x < 80 ? 'start' : x > 620 ? 'end' : 'middle'

	// Calculate rect position based on anchor
	const rectX = anchor === 'start' ? x - 4 : anchor === 'end' ? x - textWidth + 4 : x - textWidth / 2

	return (
		<g className="pointer-events-none">
			{/* Background pill for better readability */}
			<rect
				x={rectX}
				y={labelY - 9}
				width={textWidth}
				height={18}
				rx={4}
				fill={isActive ? 'rgba(26, 26, 26, 0.95)' : 'rgba(26, 26, 26, 0.9)'}
				stroke={isActive ? '#c23b3b' : '#444'}
				strokeWidth={1}
			/>
			{/* Company name */}
			<text
				x={anchor === 'start' ? x + 2 : anchor === 'end' ? x - 2 : x}
				y={labelY + 4}
				textAnchor={anchor}
				className={`font-tech text-[11px] ${isActive ? 'fill-accent-coral font-medium' : 'fill-text-primary'}`}
			>
				{displayName}
			</text>
		</g>
	)
}

export default CareerMetroMap
