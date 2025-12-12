'use client'

import { motion } from 'motion/react'

import { LINE_STYLES } from './constants'
import type { LegendProps } from './types'

export function Legend({ lines, activeLines }: LegendProps) {
	return (
		<motion.div
			className="flex flex-wrap gap-x-4 gap-y-2 lg:gap-x-5"
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 1, duration: 0.4 }}
		>
			{lines.map((line) => {
				const isActive = activeLines.includes(line.id)
				const strokeStyle = LINE_STYLES[line.pattern] || LINE_STYLES.solid

				return (
					<div
						key={line.id}
						className={`flex items-center gap-2 transition-opacity ${isActive ? 'opacity-100' : 'opacity-60'}`}
					>
						<svg
							width="28"
							height="10"
							className="flex-shrink-0"
						>
							<line
								x1="0"
								y1="5"
								x2="28"
								y2="5"
								stroke={line.color}
								strokeWidth="3"
								strokeLinecap="round"
								strokeDasharray={strokeStyle.strokeDasharray}
							/>
						</svg>
						<span className="font-tech text-sm text-text-secondary lg:text-xs">{line.label}</span>
					</div>
				)
			})}
		</motion.div>
	)
}
