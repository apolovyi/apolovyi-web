'use client'

import React from 'react'

import { motion } from 'motion/react'

import { useHeaderContext } from '@/components/header/menu/HeaderContext'

function IconMenu() {
	const { rotate, setRotate, showElement, setShowElement } = useHeaderContext()

	return (
		<button
			className="inline-flex h-12 w-12 flex-col items-center justify-center text-text-primary md:hidden"
			onClick={() => {
				setRotate(!rotate)
				setShowElement(!showElement)
			}}
			type="button"
			aria-label={rotate ? 'Close menu' : 'Open menu'}
			aria-expanded={rotate}
		>
			<div
				className="relative h-7 w-8"
				aria-hidden="true"
			>
				<motion.span
					className="absolute left-0 top-1/2 h-0.5 w-8 origin-center -translate-y-1/2 rounded-sm bg-accent-coral"
					initial={{ y: -10, rotate: 0 }}
					animate={rotate ? { y: 0, rotate: 45 } : { y: -10, rotate: 0 }}
					transition={{ duration: 0.2, ease: 'easeInOut' }}
				/>
				<motion.span
					className="absolute left-0 top-1/2 h-0.5 w-8 origin-center -translate-y-1/2 rounded-sm bg-accent-coral"
					initial={{ opacity: 1 }}
					animate={rotate ? { opacity: 0 } : { opacity: 1 }}
					transition={{ duration: 0.2, ease: 'easeInOut' }}
				/>
				<motion.span
					className="absolute left-0 top-1/2 h-0.5 w-8 origin-center -translate-y-1/2 rounded-sm bg-accent-coral"
					initial={{ y: 10, rotate: 0 }}
					animate={rotate ? { y: 0, rotate: -45 } : { y: 10, rotate: 0 }}
					transition={{ duration: 0.2, ease: 'easeInOut' }}
				/>
			</div>
		</button>
	)
}

export default IconMenu
