'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

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

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setThemeState] = useState<Theme>('system')
	const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')
	const [mounted, setMounted] = useState(false)

	// Calculate resolved theme
	const updateResolvedTheme = useCallback((currentTheme: Theme) => {
		const resolved = currentTheme === 'system' ? getSystemTheme() : currentTheme
		setResolvedTheme(resolved)

		// Update document class
		if (resolved === 'dark') {
			document.documentElement.classList.add('dark')
		} else {
			document.documentElement.classList.remove('dark')
		}
	}, [])

	// Initialize theme from localStorage
	useEffect(() => {
		const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
		const initialTheme = stored || 'system'
		setThemeState(initialTheme)
		updateResolvedTheme(initialTheme)
		setMounted(true)
	}, [updateResolvedTheme])

	// Listen for system theme changes
	useEffect(() => {
		if (!mounted) return

		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
		const handleChange = () => {
			if (theme === 'system') {
				updateResolvedTheme('system')
			}
		}

		mediaQuery.addEventListener('change', handleChange)
		return () => mediaQuery.removeEventListener('change', handleChange)
	}, [theme, mounted, updateResolvedTheme])

	const setTheme = useCallback(
		(newTheme: Theme) => {
			setThemeState(newTheme)
			localStorage.setItem(STORAGE_KEY, newTheme)
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
