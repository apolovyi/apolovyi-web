'use client'

import { motion, useReducedMotion } from 'motion/react'

import { ANIMATION_CONFIG, LINE_STYLES, SVG_DIMENSIONS, TIMELINE } from './constants'
import type { MetroLineProps } from './types'

export function MetroLine({ segment, isActive, animationDelay }: MetroLineProps) {
	const prefersReducedMotion = useReducedMotion()
	const { line, points } = segment

	if (points.length === 0) return null

	// For single-point lines (like volunteer), extend to current time
	let pathData: string
	if (points.length === 1) {
		const point = points[0]
		// Calculate end X based on current time position
		const { width, padding } = SVG_DIMENSIONS
		const usableWidth = width - padding.left - padding.right
		const currentYear = new Date().getFullYear() + new Date().getMonth() / 12
		const endX = padding.left + ((currentYear - TIMELINE.start) / (TIMELINE.end - TIMELINE.start)) * usableWidth
		pathData = `M ${point.x} ${point.y} L ${endX} ${point.y}`
	} else {
		// Create path from multiple points
		pathData = points.reduce((path, point, index) => {
			if (index === 0) return `M ${point.x} ${point.y}`
			return `${path} L ${point.x} ${point.y}`
		}, '')
	}

	const strokeStyle = LINE_STYLES[line.pattern] || LINE_STYLES.solid

	return (
		<g>
			{/* Background line (slightly thicker, for better visibility) */}
			<motion.path
				d={pathData}
				fill="none"
				stroke={line.color}
				strokeWidth={isActive ? 4 : 3}
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeDasharray={strokeStyle.strokeDasharray}
				strokeOpacity={isActive ? 1 : 0.6}
				initial={prefersReducedMotion ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
				animate={{ pathLength: 1, opacity: 1 }}
				transition={
					prefersReducedMotion
						? { duration: 0 }
						: {
								pathLength: {
									duration: ANIMATION_CONFIG.lineDuration,
									delay: animationDelay,
									ease: 'easeInOut',
								},
								opacity: { duration: 0.3, delay: animationDelay },
							}
				}
			/>
		</g>
	)
}
