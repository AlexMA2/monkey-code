import React, { useEffect, useState, useRef } from 'react';
import { RefreshCw, Check, AlertTriangle, Clock, Award, History, CloudLightning } from 'lucide-react';
import { TestStats } from '@hooks/useTypingTest';
import MetricsChart from './MetricsChart';
import { Button } from '@components/ui/button';
import { useAuthContext } from '@/_context/AuthContext';
import { useResultsSync } from '@hooks/useResultsSync';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/_constants/routes';

interface StatsDisplayProps {
  stats: TestStats;
  restart: () => void;
  language: string;
  mode: string;
  snippetName: string;
}

export default function StatsDisplay({ stats, restart, language, mode, snippetName }: StatsDisplayProps) {
  const { wpm, cpm, accuracy, errorCount, elapsedTime, wpmTimeline, errorTimeline } = stats;
  const { isAuthenticated } = useAuthContext();
  const router = useRouter();
  const { saveResult } = useResultsSync();
  const [saveStatus, setSaveStatus] = useState<'saving' | 'saved' | 'offline' | 'idle'>('idle');
  const hasSavedRef = useRef(false);
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;

    if (hasSavedRef.current) {
      return
    }

    hasSavedRef.current = true;
    const triggerSave = async () => {
      setSaveStatus('saving');
      const isOnlineSaved = await saveResult({
        wpm,
        cpm,
        accuracy,
        errorCount,
        elapsedTime,
        language,
        mode,
        snippetName,
      });
      if (!isMountedRef.current) return;
      if (isOnlineSaved) {
        setSaveStatus('saved');
      } else {
        setSaveStatus('offline');
      }
    };
    triggerSave();

    return () => {
      isMountedRef.current = false;
    };
  }, [saveResult, wpm, cpm, accuracy, errorCount, elapsedTime, language, mode, snippetName]);

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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-card-bg border border-card-border rounded-2xl p-6">
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-foreground mb-1">Test Completed Successfully!</h4>
          <p className="text-xs text-untyped flex flex-wrap items-center gap-1.5 mt-1">
            {saveStatus === 'saving' && (
              <span className="text-accent flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin" /> Saving stats to AWS...
              </span>
            )}
            {saveStatus === 'saved' && (
              <span className="text-correct flex items-center gap-1 font-medium">
                <Check className="w-3.5 h-3.5" /> All stats successfully saved to AWS.
              </span>
            )}
            {saveStatus === 'offline' && (
              <span className="text-accent flex items-center gap-1">
                <CloudLightning className="w-3.5 h-3.5 text-accent" /> Saved locally. Will upload once online.
              </span>
            )}
            {!isAuthenticated && (
              <span>To store attempts online, please sign in or create an account.</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            onClick={() => router.push(ROUTES.RESULTS)}
            variant="outline"
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 font-semibold text-sm rounded-xl h-auto border-card-border hover:border-accent/40 text-untyped hover:text-accent"
          >
            <History className="w-4 h-4" />
            Previous Results
          </Button>
          <Button
            onClick={restart}
            variant="default"
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 font-bold text-sm rounded-xl h-auto"
          >
            <RefreshCw className="w-4 h-4 animate-spin-hover" />
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}
