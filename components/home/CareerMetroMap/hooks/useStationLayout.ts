import { useMemo } from 'react'

import { type CareerStation, type MetroLineId, getTimelinePosition, lines, stations } from '@/lib/career-data'

import { SVG_DIMENSIONS, TIMELINE } from '../constants'
import type { LineSegment, StationPosition } from '../types'

// Pre-calculate line Y positions for external use
// Lines need to start at Y~100 to avoid being clipped by sticky header when scrolled
const { height, padding } = SVG_DIMENSIONS
const topOffset = 70 // Extra offset to avoid header clipping
const usableHeight = height - padding.top - padding.bottom - topOffset

export const LINE_Y_POSITIONS: Record<MetroLineId, number> = {
	backend: padding.top + topOffset + usableHeight * 0.0,
	frontend: padding.top + topOffset + usableHeight * 0.18,
	cloud: padding.top + topOffset + usableHeight * 0.38,
	leadership: padding.top + topOffset + usableHeight * 0.58,
	volunteer: padding.top + topOffset + usableHeight * 0.78,
}

interface LayoutResult {
	stationPositions: Map<string, StationPosition>
	lineSegments: LineSegment[]
	yearMarkers: Array<{ year: number; x: number }>
}

export function useStationLayout(): LayoutResult {
	return useMemo(() => {
		const { width, padding } = SVG_DIMENSIONS
		const usableWidth = width - padding.left - padding.right

		// Calculate X position based on time
		const getX = (dateStr: string): number => {
			const normalizedPos = getTimelinePosition(dateStr, TIMELINE.start, TIMELINE.end)
			return padding.left + normalizedPos * usableWidth
		}

		// Calculate station positions - use primary line Y position
		const stationPositions = new Map<string, StationPosition>()

		for (const station of stations) {
			const x = getX(station.period.start)

			// Use primary line's Y position (first line in array)
			let y: number
			if (station.lines.length === 0) {
				y = padding.top + usableHeight * 0.5
			} else {
				y = LINE_Y_POSITIONS[station.lines[0]] || padding.top + usableHeight * 0.5
			}

			stationPositions.set(station.id, { id: station.id, x, y, station })
		}

		// Build line segments
		const lineSegments: LineSegment[] = lines.map((line) => {
			const points = line.stations
				.map((stationId) => {
					const pos = stationPositions.get(stationId)
					if (!pos) return null
					return { x: pos.x, y: LINE_Y_POSITIONS[line.id], stationId }
				})
				.filter((p): p is { x: number; y: number; stationId: string } => p !== null)
				.sort((a, b) => a.x - b.x)

			// Check if any station on this line is ongoing (period.end === 'present')
			const lineStations = line.stations.map((id) => stationPositions.get(id)?.station).filter((s): s is CareerStation => s !== undefined)

			const hasOngoingStation = lineStations.some((s) => s.period.end.toLowerCase() === 'present')

			// Calculate X position of the last station's end date
			let lastStationEndX = 0
			if (lineStations.length > 0) {
				// Find the station with the latest end date
				const lastEndDate = lineStations.reduce((latest, s) => {
					if (s.period.end.toLowerCase() === 'present') return 'present'
					// Compare dates - this is a simple string comparison that works for "Mon YYYY" format
					return s.period.end > latest ? s.period.end : latest
				}, lineStations[0].period.end)

				if (lastEndDate.toLowerCase() !== 'present') {
					lastStationEndX = getX(lastEndDate)
				}
			}

			return { line, points, hasOngoingStation, lastStationEndX }
		})

		// Generate year markers
		const yearMarkers: Array<{ year: number; x: number }> = []
		for (let year = TIMELINE.start; year <= TIMELINE.end; year++) {
			const x = padding.left + ((year - TIMELINE.start) / (TIMELINE.end - TIMELINE.start)) * usableWidth
			yearMarkers.push({ year, x })
		}

		return { stationPositions, lineSegments, yearMarkers }
	}, [])
}

export function getStationLines(station: CareerStation): typeof lines {
	return lines.filter((line) => station.lines.includes(line.id))
}
