"use client";

import React from "react";
import { Button } from "@components/ui/button";
import { Award } from "lucide-react";
import { SavePayload } from "@hooks/useResultsSync";

interface UnauthenticatedStateProps {
  localPendingResults: SavePayload[];
  onSignIn: () => void;
  onSignUp: () => void;
}

export function UnauthenticatedState({
  localPendingResults,
  onSignIn,
  onSignUp,
}: UnauthenticatedStateProps) {
  return (
    <div className="bg-card-bg border border-card-border rounded-2xl p-8 text-center max-w-md mx-auto my-12 flex flex-col items-center gap-4">
      <Award className="w-16 h-16 text-untyped/40" />
      <h3 className="text-lg font-bold text-foreground">Sign In to Save Results</h3>
      <p className="text-xs text-untyped leading-relaxed">
        Your results are currently being stored in your browser&apos;s local storage.
        Sign in to upload your performance history to the cloud and keep track of your scores across devices.
      </p>
      {localPendingResults.length > 0 && (
        <div className="w-full mt-2 text-left bg-card-muted/50 p-4 rounded-xl border border-card-border">
          <p className="text-xs font-semibold text-foreground mb-2">
            Unsaved Local Attempts ({localPendingResults.length}):
          </p>
          <div className="max-h-36 overflow-y-auto space-y-2 pr-1 font-mono text-[10px]">
            {localPendingResults.map((item, idx) => (
              <div key={idx} className="flex justify-between border-b border-card-border pb-1">
                <span>
                  {item.snippetName} ({item.language})
                </span>
                <span className="text-accent">{item.wpm} WPM</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="flex gap-3 mt-4 w-full">
        <Button onClick={onSignIn} className="flex-1 rounded-xl text-xs font-bold py-2.5">
          Sign In
        </Button>
        <Button
          onClick={onSignUp}
          variant="outline"
          className="flex-1 rounded-xl border-card-border text-xs font-bold py-2.5"
        >
          Sign Up
        </Button>
      </div>
    </div>
  );
}
