import Link from 'next/link'

export default function NotFound() {
	return (
		<div className="bg-background-primary text-text-primary flex min-h-screen items-center justify-center">
			<div className="px-6 text-center">
				<h1 className="text-accent-coral mb-4 text-8xl font-bold">404</h1>
				<h2 className="text-text-secondary mb-6 text-2xl font-light md:text-3xl">Page Not Found</h2>
				<p className="text-text-secondary/70 mx-auto mb-8 max-w-md">
					The page you&apos;re looking for doesn&apos;t exist or has been moved.
				</p>
				<Link
					href="/en"
					className="border-accent-coral text-accent-coral hover:bg-accent-coral inline-block rounded-sm border px-6 py-3 transition-colors duration-200 hover:text-white"
				>
					Go Home
				</Link>
			</div>
		</div>
	)
}
