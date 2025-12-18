import Link from 'next/link'

export default function NotFound() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-white">
			<div className="px-6 text-center">
				<h1 className="mb-4 text-8xl font-bold text-[#c23b3b]">404</h1>
				<h2 className="mb-6 text-2xl font-light text-gray-300 md:text-3xl">Page Not Found</h2>
				<p className="mx-auto mb-8 max-w-md text-gray-400">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
				<Link
					href="/en"
					className="inline-block rounded-sm border border-[#c23b3b] px-6 py-3 text-[#c23b3b] transition-colors duration-200 hover:bg-[#c23b3b] hover:text-white"
				>
					Go Home
				</Link>
			</div>
		</div>
	)
}
