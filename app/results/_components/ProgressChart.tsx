"use client";

import React from "react";
import { TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ProgressChartProps {
  chartData: any[];
  filteredResultsLength: number;
}

// Custom chart tooltip
const CustomChartTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card-bg border border-card-border p-4 rounded-2xl shadow-xl font-sans text-xs flex flex-col gap-1.5 backdrop-blur-md">
        <p className="font-bold text-foreground">Attempt #{data.attempt}</p>
        <p className="text-[10px] text-untyped">
          {data.date} • <span className="text-foreground">{data.snippet}</span>
        </p>
        <div className="flex flex-col gap-1 mt-1 font-mono text-[11px]">
          <p className="text-accent flex justify-between gap-6">
            WPM: <span className="font-bold">{data.wpm}</span>
          </p>
          <p className="text-correct flex justify-between gap-6">
            Accuracy: <span className="font-bold">{data.accuracy}%</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export function ProgressChart({ chartData, filteredResultsLength }: ProgressChartProps) {
  return (
    <div className="bg-card-bg border border-card-border rounded-2xl p-6 flex flex-col gap-6">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div>
          <h4 className="text-xs font-bold text-untyped uppercase tracking-wider">
            Progress Trend Over Time
          </h4>
          <p className="text-[10px] text-untyped mt-0.5">
            Showing WPM and Accuracy for {filteredResultsLength} matching test attempts
          </p>
        </div>
        <div className="flex gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-accent/25 border border-accent rounded-sm inline-block" />
            <span className="text-foreground">WPM</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-correct/25 border border-correct rounded-sm inline-block" />
            <span className="text-foreground">Accuracy</span>
          </div>
        </div>
      </div>

      {chartData.length < 2 ? (
        <div className="w-full h-[300px] flex flex-col items-center justify-center text-xs text-untyped border border-dashed border-card-border rounded-xl bg-card-bg/20">
          <TrendingUp className="w-8 h-8 text-untyped/30 mb-2" />
          At least 2 attempts are required to plot a trend chart.
        </div>
      ) : (
        <div className="w-full h-[320px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid vertical={false} stroke="var(--card-border)" strokeDasharray="3 3" />
              <XAxis
                dataKey="attempt"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                stroke="var(--untyped)"
                tickFormatter={(v) => `#${v}`}
                className="text-[10px] font-mono"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                stroke="var(--untyped)"
                domain={[0, "auto"]}
                allowDecimals={false}
                className="text-[10px] font-mono"
              />
              <Tooltip content={<CustomChartTooltip />} />
              <Line
                type="monotone"
                dataKey="wpm"
                name="WPM"
                stroke="var(--color-accent)"
                strokeWidth={2.5}
                dot={{ r: 4, strokeWidth: 1, fill: "var(--card-bg)" }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
              <Line
                type="monotone"
                dataKey="accuracy"
                name="Accuracy"
                stroke="var(--color-correct)"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={{ r: 3, strokeWidth: 1, fill: "var(--card-bg)" }}
                activeDot={{ r: 5, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
