'use client'

import type { ReactNode } from 'react'
import React, { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

interface JourneyBackgroundProps extends React.HTMLProps<HTMLDivElement> {
	children: ReactNode
	animated?: boolean
}

// Simplified world map path - minimalist dots representing continents
// Journey: Kyiv → Cologne/Munich → Greece → Egypt → South Africa → Zambia/Zimbabwe →
// Fiji → Australia → Chile → Argentina → Colombia → Ecuador → Zurich
const journeyPath = `
  M 180 95
  L 170 100
  L 165 105
  L 190 115
  L 210 135
  L 195 155
  L 195 165
  L 360 170
  L 340 160
  L 280 175
  L 255 165
  L 260 145
  L 255 130
  L 173 100
`

// Key location coordinates (SVG viewBox 400x200)
const locations = [
	{ name: 'Kyiv', x: 180, y: 95, type: 'origin' },
	{ name: 'Germany', x: 168, y: 100, type: 'study' },
	{ name: 'Greece', x: 175, y: 112, type: 'travel' },
	{ name: 'Egypt', x: 190, y: 115, type: 'travel' },
	{ name: 'South Africa', x: 195, y: 155, type: 'travel' },
	{ name: 'Fiji', x: 360, y: 170, type: 'travel' },
	{ name: 'Australia', x: 340, y: 160, type: 'travel' },
	{ name: 'Chile', x: 100, y: 165, type: 'travel' },
	{ name: 'Colombia', x: 95, y: 140, type: 'travel' },
	{ name: 'Zurich', x: 168, y: 102, type: 'current' },
]

// Minimalist continent outlines for context
const continents = `
  M 140 85 Q 155 80 175 85 L 195 82 L 205 90 L 195 100 L 185 105 L 175 115 L 160 118 L 150 110 L 145 100 Z
  M 180 110 L 200 115 L 210 130 L 200 145 L 210 160 L 195 175 L 185 155 L 175 130 Z
  M 280 130 L 300 135 L 310 145 L 350 145 L 365 165 L 340 175 L 310 165 L 280 145 Z
  M 70 100 L 110 95 L 120 105 L 110 140 L 95 175 L 80 175 L 70 150 L 75 120 Z
`

export const JourneyBackground = ({ className, children, animated = true, ...props }: JourneyBackgroundProps) => {
	const pathRef = useRef<SVGPathElement>(null)
	const [pathLength, setPathLength] = useState(0)
	const [isVisible, setIsVisible] = useState(false)

	useEffect(() => {
		if (pathRef.current) {
			setPathLength(pathRef.current.getTotalLength())
		}
		// Small delay to ensure smooth animation start
		const timer = setTimeout(() => setIsVisible(true), 100)
		return () => clearTimeout(timer)
	}, [])

	return (
		<div
			className={cn('relative flex', className)}
			{...props}
		>
			{/* Journey map background */}
			<div className="absolute inset-0 overflow-hidden">
				<svg
					viewBox="0 0 400 200"
					className="absolute inset-0 h-full w-full"
					preserveAspectRatio="xMidYMid slice"
					aria-hidden="true"
				>
					<defs>
						{/* Gradient for the journey path */}
						<linearGradient
							id="journeyGradient"
							x1="0%"
							y1="0%"
							x2="100%"
							y2="0%"
						>
							<stop
								offset="0%"
								style={{ stopColor: 'var(--accent-coral, #c23b3b)', stopOpacity: 0.8 }}
							/>
							<stop
								offset="50%"
								style={{ stopColor: 'var(--accent-coral, #c23b3b)', stopOpacity: 0.5 }}
							/>
							<stop
								offset="100%"
								style={{ stopColor: 'var(--accent-coral, #c23b3b)', stopOpacity: 0.8 }}
							/>
						</linearGradient>

						{/* Glow filter for the path */}
						<filter
							id="glow"
							x="-50%"
							y="-50%"
							width="200%"
							height="200%"
						>
							<feGaussianBlur
								stdDeviation="2"
								result="coloredBlur"
							/>
							<feMerge>
								<feMergeNode in="coloredBlur" />
								<feMergeNode in="SourceGraphic" />
							</feMerge>
						</filter>

						{/* Pulse animation for current location */}
						<radialGradient id="pulseGradient">
							<stop
								offset="0%"
								style={{ stopColor: 'var(--accent-coral, #c23b3b)', stopOpacity: 0.6 }}
							/>
							<stop
								offset="100%"
								style={{ stopColor: 'var(--accent-coral, #c23b3b)', stopOpacity: 0 }}
							/>
						</radialGradient>
					</defs>

					{/* Subtle continent shapes */}
					<path
						d={continents}
						fill="none"
						stroke="currentColor"
						strokeWidth="0.3"
						className="text-neutral-medium-gray opacity-20"
					/>

					{/* Journey path - dashed line */}
					<path
						ref={pathRef}
						d={journeyPath}
						fill="none"
						stroke="url(#journeyGradient)"
						strokeWidth="0.8"
						strokeLinecap="round"
						strokeLinejoin="round"
						filter="url(#glow)"
						className={cn('transition-all duration-1000', animated && isVisible ? 'opacity-60' : 'opacity-0')}
						style={
							animated && pathLength
								? {
										strokeDasharray: pathLength,
										strokeDashoffset: isVisible ? 0 : pathLength,
										transition: 'stroke-dashoffset 3s ease-in-out, opacity 0.5s ease-in-out',
									}
								: undefined
						}
					/>

					{/* Location dots */}
					{locations.map((loc, i) => (
						<g key={loc.name}>
							{/* Pulse effect for current location */}
							{loc.type === 'current' && animated && (
								<circle
									cx={loc.x}
									cy={loc.y}
									r="6"
									fill="url(#pulseGradient)"
									className="animate-ping"
									style={{ animationDuration: '2s' }}
								/>
							)}
							<circle
								cx={loc.x}
								cy={loc.y}
								r={loc.type === 'current' ? 2.5 : loc.type === 'origin' ? 2 : 1.2}
								className={cn(
									'transition-all duration-500',
									loc.type === 'current' && 'fill-accent-coral',
									loc.type === 'origin' && 'fill-accent-coral opacity-70',
									loc.type === 'study' && 'fill-accent-coral opacity-50',
									loc.type === 'travel' && 'fill-neutral-medium-gray opacity-40',
									animated && isVisible ? 'opacity-100' : 'opacity-0',
								)}
								style={{ transitionDelay: animated ? `${0.5 + i * 0.15}s` : '0s' }}
							/>
						</g>
					))}

					{/* Decorative elements - subtle grid */}
					<pattern
						id="grid"
						width="20"
						height="20"
						patternUnits="userSpaceOnUse"
					>
						<circle
							cx="10"
							cy="10"
							r="0.3"
							className="fill-neutral-medium-gray opacity-10"
						/>
					</pattern>
					<rect
						width="100%"
						height="100%"
						fill="url(#grid)"
					/>
				</svg>

				{/* Gradient overlay for text readability */}
				<div className="absolute inset-0 bg-gradient-to-br from-white via-white/95 to-white/90" />
			</div>

			{children}
		</div>
	)
}
