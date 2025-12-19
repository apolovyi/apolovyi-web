'use client'

import { motion, useReducedMotion } from 'motion/react'

import { getStationAriaLabel, getStationTitle } from '@/lib/career-data'

import { ANIMATION_CONFIG, getStationSize } from './constants'
import type { StationProps } from './types'

export function Station({ position, isActive, lineColors, onClick, onHover, isPrimary = true, showCurrentJobPulse = true }: StationProps) {
	const prefersReducedMotion = useReducedMotion()
	const { station, x, y } = position
	const size = isPrimary ? getStationSize(station.tenureMonths) : getStationSize(station.tenureMonths) * 0.85

	// Use first line color or default
	const primaryColor = lineColors[0] || 'var(--accent-coral, #c23b3b)'

	// Special treatment for career break
	const isCareerBreak = station.id === 'career-break'
	const isCurrentJob = station.period.end === 'present'
	// Only show pulse for actual current employer, not volunteers
	const isCurrentEmployer = isCurrentJob && !station.isVolunteer

	// Globe icon is larger for visibility
	const globeSize = size * 2.2

	return (
		<g
			className="outline-hidden focus:outline-hidden"
			style={{ cursor: 'pointer' }}
			onClick={onClick}
			onMouseEnter={() => onHover(true)}
			onMouseLeave={() => onHover(false)}
			onFocus={() => onHover(true)}
			onBlur={() => onHover(false)}
			role="button"
			tabIndex={isPrimary ? 0 : -1}
			onKeyDown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault()
					onClick()
				}
			}}
			aria-label={getStationAriaLabel(station, station.shortName)}
		>
			<title>{getStationTitle(station)}</title>
			{/* Invisible hit area for touch */}
			<circle
				cx={x}
				cy={y}
				r={Math.max(22, size + 10)}
				fill="transparent"
			/>

			{/* Enhanced sonar pulse for current job (PEAX) - multiple staggered rings */}
			{/* Only shows when no station is focused (selected or hovered) */}
			{isPrimary && isCurrentEmployer && !prefersReducedMotion && showCurrentJobPulse && (
				<>
					{/* Ring 1 - fastest, smallest */}
					<circle
						cx={x}
						cy={y}
						r={size}
						fill="none"
						stroke={primaryColor}
						strokeWidth={2}
						opacity={0.6}
					>
						<animate
							attributeName="r"
							from={String(size)}
							to={String(size + 20)}
							dur="2s"
							repeatCount="indefinite"
						/>
						<animate
							attributeName="opacity"
							from="0.6"
							to="0"
							dur="2s"
							repeatCount="indefinite"
						/>
						<animate
							attributeName="stroke-width"
							from="2"
							to="0.5"
							dur="2s"
							repeatCount="indefinite"
						/>
					</circle>
					{/* Ring 2 - medium, delayed */}
					<circle
						cx={x}
						cy={y}
						r={size}
						fill="none"
						stroke={primaryColor}
						strokeWidth={1.5}
						opacity={0}
					>
						<animate
							attributeName="r"
							from={String(size)}
							to={String(size + 25)}
							dur="2s"
							begin="0.5s"
							repeatCount="indefinite"
						/>
						<animate
							attributeName="opacity"
							values="0;0.5;0"
							dur="2s"
							begin="0.5s"
							repeatCount="indefinite"
						/>
						<animate
							attributeName="stroke-width"
							from="1.5"
							to="0.3"
							dur="2s"
							begin="0.5s"
							repeatCount="indefinite"
						/>
					</circle>
					{/* Ring 3 - slowest, largest reach */}
					<circle
						cx={x}
						cy={y}
						r={size}
						fill="none"
						stroke={primaryColor}
						strokeWidth={1}
						opacity={0}
					>
						<animate
							attributeName="r"
							from={String(size)}
							to={String(size + 30)}
							dur="2s"
							begin="1s"
							repeatCount="indefinite"
						/>
						<animate
							attributeName="opacity"
							values="0;0.4;0"
							dur="2s"
							begin="1s"
							repeatCount="indefinite"
						/>
						<animate
							attributeName="stroke-width"
							from="1"
							to="0.2"
							dur="2s"
							begin="1s"
							repeatCount="indefinite"
						/>
					</circle>
					{/* Soft glow behind current station */}
					<circle
						cx={x}
						cy={y}
						r={size + 4}
						fill={primaryColor}
						opacity={0.15}
					/>
				</>
			)}

			{/* Glow effect for active state - enhanced */}
			{isActive && (
				<>
					{/* Outer glow */}
					<motion.circle
						cx={x}
						cy={y}
						r={size + 8}
						fill={primaryColor}
						opacity={0.1}
						initial={prefersReducedMotion ? { scale: 1 } : { scale: 0 }}
						animate={{ scale: 1 }}
						transition={{ duration: 0.3 }}
					/>
					{/* Inner glow */}
					<motion.circle
						cx={x}
						cy={y}
						r={size + 4}
						fill={primaryColor}
						opacity={0.2}
						initial={prefersReducedMotion ? { scale: 1 } : { scale: 0 }}
						animate={{ scale: 1 }}
						transition={{ duration: 0.2 }}
					/>
				</>
			)}

			{/* Main station dot with hover scale effect */}
			<motion.g
				style={{ transformOrigin: `${x}px ${y}px` }}
				animate={{ scale: isActive ? 1.2 : 1 }}
				transition={{ type: 'spring', stiffness: 400, damping: 25 }}
			>
				{isCareerBreak ? (
					// Globe icon for career break - larger and more prominent
					<motion.g
						initial={prefersReducedMotion ? { scale: 1 } : { scale: 0 }}
						animate={{ scale: 1 }}
						style={{ transformOrigin: `${x}px ${y}px` }}
						transition={
							prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 20, delay: ANIMATION_CONFIG.stationDelay }
						}
					>
						{/* Globe circle */}
						<circle
							cx={x}
							cy={y}
							r={globeSize}
							fill={isActive ? primaryColor : 'var(--bg-primary)'}
							stroke={primaryColor}
							strokeWidth={2}
						/>
						{/* Vertical meridian */}
						<ellipse
							cx={x}
							cy={y}
							rx={globeSize * 0.35}
							ry={globeSize * 0.85}
							fill="none"
							stroke={isActive ? 'rgba(255,255,255,0.7)' : primaryColor}
							strokeWidth={1}
						/>
						{/* Horizontal equator */}
						<line
							x1={x - globeSize * 0.85}
							y1={y}
							x2={x + globeSize * 0.85}
							y2={y}
							stroke={isActive ? 'rgba(255,255,255,0.7)' : primaryColor}
							strokeWidth={1}
						/>
					</motion.g>
				) : (
					// Modern station dot - solid with white ring
					<motion.g
						initial={prefersReducedMotion ? { scale: 1 } : { scale: 0 }}
						animate={{ scale: 1 }}
						style={{ transformOrigin: `${x}px ${y}px` }}
						transition={
							prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 20, delay: ANIMATION_CONFIG.stationDelay }
						}
					>
						{/* White ring (background) */}
						<circle
							cx={x}
							cy={y}
							r={size + 2}
							fill="var(--bg-primary)"
							stroke="var(--bg-primary)"
							strokeWidth={2}
						/>
						{/* Solid colored dot */}
						<circle
							cx={x}
							cy={y}
							r={size}
							fill={primaryColor}
							stroke={isActive ? 'rgba(255,255,255,0.5)' : 'none'}
							strokeWidth={isActive ? 2 : 0}
						/>
						{/* Subtle inner highlight for depth */}
						{!isActive && (
							<circle
								cx={x - size * 0.25}
								cy={y - size * 0.25}
								r={size * 0.35}
								fill="rgba(255,255,255,0.3)"
							/>
						)}
					</motion.g>
				)}
			</motion.g>
		</g>
	)
}
