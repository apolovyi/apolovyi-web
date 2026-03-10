'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	// eslint-disable-next-line no-console
	useEffect(() => console.error('Page error:', error.digest ?? error.message), [error])

	return (
		<div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)] px-6">
			<div className="text-center">
				<h1 className="mb-4 text-5xl font-extralight tracking-tight text-[var(--text-primary)]">Oops</h1>
				<p className="mx-auto mb-8 max-w-sm text-sm leading-relaxed font-light text-[var(--text-body)]">
					Something went wrong. Please try again.
				</p>
				<button
					onClick={() => reset()}
					className="cursor-pointer border border-[var(--dot-color)] px-6 py-3 text-xs tracking-[0.15em] text-[var(--text-link)] uppercase transition-colors duration-200 hover:text-[var(--text-link-hover)]"
				>
					Try Again
				</button>
			</div>
		</div>
	)
}
