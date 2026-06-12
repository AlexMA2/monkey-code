"use client";

import React from "react";
import { Button } from "@components/ui/button";
import { CloudLightning, RefreshCw } from "lucide-react";

interface SyncControlsProps {
  pendingCount: number;
  onSync: () => void;
}

export function SyncControls({ pendingCount, onSync }: SyncControlsProps) {
  if (pendingCount <= 0) return null;

  return (
    <div className="flex items-center gap-3 bg-accent/10 border border-accent/20 px-4 py-2 rounded-2xl">
      <CloudLightning className="w-4 h-4 text-accent animate-pulse" />
      <div className="text-left">
        <p className="text-xs font-bold text-accent">{pendingCount} offline save(s) pending</p>
        <p className="text-[10px] text-untyped">Stored in local storage</p>
      </div>
      <Button
        onClick={onSync}
        variant="accentSubtle"
        size="sm"
        className="flex items-center gap-1.5 text-xs font-bold rounded-lg px-2.5 py-1"
      >
        <RefreshCw className="w-3.5 h-3.5" /> Sync
      </Button>
    </div>
  );
}
