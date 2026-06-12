"use client";

import React from "react";
import { Button } from "@components/ui/button";
import { Trophy, Calendar } from "lucide-react";

interface BestAttemptProps {
  bestResult: any;
  onChallenge: () => void;
}

export function BestAttempt({ bestResult, onChallenge }: BestAttemptProps) {
  if (!bestResult) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Trophy Card */}
      <div className="md:col-span-1 bg-card-bg border border-accent/30 rounded-3xl p-6 text-center flex flex-col items-center justify-center gap-4 relative overflow-hidden group shadow-lg">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Trophy className="w-32 h-32 text-accent" />
        </div>
        <div className="bg-accent/20 p-4 rounded-full border border-accent/40 text-accent flex items-center justify-center">
          <Trophy className="w-8 h-8" />
        </div>
        <div>
          <p className="text-xs uppercase font-black tracking-widest text-accent">Personal Best</p>
          <p className="text-xs text-untyped mt-1">For currently filtered selection</p>
        </div>
        <div className="w-full border-t border-card-border/60 my-2"></div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-bold text-untyped tracking-wider">Speed</span>
          <span className="text-5xl font-black text-accent font-mono mt-1">{bestResult.wpm}</span>
          <span className="text-[10px] text-untyped mt-1">Words Per Minute</span>
        </div>
      </div>

      {/* Performance stats layout */}
      <div className="md:col-span-2 flex flex-col gap-6">
        {/* Detailed card specs */}
        <div className="bg-card-bg border border-card-border rounded-3xl p-6 flex flex-col gap-6">
          <div>
            <h4 className="text-xs font-bold text-untyped uppercase tracking-wider mb-2">Attempt Details</h4>
            <p className="text-lg font-black text-foreground">{bestResult.snippetName}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-card-muted/50 p-4 rounded-2xl border border-card-border/50 text-center">
              <span className="text-[10px] uppercase font-bold text-untyped tracking-wider">Accuracy</span>
              <p className="text-2xl font-black text-correct font-mono mt-1">{bestResult.accuracy}%</p>
            </div>
            <div className="bg-card-muted/50 p-4 rounded-2xl border border-card-border/50 text-center">
              <span className="text-[10px] uppercase font-bold text-untyped tracking-wider">Errors</span>
              <p className="text-2xl font-black text-error font-mono mt-1">{bestResult.errorCount}</p>
            </div>
            <div className="bg-card-muted/50 p-4 rounded-2xl border border-card-border/50 text-center">
              <span className="text-[10px] uppercase font-bold text-untyped tracking-wider">Language</span>
              <p className="text-sm font-bold text-foreground uppercase mt-2 font-mono">{bestResult.language}</p>
            </div>
            <div className="bg-card-muted/50 p-4 rounded-2xl border border-card-border/50 text-center">
              <span className="text-[10px] uppercase font-bold text-untyped tracking-wider">Duration</span>
              <p className="text-2xl font-black text-foreground font-mono mt-1">{bestResult.elapsedTime}s</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-untyped border-t border-card-border/60 pt-4 gap-2">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              Date: {new Date(bestResult.timestamp).toLocaleDateString()} {new Date(bestResult.timestamp).toLocaleTimeString()}
            </span>
            <span className="flex items-center gap-1.5 uppercase font-mono tracking-wider text-[10px] bg-card-muted px-2.5 py-1 rounded border border-card-border">
              Mode: {bestResult.mode}
            </span>
          </div>
        </div>

        {/* Recommendation action box */}
        <div className="bg-card-bg/40 border border-card-border rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h5 className="text-sm font-bold text-foreground">Can you beat your best?</h5>
            <p className="text-xs text-untyped mt-1">Start another typing test with these settings to challenge your speed.</p>
          </div>
          <Button onClick={onChallenge} className="rounded-xl text-xs font-bold px-6 py-2.5 w-full sm:w-auto">
            Challenge Score
          </Button>
        </div>
      </div>
    </div>
  );
}
