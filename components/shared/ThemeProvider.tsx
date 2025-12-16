'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system' | 'auto'

interface ThemeContextType {
	theme: Theme
	resolvedTheme: 'light' | 'dark'
	setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const STORAGE_KEY = 'theme'

function getSystemTheme(): 'light' | 'dark' {
	if (typeof window === 'undefined') return 'light'
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getTimeBasedTheme(): 'light' | 'dark' {
	const hour = new Date().getHours()
	// Dark mode from 7pm (19:00) to 7am (07:00)
	return hour >= 19 || hour < 7 ? 'dark' : 'light'
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setThemeState] = useState<Theme>('auto')
	const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')
	const [mounted, setMounted] = useState(false)

	// Calculate resolved theme based on mode
	const getResolvedTheme = useCallback((currentTheme: Theme): 'light' | 'dark' => {
		switch (currentTheme) {
			case 'auto':
				return getTimeBasedTheme()
			case 'system':
				return getSystemTheme()
			default:
				return currentTheme
		}
	}, [])

	// Update resolved theme and DOM
	const updateResolvedTheme = useCallback(
		(currentTheme: Theme) => {
			const resolved = getResolvedTheme(currentTheme)
			setResolvedTheme(resolved)

			// Update document class
			if (resolved === 'dark') {
				document.documentElement.classList.add('dark')
			} else {
				document.documentElement.classList.remove('dark')
			}
		},
		[getResolvedTheme],
	)

	// Initialize theme from localStorage
	useEffect(() => {
		let stored: Theme | null = null
		try {
			stored = localStorage.getItem(STORAGE_KEY) as Theme | null
		} catch {
			// localStorage unavailable (private browsing, disabled, etc.)
		}
		const initialTheme = stored || 'auto'
		setThemeState(initialTheme)
		updateResolvedTheme(initialTheme)
		setMounted(true)
	}, [updateResolvedTheme])

	// Listen for system theme changes (for 'system' mode)
	useEffect(() => {
		if (!mounted || theme !== 'system') return

		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
		const handleChange = () => updateResolvedTheme('system')

		mediaQuery.addEventListener('change', handleChange)
		return () => mediaQuery.removeEventListener('change', handleChange)
	}, [theme, mounted, updateResolvedTheme])

	// Check time periodically for 'auto' mode (every minute)
	useEffect(() => {
		if (!mounted || theme !== 'auto') return

		const interval = setInterval(() => {
			updateResolvedTheme('auto')
		}, 60000) // Check every minute

		return () => clearInterval(interval)
	}, [theme, mounted, updateResolvedTheme])

	const setTheme = useCallback(
		(newTheme: Theme) => {
			setThemeState(newTheme)
			try {
				localStorage.setItem(STORAGE_KEY, newTheme)
			} catch {
				// localStorage unavailable (private browsing, disabled, etc.)
			}
			updateResolvedTheme(newTheme)
		},
		[updateResolvedTheme],
	)

	// Prevent flash by not rendering until mounted
	// The flash prevention script in layout handles initial state
	if (!mounted) {
		return <>{children}</>
	}

	return <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
	const context = useContext(ThemeContext)
	// Return a safe default during SSR or before provider mounts
	if (context === undefined) {
		return {
			theme: 'system' as const,
			resolvedTheme: 'light' as const,
			setTheme: () => {},
		}
	}
	return context
}
