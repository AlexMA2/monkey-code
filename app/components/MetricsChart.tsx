import React from 'react';

interface MetricsChartProps {
  wpmTimeline: number[];
  errorTimeline: number[];
}

export default function MetricsChart({ wpmTimeline, errorTimeline }: MetricsChartProps) {
  if (wpmTimeline.length < 2) {
    return (
      <div className="w-full h-32 flex items-center justify-center text-xs text-zinc-500 border border-dashed border-zinc-800 rounded-xl bg-zinc-950/20">
        No progress timeline data available (test must last at least 2 seconds)
      </div>
    );
  }

  const width = 600;
  const height = 150;
  const padding = 20;

  const maxWpm = Math.max(...wpmTimeline, 60); // default scaling min 60
  const maxErr = Math.max(...errorTimeline, 5);

  const getCoordinates = (timeline: number[], maxVal: number) => {
    const points: { x: number; y: number }[] = [];
    const stepX = (width - padding * 2) / (timeline.length - 1);
    
    timeline.forEach((val, i) => {
      const x = padding + i * stepX;
      const y = height - padding - (val / maxVal) * (height - padding * 2);
      points.push({ x, y });
    });

    return points;
  };

  const wpmCoords = getCoordinates(wpmTimeline, maxWpm);
  const errCoords = getCoordinates(errorTimeline, maxErr);

  const createPathD = (coords: { x: number; y: number }[]) => {
    if (coords.length === 0) return '';
    return coords.reduce((acc, c, i) => {
      return i === 0 ? `M ${c.x} ${c.y}` : `${acc} L ${c.x} ${c.y}`;
    }, '');
  };

  const createAreaPathD = (coords: { x: number; y: number }[]) => {
    if (coords.length === 0) return '';
    const linePath = createPathD(coords);
    const firstX = coords[0].x;
    const lastX = coords[coords.length - 1].x;
    const bottomY = height - padding;
    return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  };

  const wpmPath = createPathD(wpmCoords);
  const wpmAreaPath = createAreaPathD(wpmCoords);
  const errPath = createPathD(errCoords);

  return (
    <div className="w-full bg-zinc-950/60 border border-zinc-850 p-6 rounded-2xl backdrop-blur-md">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
          Performance History
        </h4>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-accent/25 border border-accent rounded-sm inline-block" />
            <span className="text-zinc-400 font-semibold">WPM</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-error/25 border border-error rounded-sm inline-block" />
            <span className="text-zinc-400 font-semibold">Errors</span>
          </div>
        </div>
      </div>

      <div className="relative w-full h-[150px]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          {/* Grid lines */}
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#1f2937" strokeWidth="0.5" strokeDasharray="4" />
          <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#1f2937" strokeWidth="0.5" strokeDasharray="4" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#1f2937" strokeWidth="1" />

          {/* Area under WPM */}
          <path d={wpmAreaPath} fill="url(#wpmGradient)" opacity="0.15" />

          {/* WPM Line */}
          <path
            d={wpmPath}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Error Line */}
          <path
            d={errPath}
            fill="none"
            stroke="var(--color-error)"
            strokeWidth="1.5"
            strokeDasharray="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.75"
          />

          {/* Graph node dots on hover/highlight */}
          {wpmCoords.map((c, idx) => (
            <circle
              key={`wpm-${idx}`}
              cx={c.x}
              cy={c.y}
              r="3"
              fill="var(--color-accent)"
              className="hover:r-5 transition-all duration-150 cursor-pointer"
            />
          ))}

          {/* Defs gradients */}
          <defs>
            <linearGradient id="wpmGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-accent)" />
              <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Timeline stats footer */}
      <div className="flex justify-between text-[10px] text-zinc-500 font-mono mt-2 px-1">
        <span>0s</span>
        <span>{wpmTimeline.length}s</span>
      </div>
    </div>
  );
}
