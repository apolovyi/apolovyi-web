'use client'

import { motion, useReducedMotion } from 'motion/react'

import { ANIMATION_CONFIG, LINE_STYLES, SVG_DIMENSIONS, TIMELINE } from './constants'
import type { MetroLineProps } from './types'

interface ExtendedMetroLineProps extends MetroLineProps {
	isVisible?: boolean
}

export function MetroLine({ segment, isActive, animationDelay, isVisible = true }: ExtendedMetroLineProps) {
	const prefersReducedMotion = useReducedMotion()
	const { line, points } = segment

	if (points.length === 0) return null

	const { hasOngoingStation, lastStationEndX } = segment

	// Build path from points
	let pathData: string
	if (points.length === 1) {
		const point = points[0]
		// Only extend to current time if the line has an ongoing station
		let endX: number
		if (hasOngoingStation) {
			const { width, padding } = SVG_DIMENSIONS
			const usableWidth = width - padding.left - padding.right
			const currentYear = new Date().getFullYear() + new Date().getMonth() / 12
			endX = padding.left + ((currentYear - TIMELINE.start) / (TIMELINE.end - TIMELINE.start)) * usableWidth
		} else {
			// End at the last station's end date
			endX = lastStationEndX > point.x ? lastStationEndX : point.x + 30 // minimum extension
		}
		pathData = `M ${point.x} ${point.y} L ${endX} ${point.y}`
	} else {
		// Create path from multiple points
		let basePath = points.reduce((path, point, index) => {
			if (index === 0) return `M ${point.x} ${point.y}`
			return `${path} L ${point.x} ${point.y}`
		}, '')

		// Extend past the last point if there's an ongoing station
		if (hasOngoingStation) {
			const lastPoint = points[points.length - 1]
			const { width, padding } = SVG_DIMENSIONS
			const usableWidth = width - padding.left - padding.right
			const currentYear = new Date().getFullYear() + new Date().getMonth() / 12
			const endX = padding.left + ((currentYear - TIMELINE.start) / (TIMELINE.end - TIMELINE.start)) * usableWidth
			if (endX > lastPoint.x) {
				basePath = `${basePath} L ${endX} ${lastPoint.y}`
			}
		}
		pathData = basePath
	}

	const strokeStyle = LINE_STYLES[line.pattern] || LINE_STYLES.solid
	const isDashed = line.pattern === 'dashed' || line.pattern === 'dotted'

	// Dashed/dotted lines need higher opacity and slightly thicker stroke to be visible
	const baseOpacity = isDashed ? 0.75 : 0.65
	const targetOpacity = isVisible ? (isActive ? 1 : baseOpacity) : 0
	const strokeWidth = isDashed ? (isActive ? 3 : 2.5) : isActive ? 2.5 : 2

	// Calculate terminus positions
	const firstPoint = points[0]
	const terminusHeight = 6

	return (
		<g>
			{/* Metro line - thin and elegant */}
			<motion.path
				d={pathData}
				fill="none"
				stroke={line.color}
				strokeWidth={strokeWidth}
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeDasharray={strokeStyle.strokeDasharray}
				initial={prefersReducedMotion ? { pathLength: 1, opacity: targetOpacity } : { pathLength: 0, opacity: 0 }}
				animate={{ pathLength: 1, opacity: targetOpacity }}
				transition={
					prefersReducedMotion
						? { duration: 0 }
						: {
								pathLength: {
									duration: ANIMATION_CONFIG.lineDuration,
									delay: animationDelay,
									ease: 'easeInOut',
								},
								opacity: { duration: 0.3 },
							}
				}
			/>

			{/* Terminus marker at start of line */}
			<motion.line
				x1={firstPoint.x - 3}
				y1={firstPoint.y - terminusHeight}
				x2={firstPoint.x - 3}
				y2={firstPoint.y + terminusHeight}
				stroke={line.color}
				strokeWidth={2}
				strokeLinecap="round"
				initial={{ opacity: 0 }}
				animate={{ opacity: targetOpacity }}
				transition={{ delay: animationDelay + ANIMATION_CONFIG.lineDuration, duration: 0.3 }}
			/>
		</g>
	)
}
