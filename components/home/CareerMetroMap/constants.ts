export const SVG_DIMENSIONS = {
	width: 700,
	height: 380,
	padding: { top: 30, right: 30, bottom: 60, left: 30 },
} as const

export const TIMELINE = {
	start: 2015,
	end: 2026,
} as const

export const LINE_STYLES = {
	'solid': { strokeDasharray: 'none' },
	'dashed': { strokeDasharray: '8 4' },
	'dotted': { strokeDasharray: '2 4' },
	'double-dotted': { strokeDasharray: '2 2 6 2' },
} as const

export const STATION_SIZES = {
	small: 6, // < 6 months
	medium: 8, // 6-18 months
	large: 10, // 18-36 months
	xlarge: 12, // > 36 months
} as const

export const ANIMATION_CONFIG = {
	lineDuration: 0.8,
	lineStagger: 0.15,
	stationDelay: 0.3,
	stationDuration: 0.4,
} as const

export function getStationSize(tenureMonths: number): number {
	if (tenureMonths < 6) return STATION_SIZES.small
	if (tenureMonths < 18) return STATION_SIZES.medium
	if (tenureMonths < 36) return STATION_SIZES.large
	return STATION_SIZES.xlarge
}
