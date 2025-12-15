export const SVG_DIMENSIONS = {
	width: 700,
	height: 450, // Increased for better line spacing (was 380)
	padding: { top: 30, right: 30, bottom: 50, left: 30 },
} as const

export const TIMELINE = {
	start: 2015,
	end: 2026,
} as const

export const LINE_STYLES = {
	'solid': { strokeDasharray: 'none' },
	'dashed': { strokeDasharray: '6 3' },
	'dotted': { strokeDasharray: '2 3' },
	'double-dotted': { strokeDasharray: '2 2 6 2' },
} as const

export const STATION_SIZES = {
	small: 4, // < 6 months
	medium: 5, // 6-18 months
	large: 6, // 18-36 months
	xlarge: 7, // > 36 months
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
