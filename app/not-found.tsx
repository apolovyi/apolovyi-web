import Link from 'next/link'

export default function NotFound() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)] px-6">
			<div className="text-center">
				<h1 className="mb-4 text-8xl font-extralight tracking-tight text-[var(--text-primary)]">404</h1>
				<p className="mx-auto mb-8 max-w-sm text-sm leading-relaxed font-light text-[var(--text-body)]">
					The page you&apos;re looking for doesn&apos;t exist or has been moved.
				</p>
				<Link
					href="/"
					className="border border-[var(--dot-color)] px-6 py-3 text-xs tracking-[0.15em] text-[var(--text-link)] uppercase transition-colors duration-200 hover:text-[var(--text-link-hover)]"
				>
					Go Home
				</Link>
			</div>
		</div>
	)
}
