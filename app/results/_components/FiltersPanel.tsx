"use client";

import React from "react";
import { Button } from "@components/ui/button";
import { Filter } from "lucide-react";

interface FiltersPanelProps {
  filterLanguage: string;
  setFilterLanguage: (val: string) => void;
  filterMode: string;
  setFilterMode: (val: string) => void;
  filterDuration: string;
  setFilterDuration: (val: string) => void;
  filterDateRange: string;
  setFilterDateRange: (val: string) => void;
  uniqueLanguages: string[];
  uniqueModes: string[];
}

export function FiltersPanel({
  filterLanguage,
  setFilterLanguage,
  filterMode,
  setFilterMode,
  filterDuration,
  setFilterDuration,
  filterDateRange,
  setFilterDateRange,
  uniqueLanguages,
  uniqueModes,
}: FiltersPanelProps) {
  const isAnyFilterActive =
    filterLanguage !== "all" ||
    filterMode !== "all" ||
    filterDuration !== "all" ||
    filterDateRange !== "all";

  return (
    <div className="bg-card-bg/40 border border-card-border rounded-2xl p-5 flex flex-wrap gap-4 items-center">
      <div className="flex items-center gap-2 text-xs font-bold text-foreground mr-2">
        <Filter className="w-4 h-4 text-accent" /> Filters
      </div>

      {/* Language filter */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] text-untyped uppercase font-bold tracking-wider">Language</span>
        <select
          value={filterLanguage}
          onChange={(e) => setFilterLanguage(e.target.value)}
          className="bg-card-bg border border-card-border text-xs rounded-xl px-3 py-1.5 text-foreground focus:outline-none focus:border-accent min-w-[120px]"
        >
          <option value="all">All Languages</option>
          {uniqueLanguages.map((lang) => (
            <option key={lang} value={lang}>
              {lang.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Mode filter */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] text-untyped uppercase font-bold tracking-wider">Mode</span>
        <select
          value={filterMode}
          onChange={(e) => setFilterMode(e.target.value)}
          className="bg-card-bg border border-card-border text-xs rounded-xl px-3 py-1.5 text-foreground focus:outline-none focus:border-accent min-w-[120px]"
        >
          <option value="all">All Modes</option>
          {uniqueModes.map((mode) => (
            <option key={mode} value={mode}>
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Time / Duration filter */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] text-untyped uppercase font-bold tracking-wider">Duration</span>
        <select
          value={filterDuration}
          onChange={(e) => setFilterDuration(e.target.value)}
          className="bg-card-bg border border-card-border text-xs rounded-xl px-3 py-1.5 text-foreground focus:outline-none focus:border-accent min-w-[120px]"
        >
          <option value="all">All Durations</option>
          <option value="15">≤ 15 seconds</option>
          <option value="30">≤ 30 seconds</option>
          <option value="60">≤ 60 seconds</option>
          <option value="120">&gt; 60 seconds</option>
        </select>
      </div>

      {/* Date Range filter */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] text-untyped uppercase font-bold tracking-wider">Date Range</span>
        <select
          value={filterDateRange}
          onChange={(e) => setFilterDateRange(e.target.value)}
          className="bg-card-bg border border-card-border text-xs rounded-xl px-3 py-1.5 text-foreground focus:outline-none focus:border-accent min-w-[120px]"
        >
          <option value="all">All Time</option>
          <option value="7days">Last Week</option>
          <option value="14days">Last 2 Weeks</option>
          <option value="30days">Last Month</option>
        </select>
      </div>

      {/* Clear filters button */}
      {isAnyFilterActive && (
        <Button
          variant="ghost"
          onClick={() => {
            setFilterLanguage("all");
            setFilterMode("all");
            setFilterDuration("all");
            setFilterDateRange("all");
          }}
          className="self-end text-xs font-semibold h-8 text-untyped hover:text-accent"
        >
          Clear
        </Button>
      )}
    </div>
  );
}
