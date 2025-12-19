'use client'

import { useEffect } from 'react'

import { logger } from '@/lib/logger'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	useEffect(() => {
		logger.error('Application error:', error)
	}, [error])

	return (
		<div className="bg-background-primary text-text-primary flex min-h-screen items-center justify-center">
			<div className="px-6 text-center">
				<h1 className="text-accent-coral mb-4 text-6xl font-bold">Oops!</h1>
				<h2 className="text-text-secondary mb-6 text-2xl font-light md:text-3xl">Something went wrong</h2>
				<p className="text-text-secondary/70 mx-auto mb-8 max-w-md">An unexpected error occurred. Please try again.</p>
				<button
					onClick={() => reset()}
					className="border-accent-coral text-accent-coral hover:bg-accent-coral inline-block rounded-sm border px-6 py-3 transition-colors duration-200 hover:text-white"
				>
					Try Again
				</button>
			</div>
		</div>
	)
}
