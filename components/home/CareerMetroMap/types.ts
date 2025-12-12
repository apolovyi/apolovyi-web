import type { CareerStation, MetroLine, MetroLineId } from '@/lib/career-data'

export interface StationPosition {
	id: string
	x: number
	y: number
	station: CareerStation
}

export interface LineSegment {
	line: MetroLine
	points: Array<{ x: number; y: number; stationId: string }>
}

export interface CareerMetroMapProps {
	activeStation: string | null
	onStationSelect: (stationId: string) => void
	className?: string
}

export interface MetroLineProps {
	segment: LineSegment
	isActive: boolean
	animationDelay: number
}

export interface StationProps {
	position: StationPosition
	isActive: boolean
	lineColors: string[]
	onClick: () => void
	onHover: (hovering: boolean) => void
	isPrimary?: boolean
}

export interface LegendProps {
	lines: MetroLine[]
	activeLines: MetroLineId[]
	visibleLines: MetroLineId[]
	onToggleLine: (lineId: MetroLineId) => void
}

export interface TimelineAxisProps {
	startYear: number
	endYear: number
	width: number
	y: number
}
