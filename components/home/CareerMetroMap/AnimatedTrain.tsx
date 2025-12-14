'use client'

import { useEffect, useState } from 'react'

import { motion, useReducedMotion } from 'motion/react'

import { SVG_DIMENSIONS, TIMELINE } from './constants'
import type { LineSegment } from './types'

interface AnimatedTrainProps {
	segment: LineSegment
	animationKey: number
	svgWidth: number
	svgHeight: number
}

// Sleek modern train with glow effects
function TrainIcon({ color }: { color: string }) {
	return (
		<g>
			{/* Glow effect */}
			<ellipse
				cx={0}
				cy={0}
				rx={40}
				ry={15}
				fill={color}
				opacity={0.15}
				filter="url(#trainGlow)"
			/>

			{/* Main train body - sleek modern design */}
			<g transform="scale(1.4)">
				{/* Shadow */}
				<ellipse
					cx={0}
					cy={10}
					rx={22}
					ry={3}
					fill="rgba(0,0,0,0.2)"
				/>

				{/* Body with gradient */}
				<rect
					x={-28}
					y={-9}
					width={56}
					height={18}
					rx={6}
					fill="url(#trainBodyGradient)"
				/>

				{/* Chrome trim top */}
				<rect
					x={-28}
					y={-9}
					width={56}
					height={2}
					rx={1}
					fill="rgba(255,255,255,0.4)"
				/>

				{/* Windows with reflection */}
				<rect
					x={-22}
					y={-5}
					width={9}
					height={6}
					rx={1.5}
					fill="#B4DCFF"
				/>
				<rect
					x={-10}
					y={-5}
					width={9}
					height={6}
					rx={1.5}
					fill="#B4DCFF"
				/>
				<rect
					x={2}
					y={-5}
					width={9}
					height={6}
					rx={1.5}
					fill="#B4DCFF"
				/>

				{/* Front windshield - angled */}
				<path
					d="M14,-5 L14,1 L22,1 Q24,1 24,-1 L24,-3 Q24,-5 22,-5 Z"
					fill="#B4DCFF"
				/>

				{/* Window reflections */}
				<rect
					x={-22}
					y={-5}
					width={9}
					height={2}
					rx={0.5}
					fill="rgba(255,255,255,0.3)"
				/>
				<rect
					x={-10}
					y={-5}
					width={9}
					height={2}
					rx={0.5}
					fill="rgba(255,255,255,0.3)"
				/>
				<rect
					x={2}
					y={-5}
					width={9}
					height={2}
					rx={0.5}
					fill="rgba(255,255,255,0.3)"
				/>

				{/* Side stripe */}
				<rect
					x={-28}
					y={2}
					width={56}
					height={2.5}
					fill="rgba(255,255,255,0.5)"
				/>

				{/* Wheels */}
				<g fill="#222">
					<circle
						cx={-18}
						cy={8}
						r={3}
					/>
					<circle
						cx={-8}
						cy={8}
						r={3}
					/>
					<circle
						cx={8}
						cy={8}
						r={3}
					/>
					<circle
						cx={18}
						cy={8}
						r={3}
					/>
				</g>

				{/* Headlight with glow */}
				<circle
					cx={26}
					cy={-2}
					r={2.5}
					fill="#FFE566"
				/>
				<circle
					cx={26}
					cy={-2}
					r={4}
					fill="#FFE566"
					opacity={0.3}
				/>
			</g>
		</g>
	)
}

// Rocket with improved aesthetics
function RocketIcon({ color }: { color: string }) {
	return (
		<g>
			{/* Outer glow */}
			<ellipse
				cx={0}
				cy={0}
				rx={20}
				ry={35}
				fill={color}
				opacity={0.2}
				filter="url(#rocketGlow)"
			/>

			<g transform="scale(1.6)">
				{/* Rocket body with metallic gradient */}
				<ellipse
					cx={0}
					cy={0}
					rx={9}
					ry={22}
					fill="url(#rocketBodyGradient)"
				/>

				{/* Nose cone */}
				<path
					d="M-9,-14 Q0,-32 9,-14"
					fill="url(#rocketBodyGradient)"
				/>
				<path
					d="M-6,-14 Q0,-28 6,-14"
					fill="rgba(255,255,255,0.15)"
				/>

				{/* Window with reflection */}
				<circle
					cx={0}
					cy={-6}
					r={5}
					fill="#B4DCFF"
					stroke="#666"
					strokeWidth={0.8}
				/>
				<circle
					cx={-1.5}
					cy={-7.5}
					r={1.5}
					fill="rgba(255,255,255,0.5)"
				/>

				{/* Body stripes */}
				<rect
					x={-9}
					y={4}
					width={18}
					height={2.5}
					fill="rgba(255,255,255,0.4)"
					rx={1}
				/>
				<rect
					x={-9}
					y={-2}
					width={18}
					height={1}
					fill="rgba(255,255,255,0.2)"
					rx={0.5}
				/>

				{/* Fins with gradient */}
				<path
					d="M-9,12 L-18,24 L-9,18 Z"
					fill={color}
					stroke="#333"
					strokeWidth={0.5}
				/>
				<path
					d="M9,12 L18,24 L9,18 Z"
					fill={color}
					stroke="#333"
					strokeWidth={0.5}
				/>
				<path
					d="M0,12 L0,22 L3,15 L-3,15 Z"
					fill={color}
					stroke="#333"
					strokeWidth={0.5}
				/>
			</g>
		</g>
	)
}

// Intense rocket flames
function RocketFlames() {
	return (
		<g transform="scale(1.6)">
			{/* Outer flame glow */}
			<motion.ellipse
				cx={0}
				cy={35}
				rx={18}
				ry={30}
				fill="url(#flameGradient)"
				opacity={0.4}
				animate={{
					ry: [30, 45, 35, 50, 30],
					rx: [18, 22, 15, 20, 18],
				}}
				transition={{ duration: 0.2, repeat: Infinity, ease: 'easeInOut' }}
			/>
			{/* Main flame */}
			<motion.ellipse
				cx={0}
				cy={28}
				rx={12}
				ry={22}
				fill="url(#flameGradient)"
				animate={{
					ry: [22, 35, 25, 40, 22],
					rx: [12, 16, 10, 14, 12],
				}}
				transition={{ duration: 0.15, repeat: Infinity, ease: 'easeInOut' }}
			/>
			{/* Inner core - white hot */}
			<motion.ellipse
				cx={0}
				cy={22}
				rx={6}
				ry={14}
				fill="#FFFFEE"
				animate={{
					ry: [14, 22, 16, 25, 14],
					rx: [6, 9, 5, 8, 6],
				}}
				transition={{ duration: 0.1, repeat: Infinity, ease: 'easeInOut' }}
			/>
		</g>
	)
}

// Rocket launch with curved trajectory - flies across entire visible area
function RocketLaunch({
	startX,
	startY,
	svgWidth,
	svgHeight,
	color,
}: {
	startX: number
	startY: number
	svgWidth: number
	svgHeight: number
	color: string
}) {
	const [position, setPosition] = useState({ x: startX, y: startY, rotation: -90 })

	useEffect(() => {
		const duration = 6000 // 6 seconds for extended visibility
		const startTime = Date.now()

		// Rocket starts from LEFT side and flies ACROSS the entire screen
		const launchStartX = 50 // Start from left edge of SVG
		const launchEndX = svgWidth + 150 // Exit past right edge
		const totalDistance = launchEndX - launchStartX

		const animateFrame = () => {
			const elapsed = Date.now() - startTime
			const t = Math.min(elapsed / duration, 1)

			// Custom easing optimized for visibility:
			// 0-15%: Slow launch phase (covers 10% of distance)
			// 15-85%: Extended cruise across screen (covers 75% of distance)
			// 85-100%: Explosive exit (covers 15% of distance)
			// Result: rocket visible for ~70% of animation = ~4.2 seconds
			let xProgress: number

			if (t < 0.15) {
				// Slow launch: quadratic ease-in
				const tNorm = t / 0.15
				xProgress = 0.1 * tNorm * tNorm
			} else if (t < 0.85) {
				// Extended cruise: linear movement (covers most of the distance)
				const tNorm = (t - 0.15) / 0.7
				xProgress = 0.1 + 0.75 * tNorm
			} else {
				// Explosive exit: cubic acceleration
				const tNorm = (t - 0.85) / 0.15
				const explosive = tNorm * tNorm * tNorm
				xProgress = 0.85 + 0.15 * explosive
			}

			// X movement: fly across entire visible width
			const x = launchStartX + totalDistance * xProgress

			// Y movement: gentle sine wobble through center of metro map
			const centerY = svgHeight / 2
			const wobble = Math.sin(t * Math.PI * 4) * 25 // 4 gentle wobbles
			const y = centerY + wobble

			// Rotation: mostly horizontal, slight tilt matching wobble direction
			const rotation = -90 + Math.cos(t * Math.PI * 4) * 10

			setPosition({ x, y, rotation })

			if (t < 1) {
				requestAnimationFrame(animateFrame)
			}
		}

		const frameId = requestAnimationFrame(animateFrame)
		return () => cancelAnimationFrame(frameId)
	}, [svgWidth, svgHeight])

	return (
		<g transform={`translate(${position.x}, ${position.y})`}>
			{/* Rocket with dynamic rotation */}
			<g transform={`rotate(${position.rotation})`}>
				<RocketIcon color={color} />
				{/* Flames behind rocket */}
				<g transform="translate(0, 35)">
					<RocketFlames />
				</g>
			</g>

			{/* Dynamic smoke trail based on movement direction */}
			{[...Array(12)].map((_, i) => {
				const trailAngle = ((position.rotation + 90) * Math.PI) / 180
				const offsetX = Math.cos(trailAngle + Math.PI) * (i * 18 + 25)
				const offsetY = Math.sin(trailAngle + Math.PI) * (i * 18 + 25)
				return (
					<motion.circle
						key={`smoke-${i}`}
						cx={offsetX}
						cy={offsetY}
						r={5 + i * 1.2}
						fill={i < 4 ? '#FF8844' : i < 7 ? '#AAAAAA' : '#666666'}
						initial={{ opacity: i < 4 ? 0.7 : 0.5, scale: 1 }}
						animate={{
							opacity: 0,
							scale: 2.5,
						}}
						transition={{
							duration: 0.6,
							delay: i * 0.04,
							ease: 'easeOut',
							repeat: Infinity,
						}}
					/>
				)
			})}

			{/* Spark particles trailing behind */}
			{[...Array(6)].map((_, i) => {
				const trailAngle = ((position.rotation + 90) * Math.PI) / 180
				const spread = (i - 2.5) * 8
				const dist = 40 + i * 15
				return (
					<motion.circle
						key={`spark-${i}`}
						cx={Math.cos(trailAngle + Math.PI) * dist + Math.cos(trailAngle + Math.PI / 2) * spread}
						cy={Math.sin(trailAngle + Math.PI) * dist + Math.sin(trailAngle + Math.PI / 2) * spread}
						r={2.5}
						fill="#FFD700"
						initial={{ opacity: 0.9, scale: 1 }}
						animate={{ opacity: 0, scale: 0.3 }}
						transition={{
							duration: 0.5,
							delay: i * 0.06,
							repeat: Infinity,
						}}
					/>
				)
			})}
		</g>
	)
}

// Sparkle burst effect for transformation
function SparkleEffect({ color }: { color: string }) {
	return (
		<g>
			{[...Array(12)].map((_, i) => {
				const angle = (i * 30 * Math.PI) / 180
				return (
					<motion.line
						key={i}
						x1={0}
						y1={0}
						x2={Math.cos(angle) * 20}
						y2={Math.sin(angle) * 20}
						stroke={color}
						strokeWidth={2.5}
						strokeLinecap="round"
						initial={{ opacity: 0, pathLength: 0 }}
						animate={{
							opacity: [0, 1, 0],
							x2: [0, Math.cos(angle) * 35, Math.cos(angle) * 50],
							y2: [0, Math.sin(angle) * 35, Math.sin(angle) * 50],
						}}
						transition={{ duration: 0.6, ease: 'easeOut' }}
					/>
				)
			})}
			{/* Bright center flash */}
			<motion.circle
				cx={0}
				cy={0}
				r={8}
				fill="white"
				initial={{ opacity: 0, scale: 0 }}
				animate={{ opacity: [0, 1, 0], scale: [0, 2, 0] }}
				transition={{ duration: 0.4 }}
			/>
		</g>
	)
}

export function AnimatedTrain({ segment, animationKey, svgWidth, svgHeight }: AnimatedTrainProps) {
	const prefersReducedMotion = useReducedMotion()
	const { line, points, hasOngoingStation } = segment
	const [phase, setPhase] = useState<'travel' | 'transform' | 'launch' | 'done'>('travel')
	const [trainX, setTrainX] = useState(0)

	// Calculate positions
	const firstPoint = points[0]
	const startX = firstPoint?.x ?? 0
	const y = firstPoint?.y ?? 0

	let endX: number
	if (hasOngoingStation) {
		const { width, padding } = SVG_DIMENSIONS
		const usableWidth = width - padding.left - padding.right
		const currentYear = new Date().getFullYear() + new Date().getMonth() / 12
		endX = padding.left + ((currentYear - TIMELINE.start) / (TIMELINE.end - TIMELINE.start)) * usableWidth
	} else {
		const lastPoint = points[points.length - 1]
		endX = lastPoint?.x ? lastPoint.x + 30 : 600
	}

	// Animate train position with easing
	useEffect(() => {
		if (phase !== 'travel' || prefersReducedMotion) return

		setTrainX(startX)
		const duration = 5500 // 5.5 seconds for travel
		const startTime = Date.now()

		const animateFrame = () => {
			const elapsed = Date.now() - startTime
			const t = Math.min(elapsed / duration, 1)
			// Ease-in-out for smooth train movement
			const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
			const currentX = startX + (endX - startX) * eased
			setTrainX(currentX)

			if (t < 1) {
				requestAnimationFrame(animateFrame)
			}
		}

		const frameId = requestAnimationFrame(animateFrame)
		return () => cancelAnimationFrame(frameId)
	}, [phase, startX, endX, prefersReducedMotion])

	// Phase timing
	useEffect(() => {
		setPhase('travel')
		setTrainX(startX)

		const transformTimer = setTimeout(() => setPhase('transform'), 5500)
		const launchTimer = setTimeout(() => setPhase('launch'), 6200)
		const doneTimer = setTimeout(() => setPhase('done'), 12500) // 6200 + 6000 + buffer

		return () => {
			clearTimeout(transformTimer)
			clearTimeout(launchTimer)
			clearTimeout(doneTimer)
		}
	}, [animationKey, startX])

	if (points.length === 0 || prefersReducedMotion || phase === 'done') return null

	return (
		<g key={`train-${animationKey}`}>
			{/* Gradient and filter definitions */}
			<defs>
				{/* Train body gradient */}
				<linearGradient
					id="trainBodyGradient"
					x1="0%"
					y1="0%"
					x2="0%"
					y2="100%"
				>
					<stop
						offset="0%"
						stopColor={line.color}
					/>
					<stop
						offset="50%"
						stopColor={line.color}
					/>
					<stop
						offset="100%"
						style={{ stopColor: line.color, stopOpacity: 0.7 }}
					/>
				</linearGradient>

				{/* Rocket body gradient */}
				<linearGradient
					id="rocketBodyGradient"
					x1="0%"
					y1="0%"
					x2="100%"
					y2="0%"
				>
					<stop
						offset="0%"
						style={{ stopColor: line.color, stopOpacity: 0.8 }}
					/>
					<stop
						offset="30%"
						stopColor={line.color}
					/>
					<stop
						offset="70%"
						stopColor={line.color}
					/>
					<stop
						offset="100%"
						style={{ stopColor: line.color, stopOpacity: 0.8 }}
					/>
				</linearGradient>

				{/* Flame gradient */}
				<linearGradient
					id="flameGradient"
					x1="0%"
					y1="0%"
					x2="0%"
					y2="100%"
				>
					<stop
						offset="0%"
						stopColor="#FFFF88"
					/>
					<stop
						offset="25%"
						stopColor="#FFCC00"
					/>
					<stop
						offset="50%"
						stopColor="#FF8800"
					/>
					<stop
						offset="75%"
						stopColor="#FF4400"
					/>
					<stop
						offset="100%"
						stopColor="#CC2200"
					/>
				</linearGradient>

				{/* Glow filters */}
				<filter
					id="trainGlow"
					x="-50%"
					y="-50%"
					width="200%"
					height="200%"
				>
					<feGaussianBlur
						stdDeviation="4"
						result="blur"
					/>
					<feMerge>
						<feMergeNode in="blur" />
						<feMergeNode in="SourceGraphic" />
					</feMerge>
				</filter>

				<filter
					id="rocketGlow"
					x="-50%"
					y="-50%"
					width="200%"
					height="200%"
				>
					<feGaussianBlur
						stdDeviation="6"
						result="blur"
					/>
					<feMerge>
						<feMergeNode in="blur" />
						<feMergeNode in="SourceGraphic" />
					</feMerge>
				</filter>
			</defs>

			{/* Phase 1: Train traveling along the line */}
			{phase === 'travel' && (
				<g transform={`translate(${trainX}, ${y})`}>
					<TrainIcon color={line.color} />
				</g>
			)}

			{/* Phase 2: Transform - train morphs into rocket with sparkle burst */}
			{phase === 'transform' && (
				<g transform={`translate(${endX}, ${y})`}>
					<motion.g
						initial={{ scale: 1, opacity: 1 }}
						animate={{ scale: 0, opacity: 0, rotate: 15 }}
						transition={{ duration: 0.35, ease: 'easeIn' }}
					>
						<TrainIcon color={line.color} />
					</motion.g>
					<motion.g
						initial={{ scale: 0, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ duration: 0.35, delay: 0.25, ease: 'backOut' }}
					>
						<RocketIcon color={line.color} />
					</motion.g>
					<SparkleEffect color={line.color} />
				</g>
			)}

			{/* Phase 3: Rocket launches with curved trajectory across screen */}
			{phase === 'launch' && (
				<RocketLaunch
					startX={endX}
					startY={y}
					svgWidth={svgWidth}
					svgHeight={svgHeight}
					color={line.color}
				/>
			)}
		</g>
	)
}
