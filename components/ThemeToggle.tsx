'use client'

import { useTheme } from '@/components/shared/ThemeProvider'

export default function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme()

	return (
		<button
			onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
			className="theme-toggle"
			aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
			data-ui
		>
			<span className="toggle-circle" />
		</button>
	)
}
