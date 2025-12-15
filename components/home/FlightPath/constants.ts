// Flight Path section constants

export const SVG_DIMENSIONS = {
	width: 700,
	height: 350,
	padding: { top: 60, right: 50, bottom: 60, left: 30 },
} as const

export const TIMELINE = {
	start: 2015,
	end: 2026,
} as const

export const COLORS = {
	// Sky gradient
	skyTop: '#E0F2FE',
	skyBottom: '#FFFFFF',

	// Flight path
	path: '#3B82F6',
	pathGlow: '#60A5FA',

	// Education markers (amber/gold)
	education: '#F59E0B',
	educationLight: '#FCD34D',

	// Certification markers (indigo)
	certification: '#6366F1',
	certificationLight: '#A5B4FC',

	// Clouds
	cloud: '#F1F5F9',
	cloudShadow: '#E2E8F0',

	// Ground/runway
	ground: '#94A3B8',
	runway: '#64748B',
} as const

export const MILESTONES = [
	{ id: 'bsc', year: 2018, altitude: 80, type: 'education' as const },
	{ id: 'aws', year: 2020, altitude: 140, type: 'certification' as const },
	{ id: 'msc', year: 2023, altitude: 220, type: 'education' as const },
	{ id: 'flowable', year: 2025, altitude: 270, type: 'certification' as const },
] as const

export const ANIMATION_CONFIG = {
	pathDrawDuration: 1.2,
	milestoneStagger: 0.15,
	milestoneDelay: 0.6,
	airplaneDelay: 1.4,
	cardsFadeDelay: 1.8,
} as const

// Calculate X position from year
export function getXFromYear(year: number, width: number): number {
	const { start, end } = TIMELINE
	const { left, right } = SVG_DIMENSIONS.padding
	const usableWidth = width - left - right
	return left + ((year - start) / (end - start)) * usableWidth
}

// Calculate Y position from altitude (inverted - higher altitude = lower Y)
export function getYFromAltitude(altitude: number, height: number): number {
	const { top, bottom } = SVG_DIMENSIONS.padding
	const usableHeight = height - top - bottom
	const maxAltitude = 300
	return height - bottom - (altitude / maxAltitude) * usableHeight
}
