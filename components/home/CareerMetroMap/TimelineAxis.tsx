'use client'

import { motion } from 'motion/react'

import type { TimelineAxisProps } from './types'

export function TimelineAxis({ startYear, endYear, width, y }: TimelineAxisProps) {
	const years: number[] = []
	for (let year = startYear; year <= endYear; year++) {
		years.push(year)
	}

	const getX = (year: number) => {
		return 30 + ((year - startYear) / (endYear - startYear)) * (width - 60)
	}

	return (
		<g>
			{/* Timeline base line */}
			<motion.line
				x1={30}
				y1={y}
				x2={width - 30}
				y2={y}
				stroke="currentColor"
				strokeOpacity={0.2}
				strokeWidth={1}
				initial={{ pathLength: 0 }}
				animate={{ pathLength: 1 }}
				transition={{ duration: 0.8, delay: 0.5 }}
			/>

			{/* Year markers */}
			{years.map((year, index) => {
				const x = getX(year)
				// Show every 2 years to avoid crowding
				const showLabel = year % 2 === 1 || year === endYear

				return (
					<motion.g
						key={year}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.8 + index * 0.05 }}
					>
						<line
							x1={x}
							y1={y - 3}
							x2={x}
							y2={y + 3}
							stroke="currentColor"
							strokeOpacity={showLabel ? 0.3 : 0.15}
							strokeWidth={1}
						/>
						{showLabel && (
							<text
								x={x}
								y={y + 14}
								textAnchor="middle"
								className="fill-text-secondary/70 font-tech text-[9px]"
							>
								{year}
							</text>
						)}
					</motion.g>
				)
			})}
		</g>
	)
}
