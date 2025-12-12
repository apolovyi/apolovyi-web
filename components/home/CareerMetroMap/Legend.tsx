'use client'

import { motion } from 'motion/react'

import { LINE_STYLES } from './constants'
import type { LegendProps } from './types'

export function Legend({ lines, activeLines, visibleLines, onToggleLine }: LegendProps) {
	return (
		<motion.div
			className="flex flex-wrap gap-x-3 gap-y-2 lg:gap-x-4"
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 1, duration: 0.4 }}
		>
			{lines.map((line) => {
				const isActive = activeLines.includes(line.id)
				const isVisible = visibleLines.includes(line.id)
				const strokeStyle = LINE_STYLES[line.pattern] || LINE_STYLES.solid

				return (
					<button
						key={line.id}
						onClick={() => onToggleLine(line.id)}
						className={`flex items-center gap-2 rounded-md px-2 py-1 transition-all ${
							isVisible
								? isActive
									? 'bg-neutral-800/50 opacity-100'
									: 'opacity-80 hover:bg-neutral-800/30'
								: 'opacity-30 hover:opacity-50'
						}`}
						aria-pressed={isVisible}
						aria-label={`${isVisible ? 'Hide' : 'Show'} ${line.label} line`}
					>
						<svg
							width="24"
							height="10"
							className="flex-shrink-0"
						>
							<line
								x1="0"
								y1="5"
								x2="24"
								y2="5"
								stroke={line.color}
								strokeWidth="3"
								strokeLinecap="round"
								strokeDasharray={strokeStyle.strokeDasharray}
								strokeOpacity={isVisible ? 1 : 0.4}
							/>
						</svg>
						<span className={`font-tech text-sm lg:text-xs ${isVisible ? 'text-text-secondary' : 'text-text-secondary/50'}`}>
							{line.label}
						</span>
					</button>
				)
			})}
		</motion.div>
	)
}
