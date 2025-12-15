'use client'

import { type RefObject, useEffect, useRef, useState } from 'react'

import { motion, useReducedMotion } from 'motion/react'
import { createPortal } from 'react-dom'

import { SVG_DIMENSIONS, TIMELINE } from './constants'
import type { LineSegment } from './types'

interface AnimatedTrainProps {
	segment: LineSegment
	animationKey: number
	svgWidth: number
	svgHeight: number
	svgRef?: RefObject<SVGSVGElement | null>
}

// SBB Colors from official design system
const SBB_COLORS = {
	red: '#EB0000',
	charcoal: '#212121',
	white: '#FFFFFF',
}

// Minimal SBB-branded train - clean, iconic, modern
function TrainIcon({ color }: { color: string }) {
	const accentColor = SBB_COLORS.red

	return (
		<g>
			{/* Soft glow using line color */}
			<ellipse
				cx={0}
				cy={0}
				rx={42}
				ry={12}
				fill={color}
				opacity={0.25}
				filter="url(#trainGlow)"
			/>

			{/* Minimal modern train */}
			<g transform="scale(1.5)">
				{/* Shadow */}
				<ellipse
					cx={2}
					cy={10}
					rx={26}
					ry={2.5}
					fill="rgba(0,0,0,0.2)"
				/>

				{/* Clean body - single white shape with rounded front */}
				<path
					d="M-28,-7 L-28,6 L24,6 L30,0 L30,-4 L24,-7 Z"
					fill={SBB_COLORS.white}
					stroke="#CCCCCC"
					strokeWidth={0.5}
				/>

				{/* Iconic SBB red stripe - the key identifier */}
				<rect
					x={-28}
					y={2}
					width={52}
					height={3}
					fill={accentColor}
				/>
				{/* Red stripe curves to front */}
				<path
					d="M24,2 L30,0 L30,1 L24,5 Z"
					fill={accentColor}
				/>

				{/* Simple windows - clean rectangles */}
				<rect
					x={-24}
					y={-5}
					width={10}
					height={5}
					rx={1}
					fill="#2A3A4A"
				/>
				<rect
					x={-12}
					y={-5}
					width={10}
					height={5}
					rx={1}
					fill="#2A3A4A"
				/>
				<rect
					x={0}
					y={-5}
					width={10}
					height={5}
					rx={1}
					fill="#2A3A4A"
				/>
				<rect
					x={12}
					y={-5}
					width={8}
					height={5}
					rx={1}
					fill="#2A3A4A"
				/>

				{/* Window highlight */}
				<rect
					x={-24}
					y={-5}
					width={10}
					height={1.5}
					rx={0.5}
					fill="rgba(255,255,255,0.15)"
				/>
				<rect
					x={-12}
					y={-5}
					width={10}
					height={1.5}
					rx={0.5}
					fill="rgba(255,255,255,0.15)"
				/>
				<rect
					x={0}
					y={-5}
					width={10}
					height={1.5}
					rx={0.5}
					fill="rgba(255,255,255,0.15)"
				/>

				{/* Front windshield */}
				<path
					d="M22,-5 L28,-3 L28,0 L22,1 Z"
					fill="#1A2A3A"
				/>

				{/* Simple undercarriage */}
				<rect
					x={-26}
					y={6}
					width={56}
					height={2.5}
					fill={SBB_COLORS.charcoal}
				/>

				{/* Minimal wheels - just 4 circles */}
				<g fill={SBB_COLORS.charcoal}>
					<circle
						cx={-20}
						cy={9}
						r={2.5}
					/>
					<circle
						cx={-10}
						cy={9}
						r={2.5}
					/>
					<circle
						cx={10}
						cy={9}
						r={2.5}
					/>
					<circle
						cx={20}
						cy={9}
						r={2.5}
					/>
				</g>

				{/* Single clean headlight */}
				<circle
					cx={29}
					cy={-1}
					r={2}
					fill="#FFFFDD"
				/>
				<circle
					cx={29}
					cy={-1}
					r={3}
					fill="#FFFFAA"
					opacity={0.3}
				/>
			</g>
		</g>
	)
}

// Rocket with improved aesthetics
// Unused - portal rocket has inline SVG. Kept for reference.
function _RocketIcon({ color }: { color: string }) {
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

// Intense rocket flames (unused - portal version has inline SVG flames)
function _RocketFlames() {
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

// Portal-based rocket launch that renders outside SVG for proper overflow
function PortalRocketLaunch({
	startX,
	startY,
	svgRef,
	color,
}: {
	startX: number
	startY: number
	svgRef: RefObject<SVGSVGElement | null>
	color: string
}) {
	const [screenPos, setScreenPos] = useState({ x: 0, y: 0, rotation: 0, scale: 1 })
	const [isClient, setIsClient] = useState(false)
	// Store initial SVG position so rocket stays fixed even when user scrolls
	const initialSvgRect = useRef<{ left: number; top: number; scaleX: number; scaleY: number; clampedX: number } | null>(null)

	useEffect(() => {
		setIsClient(true)
	}, [])

	useEffect(() => {
		if (!svgRef.current || !isClient) return

		const duration = 4000 // 4 seconds for vertical flight
		const startTime = Date.now()

		// Capture initial SVG position ONCE at animation start
		const svg = svgRef.current
		const rect = svg.getBoundingClientRect()
		const viewBox = svg.viewBox.baseVal
		const viewportWidth = window.innerWidth

		// Calculate raw X position
		const scaleX = rect.width / viewBox.width
		let rocketX = rect.left + startX * scaleX

		// Clamp X to stay within viewport (with padding for rocket width)
		const rocketHalfWidth = 60
		rocketX = Math.min(Math.max(rocketX, rocketHalfWidth), viewportWidth - rocketHalfWidth)

		initialSvgRect.current = {
			left: rect.left,
			top: rect.top,
			scaleX: rect.width / viewBox.width,
			scaleY: rect.height / viewBox.height,
			clampedX: rocketX, // Pre-calculated clamped X position
		}

		const animateFrame = () => {
			if (!initialSvgRect.current) return

			const elapsed = Date.now() - startTime
			const t = Math.min(elapsed / duration, 1)

			const { top, scaleY, clampedX } = initialSvgRect.current

			// Easing for vertical flight
			let yProgress: number
			if (t < 0.2) {
				const tNorm = t / 0.2
				yProgress = 0.15 * tNorm * tNorm
			} else if (t < 0.8) {
				const tNorm = (t - 0.2) / 0.6
				yProgress = 0.15 + 0.6 * tNorm
			} else {
				const tNorm = (t - 0.8) / 0.2
				yProgress = 0.75 + 0.25 * tNorm * tNorm
			}

			// Calculate SVG coordinates - fly to well above viewport (-500 in SVG coords)
			const totalDistance = startY + 500 // From startY to -500
			const svgY = startY - totalDistance * yProgress

			// Use clamped X position, calculate Y from initial top position
			const screenX = clampedX
			const screenY = top + svgY * scaleY

			// Slight wobble for realism
			const rotation = Math.sin(t * Math.PI * 6) * 3

			setScreenPos({ x: screenX, y: screenY, rotation, scale: scaleX * 0.8 })

			if (t < 1) {
				requestAnimationFrame(animateFrame)
			}
		}

		const frameId = requestAnimationFrame(animateFrame)
		return () => cancelAnimationFrame(frameId)
	}, [startX, startY, svgRef, isClient])

	if (!isClient) return null

	// Render rocket in a portal at document.body level
	return createPortal(
		<div
			style={{
				position: 'fixed',
				left: screenPos.x,
				top: screenPos.y,
				transform: `translate(-50%, -50%) rotate(${screenPos.rotation}deg) scale(${screenPos.scale})`,
				pointerEvents: 'none',
				zIndex: 9999,
			}}
		>
			{/* Rocket SVG rendered as HTML */}
			<svg
				width="120"
				height="300"
				viewBox="-60 -80 120 300"
				style={{ overflow: 'visible' }}
			>
				<defs>
					<linearGradient
						id="portalRocketBody"
						x1="0%"
						y1="0%"
						x2="100%"
						y2="0%"
					>
						<stop
							offset="0%"
							stopColor={color}
						/>
						<stop
							offset="50%"
							stopColor="#ffffff"
							stopOpacity="0.3"
						/>
						<stop
							offset="100%"
							stopColor={color}
						/>
					</linearGradient>
					<linearGradient
						id="portalFlameGradient"
						x1="0%"
						y1="0%"
						x2="0%"
						y2="100%"
					>
						<stop
							offset="0%"
							stopColor="#FFFFFF"
						/>
						<stop
							offset="30%"
							stopColor="#FFFF00"
						/>
						<stop
							offset="60%"
							stopColor="#FFA500"
						/>
						<stop
							offset="100%"
							stopColor="#FF4500"
							stopOpacity="0"
						/>
					</linearGradient>
					<radialGradient
						id="portalWindowGlow"
						cx="50%"
						cy="50%"
						r="50%"
					>
						<stop
							offset="0%"
							stopColor="#88DDFF"
						/>
						<stop
							offset="100%"
							stopColor="#4488AA"
						/>
					</radialGradient>
				</defs>

				{/* Rocket body */}
				<g transform="scale(1.6)">
					{/* Nose cone */}
					<path
						d="M-9,-14 Q0,-32 9,-14"
						fill={color}
					/>
					{/* Body */}
					<rect
						x={-9}
						y={-14}
						width={18}
						height={32}
						rx={2}
						fill="url(#portalRocketBody)"
					/>
					{/* Window */}
					<circle
						cx={0}
						cy={-4}
						r={5}
						fill="url(#portalWindowGlow)"
					/>
					<circle
						cx={0}
						cy={-4}
						r={3}
						fill="#88DDFF"
						opacity={0.8}
					/>
					{/* Fins */}
					<path
						d="M-9,12 L-18,24 L-9,20 Z"
						fill={color}
					/>
					<path
						d="M9,12 L18,24 L9,20 Z"
						fill={color}
					/>
					{/* Center fin */}
					<path
						d="M-3,18 L0,28 L3,18 Z"
						fill={color}
						opacity={0.8}
					/>
				</g>

				{/* Flames */}
				<g transform="translate(0, 55) scale(1.6)">
					<ellipse
						cx={0}
						cy={35}
						rx={18}
						ry={40}
						fill="url(#portalFlameGradient)"
						opacity={0.5}
					>
						<animate
							attributeName="ry"
							values="40;55;45;60;40"
							dur="0.2s"
							repeatCount="indefinite"
						/>
					</ellipse>
					<ellipse
						cx={0}
						cy={28}
						rx={12}
						ry={28}
						fill="url(#portalFlameGradient)"
					>
						<animate
							attributeName="ry"
							values="28;40;30;45;28"
							dur="0.15s"
							repeatCount="indefinite"
						/>
					</ellipse>
					<ellipse
						cx={0}
						cy={22}
						rx={6}
						ry={16}
						fill="#FFFFEE"
					>
						<animate
							attributeName="ry"
							values="16;24;18;28;16"
							dur="0.1s"
							repeatCount="indefinite"
						/>
					</ellipse>
				</g>

				{/* Smoke trail */}
				{[...Array(10)].map((_, i) => (
					<circle
						key={`smoke-${i}`}
						cx={Math.sin(i * 0.8) * 8}
						cy={120 + i * 20}
						r={8 + i * 2}
						fill={i < 3 ? '#FF8844' : i < 6 ? '#AAAAAA' : '#666666'}
						opacity={0.6 - i * 0.05}
					>
						<animate
							attributeName="r"
							values={`${8 + i * 2};${16 + i * 3};${8 + i * 2}`}
							dur="0.6s"
							repeatCount="indefinite"
						/>
						<animate
							attributeName="opacity"
							values={`${0.6 - i * 0.05};0;${0.6 - i * 0.05}`}
							dur="0.6s"
							repeatCount="indefinite"
						/>
					</circle>
				))}
			</svg>
		</div>,
		document.body,
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

export function AnimatedTrain({ segment, animationKey, svgWidth: _svgWidth, svgHeight: _svgHeight, svgRef }: AnimatedTrainProps) {
	const prefersReducedMotion = useReducedMotion()
	const { line, points, hasOngoingStation } = segment
	const [phase, setPhase] = useState<'travel' | 'transform' | 'launch' | 'done'>('travel')
	const [trainX, setTrainX] = useState(0)

	// Calculate positions - offset train above the line so it doesn't overlap stations
	const TRAIN_Y_OFFSET = 15 // Train travels below the line for visibility
	const firstPoint = points[0]
	const startX = firstPoint?.x ?? 0
	const baseY = firstPoint?.y ?? 0
	const y = baseY + TRAIN_Y_OFFSET

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
		const doneTimer = setTimeout(() => setPhase('done'), 10500) // 6200 + 4000 + buffer

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

			{/* Phase 2: Transform - train fades out with sparkle burst, then portal rocket takes over */}
			{phase === 'transform' && (
				<g transform={`translate(${endX}, ${y})`}>
					<motion.g
						initial={{ scale: 1, opacity: 1 }}
						animate={{ scale: 0, opacity: 0, rotate: 15 }}
						transition={{ duration: 0.5, ease: 'easeIn' }}
					>
						<TrainIcon color={line.color} />
					</motion.g>
					<SparkleEffect color={line.color} />
				</g>
			)}

			{/* Phase 3: Rocket launches - rendered via portal for proper overflow */}
			{phase === 'launch' && svgRef && (
				<PortalRocketLaunch
					startX={endX}
					startY={y}
					svgRef={svgRef}
					color={line.color}
				/>
			)}
		</g>
	)
}
