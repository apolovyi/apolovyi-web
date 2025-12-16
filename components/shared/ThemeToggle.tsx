'use client'

import { motion } from 'motion/react'

import { useTheme } from './ThemeProvider'

export function ThemeToggle({ className }: { className?: string }) {
	const { resolvedTheme, setTheme } = useTheme()

	const toggleTheme = () => {
		setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
	}

	return (
		<button
			onClick={toggleTheme}
			className={`hover:bg-neutral-light-gray/50 relative flex h-9 w-9 items-center justify-center rounded-full transition-colors ${className}`}
			aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
		>
			{/* Sun icon */}
			<motion.svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="absolute h-5 w-5 text-text-primary"
				initial={false}
				animate={{
					scale: resolvedTheme === 'dark' ? 1 : 0,
					opacity: resolvedTheme === 'dark' ? 1 : 0,
					rotate: resolvedTheme === 'dark' ? 0 : -90,
				}}
				transition={{ duration: 0.2 }}
			>
				<circle
					cx="12"
					cy="12"
					r="5"
				/>
				<line
					x1="12"
					y1="1"
					x2="12"
					y2="3"
				/>
				<line
					x1="12"
					y1="21"
					x2="12"
					y2="23"
				/>
				<line
					x1="4.22"
					y1="4.22"
					x2="5.64"
					y2="5.64"
				/>
				<line
					x1="18.36"
					y1="18.36"
					x2="19.78"
					y2="19.78"
				/>
				<line
					x1="1"
					y1="12"
					x2="3"
					y2="12"
				/>
				<line
					x1="21"
					y1="12"
					x2="23"
					y2="12"
				/>
				<line
					x1="4.22"
					y1="19.78"
					x2="5.64"
					y2="18.36"
				/>
				<line
					x1="18.36"
					y1="5.64"
					x2="19.78"
					y2="4.22"
				/>
			</motion.svg>

			{/* Moon icon */}
			<motion.svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="absolute h-5 w-5 text-text-primary"
				initial={false}
				animate={{
					scale: resolvedTheme === 'light' ? 1 : 0,
					opacity: resolvedTheme === 'light' ? 1 : 0,
					rotate: resolvedTheme === 'light' ? 0 : 90,
				}}
				transition={{ duration: 0.2 }}
			>
				<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
			</motion.svg>
		</button>
	)
}
