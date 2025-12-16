'use client'

import { useMemo } from 'react'

import { MOBILE_SVG, PARALLAX_CONFIG, SCENERY_COLORS } from './constants'

interface SwissSceneryProps {
	scrollProgress: number // 0 to 1
}

// Generate mountain path for a given y position
function generateMountainPath(baseY: number, amplitude: number, peaks: number, seed: number): string {
	const { width } = MOBILE_SVG.viewBox
	const points: { x: number; y: number }[] = []

	// Start from left edge
	points.push({ x: 0, y: baseY })

	// Generate peaks
	for (let i = 0; i <= peaks; i++) {
		const x = (i / peaks) * width
		// Use seed to create consistent but varied heights
		const heightVariation = Math.sin(seed + i * 1.5) * amplitude * 0.5
		const peakHeight = baseY - amplitude - heightVariation

		if (i > 0 && i < peaks) {
			// Add peak
			points.push({ x: x - width / peaks / 3, y: baseY - amplitude * 0.3 })
			points.push({ x, y: peakHeight })
			points.push({ x: x + width / peaks / 3, y: baseY - amplitude * 0.3 })
		}
	}

	// End at right edge
	points.push({ x: width, y: baseY })

	// Create smooth path
	let path = `M ${points[0].x} ${points[0].y}`
	for (let i = 1; i < points.length; i++) {
		const prev = points[i - 1]
		const curr = points[i]
		const cpX = (prev.x + curr.x) / 2
		path += ` Q ${cpX} ${prev.y}, ${curr.x} ${curr.y}`
	}

	// Close path at bottom
	path += ` L ${width} ${MOBILE_SVG.viewBox.height} L 0 ${MOBILE_SVG.viewBox.height} Z`

	return path
}

// Generate simple tree shape
function Tree({ x, y, scale = 1, opacity = 0.6 }: { x: number; y: number; scale?: number; opacity?: number }) {
	return (
		<g
			transform={`translate(${x}, ${y}) scale(${scale})`}
			opacity={opacity}
		>
			{/* Tree trunk */}
			<rect
				x={-2}
				y={0}
				width={4}
				height={12}
				fill="#5D4E37"
			/>
			{/* Tree foliage - simple triangle */}
			<path
				d="M0 -20 L-10 0 L10 0 Z"
				fill={SCENERY_COLORS.trees}
			/>
			<path
				d="M0 -30 L-8 -10 L8 -10 Z"
				fill={SCENERY_COLORS.trees}
			/>
		</g>
	)
}

export function SwissScenery({ scrollProgress }: SwissSceneryProps) {
	// Calculate parallax offsets
	const farOffset = scrollProgress * MOBILE_SVG.viewBox.height * PARALLAX_CONFIG.farMountains
	const nearOffset = scrollProgress * MOBILE_SVG.viewBox.height * PARALLAX_CONFIG.nearMountains
	const treeOffset = scrollProgress * MOBILE_SVG.viewBox.height * PARALLAX_CONFIG.trees

	// Generate mountain paths (memoized to avoid recalculation)
	const farMountainPath = useMemo(() => generateMountainPath(500, 80, 5, 1), [])
	const nearMountainPath = useMemo(() => generateMountainPath(550, 60, 4, 2), [])

	// Tree positions (scattered along the sides - kept within safe bounds)
	const trees = useMemo(
		() => [
			{ x: 30, y: 200, scale: 0.8, opacity: 0.4 },
			{ x: 50, y: 350, scale: 1, opacity: 0.5 },
			{ x: 330, y: 280, scale: 0.9, opacity: 0.45 },
			{ x: 310, y: 450, scale: 1.1, opacity: 0.5 },
			{ x: 60, y: 520, scale: 0.7, opacity: 0.35 },
			{ x: 300, y: 600, scale: 0.85, opacity: 0.4 },
		],
		[],
	)

	return (
		<g clipPath="url(#sceneryClip)">
			{/* Clip path and gradients */}
			<defs>
				{/* Clip path to prevent horizontal overflow */}
				<clipPath id="sceneryClip">
					<rect
						x={0}
						y={0}
						width={MOBILE_SVG.viewBox.width}
						height={MOBILE_SVG.viewBox.height}
					/>
				</clipPath>
				<linearGradient
					id="skyGradient"
					x1="0%"
					y1="0%"
					x2="0%"
					y2="100%"
				>
					<stop
						offset="0%"
						stopColor={SCENERY_COLORS.sky.top}
					/>
					<stop
						offset="100%"
						stopColor={SCENERY_COLORS.sky.bottom}
					/>
				</linearGradient>
			</defs>

			{/* Sky */}
			<rect
				x={0}
				y={0}
				width={MOBILE_SVG.viewBox.width}
				height={MOBILE_SVG.viewBox.height}
				fill="url(#skyGradient)"
				opacity={0.3}
			/>

			{/* Far mountains - slowest parallax */}
			<g transform={`translate(0, ${-farOffset})`}>
				<path
					d={farMountainPath}
					fill={SCENERY_COLORS.mountains.far}
					opacity={0.4}
				/>
			</g>

			{/* Near mountains - medium parallax */}
			<g transform={`translate(0, ${-nearOffset})`}>
				<path
					d={nearMountainPath}
					fill={SCENERY_COLORS.mountains.near}
					opacity={0.3}
				/>
			</g>

			{/* Trees - fastest parallax */}
			<g transform={`translate(0, ${-treeOffset})`}>
				{trees.map((tree, index) => (
					<Tree
						key={index}
						{...tree}
					/>
				))}
			</g>

			{/* Ground/grass at bottom */}
			<rect
				x={0}
				y={MOBILE_SVG.viewBox.height - 60}
				width={MOBILE_SVG.viewBox.width}
				height={60}
				fill={SCENERY_COLORS.ground}
				opacity={0.3}
			/>
		</g>
	)
}
