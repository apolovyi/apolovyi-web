'use client'

import React, { useEffect, useState } from 'react'

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
	const [shouldAnimate, setShouldAnimate] = useState(false)

	// Only trigger animation once loading completes
	useEffect(() => {
		if (finishedLoading && !shouldAnimate) {
			setShouldAnimate(true)
		}
	}, [finishedLoading, shouldAnimate])

	return (
		<motion.header
			key={shouldAnimate ? 'animate' : 'static'}
			initial={shouldAnimate ? { opacity: 0 } : false}
			animate={{ opacity: 1 }}
			transition={{ opacity: { delay: 0, duration: 0.3 } }}
			className={className}
		>
			{children}
		</motion.header>
	)
}
