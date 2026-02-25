import { useEffect, useRef } from 'react';

interface ProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: 'green' | 'cyan' | 'purple';
  showLabel?: boolean;
}

const colorMap = {
  green: { stroke: '#4ade80', glow: 'rgba(74,222,128,0.4)' },
  cyan: { stroke: '#22d3ee', glow: 'rgba(34,211,238,0.4)' },
  purple: { stroke: '#a78bfa', glow: 'rgba(167,139,250,0.4)' },
};

export default function ProgressRing({
  percentage,
  size = 80,
  strokeWidth = 6,
  color = 'green',
  showLabel = true,
}: ProgressRingProps) {
  const circleRef = useRef<SVGCircleElement>(null);
  const clampedPct = Math.min(100, Math.max(0, percentage));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedPct / 100) * circumference;
  const { stroke, glow } = colorMap[color];

  useEffect(() => {
    const el = circleRef.current;
    if (!el) return;
    el.style.transition = 'none';
    el.style.strokeDashoffset = String(circumference);
    // Force reflow
    void el.getBoundingClientRect();
    el.style.transition = 'stroke-dashoffset 1s ease-out';
    el.style.strokeDashoffset = String(offset);
  }, [circumference, offset]);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)' }}
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          ref={circleRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          style={{ filter: `drop-shadow(0 0 4px ${glow})` }}
        />
      </svg>
      {showLabel && (
        <span
          className="absolute text-xs font-mono font-bold"
          style={{ color: stroke }}
        >
          {clampedPct}%
        </span>
      )}
    </div>
  );
}
