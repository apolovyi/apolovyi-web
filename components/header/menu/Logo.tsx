import React, { memo, useRef } from 'react'

import HexagonLogo from '@/components/header/menu/HexagonLogo'
import { useHoverTapMotion } from '@/components/shared/useHoverTapMotion'

interface LogoProps {
	onClick?: () => void
}

function Logo({ onClick }: LogoProps) {
	const ref = useRef<HTMLButtonElement>(null)
	useHoverTapMotion(ref)
	return (
		<button
			ref={ref}
			onClick={onClick}
			type="button"
			aria-label="Scroll to top"
			className="inline-flex h-11 w-11 cursor-pointer items-center justify-center bg-transparent p-0"
		>
			<HexagonLogo />
		</button>
	)
}

export default memo(Logo)
