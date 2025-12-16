// Mobile Train Journey - Constants and Configuration

// SBB Colors (Swiss Federal Railways brand)
export const SBB_COLORS = {
	red: '#EB0000',
	white: '#FFFFFF',
	charcoal: '#212121',
	lightGray: '#F5F5F5',
} as const

// SVG Dimensions for mobile viewport
export const MOBILE_SVG = {
	viewBox: {
		width: 375,
		height: 850, // Increased for better station spacing
	},
	padding: {
		top: 50,
		right: 40,
		bottom: 70,
		left: 40,
	},
} as const

// Track configuration
export const TRACK_CONFIG = {
	strokeWidth: 4,
	color: '#94A3B8', // Neutral gray track
	activeColor: SBB_COLORS.red,
	// Control how much the track winds (amplitude of curves)
	curveAmplitude: 60,
	// Vertical spacing between stations
	stationSpacing: 70,
} as const

// Station configuration
export const STATION_CONFIG = {
	radius: {
		normal: 6,
		active: 10,
		pulse: 16,
	},
	labelOffset: 16, // Reduced from 18 for better fit on narrow screens
} as const

// Train configuration
export const TRAIN_CONFIG = {
	scale: 0.6, // Smaller than desktop
	// Offset from track center (train sits on track)
	yOffset: -10,
} as const

// Animation timings
export const ANIMATION_CONFIG = {
	stationActivation: 200, // ms
	trainSmooth: 100, // ms for scroll interpolation
} as const

// Parallax configuration for scenery layers
export const PARALLAX_CONFIG = {
	farMountains: 0.05, // 5% movement
	nearMountains: 0.1, // 10% movement
	trees: 0.15, // 15% movement
} as const

// Scenery colors
export const SCENERY_COLORS = {
	sky: {
		top: '#E0F2FE',
		bottom: '#FFFFFF',
	},
	mountains: {
		far: '#E2E8F0',
		near: '#CBD5E1',
	},
	trees: '#6B7280',
	ground: '#F1F5F9',
} as const
