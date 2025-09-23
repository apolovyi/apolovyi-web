/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
	reactStrictMode: true,
	output: 'export',
	images: { unoptimized: true, qualities: [75, 100] },
	compiler: {
		removeConsole: process.env.NODE_ENV === 'production',
	},
}
module.exports = withBundleAnalyzer(nextConfig)
