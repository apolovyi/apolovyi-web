import React from 'react'

const HexagonLogo = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 100 100"
		width="50"
		height="50"
		className="hexagon-logo"
	>
		<polygon
			points="50,5 95,30 95,70 50,95 5,70 5,30"
			className="fill-background-primary stroke-accent-coral"
			strokeWidth="2"
		/>
		<text
			x="50"
			y="62"
			textAnchor="middle"
			className="fill-accent-coral text-[40px] font-extralight"
		>
			AP
		</text>
	</svg>
)

export default HexagonLogo
