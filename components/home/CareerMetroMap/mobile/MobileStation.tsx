'use client'

import { motion } from 'motion/react'

import { type CareerStation, stationIdToDictionaryKey } from '@/lib/career-data'

import { SBB_COLORS, STATION_CONFIG } from './constants'

interface MobileStationProps {
	id: string
	x: number
	y: number
	station: CareerStation
	isActive: boolean
	onSelect: (dictionaryKey: string) => void
	index: number
}

// Truncate company name if too long
function truncateCompany(name: string, maxLength: number = 20): string {
	if (name.length <= maxLength) return name
	return name.substring(0, maxLength - 1) + '…'
}

export function MobileStation({ id, x, y, station, isActive, onSelect, index }: MobileStationProps) {
	const isCurrentJob = station.period.end === 'present' && !station.isVolunteer

	// Alternate label position based on index (even = right, odd = left)
	const labelOnRight = index % 2 === 0

	// Get primary line color for the station
	const primaryLineColor = station.lines[0] === 'backend' ? '#3B82F6' : station.lines[0] === 'frontend' ? '#10B981' : '#8B5CF6'

	// Truncate long company names for better fit
	const displayName = truncateCompany(station.company)

	const handleClick = () => {
		onSelect(stationIdToDictionaryKey(id))
	}

	return (
		<g
			onClick={handleClick}
			style={{ cursor: 'pointer' }}
			role="button"
			aria-label={`${station.company} - ${station.role.en}`}
			tabIndex={0}
			onKeyDown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault()
					handleClick()
				}
			}}
		>
			{/* Hit area - larger invisible circle for easier tapping */}
			<circle
				cx={x}
				cy={y}
				r={30}
				fill="transparent"
			/>

			{/* Pulse animation for current job */}
			{isCurrentJob && (
				<motion.circle
					cx={x}
					cy={y}
					r={STATION_CONFIG.radius.pulse}
					fill={SBB_COLORS.red}
					initial={{ opacity: 0.4, scale: 1 }}
					animate={{
						opacity: [0.4, 0, 0.4],
						scale: [1, 1.5, 1],
					}}
					transition={{
						duration: 2,
						repeat: Infinity,
						ease: 'easeInOut',
					}}
				/>
			)}

			{/* Active state glow */}
			{isActive && (
				<circle
					cx={x}
					cy={y}
					r={STATION_CONFIG.radius.active + 4}
					fill={primaryLineColor}
					opacity={0.2}
				/>
			)}

			{/* Station dot */}
			<motion.circle
				cx={x}
				cy={y}
				r={isActive ? STATION_CONFIG.radius.active : STATION_CONFIG.radius.normal}
				fill={isCurrentJob ? SBB_COLORS.red : isActive ? primaryLineColor : '#64748B'}
				stroke="#FFFFFF"
				strokeWidth={2}
				initial={{ scale: 0 }}
				animate={{ scale: 1 }}
				transition={{ duration: 0.3, delay: 0.1 }}
			/>

			{/* Company name label - positioned to alternating sides */}
			<g>
				<text
					x={labelOnRight ? x + STATION_CONFIG.labelOffset : x - STATION_CONFIG.labelOffset}
					y={y - 2}
					textAnchor={labelOnRight ? 'start' : 'end'}
					className="fill-text-primary font-tech text-[10px] font-medium"
					dominantBaseline="middle"
				>
					{displayName}
				</text>

				{/* "Now" badge for current job - above the station */}
				{isCurrentJob && (
					<g transform={`translate(${x}, ${y - 22})`}>
						<rect
							x={-12}
							y={-7}
							width={24}
							height={14}
							rx={7}
							fill={SBB_COLORS.red}
						/>
						<text
							x={0}
							y={0}
							textAnchor="middle"
							dominantBaseline="middle"
							className="fill-white font-tech text-[7px] font-bold uppercase"
						>
							Now
						</text>
					</g>
				)}
			</g>

			{/* Period text below label */}
			<text
				x={labelOnRight ? x + STATION_CONFIG.labelOffset : x - STATION_CONFIG.labelOffset}
				y={y + 10}
				textAnchor={labelOnRight ? 'start' : 'end'}
				className="fill-text-secondary/60 font-tech text-[8px]"
			>
				{station.period.start} - {station.period.end === 'present' ? 'Present' : station.period.end}
			</text>
		</g>
	)
}
