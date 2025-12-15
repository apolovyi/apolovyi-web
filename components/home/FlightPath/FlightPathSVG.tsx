'use client'

import { useEffect, useRef, useState } from 'react'

import { motion, useReducedMotion } from 'motion/react'

import { ANIMATION_CONFIG, COLORS, MILESTONES, SVG_DIMENSIONS, getXFromYear, getYFromAltitude } from './constants'

// Cloud component
function Cloud({ x, y, scale = 1, opacity = 0.8 }: { x: number; y: number; scale?: number; opacity?: number }) {
	return (
		<g transform={`translate(${x}, ${y}) scale(${scale})`}>
			<ellipse
				cx="0"
				cy="0"
				rx="25"
				ry="15"
				fill={COLORS.cloud}
				opacity={opacity}
			/>
			<ellipse
				cx="-18"
				cy="5"
				rx="18"
				ry="12"
				fill={COLORS.cloud}
				opacity={opacity}
			/>
			<ellipse
				cx="18"
				cy="5"
				rx="18"
				ry="12"
				fill={COLORS.cloud}
				opacity={opacity}
			/>
			<ellipse
				cx="0"
				cy="10"
				rx="20"
				ry="10"
				fill={COLORS.cloudShadow}
				opacity={opacity * 0.5}
			/>
		</g>
	)
}

// Current position indicator - subtle pulsing dot
function CurrentPositionIndicator({ x, y }: { x: number; y: number }) {
	const prefersReducedMotion = useReducedMotion()

	return (
		<motion.g
			initial={{ opacity: 0, scale: 0 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{
				opacity: { duration: 0.4, delay: ANIMATION_CONFIG.airplaneDelay },
				scale: { duration: 0.4, delay: ANIMATION_CONFIG.airplaneDelay, type: 'spring' },
			}}
		>
			{/* Pulsing outer ring */}
			<motion.circle
				cx={x}
				cy={y}
				r={12}
				fill="none"
				stroke={COLORS.path}
				strokeWidth="2"
				opacity={0.3}
				animate={prefersReducedMotion ? {} : { r: [12, 18, 12], opacity: [0.3, 0.1, 0.3] }}
				transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
			/>
			{/* Static glow */}
			<circle
				cx={x}
				cy={y}
				r={8}
				fill={COLORS.pathGlow}
				opacity={0.4}
			/>
			{/* Core dot */}
			<circle
				cx={x}
				cy={y}
				r={5}
				fill={COLORS.path}
			/>
			{/* Highlight */}
			<circle
				cx={x - 1.5}
				cy={y - 1.5}
				r={2}
				fill="white"
				opacity={0.6}
			/>
		</motion.g>
	)
}

// Milestone marker
function MilestoneMarker({
	x,
	y,
	type,
	index,
	label,
	labelPosition = 'below',
}: {
	x: number
	y: number
	type: 'education' | 'certification'
	index: number
	label: string
	labelPosition?: 'below' | 'left'
}) {
	const color = type === 'education' ? COLORS.education : COLORS.certification
	const lightColor = type === 'education' ? COLORS.educationLight : COLORS.certificationLight
	const size = type === 'education' ? 14 : 10
	const delay = ANIMATION_CONFIG.milestoneDelay + index * ANIMATION_CONFIG.milestoneStagger

	// Label positioning
	const labelX = labelPosition === 'left' ? x - size - 8 : x
	const labelY = labelPosition === 'left' ? y + 4 : y + size + 16
	const anchor = labelPosition === 'left' ? 'end' : 'middle'

	return (
		<motion.g
			initial={{ scale: 0, opacity: 0 }}
			animate={{ scale: 1, opacity: 1 }}
			transition={{ delay, duration: 0.4, type: 'spring', stiffness: 300, damping: 20 }}
		>
			{/* Glow effect */}
			<circle
				cx={x}
				cy={y}
				r={size + 4}
				fill={lightColor}
				opacity={0.3}
			/>
			{/* Main marker */}
			<circle
				cx={x}
				cy={y}
				r={size}
				fill={color}
			/>
			{/* Inner highlight */}
			<circle
				cx={x - size / 4}
				cy={y - size / 4}
				r={size / 3}
				fill="white"
				opacity={0.4}
			/>
			{/* Icon */}
			{type === 'education' ? (
				// Graduation cap
				<g transform={`translate(${x}, ${y})`}>
					<path
						d="M-6 1 L0 -4 L6 1 L0 3 Z"
						fill="white"
						opacity={0.9}
					/>
					<rect
						x="-1"
						y="1"
						width="2"
						height="4"
						fill="white"
						opacity={0.9}
					/>
				</g>
			) : (
				// Certificate/badge checkmark
				<g transform={`translate(${x}, ${y})`}>
					<path
						d="M-3 0 L-1 2 L3 -2"
						stroke="white"
						strokeWidth="2"
						fill="none"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</g>
			)}
			{/* Label */}
			<text
				x={labelX}
				y={labelY}
				textAnchor={anchor}
				className="fill-text-secondary font-tech text-[10px]"
			>
				{label}
			</text>
		</motion.g>
	)
}

// Ground/runway
function Ground({ width, height }: { width: number; height: number }) {
	const groundY = height - SVG_DIMENSIONS.padding.bottom + 20
	return (
		<g>
			{/* Ground line */}
			<line
				x1={SVG_DIMENSIONS.padding.left}
				y1={groundY}
				x2={width - SVG_DIMENSIONS.padding.right}
				y2={groundY}
				stroke={COLORS.ground}
				strokeWidth="2"
			/>
			{/* Runway markings */}
			{[0, 1, 2, 3].map((i) => (
				<rect
					key={i}
					x={SVG_DIMENSIONS.padding.left + 20 + i * 40}
					y={groundY - 2}
					width="20"
					height="4"
					fill={COLORS.runway}
					rx="1"
				/>
			))}
		</g>
	)
}

export function FlightPathSVG() {
	const svgRef = useRef<SVGSVGElement>(null)
	const [isVisible, setIsVisible] = useState(false)
	const prefersReducedMotion = useReducedMotion()

	const { width, height } = SVG_DIMENSIONS

	// Intersection observer for scroll-triggered animation
	useEffect(() => {
		const svg = svgRef.current
		if (!svg) return

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true)
				}
			},
			{ threshold: 0.2 },
		)

		observer.observe(svg)
		return () => observer.disconnect()
	}, [])

	// Calculate milestone positions
	const milestonePositions = MILESTONES.map((m) => ({
		...m,
		x: getXFromYear(m.year, width),
		y: getYFromAltitude(m.altitude, height),
	}))

	// Build the flight path
	const pathPoints = [
		{ x: SVG_DIMENSIONS.padding.left, y: height - SVG_DIMENSIONS.padding.bottom },
		...milestonePositions.map((m) => ({ x: m.x, y: m.y })),
	]

	// Create smooth curve through points
	const pathD = pathPoints.reduce((acc, point, i) => {
		if (i === 0) {
			return `M ${point.x} ${point.y}`
		}
		const prev = pathPoints[i - 1]
		const cpX = (prev.x + point.x) / 2
		return `${acc} Q ${cpX} ${prev.y}, ${point.x} ${point.y}`
	}, '')

	// Get last milestone for current position indicator
	const lastMilestone = milestonePositions[milestonePositions.length - 1]

	// Labels for milestones
	const milestoneLabels: Record<string, string> = {
		bsc: 'BSc 2018',
		aws: 'AWS 2020',
		msc: 'MSc 2023',
		flowable: 'Flowable 2025',
	}

	return (
		<svg
			ref={svgRef}
			viewBox={`0 0 ${width} ${height}`}
			className="h-auto w-full max-w-3xl"
			role="img"
			aria-label="Flight path visualization showing education and certification milestones from 2015 to 2025"
		>
			{/* Sky gradient background */}
			<defs>
				<linearGradient
					id="skyGradient"
					x1="0%"
					y1="0%"
					x2="0%"
					y2="100%"
				>
					<stop
						offset="0%"
						stopColor={COLORS.skyTop}
					/>
					<stop
						offset="100%"
						stopColor={COLORS.skyBottom}
					/>
				</linearGradient>
				{/* Path glow filter */}
				<filter
					id="pathGlow"
					x="-20%"
					y="-20%"
					width="140%"
					height="140%"
				>
					<feGaussianBlur
						stdDeviation="3"
						result="blur"
					/>
					<feMerge>
						<feMergeNode in="blur" />
						<feMergeNode in="SourceGraphic" />
					</feMerge>
				</filter>
			</defs>

			{/* Background */}
			<rect
				x="0"
				y="0"
				width={width}
				height={height}
				fill="url(#skyGradient)"
				rx="8"
			/>

			{/* Clouds - positioned within safe area */}
			<Cloud
				x={80}
				y={85}
				scale={0.7}
				opacity={0.5}
			/>
			<Cloud
				x={250}
				y={110}
				scale={0.55}
				opacity={0.45}
			/>
			<Cloud
				x={420}
				y={75}
				scale={0.6}
				opacity={0.5}
			/>
			<Cloud
				x={580}
				y={120}
				scale={0.5}
				opacity={0.4}
			/>

			{/* Ground */}
			<Ground
				width={width}
				height={height}
			/>

			{/* Altitude grid lines (subtle) */}
			{[100, 150, 200, 250].map((alt) => {
				const y = getYFromAltitude(alt, height)
				return (
					<line
						key={alt}
						x1={SVG_DIMENSIONS.padding.left}
						y1={y}
						x2={width - SVG_DIMENSIONS.padding.right}
						y2={y}
						stroke={COLORS.ground}
						strokeWidth="0.5"
						strokeDasharray="4 8"
						opacity={0.3}
					/>
				)
			})}

			{/* Flight path - glow layer */}
			{isVisible && (
				<motion.path
					d={pathD}
					fill="none"
					stroke={COLORS.pathGlow}
					strokeWidth="6"
					strokeLinecap="round"
					opacity={0.3}
					initial={{ pathLength: 0 }}
					animate={{ pathLength: 1 }}
					transition={{ duration: prefersReducedMotion ? 0 : ANIMATION_CONFIG.pathDrawDuration, ease: 'easeInOut' }}
				/>
			)}

			{/* Flight path - main line */}
			{isVisible && (
				<motion.path
					d={pathD}
					fill="none"
					stroke={COLORS.path}
					strokeWidth="3"
					strokeLinecap="round"
					strokeDasharray="8 4"
					initial={{ pathLength: 0, opacity: 0 }}
					animate={{ pathLength: 1, opacity: 1 }}
					transition={{
						pathLength: { duration: prefersReducedMotion ? 0 : ANIMATION_CONFIG.pathDrawDuration, ease: 'easeInOut' },
						opacity: { duration: 0.3 },
					}}
				/>
			)}

			{/* Milestone markers */}
			{isVisible &&
				milestonePositions.map((milestone, index) => (
					<MilestoneMarker
						key={milestone.id}
						x={milestone.x}
						y={milestone.y}
						type={milestone.type}
						index={index}
						label={milestoneLabels[milestone.id]}
						labelPosition={milestone.id === 'flowable' ? 'left' : 'below'}
					/>
				))}

			{/* Current position indicator - extends slightly past last milestone */}
			{isVisible && (
				<CurrentPositionIndicator
					x={Math.min(lastMilestone.x + 35, width - SVG_DIMENSIONS.padding.right - 20)}
					y={lastMilestone.y - 15}
				/>
			)}

			{/* Timeline labels at bottom */}
			<text
				x={SVG_DIMENSIONS.padding.left}
				y={height - 15}
				className="fill-text-secondary font-tech text-[11px]"
			>
				2015
			</text>
			<text
				x={width - SVG_DIMENSIONS.padding.right}
				y={height - 15}
				textAnchor="end"
				className="fill-text-secondary font-tech text-[11px]"
			>
				2026
			</text>
		</svg>
	)
}
