import React, { useState } from 'react';
import { DestinyMatrixResult, getChartPositions, ChartPosition } from '../../lib/matrix-calculator';
import { getArcana, Arcana } from '../../lib/arcana-meanings';

type DestinyMatrixChartProps = {
  result: DestinyMatrixResult;
  onNodeClick?: (position: string, arcana: Arcana) => void;
};

export function DestinyMatrixChart({ result, onNodeClick }: DestinyMatrixChartProps) {
  const positions = getChartPositions(result);
  const [hoveredNode, setHoveredNode] = useState<ChartPosition | null>(null);
  const center = positions.find(p => p.id === 'X')!;
  const centerX = center.x;
  const centerY = center.y;

  const getNodeColor = (id: string): string => {
    if (id === 'X') return 'url(#goldGradient)';
    return 'url(#purpleGradient)';
  };

  const renderLines = () => {
    const lines: React.ReactNode[] = [];
    const corners = [
      positions.find(p => p.id === 'A')!,
      positions.find(p => p.id === 'B')!,
      positions.find(p => p.id === 'C')!,
      positions.find(p => p.id === 'D')!,
    ];

    corners.forEach((corner, index) => {
      const next = corners[(index + 1) % 4];
      lines.push(
        <line
          key={`outer-${index}`}
          x1={corner.x}
          y1={corner.y}
          x2={next.x}
          y2={next.y}
          stroke="rgba(139, 127, 176, 0.3)"
          strokeWidth="1"
        />
      );
    });

    const innerCorners = ['E', 'F', 'G', 'H'];
    innerCorners.forEach(id => {
      const pos = positions.find(p => p.id === id)!;
      lines.push(
        <line
          key={`inner-${id}`}
          x1={pos.x}
          y1={pos.y}
          x2={centerX}
          y2={centerY}
          stroke="rgba(212, 165, 116, 0.3)"
          strokeWidth="1"
        />
      );
    });

    lines.push(
      <line key="diag-1" x1={positions.find(p => p.id === 'A')!.x} y1={positions.find(p => p.id === 'A')!.y}
            x2={positions.find(p => p.id === 'C')!.x} y2={positions.find(p => p.id === 'C')!.y}
            stroke="rgba(139, 127, 176, 0.2)" strokeWidth="1" strokeDasharray="5,5" />,
      <line key="diag-2" x1={positions.find(p => p.id === 'B')!.x} y1={positions.find(p => p.id === 'B')!.y}
            x2={positions.find(p => p.id === 'D')!.x} y2={positions.find(p => p.id === 'D')!.y}
            stroke="rgba(139, 127, 176, 0.2)" strokeWidth="1" strokeDasharray="5,5" />
    );

    return lines;
  };

  const renderNode = (position: ChartPosition) => {
    const isCenter = position.id === 'X';
    const arcana = getArcana(position.arcana);
    const nodeSize = isCenter ? 32 : 24;

    return (
      <g
        key={position.id}
        transform={`translate(${position.x}, ${position.y})`}
        onMouseEnter={() => setHoveredNode(position)}
        onMouseLeave={() => setHoveredNode(null)}
        onClick={() => onNodeClick?.(position.id, arcana)}
        style={{ cursor: 'pointer' }}
      >
        {isCenter && (
          <circle r={nodeSize + 8} fill="none" stroke="rgba(212, 165, 116, 0.3)" strokeWidth="2">
            <animate
              attributeName="r"
              values={`${nodeSize + 4};${nodeSize + 12};${nodeSize + 4}`}
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
        )}
        <circle
          r={nodeSize}
          fill={getNodeColor(position.id)}
          stroke={isCenter ? '#D4A574' : 'rgba(139, 127, 176, 0.5)'}
          strokeWidth={isCenter ? 2 : 1}
        />
        <text
          textAnchor="middle"
          dy="0.35em"
          fill={isCenter ? '#FFF8E7' : '#3D3D3D'}
          fontSize={isCenter ? 14 : 12}
          fontWeight="600"
          fontFamily="Inter, sans-serif"
        >
          {position.arcana}
        </text>
      </g>
    );
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <svg
        viewBox="0 0 400 400"
        className="w-full h-auto"
        aria-label="Destiny Matrix Chart"
      >
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4A574" />
            <stop offset="100%" stopColor="#C49B6B" />
          </linearGradient>
          <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A99BBF" />
            <stop offset="100%" stopColor="#8B7FB0" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width="400" height="400" fill="transparent" />

        {renderLines()}

        {positions.filter(p => p.id !== 'X').map(renderNode)}

        <g
          transform={`translate(${centerX}, ${centerY})`}
          style={{ cursor: 'pointer' }}
          onMouseEnter={() => setHoveredNode(center)}
          onMouseLeave={() => setHoveredNode(null)}
          onClick={() => onNodeClick?.(center.id, getArcana(center.arcana))}
        >
          <circle
            r={36}
            fill="url(#goldGradient)"
            stroke="#D4A574"
            strokeWidth={3}
            filter="url(#glow)"
          >
            <animate
              attributeName="opacity"
              values="1;0.85;1"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>
          <text
            textAnchor="middle"
            dy="0.35em"
            fill="#FFF8E7"
            fontSize={18}
            fontWeight="700"
            fontFamily="Inter, sans-serif"
          >
            {center.arcana}
          </text>
        </g>
      </svg>

      {hoveredNode && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm
                        px-4 py-2 rounded-lg shadow-lg border border-purple/30 text-center min-w-max">
          <p className="text-sm font-semibold text-text-primary">
            {getArcana(hoveredNode.arcana).name}
          </p>
          <p className="text-xs text-text-primary/70">
            {getArcana(hoveredNode.arcana).description}
          </p>
        </div>
      )}
    </div>
  );
}
