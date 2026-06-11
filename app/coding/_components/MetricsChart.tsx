import React from 'react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@components/ui/chart';

interface MetricsChartProps {
  wpmTimeline: number[];
  errorTimeline: number[];
}

const chartConfig = {
  wpm: {
    label: 'WPM',
    color: 'var(--color-accent)',
  },
  errors: {
    label: 'Errors',
    color: 'var(--color-error)',
  },
} satisfies ChartConfig;

export default function MetricsChart({ wpmTimeline, errorTimeline }: MetricsChartProps) {
  if (wpmTimeline.length < 2) {
    return (
      <div className="w-full h-32 flex items-center justify-center text-xs text-untyped border border-dashed border-card-border rounded-xl bg-card-bg/20">
        No progress timeline data available (test must last at least 2 seconds)
      </div>
    );
  }

  // Map timeline arrays to Recharts format
  const chartData = wpmTimeline.map((wpm, index) => ({
    time: index + 1,
    wpm,
    errors: errorTimeline[index] || 0,
  }));

  return (
    <div className="w-full bg-card-bg border border-card-border p-6 rounded-2xl backdrop-blur-md">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-xs font-bold text-untyped uppercase tracking-wider">
          Performance History
        </h4>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-accent/25 border border-accent rounded-sm inline-block" />
            <span className="text-untyped font-semibold">WPM</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-error/25 border border-error rounded-sm inline-block" />
            <span className="text-untyped font-semibold">Errors</span>
          </div>
        </div>
      </div>

      <div className="w-full h-[200px]">
        <ChartContainer config={chartConfig} className="w-full h-full min-h-[200px]">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
          >
            <CartesianGrid vertical={false} stroke="var(--card-border)" strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              stroke="var(--untyped)"
              tickFormatter={(value) => `${value}s`}
              className="text-[10px] font-mono"
            />
            <YAxis
              yAxisId="wpm"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              stroke="var(--color-accent)"
              domain={[0, 'auto']}
              className="text-[10px] font-mono"
            />
            <YAxis
              yAxisId="errors"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              stroke="var(--color-error)"
              domain={[0, 'auto']}
              className="text-[10px] font-mono"
            />
            <ChartTooltip
              cursor={{ stroke: 'var(--card-border)', strokeWidth: 1 }}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Line
              yAxisId="wpm"
              type="monotone"
              dataKey="wpm"
              stroke="var(--color-accent)"
              strokeWidth={2}
              dot={{ r: 3, strokeWidth: 1, fill: 'var(--card-bg)' }}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
            <Line
              yAxisId="errors"
              type="monotone"
              dataKey="errors"
              stroke="var(--color-error)"
              strokeWidth={1.5}
              strokeDasharray="3 3"
              dot={{ r: 2, strokeWidth: 1, fill: 'var(--card-bg)' }}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          </LineChart>
        </ChartContainer>
      </div>
    </div>
  );
}
