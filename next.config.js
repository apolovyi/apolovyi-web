/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
	reactStrictMode: true,
	output: 'export',
	images: { unoptimized: true },
	reactCompiler: true,
	compiler: {
		removeConsole: process.env.NODE_ENV === 'production',
	},
	experimental: {
		optimizePackageImports: [
			'motion',
			'lucide-react',
			'@react-three/drei',
			'@react-three/fiber',
			'three',
			'zod',
			'class-variance-authority',
			'clsx',
			'tailwind-merge',
		],
	},
}
module.exports = withBundleAnalyzer(nextConfig)
