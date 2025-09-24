import React from 'react'

export default function Head() {
	return (
		<>
			{/* Preconnect to tiny analytics to speed up DNS/TLS when enabled */}
			<link
				rel="preconnect"
				href="https://app.tinyanalytics.io"
				crossOrigin="anonymous"
			/>
		</>
	)
}
