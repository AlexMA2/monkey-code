"use client";

import React from "react";
import { Button } from "@components/ui/button";
import { ROUTES } from "@/_constants/routes";
import { useRouter } from "next/navigation";
import {
  History,
  ArrowLeft,
  List,
  TrendingUp,
  Trophy,
} from "lucide-react";
import Loading from "../loading";

// Subcomponents
import { Confetti } from "./_components/Confetti";
import { SyncControls } from "./_components/SyncControls";
import { UnauthenticatedState } from "./_components/UnauthenticatedState";
import { EmptyState } from "./_components/EmptyState";
import { FiltersPanel } from "./_components/FiltersPanel";
import { HistoryList } from "./_components/HistoryList";
import { ProgressChart } from "./_components/ProgressChart";
import { BestAttempt } from "./_components/BestAttempt";

// Local hook
import { useResultsData } from "./_hooks/useResultsData";

export default function PreviousResultsPage() {
  const router = useRouter();
  const {
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
  } = useResultsData();

  if (isAuthLoading || (loading && results.length === 0)) {
    return <Loading />;
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {triggerConfetti && <Confetti duration={4000} />}
      
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-card-border pb-6">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.push(ROUTES.CODING)}
            variant="outline"
            size="icon"
            className="rounded-xl border-card-border hover:border-accent/40 text-untyped hover:text-accent w-10 h-10"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-black text-foreground flex items-center gap-2">
              <History className="w-6 h-6 text-accent" /> Previous Results
            </h2>
            <p className="text-xs text-untyped">Analyze your progress and coding statistics</p>
          </div>
        </div>

        {/* Sync Controls */}
        <SyncControls pendingCount={pendingCount} onSync={handleManualSync} />
      </div>

      {/* Main Content Area */}
      {!isAuthenticated ? (
        <UnauthenticatedState
          localPendingResults={localPendingResults}
          onSignIn={() => router.push(ROUTES.LOGIN)}
          onSignUp={() => router.push(ROUTES.REGISTER)}
        />
      ) : error ? (
        <div className="bg-error/10 border border-error/20 text-error rounded-2xl p-6 text-center max-w-lg mx-auto">
          <p className="text-sm font-semibold">Error Loading History</p>
          <p className="text-xs mt-1 text-error/80">{error}</p>
          <Button onClick={fetchResults} variant="outline" className="mt-4 border-error/20 hover:bg-error/10 text-xs">
            Try Again
          </Button>
        </div>
      ) : allResults.length === 0 ? (
        <EmptyState onStartTest={() => router.push(ROUTES.CODING)} />
      ) : (
        <div className="flex flex-col gap-6">
          {/* Filters Panel */}
          <FiltersPanel
            filterLanguage={filterLanguage}
            setFilterLanguage={setFilterLanguage}
            filterMode={filterMode}
            setFilterMode={setFilterMode}
            filterDuration={filterDuration}
            setFilterDuration={setFilterDuration}
            filterDateRange={filterDateRange}
            setFilterDateRange={setFilterDateRange}
            uniqueLanguages={uniqueLanguages}
            uniqueModes={uniqueModes}
          />

          {/* Tabs Navigation */}
          <div className="flex border-b border-card-border gap-6">
            <button
              onClick={() => setActiveTab("list")}
              className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all duration-200 ${
                activeTab === "list"
                  ? "border-accent text-accent"
                  : "border-transparent text-untyped hover:text-foreground"
              }`}
            >
              <List className="w-4 h-4" />
              History List ({filteredResults.length})
            </button>
            <button
              onClick={() => setActiveTab("chart")}
              className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all duration-200 ${
                activeTab === "chart"
                  ? "border-accent text-accent"
                  : "border-transparent text-untyped hover:text-foreground"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Progress Chart
            </button>
            <button
              onClick={() => setActiveTab("best")}
              className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all duration-200 ${
                activeTab === "best"
                  ? "border-accent text-accent"
                  : "border-transparent text-untyped hover:text-foreground"
              }`}
            >
              <Trophy className="w-4 h-4" />
              Best Attempt
            </button>
          </div>

          {/* Tab Content */}
          {filteredResults.length === 0 ? (
            <div className="bg-card-bg border border-card-border rounded-2xl p-12 text-center flex flex-col items-center gap-2 my-4">
              <p className="text-sm font-bold text-foreground">No matching results found</p>
              <p className="text-xs text-untyped">Try adjusting your filters to find attempts.</p>
            </div>
          ) : activeTab === "list" ? (
            <HistoryList
              paginatedResults={paginatedResults}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              totalCount={filteredResults.length}
              itemsPerPage={itemsPerPage}
              results={results}
              hasMore={hasMore}
              loadMore={loadMore}
              loadingMore={loadingMore}
            />
          ) : activeTab === "chart" ? (
            <ProgressChart
              chartData={chartData}
              filteredResultsLength={filteredResults.length}
            />
          ) : (
            /* Best Attempt Tab */
            <BestAttempt
              bestResult={bestResult}
              onChallenge={() => router.push(ROUTES.CODING)}
            />
          )}
        </div>
      )}
    </div>
  );
}
