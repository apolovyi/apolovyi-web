import React from 'react';

interface LogoProps {
  width?: number;
  height?: number;
  color?: string;
}

const HexagonLogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="50" height="50">
    <style>
      {`
        .hexagon { fill: #fafafa; stroke: #ea5555; stroke-width: 2; }
        .text { font-size: 40px; fill: #ea5555; font-weight: 200; }
      `}
    </style>

    {/* Hexagon */}
    <polygon className="hexagon" points="50,5 95,30 95,70 50,95 5,70 5,30" />

    {/* AP Text */}
    <text x="50" y="62" textAnchor="middle" className="text">
      AP
    </text>
  </svg>
);

export default HexagonLogo;
