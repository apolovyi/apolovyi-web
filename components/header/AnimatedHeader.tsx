'use client'

import React from 'react'

import { motion } from 'motion/react'

export default function AnimatedHeader({
	className,
	finishedLoading,
	children,
}: {
	className: string
	finishedLoading: boolean
	children: React.ReactNode
}) {
	return (
		<motion.header
			initial={{ opacity: 0 }}
			animate={{ opacity: finishedLoading ? 1 : 0 }}
			transition={{ opacity: { duration: 0.3 } }}
			className={className}
		>
			{children}
		</motion.header>
	)
}
