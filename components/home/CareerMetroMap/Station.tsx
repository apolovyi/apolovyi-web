'use client'

import { motion, useReducedMotion } from 'motion/react'

import { ANIMATION_CONFIG, getStationSize } from './constants'
import type { StationProps } from './types'

export function Station({ position, isActive, lineColors, onClick, onHover, isPrimary = true }: StationProps) {
	const prefersReducedMotion = useReducedMotion()
	const { station, x, y } = position
	const size = isPrimary ? getStationSize(station.tenureMonths) : getStationSize(station.tenureMonths) * 0.8

	// Use first line color or default
	const primaryColor = lineColors[0] || '#c23b3b'

	return (
		<g
			className="cursor-pointer outline-none focus:outline-none"
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
			aria-label={`${station.company}, ${station.role.en}, ${station.period.start} to ${station.period.end === 'present' ? 'present' : station.period.end}`}
		>
			{/* Outer ring for active/focus state */}
			{isActive && (
				<motion.circle
					cx={x}
					cy={y}
					r={size + 4}
					fill="none"
					stroke={primaryColor}
					strokeWidth={2}
					initial={prefersReducedMotion ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }}
				/>
			)}

			{/* Main station dot */}
			<motion.circle
				cx={x}
				cy={y}
				r={size}
				fill={isActive ? primaryColor : '#1a1a1a'}
				stroke={primaryColor}
				strokeWidth={2}
				initial={prefersReducedMotion ? { scale: 1 } : { scale: 0 }}
				animate={{ scale: 1 }}
				transition={
					prefersReducedMotion
						? { duration: 0 }
						: {
								type: 'spring',
								stiffness: 300,
								damping: 20,
								delay: ANIMATION_CONFIG.stationDelay,
							}
				}
			/>

			{/* Pulse animation for current position - only on primary and if motion allowed */}
			{isPrimary && station.period.end === 'present' && !prefersReducedMotion && (
				<circle
					cx={x}
					cy={y}
					r={size}
					fill={primaryColor}
					opacity="0.4"
				>
					<animate
						attributeName="r"
						from={String(size)}
						to={String(size + 12)}
						dur="2s"
						repeatCount="indefinite"
					/>
					<animate
						attributeName="opacity"
						from="0.4"
						to="0"
						dur="2s"
						repeatCount="indefinite"
					/>
				</circle>
			)}
		</g>
	)
}
