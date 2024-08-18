import React from "react";

interface LogoProps {
  width?: number;
  height?: number;
  color?: string;
}

const HexagonLogo = ({ width = 50, height = 50, color = "#ea5555" }: LogoProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width={width} height={height}>
    {/* Hexagon */}
    <polygon className="fill-neutral-50 stroke-accent-coral stroke-2" points="50,5 95,30 95,70 50,95 5,70 5,30" />

    {/* AP Text */}
    <text x="50" y="62" textAnchor="middle" className="font fill-accent-coral font-tech text-4xl">
      AP
    </text>
  </svg>
);

export default HexagonLogo;
