'use client'

import { useEffect, useRef, useState } from 'react'

import { motion, useReducedMotion } from 'motion/react'

import type { StationPoint } from './TrackSVG'
import { SBB_COLORS, TRAIN_CONFIG } from './constants'

interface MobileTrainProps {
	stationPoints: StationPoint[]
	trackPath: string
	scrollProgress: number // 0 to 1
}

// Simplified SBB train icon for mobile
function MobileTrainIcon() {
	return (
		<g transform={`scale(${TRAIN_CONFIG.scale})`}>
			{/* Soft glow */}
			<ellipse
				cx={0}
				cy={0}
				rx={30}
				ry={10}
				fill={SBB_COLORS.red}
				opacity={0.2}
			/>

			{/* Shadow */}
			<ellipse
				cx={2}
				cy={8}
				rx={20}
				ry={2}
				fill="rgba(0,0,0,0.2)"
			/>

			{/* Clean body - single white shape with rounded front */}
			<path
				d="M-22,-6 L-22,5 L18,5 L24,0 L24,-3 L18,-6 Z"
				fill={SBB_COLORS.white}
				stroke="#CCCCCC"
				strokeWidth={0.5}
			/>

			{/* Iconic SBB red stripe */}
			<rect
				x={-22}
				y={2}
				width={40}
				height={2.5}
				fill={SBB_COLORS.red}
			/>
			<path
				d="M18,2 L24,0 L24,1 L18,4.5 Z"
				fill={SBB_COLORS.red}
			/>

			{/* Windows */}
			<rect
				x={-18}
				y={-4}
				width={8}
				height={4}
				rx={1}
				fill="#2A3A4A"
			/>
			<rect
				x={-8}
				y={-4}
				width={8}
				height={4}
				rx={1}
				fill="#2A3A4A"
			/>
			<rect
				x={2}
				y={-4}
				width={8}
				height={4}
				rx={1}
				fill="#2A3A4A"
			/>

			{/* Front windshield */}
			<path
				d="M16,-4 L22,-2 L22,0 L16,1 Z"
				fill="#1A2A3A"
			/>

			{/* Undercarriage */}
			<rect
				x={-20}
				y={5}
				width={44}
				height={2}
				fill={SBB_COLORS.charcoal}
			/>

			{/* Wheels */}
			<circle
				cx={-14}
				cy={7.5}
				r={2}
				fill={SBB_COLORS.charcoal}
			/>
			<circle
				cx={-4}
				cy={7.5}
				r={2}
				fill={SBB_COLORS.charcoal}
			/>
			<circle
				cx={8}
				cy={7.5}
				r={2}
				fill={SBB_COLORS.charcoal}
			/>
			<circle
				cx={18}
				cy={7.5}
				r={2}
				fill={SBB_COLORS.charcoal}
			/>
		</g>
	)
}

export function MobileTrain({ stationPoints, trackPath, scrollProgress }: MobileTrainProps) {
	const pathRef = useRef<SVGPathElement>(null)
	const [position, setPosition] = useState({ x: 0, y: 0, angle: 0 })
	const prefersReducedMotion = useReducedMotion()

	useEffect(() => {
		if (!pathRef.current || stationPoints.length === 0) return

		const path = pathRef.current
		const totalLength = path.getTotalLength()

		// Calculate position along path based on scroll progress
		// Invert progress so train starts at bottom (oldest) and moves to top (newest)
		const clampedProgress = Math.max(0, Math.min(1, 1 - scrollProgress))
		const targetLength = clampedProgress * totalLength

		// Get point and angle at this length
		const point = path.getPointAtLength(targetLength)

		// Calculate angle from path tangent
		const delta = 1
		const pointBefore = path.getPointAtLength(Math.max(0, targetLength - delta))
		const pointAfter = path.getPointAtLength(Math.min(totalLength, targetLength + delta))
		const angle = Math.atan2(pointAfter.y - pointBefore.y, pointAfter.x - pointBefore.x) * (180 / Math.PI)

		setPosition({ x: point.x, y: point.y, angle })
	}, [scrollProgress, stationPoints, trackPath])

	// Don't render if no path or reduced motion
	if (stationPoints.length === 0) return null

	return (
		<g>
			{/* Hidden path for getPointAtLength calculations */}
			<path
				ref={pathRef}
				d={trackPath}
				fill="none"
				stroke="transparent"
				strokeWidth={0}
			/>

			{/* Train positioned along path */}
			<motion.g
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5 }}
			>
				<g
					transform={`translate(${position.x}, ${position.y + TRAIN_CONFIG.yOffset}) rotate(${position.angle})`}
					style={{
						transition: prefersReducedMotion ? 'none' : 'transform 0.1s ease-out',
					}}
				>
					<MobileTrainIcon />
				</g>
			</motion.g>
		</g>
	)
}
