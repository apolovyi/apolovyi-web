import { useMemo } from 'react'

import { type CareerStation, type MetroLineId, getTimelinePosition, lines, stations } from '@/lib/career-data'

import { SVG_DIMENSIONS, TIMELINE } from '../constants'
import type { LineSegment, StationPosition } from '../types'

// Pre-calculate line Y positions for external use
const { height, padding } = SVG_DIMENSIONS
const usableHeight = height - padding.top - padding.bottom - 40

export const LINE_Y_POSITIONS: Record<MetroLineId, number> = {
	backend: padding.top + usableHeight * 0.05,
	frontend: padding.top + usableHeight * 0.22,
	cloud: padding.top + usableHeight * 0.39,
	leadership: padding.top + usableHeight * 0.54,
	volunteer: padding.top + usableHeight * 0.7,
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
			// Skip career break in the map visualization
			if (station.id === 'career-break') continue

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

			return { line, points }
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
