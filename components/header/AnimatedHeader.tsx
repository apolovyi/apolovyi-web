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
			animate={{ opacity: 1 }}
			transition={{ opacity: { delay: finishedLoading ? 0 : 4.9, duration: 0 } }}
			className={className}
		>
			{children}
		</motion.header>
	)
}
