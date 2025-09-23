/** @type {import('next').NextConfig} */

const nextConfig = {
	reactStrictMode: true,
	output: 'export',
	images: { unoptimized: true, qualities: [75, 100] },
	compiler: {
		removeConsole: process.env.NODE_ENV === 'production',
	},
}
module.exports = nextConfig
