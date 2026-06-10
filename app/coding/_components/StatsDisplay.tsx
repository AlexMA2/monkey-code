import React from 'react';
import { RefreshCw, Check, AlertTriangle, Clock, Award } from 'lucide-react';
import { TestStats } from '../_hooks/useTypingTest';
import MetricsChart from './MetricsChart';

interface StatsDisplayProps {
  stats: TestStats;
  restart: () => void;
}

export default function StatsDisplay({ stats, restart }: StatsDisplayProps) {
  const { wpm, cpm, accuracy, errorCount, elapsedTime, wpmTimeline, errorTimeline } = stats;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 flex flex-col gap-8">
      {/* Metrics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* WPM Card */}
        <div className="bg-card-bg border border-card-border rounded-2xl p-5 text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-all duration-300">
            <Award className="w-16 h-16 text-accent" />
          </div>
          <p className="text-xs font-semibold text-untyped uppercase tracking-wider mb-1">
            WPM
          </p>
          <p className="text-4xl md:text-5xl font-black text-accent font-mono">
            {wpm}
          </p>
          <p className="text-[10px] text-untyped mt-2">Words Per Minute</p>
        </div>

        {/* Accuracy Card */}
        <div className="bg-card-bg border border-card-border rounded-2xl p-5 text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-all duration-300">
            <Check className="w-16 h-16 text-correct" />
          </div>
          <p className="text-xs font-semibold text-untyped uppercase tracking-wider mb-1">
            Accuracy
          </p>
          <p className="text-4xl md:text-5xl font-black text-correct font-mono">
            {accuracy}%
          </p>
          <p className="text-[10px] text-untyped mt-2">Correct keystrokes</p>
        </div>

        {/* Errors Card */}
        <div className="bg-card-bg border border-card-border rounded-2xl p-5 text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-all duration-300">
            <AlertTriangle className="w-16 h-16 text-error" />
          </div>
          <p className="text-xs font-semibold text-untyped uppercase tracking-wider mb-1">
            Errors
          </p>
          <p className="text-4xl md:text-5xl font-black text-error font-mono">
            {errorCount}
          </p>
          <p className="text-[10px] text-untyped mt-2">Missed keystrokes</p>
        </div>

        {/* Time Card */}
        <div className="bg-card-bg border border-card-border rounded-2xl p-5 text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-all duration-300">
            <Clock className="w-16 h-16 text-foreground" />
          </div>
          <p className="text-xs font-semibold text-untyped uppercase tracking-wider mb-1">
            Time
          </p>
          <p className="text-4xl md:text-5xl font-black text-foreground font-mono">
            {elapsedTime}s
          </p>
          <p className="text-[10px] text-untyped mt-2">Total elapsed duration</p>
        </div>
      </div>

      {/* SVG Chart */}
      <MetricsChart wpmTimeline={wpmTimeline} errorTimeline={errorTimeline} />

      {/* Call to action & secondary info */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card-bg border border-card-border rounded-2xl p-6">
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-1">Test Completed Successfully!</h4>
          <p className="text-xs text-untyped">
            Adjust your preferences below or try typing another snippet to increase your code speed.
          </p>
        </div>
        <button
          onClick={restart}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-accent text-background font-bold text-sm rounded-xl hover:shadow-lg hover:shadow-accent/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 animate-spin-hover" />
          Try Again
        </button>
      </div>
    </div>
  );
}
