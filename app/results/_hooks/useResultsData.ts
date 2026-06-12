"use client";

import { useEffect, useState } from "react";
import { useAuthContext } from "@/_context/AuthContext";
import { useResultsSync, SavePayload } from "@hooks/useResultsSync";

export interface Result extends SavePayload {
  _id?: string;
  userId?: string;
}

export function useResultsData() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuthContext();
  const { syncPendingResults, getPendingResultsCount } = useResultsSync();

  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingCount, setPendingCount] = useState(0);

  // Pagination cursor/hasMore states from server
  const [lastKey, setLastKey] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  // Tabs and Filters states
  const [activeTab, setActiveTab] = useState<"list" | "chart" | "best">("list");
  const [filterLanguage, setFilterLanguage] = useState<string>("all");
  const [filterMode, setFilterMode] = useState<string>("all");
  const [filterDuration, setFilterDuration] = useState<string>("all");
  const [filterDateRange, setFilterDateRange] = useState<string>("all"); // 'all', '7days', '14days', '30days'

  // Confetti trigger state
  const [triggerConfetti, setTriggerConfetti] = useState(false);

  // Pagination state (client-side chunking of filtered list)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchResults = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/results?limit=100");
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        if (errData.error === 'Internal Server Error') {
          throw new Error('Something went wrong in our servers. Please, try again later.')
        }
        throw new Error(errData.details || errData.error || "Failed to fetch typing test history.");
      }
      const data = await response.json();
      setResults(data.results || []);
      setLastKey(data.lastEvaluatedKey || null);
      setHasMore(!!data.lastEvaluatedKey);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (!isAuthenticated || !lastKey || loadingMore) return;
    setLoadingMore(true);
    try {
      const response = await fetch(`/api/results?limit=100&lastKey=${encodeURIComponent(lastKey)}`);
      if (!response.ok) {
        throw new Error("Failed to load more results.");
      }
      const data = await response.json();
      const newItems: Result[] = data.results || [];

      // Append unique new results
      setResults((prev) => {
        const merged = [...prev];
        newItems.forEach((item) => {
          if (!merged.some((existing) => existing.timestamp === item.timestamp)) {
            merged.push(item);
          }
        });
        return merged;
      });
      setLastKey(data.lastEvaluatedKey || null);
      setHasMore(!!data.lastEvaluatedKey);
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (!isAuthLoading) {
      fetchResults();
      setPendingCount(getPendingResultsCount());
    }
  }, [isAuthenticated, isAuthLoading]);

  const handleManualSync = async () => {
    await syncPendingResults();
    setPendingCount(getPendingResultsCount());
    fetchResults();
  };

  // Pending items from LocalStorage (not yet synced)
  const getPendingLocalResults = (): SavePayload[] => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem("monkeycode_pending_results");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const localPendingResults = getPendingLocalResults();
  const allResults = [...localPendingResults, ...results];

  // Dynamically extract unique languages and modes for filters
  const uniqueLanguages = Array.from(
    new Set(allResults.map((r) => r.language.toLowerCase()))
  ).sort();
  const uniqueModes = Array.from(
    new Set(allResults.map((r) => r.mode.toLowerCase()))
  ).sort();

  // Filter logic
  const filteredResults = allResults.filter((r) => {
    // 1. Language filter
    const matchesLang =
      filterLanguage === "all" || r.language.toLowerCase() === filterLanguage.toLowerCase();

    // 2. Mode filter
    const matchesMode =
      filterMode === "all" || r.mode.toLowerCase() === filterMode.toLowerCase();

    // 3. Duration filter
    let matchesDuration = true;
    if (filterDuration === "15") matchesDuration = r.elapsedTime <= 15;
    else if (filterDuration === "30") matchesDuration = r.elapsedTime <= 30;
    else if (filterDuration === "60") matchesDuration = r.elapsedTime <= 60;
    else if (filterDuration === "120") matchesDuration = r.elapsedTime > 60;

    // 4. Date Range filter
    let matchesDate = true;
    if (filterDateRange !== "all") {
      const now = Date.now();
      const elapsedMs = now - r.timestamp;
      if (filterDateRange === "7days") {
        matchesDate = elapsedMs <= 7 * 24 * 60 * 60 * 1000;
      } else if (filterDateRange === "14days") {
        matchesDate = elapsedMs <= 14 * 24 * 60 * 60 * 1000;
      } else if (filterDateRange === "30days") {
        matchesDate = elapsedMs <= 30 * 24 * 60 * 60 * 1000;
      }
    }

    return matchesLang && matchesMode && matchesDuration && matchesDate;
  });

  // Sort lists
  const sortedForList = [...filteredResults].sort((a, b) => b.timestamp - a.timestamp);
  const sortedForChart = [...filteredResults].sort((a, b) => a.timestamp - b.timestamp);

  // Best attempt calculation
  const bestResult =
    filteredResults.length > 0
      ? [...filteredResults].sort((a, b) => {
        if (b.wpm !== a.wpm) return b.wpm - a.wpm;
        return b.accuracy - a.accuracy;
      })[0]
      : null;

  // Trigger confetti if the best attempt WPM has increased
  useEffect(() => {
    if (bestResult) {
      const storedBest = localStorage.getItem("monkeycode_best_wpm");
      const currentBestWpm = bestResult.wpm;

      if (storedBest !== null) {
        const prevBest = Number(storedBest);
        if (currentBestWpm > prevBest) {
          setTriggerConfetti(true);
          const timer = setTimeout(() => setTriggerConfetti(false), 5000);
          localStorage.setItem("monkeycode_best_wpm", currentBestWpm.toString());
          return () => clearTimeout(timer);
        }
      } else {
        localStorage.setItem("monkeycode_best_wpm", currentBestWpm.toString());
      }
    }
  }, [bestResult]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(sortedForList.length / itemsPerPage));
  const paginatedResults = sortedForList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page number on filter/tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterLanguage, filterMode, filterDuration, filterDateRange, activeTab]);

  const rawChartData = sortedForChart.map((r, index) => ({
    attempt: index + 1,
    wpm: r.wpm,
    accuracy: r.accuracy,
    date: new Date(r.timestamp).toLocaleDateString([], { month: "short", day: "numeric" }),
    snippet: r.snippetName,
  }));

  // Downsample to max 40 points to avoid SVG performance lag
  let chartData = rawChartData;
  const maxPoints = 40;
  if (rawChartData.length > maxPoints) {
    chartData = [];
    chartData.push(rawChartData[0]); // Always keep first

    const step = (rawChartData.length - 2) / (maxPoints - 2);
    for (let i = 1; i < maxPoints - 1; i++) {
      const index = Math.round(i * step);
      if (rawChartData[index]) {
        chartData.push(rawChartData[index]);
      }
    }

    chartData.push(rawChartData[rawChartData.length - 1]); // Always keep last
  }

  return {
    isAuthenticated,
    isAuthLoading,
    loading,
    loadingMore,
    error,
    pendingCount,
    activeTab,
    setActiveTab,
    filterLanguage,
    setFilterLanguage,
    filterMode,
    setFilterMode,
    filterDuration,
    setFilterDuration,
    filterDateRange,
    setFilterDateRange,
    currentPage,
    setCurrentPage,
    triggerConfetti,
    localPendingResults,
    allResults,
    results,
    uniqueLanguages,
    uniqueModes,
    filteredResults,
    paginatedResults,
    totalPages,
    bestResult,
    chartData,
    itemsPerPage,
    handleManualSync,
    fetchResults,
    hasMore,
    loadMore,
  };
}
