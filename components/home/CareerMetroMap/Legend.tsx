'use client'

import { motion } from 'motion/react'

import { LINE_STYLES } from './constants'
import type { LegendProps } from './types'

export function Legend({ lines, activeLines, visibleLines, onToggleLine }: LegendProps) {
	const isSoloMode = visibleLines.length === 1

	return (
		<motion.div
			className="flex flex-wrap items-center gap-x-4 gap-y-1.5 sm:gap-x-5"
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 1, duration: 0.4 }}
		>
			{lines.map((line) => {
				const isActive = activeLines.includes(line.id)
				const isVisible = visibleLines.includes(line.id)
				const isSoloed = isSoloMode && isVisible
				const strokeStyle = LINE_STYLES[line.pattern] || LINE_STYLES.solid

				return (
					<button
						key={line.id}
						onClick={() => onToggleLine(line.id)}
						className={`group flex items-center gap-1.5 py-0.5 transition-all ${
							isVisible ? (isActive || isSoloed ? 'opacity-100' : 'opacity-70 hover:opacity-90') : 'opacity-30 hover:opacity-50'
						} ${isSoloed ? 'bg-text-secondary/10 -mx-2 rounded-full px-2' : ''}`}
						aria-pressed={isVisible}
						aria-label={isSoloed ? `Show all lines (${line.label} is soloed)` : `Solo ${line.label} line`}
					>
						<svg
							width="16"
							height="6"
							viewBox="0 0 20 6"
							className="flex-shrink-0"
						>
							<line
								x1="0"
								y1="3"
								x2="20"
								y2="3"
								stroke={line.color}
								strokeWidth="2"
								strokeLinecap="round"
								strokeDasharray={strokeStyle.strokeDasharray}
								strokeOpacity={isVisible ? 1 : 0.4}
							/>
						</svg>
						<span
							className={`font-tech text-[10px] tracking-wide uppercase ${
								isVisible ? 'text-text-secondary' : 'text-text-secondary/50 line-through'
							}`}
						>
							{line.label}
						</span>
					</button>
				)
			})}
		</motion.div>
	)
}
