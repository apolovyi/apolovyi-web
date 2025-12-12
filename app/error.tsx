'use client'

import { useEffect } from 'react'

import { logger } from '@/lib/logger'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	useEffect(() => {
		logger.error('Application error:', error)
	}, [error])

	return (
		<div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-white">
			<div className="px-6 text-center">
				<h1 className="mb-4 text-6xl font-bold text-[#c23b3b]">Oops!</h1>
				<h2 className="mb-6 text-2xl font-light text-gray-300 md:text-3xl">Something went wrong</h2>
				<p className="mx-auto mb-8 max-w-md text-gray-400">An unexpected error occurred. Please try again.</p>
				<button
					onClick={() => reset()}
					className="inline-block rounded border border-[#c23b3b] px-6 py-3 text-[#c23b3b] transition-colors duration-200 hover:bg-[#c23b3b] hover:text-white"
				>
					Try Again
				</button>
			</div>
		</div>
	)
}
