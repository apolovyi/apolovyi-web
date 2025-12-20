'use client'

import { useEffect, useRef, useState } from 'react'

import { useReducedMotion } from 'motion/react'

import { cn } from '@/lib/utils'

interface MapDot {
	start: { lat: number; lng: number; label?: string }
	end: { lat: number; lng: number; label?: string }
}

interface WorldMapProps {
	dots?: MapDot[]
	lineColor?: string
	className?: string
}

export function WorldMap({ dots = [], lineColor = 'var(--accent-coral, #c23b3b)', className }: WorldMapProps) {
	const svgRef = useRef<SVGSVGElement>(null)
	const [isVisible, setIsVisible] = useState(false)
	const [mapSvg, setMapSvg] = useState<string>('')
	const prefersReducedMotion = useReducedMotion()

	useEffect(() => {
		const timer = setTimeout(() => setIsVisible(true), 300)
		return () => clearTimeout(timer)
	}, [])

	useEffect(() => {
		fetch('/world-map.svg')
			.then((res) => res.text())
			.then(setMapSvg)
			.catch(() => {
				// Silently fail - map is optional
			})
	}, [])

	// Project to 210×100 coordinate space matching base map SVG
	// x: standard equirectangular
	// y: derived from base map reference points (Cairo, Cape Town)
	const projectPoint = (lat: number, lng: number) => {
		const x = (lng + 180) * (210 / 360)
		const y = (90 - lat) * 0.5 - 1.4
		return { x, y }
	}

	const createCurvedPath = (start: { x: number; y: number }, end: { x: number; y: number }) => {
		const midX = (start.x + end.x) / 2
		const midY = Math.min(start.y, end.y) - 12
		return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`
	}

	if (!mapSvg) return null

	// Animation timing - sequential journey
	const flightDuration = 2 // seconds per flight segment
	const pauseBetweenFlights = 0.5 // pause at each destination
	const segmentDuration = flightDuration + pauseBetweenFlights
	const totalJourneyDuration = dots.length * segmentDuration
	const pulseDuration = 3

	// Build the complete journey path for a single plane
	const allPoints = dots.map((dot) => projectPoint(dot.start.lat, dot.start.lng))
	// Add the final destination
	if (dots.length > 0) {
		const lastDot = dots[dots.length - 1]
		allPoints.push(projectPoint(lastDot.end.lat, lastDot.end.lng))
	}

	// Create a continuous path through all points
	const createJourneyPath = () => {
		if (allPoints.length < 2) return ''
		let path = `M ${allPoints[0].x} ${allPoints[0].y}`
		for (let i = 1; i < allPoints.length; i++) {
			const prev = allPoints[i - 1]
			const curr = allPoints[i]
			const midX = (prev.x + curr.x) / 2
			const midY = Math.min(prev.y, curr.y) - 12
			path += ` Q ${midX} ${midY} ${curr.x} ${curr.y}`
		}
		return path
	}

	const journeyPath = createJourneyPath()

	return (
		<div className={cn('relative h-full w-full', className)}>
			<div
				className="absolute inset-0 h-full w-full [&>svg]:h-full [&>svg]:w-full"
				dangerouslySetInnerHTML={{ __html: mapSvg }}
			/>
			<svg
				ref={svgRef}
				viewBox="0 0 210 100"
				className="absolute inset-0 h-full w-full"
				preserveAspectRatio="xMidYMid meet"
			>
				<defs>
					{/* Glow filter for dots and plane */}
					<filter
						id="dot-glow"
						x="-100%"
						y="-100%"
						width="300%"
						height="300%"
					>
						<feGaussianBlur
							stdDeviation="0.4"
							result="coloredBlur"
						/>
						<feMerge>
							<feMergeNode in="coloredBlur" />
							<feMergeNode in="SourceGraphic" />
						</feMerge>
					</filter>
				</defs>

				{/* Static flight paths - subtle dashed lines showing the route */}
				{isVisible &&
					dots.map((dot, i) => {
						const startPoint = projectPoint(dot.start.lat, dot.start.lng)
						const endPoint = projectPoint(dot.end.lat, dot.end.lng)
						const pathD = createCurvedPath(startPoint, endPoint)

						return (
							<path
								key={`static-path-${i}`}
								d={pathD}
								fill="none"
								style={{ stroke: lineColor }}
								strokeWidth="0.25"
								strokeOpacity="0.3"
								strokeDasharray="1.5 1"
							/>
						)
					})}

				{/* Single animated plane traveling the complete journey */}
				{isVisible && !prefersReducedMotion && journeyPath && (
					<g filter="url(#dot-glow)">
						<path
							id="journey-path"
							d={journeyPath}
							fill="none"
							stroke="none"
						/>
						{/* Plane icon - pointing right (→) for auto-rotate to work correctly */}
						<g>
							<animateMotion
								dur={`${totalJourneyDuration}s`}
								repeatCount="indefinite"
								rotate="auto"
								calcMode="spline"
								keySplines={dots.map(() => '0.4 0 0.2 1').join('; ')}
								keyTimes={dots.map((_, i) => i / dots.length).join('; ') + '; 1'}
							>
								<mpath href="#journey-path" />
							</animateMotion>
							{/* Plane shape - larger, dark with white stroke for visibility */}
							<polygon
								points="-4,-2.5 4,0 -4,2.5 -2,0"
								fill="#1a1a2e"
								stroke="white"
								strokeWidth="0.3"
							/>
						</g>
					</g>
				)}

				{/* Destination dots - only unique locations */}
				{isVisible &&
					allPoints.map((point, i) => {
						const pulseDelay = (i * 0.4) % pulseDuration

						return (
							<g
								key={`destination-${i}`}
								filter="url(#dot-glow)"
							>
								{/* Solid center dot */}
								<circle
									cx={point.x}
									cy={point.y}
									r="1.5"
									style={{ fill: lineColor }}
								/>
								{/* White inner highlight */}
								<circle
									cx={point.x - 0.25}
									cy={point.y - 0.25}
									r="0.4"
									fill="rgba(255,255,255,0.4)"
								/>
								{/* Pulse ring animation - larger and more visible */}
								{!prefersReducedMotion && (
									<circle
										cx={point.x}
										cy={point.y}
										r="1.5"
										fill="none"
										style={{ stroke: lineColor }}
										strokeWidth="0.6"
									>
										<animate
											attributeName="r"
											values="1.5;5;1.5"
											dur={`${pulseDuration}s`}
											begin={`${pulseDelay}s`}
											repeatCount="indefinite"
										/>
										<animate
											attributeName="opacity"
											values="0.6;0;0.6"
											dur={`${pulseDuration}s`}
											begin={`${pulseDelay}s`}
											repeatCount="indefinite"
										/>
										<animate
											attributeName="stroke-width"
											values="0.6;0.15;0.6"
											dur={`${pulseDuration}s`}
											begin={`${pulseDelay}s`}
											repeatCount="indefinite"
										/>
									</circle>
								)}
							</g>
						)
					})}
			</svg>
		</div>
	)
}
