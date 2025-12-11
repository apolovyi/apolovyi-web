'use client'

import { useEffect, useRef, useState } from 'react'

import { motion } from 'motion/react'

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

export function WorldMap({ dots = [], lineColor = '#c23b3b', className }: WorldMapProps) {
	const svgRef = useRef<SVGSVGElement>(null)
	const [isVisible, setIsVisible] = useState(false)
	const [mapSvg, setMapSvg] = useState<string>('')

	useEffect(() => {
		const timer = setTimeout(() => setIsVisible(true), 300)
		return () => clearTimeout(timer)
	}, [])

	useEffect(() => {
		fetch('/world-map.svg')
			.then((res) => res.text())
			.then(setMapSvg)
			.catch(console.error)
	}, [])

	const projectPoint = (lat: number, lng: number) => {
		const x = (lng + 180) * (800 / 360)
		const y = (90 - lat) * (400 / 180)
		return { x, y }
	}

	const createCurvedPath = (start: { x: number; y: number }, end: { x: number; y: number }) => {
		const midX = (start.x + end.x) / 2
		const midY = Math.min(start.y, end.y) - 50
		return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`
	}

	if (!mapSvg) return null

	return (
		<div className={cn('relative h-full w-full', className)}>
			<div
				className="absolute inset-0 h-full w-full [&>svg]:h-full [&>svg]:w-full"
				dangerouslySetInnerHTML={{ __html: mapSvg }}
			/>
			<svg
				ref={svgRef}
				viewBox="0 0 800 400"
				className="absolute inset-0 h-full w-full"
				preserveAspectRatio="xMidYMid slice"
			>
				<defs>
					<linearGradient
						id="path-gradient"
						x1="0%"
						y1="0%"
						x2="100%"
						y2="0%"
					>
						<stop
							offset="0%"
							stopColor={lineColor}
							stopOpacity="0"
						/>
						<stop
							offset="5%"
							stopColor={lineColor}
							stopOpacity="1"
						/>
						<stop
							offset="95%"
							stopColor={lineColor}
							stopOpacity="1"
						/>
						<stop
							offset="100%"
							stopColor={lineColor}
							stopOpacity="0"
						/>
					</linearGradient>
				</defs>

				{dots.map((dot, i) => {
					const startPoint = projectPoint(dot.start.lat, dot.start.lng)
					const endPoint = projectPoint(dot.end.lat, dot.end.lng)
					return (
						<g key={`path-group-${i}`}>
							<motion.path
								d={createCurvedPath(startPoint, endPoint)}
								fill="none"
								stroke="url(#path-gradient)"
								strokeWidth="1"
								initial={{ pathLength: 0, opacity: 0 }}
								animate={isVisible ? { pathLength: 1, opacity: 1 } : {}}
								transition={{
									pathLength: { duration: 1, delay: i * 0.5 },
									opacity: { duration: 0.3, delay: i * 0.5 },
								}}
							/>
						</g>
					)
				})}

				{dots.map((dot, i) => {
					const startPoint = projectPoint(dot.start.lat, dot.start.lng)
					const endPoint = projectPoint(dot.end.lat, dot.end.lng)
					return (
						<g key={`points-group-${i}`}>
							<g key={`start-${i}`}>
								<circle
									cx={startPoint.x}
									cy={startPoint.y}
									r="2"
									fill={lineColor}
								/>
								<circle
									cx={startPoint.x}
									cy={startPoint.y}
									r="2"
									fill={lineColor}
									opacity="0.5"
								>
									<animate
										attributeName="r"
										from="2"
										to="8"
										dur="1.5s"
										begin="0s"
										repeatCount="indefinite"
									/>
									<animate
										attributeName="opacity"
										from="0.5"
										to="0"
										dur="1.5s"
										begin="0s"
										repeatCount="indefinite"
									/>
								</circle>
							</g>
							<g key={`end-${i}`}>
								<circle
									cx={endPoint.x}
									cy={endPoint.y}
									r="2"
									fill={lineColor}
								/>
								<circle
									cx={endPoint.x}
									cy={endPoint.y}
									r="2"
									fill={lineColor}
									opacity="0.5"
								>
									<animate
										attributeName="r"
										from="2"
										to="8"
										dur="1.5s"
										begin="0s"
										repeatCount="indefinite"
									/>
									<animate
										attributeName="opacity"
										from="0.5"
										to="0"
										dur="1.5s"
										begin="0s"
										repeatCount="indefinite"
									/>
								</circle>
							</g>
						</g>
					)
				})}
			</svg>
		</div>
	)
}
