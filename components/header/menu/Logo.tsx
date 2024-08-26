import React, { memo } from "react";

import HexagonLogo from "@/components/header/menu/HexagonLogo";

interface LogoProps {
	onClick?: () => void;
}

function Logo({ onClick }: LogoProps) {
	return (
		<div onClick={onClick} className="cursor-pointer">
			<HexagonLogo />
		</div>
	);
}

export default memo(Logo);
