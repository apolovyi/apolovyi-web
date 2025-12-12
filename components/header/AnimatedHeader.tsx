'use client'

import React, { useState } from 'react'

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
	const [hasAnimated, setHasAnimated] = useState(false)

	return (
		<motion.header
			initial={hasAnimated ? false : { opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ opacity: { delay: finishedLoading ? 0 : 4.9, duration: 0 } }}
			onAnimationComplete={() => setHasAnimated(true)}
			className={className}
		>
			{children}
		</motion.header>
	)
}
