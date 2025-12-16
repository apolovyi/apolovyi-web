'use client'

import { useEffect, useState } from 'react'

import { AnimatePresence, motion } from 'motion/react'

// SBB Train colors
const SBB_RED = '#EB0000'
const SBB_WHITE = '#FFFFFF'

function TrainIcon() {
	return (
		<svg
			width="120"
			height="40"
			viewBox="0 0 120 40"
			fill="none"
		>
			{/* Train body */}
			<rect
				x="10"
				y="12"
				width="85"
				height="20"
				rx="3"
				fill={SBB_WHITE}
				stroke="#DDD"
				strokeWidth="1"
			/>

			{/* SBB Red stripe */}
			<rect
				x="10"
				y="26"
				width="85"
				height="4"
				fill={SBB_RED}
			/>

			{/* Front nose */}
			<path
				d="M95 12 L110 18 L110 26 L95 32 Z"
				fill={SBB_WHITE}
				stroke="#DDD"
				strokeWidth="1"
			/>
			<path
				d="M95 26 L110 23 L110 26 L95 32 Z"
				fill={SBB_RED}
			/>

			{/* Windows */}
			<rect
				x="18"
				y="16"
				width="12"
				height="8"
				rx="1"
				fill="#2A3A4A"
			/>
			<rect
				x="34"
				y="16"
				width="12"
				height="8"
				rx="1"
				fill="#2A3A4A"
			/>
			<rect
				x="50"
				y="16"
				width="12"
				height="8"
				rx="1"
				fill="#2A3A4A"
			/>
			<rect
				x="66"
				y="16"
				width="12"
				height="8"
				rx="1"
				fill="#2A3A4A"
			/>

			{/* Front windshield */}
			<path
				d="M95 16 L105 19 L105 23 L95 26 Z"
				fill="#1A2A3A"
			/>

			{/* Wheels */}
			<circle
				cx="25"
				cy="34"
				r="4"
				fill="#333"
			/>
			<circle
				cx="45"
				cy="34"
				r="4"
				fill="#333"
			/>
			<circle
				cx="65"
				cy="34"
				r="4"
				fill="#333"
			/>
			<circle
				cx="85"
				cy="34"
				r="4"
				fill="#333"
			/>

			{/* Wheel details */}
			<circle
				cx="25"
				cy="34"
				r="2"
				fill="#666"
			/>
			<circle
				cx="45"
				cy="34"
				r="2"
				fill="#666"
			/>
			<circle
				cx="65"
				cy="34"
				r="2"
				fill="#666"
			/>
			<circle
				cx="85"
				cy="34"
				r="2"
				fill="#666"
			/>
		</svg>
	)
}

// Animated track ties
function TrackTies() {
	return (
		<div className="absolute bottom-[18px] left-0 right-0 overflow-hidden">
			<motion.div
				className="flex gap-6"
				animate={{ x: [0, -48] }}
				transition={{ duration: 0.3, repeat: Infinity, ease: 'linear' }}
			>
				{Array.from({ length: 20 }).map((_, i) => (
					<div
						key={i}
						className="h-2 w-6 flex-shrink-0 rounded-sm bg-gray-300"
					/>
				))}
			</motion.div>
		</div>
	)
}

// Track rail
function TrackRail() {
	return (
		<div className="absolute bottom-[26px] left-0 right-0">
			<div className="h-1 w-full bg-gray-400" />
		</div>
	)
}

export function LoadingScreen() {
	const [isLoading, setIsLoading] = useState(true)
	const [isVisible, setIsVisible] = useState(true)

	useEffect(() => {
		// Simple approach: hide after 500ms minimum
		// By the time React hydrates, the page is already interactive
		const timer = setTimeout(() => {
			setIsLoading(false)
		}, 500)

		return () => clearTimeout(timer)
	}, [])

	// Remove from DOM after exit animation completes, then signal ready
	useEffect(() => {
		if (!isLoading) {
			const timer = setTimeout(() => {
				setIsVisible(false)
				// Dispatch event so other components know loading is complete
				window.dispatchEvent(new CustomEvent('loadingScreenComplete'))
			}, 350)
			return () => clearTimeout(timer)
		}
	}, [isLoading])

	if (!isVisible) return null

	return (
		<AnimatePresence>
			{isLoading && (
				<motion.div
					className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
					initial={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					transition={{ duration: 0.3, ease: 'easeIn' }}
				>
					<div className="relative flex flex-col items-center">
						{/* Train with bobbing animation */}
						<motion.div
							animate={{ y: [0, -2, 0] }}
							transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }}
						>
							<TrainIcon />
						</motion.div>

						{/* Track */}
						<div className="relative mt-0 h-8 w-[200px]">
							<TrackRail />
							<TrackTies />
						</div>

						{/* Loading text */}
						<motion.p
							className="mt-4 font-tech text-sm text-gray-500"
							animate={{ opacity: [0.5, 1, 0.5] }}
							transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
						>
							Loading...
						</motion.p>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}
