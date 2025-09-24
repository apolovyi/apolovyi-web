import React, { memo, useRef } from 'react'

import HexagonLogo from '@/components/header/menu/HexagonLogo'
import { useHoverTapMotion } from '@/components/shared/useHoverTapMotion'

interface LogoProps {
	onClick?: () => void
}

function Logo({ onClick }: LogoProps) {
	const ref = useRef<HTMLDivElement>(null)
	useHoverTapMotion(ref)
	return (
		<div
			ref={ref}
			onClick={onClick}
			className="cursor-pointer"
		>
			<HexagonLogo />
		</div>
	)
}

export default memo(Logo)
