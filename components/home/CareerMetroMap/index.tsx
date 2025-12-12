'use client'

import { useMemo, useState } from 'react'

import { lines, stationIdToDictionaryKey } from '@/lib/career-data'
import { cn } from '@/lib/utils'

import { Legend } from './Legend'
import { MetroLine } from './MetroLine'
import { Station } from './Station'
import { TimelineAxis } from './TimelineAxis'
import { ANIMATION_CONFIG, SVG_DIMENSIONS, TIMELINE } from './constants'
import { LINE_Y_POSITIONS, getStationLines, useStationLayout } from './hooks/useStationLayout'
import type { CareerMetroMapProps } from './types'

export function CareerMetroMap({ activeStation, onStationSelect, className }: CareerMetroMapProps) {
	const { stationPositions, lineSegments } = useStationLayout()
	const [hoveredStation, setHoveredStation] = useState<string | null>(null)

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

					{/* Metro lines */}
					{lineSegments.map((segment, index) => (
						<MetroLine
							key={segment.line.id}
							segment={segment}
							isActive={activeLines.includes(segment.line.id)}
							animationDelay={index * ANIMATION_CONFIG.lineStagger}
						/>
					))}

					{/* Vertical connectors for multi-line stations */}
					{Array.from(stationPositions.values())
						.filter((pos) => pos.station.lines.length > 1)
						.map((position) => {
							const stationLineYs = position.station.lines.map((lineId) => LINE_Y_POSITIONS[lineId])
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

					{/* Stations - render on each line they belong to */}
					{Array.from(stationPositions.values()).flatMap((position) => {
						const stationLines = getStationLines(position.station)
						const dictionaryKey = stationIdToDictionaryKey(position.id)
						const isActive = activeStation === dictionaryKey || hoveredStation === position.id

						// Render a station dot on EACH line the station belongs to
						return stationLines.map((line, lineIndex) => {
							const lineY = LINE_Y_POSITIONS[line.id]
							const positionOnLine = { ...position, y: lineY }

							return (
								<Station
									key={`${position.id}-${line.id}`}
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

					{/* Company name tooltip on hover */}
					{hoveredStation && stationPositions.has(hoveredStation) && <StationTooltip position={stationPositions.get(hoveredStation)!} />}
				</svg>
			</div>

			<Legend
				lines={lines}
				activeLines={activeLines}
			/>
		</div>
	)
}

// Simple tooltip component
function StationTooltip({
	position,
}: {
	position: { x: number; y: number; station: { company: string; period: { start: string; end: string } } }
}) {
	const { x, y, station } = position

	// Determine if tooltip should flip to avoid edge
	const flipRight = x < 100
	const flipDown = y < 60

	const tooltipX = flipRight ? x + 15 : x - 15
	const tooltipY = flipDown ? y + 25 : y - 25
	const anchor = flipRight ? 'start' : 'end'

	return (
		<g>
			{/* Background */}
			<rect
				x={flipRight ? tooltipX - 4 : tooltipX - 140}
				y={tooltipY - 14}
				width={144}
				height={36}
				rx={4}
				fill="#1a1a1a"
				stroke="#333"
				strokeWidth={1}
			/>
			{/* Company name */}
			<text
				x={tooltipX}
				y={tooltipY}
				textAnchor={anchor}
				className="fill-text-primary font-body text-xs font-medium"
			>
				{station.company.length > 20 ? station.company.slice(0, 18) + '...' : station.company}
			</text>
			{/* Period */}
			<text
				x={tooltipX}
				y={tooltipY + 14}
				textAnchor={anchor}
				className="fill-text-secondary font-tech text-[10px]"
			>
				{station.period.start} - {station.period.end === 'present' ? 'Present' : station.period.end}
			</text>
		</g>
	)
}

export default CareerMetroMap
