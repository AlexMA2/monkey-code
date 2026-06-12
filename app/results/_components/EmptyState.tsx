"use client";

import React from "react";
import { Button } from "@components/ui/button";
import { Terminal } from "lucide-react";

interface EmptyStateProps {
  onStartTest: () => void;
}

export function EmptyState({ onStartTest }: EmptyStateProps) {
  return (
    <div className="bg-card-bg border border-card-border rounded-2xl p-12 text-center max-w-lg mx-auto my-8 flex flex-col items-center gap-4">
      <Terminal className="w-16 h-16 text-untyped/30" />
      <h3 className="text-lg font-bold text-foreground">No Attempts Yet</h3>
      <p className="text-xs text-untyped leading-relaxed">
        You haven't completed any typing tests yet. Start typing to measure your words per minute (WPM), accuracy, and code-completion speeds.
      </p>
      <Button onClick={onStartTest} className="mt-4 rounded-xl text-xs font-bold px-6 py-2.5">
        Start Coding Test
      </Button>
    </div>
  );
}
