import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: 'Artem Polovyi Portfolio',
		short_name: 'AP Portfolio',
		icons: [
			{
				src: '/fav/android-chrome-192x192.png',
				sizes: '192x192',
				type: 'image/png',
			},
			{
				src: '/fav/android-chrome-384x384.png',
				sizes: '384x384',
				type: 'image/png',
			},
		],
		theme_color: '#d8f0f9',
		background_color: '#d8f0f9',
		display: 'standalone',
	}
}
