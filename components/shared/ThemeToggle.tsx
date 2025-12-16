'use client'

import { motion } from 'motion/react'

import { useTheme } from './ThemeProvider'

type ThemeMode = 'auto' | 'light' | 'dark' | 'system'

const THEME_CYCLE: ThemeMode[] = ['auto', 'light', 'dark']

export function ThemeToggle({ className }: { className?: string }) {
	const { theme, setTheme } = useTheme()

	const cycleTheme = () => {
		const currentIndex = THEME_CYCLE.indexOf(theme as ThemeMode)
		const nextIndex = (currentIndex + 1) % THEME_CYCLE.length
		setTheme(THEME_CYCLE[nextIndex])
	}

	const getAriaLabel = () => {
		switch (theme) {
			case 'auto':
				return 'Auto mode (time-based). Click for light mode'
			case 'light':
				return 'Light mode. Click for dark mode'
			case 'dark':
				return 'Dark mode. Click for auto mode'
			default:
				return 'Toggle theme'
		}
	}

	return (
		<button
			onClick={cycleTheme}
			className={`hover:bg-neutral-light-gray/50 relative flex h-9 w-9 items-center justify-center rounded-full transition-colors ${className}`}
			aria-label={getAriaLabel()}
			title={getAriaLabel()}
		>
			{/* Auto icon (sun + moon) */}
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
					scale: theme === 'auto' ? 1 : 0,
					opacity: theme === 'auto' ? 1 : 0,
				}}
				transition={{ duration: 0.2 }}
			>
				{/* Half sun, half moon */}
				<circle
					cx="12"
					cy="12"
					r="4"
				/>
				<path d="M12 2v2" />
				<path d="M12 20v2" />
				<path d="M4.93 4.93l1.41 1.41" />
				<path d="M17.66 17.66l1.41 1.41" />
				<path d="M2 12h2" />
				<path d="M20 12h2" />
				<path d="M6.34 17.66l-1.41 1.41" />
				<path d="M19.07 4.93l-1.41 1.41" />
			</motion.svg>

			{/* Sun icon (shown in dark mode) */}
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
					scale: theme === 'dark' ? 1 : 0,
					opacity: theme === 'dark' ? 1 : 0,
					rotate: theme === 'dark' ? 0 : -90,
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

			{/* Moon icon (shown in light mode) */}
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
					scale: theme === 'light' ? 1 : 0,
					opacity: theme === 'light' ? 1 : 0,
					rotate: theme === 'light' ? 0 : 90,
				}}
				transition={{ duration: 0.2 }}
			>
				<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
			</motion.svg>
		</button>
	)
}
