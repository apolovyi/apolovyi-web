'use client'

import { useMemo } from 'react'

import { type CareerStation, stationIdToDictionaryKey, stations } from '@/lib/career-data'

import { MOBILE_SVG, TRACK_CONFIG } from './constants'

interface StationPoint {
	id: string
	x: number
	y: number
	station: CareerStation
	dictionaryKey: string
}

// TrackSVG renders track elements inside a parent SVG (no wrapper)

// Generate a winding path through all stations
function generateWindingPath(stationPoints: StationPoint[]): string {
	if (stationPoints.length === 0) return ''

	const points = stationPoints.map((s) => ({ x: s.x, y: s.y }))
	let path = `M ${points[0].x} ${points[0].y}`

	for (let i = 1; i < points.length; i++) {
		const prev = points[i - 1]
		const curr = points[i]

		// Calculate control points for smooth curve
		const midY = (prev.y + curr.y) / 2

		// Alternate curves left and right for winding effect
		const curveDirection = i % 2 === 0 ? 1 : -1
		const curveOffset = TRACK_CONFIG.curveAmplitude * curveDirection

		// Use quadratic bezier for smooth curves
		const cp1x = prev.x + curveOffset * 0.5
		const cp1y = midY - (curr.y - prev.y) * 0.2
		const cp2x = curr.x + curveOffset * 0.5
		const cp2y = midY + (curr.y - prev.y) * 0.2

		path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`
	}

	return path
}

// Calculate station positions along the vertical track
function calculateStationPositions(): StationPoint[] {
	// Sort stations chronologically (oldest first, so they're at bottom)
	const sortedStations = [...stations].sort((a, b) => {
		const parseDate = (dateStr: string) => {
			if (dateStr.toLowerCase() === 'present') return new Date()
			const [month, year] = dateStr.split(' ')
			const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(month)
			return new Date(parseInt(year), monthIndex)
		}
		return parseDate(a.period.start).getTime() - parseDate(b.period.start).getTime()
	})

	const { viewBox, padding } = MOBILE_SVG
	const usableHeight = viewBox.height - padding.top - padding.bottom
	const centerX = viewBox.width / 2

	return sortedStations.map((station, index) => {
		// Distribute stations evenly along the height (oldest at bottom, newest at top)
		const progress = index / (sortedStations.length - 1)
		const y = viewBox.height - padding.bottom - progress * usableHeight

		// Alternate X position for winding effect
		const xOffset = (index % 2 === 0 ? -1 : 1) * TRACK_CONFIG.curveAmplitude * 0.3
		const x = centerX + xOffset

		return {
			id: station.id,
			x,
			y,
			station,
			dictionaryKey: stationIdToDictionaryKey(station.id),
		}
	})
}

export function TrackSVG() {
	const stationPoints = useMemo(() => calculateStationPositions(), [])
	const trackPath = useMemo(() => generateWindingPath(stationPoints), [stationPoints])

	return (
		<g>
			<defs>
				{/* Track gradient */}
				<linearGradient
					id="trackGradient"
					x1="0%"
					y1="100%"
					x2="0%"
					y2="0%"
				>
					<stop
						offset="0%"
						stopColor={TRACK_CONFIG.color}
						stopOpacity={0.4}
					/>
					<stop
						offset="50%"
						stopColor={TRACK_CONFIG.color}
						stopOpacity={0.7}
					/>
					<stop
						offset="100%"
						stopColor={TRACK_CONFIG.color}
						stopOpacity={1}
					/>
				</linearGradient>

				{/* Glow filter for active elements */}
				<filter
					id="stationGlow"
					x="-50%"
					y="-50%"
					width="200%"
					height="200%"
				>
					<feGaussianBlur
						stdDeviation="3"
						result="blur"
					/>
					<feMerge>
						<feMergeNode in="blur" />
						<feMergeNode in="SourceGraphic" />
					</feMerge>
				</filter>
			</defs>

			{/* Track shadow */}
			<path
				d={trackPath}
				fill="none"
				stroke="rgba(0,0,0,0.1)"
				strokeWidth={TRACK_CONFIG.strokeWidth + 2}
				strokeLinecap="round"
				strokeLinejoin="round"
				transform="translate(2, 2)"
			/>

			{/* Main track */}
			<path
				d={trackPath}
				fill="none"
				stroke="url(#trackGradient)"
				strokeWidth={TRACK_CONFIG.strokeWidth}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>

			{/* Track ties (railroad sleepers) */}
			{stationPoints.map((point, index) => {
				if (index === 0) return null
				const prev = stationPoints[index - 1]
				// Add ties between stations
				const numTies = 3
				return Array.from({ length: numTies }).map((_, tieIndex) => {
					const t = (tieIndex + 1) / (numTies + 1)
					const tieX = prev.x + (point.x - prev.x) * t
					const tieY = prev.y + (point.y - prev.y) * t
					// Calculate angle for tie orientation
					const angle = Math.atan2(point.y - prev.y, point.x - prev.x) * (180 / Math.PI) + 90
					return (
						<rect
							key={`tie-${point.id}-${tieIndex}`}
							x={tieX - 12}
							y={tieY - 2}
							width={24}
							height={4}
							rx={1}
							fill="#94A3B8"
							opacity={0.3}
							transform={`rotate(${angle}, ${tieX}, ${tieY})`}
						/>
					)
				})
			})}
		</g>
	)
}

// Export station positions for use by other components
export function useStationPositions(): StationPoint[] {
	return useMemo(() => calculateStationPositions(), [])
}

// Export path for train to follow
export function useTrackPath(): string {
	const stationPoints = useMemo(() => calculateStationPositions(), [])
	return useMemo(() => generateWindingPath(stationPoints), [stationPoints])
}

export type { StationPoint }
