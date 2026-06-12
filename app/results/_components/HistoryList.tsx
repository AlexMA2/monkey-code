"use client";

import React from "react";
import { Button } from "@components/ui/button";
import { Calendar, Clock, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface HistoryListProps {
  paginatedResults: any[];
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  totalCount: number;
  itemsPerPage: number;
  results: any[];
  hasMore: boolean;
  loadMore: () => void;
  loadingMore: boolean;
}

export function HistoryList({
  paginatedResults,
  currentPage,
  setCurrentPage,
  totalPages,
  totalCount,
  itemsPerPage,
  results,
  hasMore,
  loadMore,
  loadingMore,
}: HistoryListProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* History Grid List */}
      <div className="grid grid-cols-1 gap-4">
        {paginatedResults.map((result, idx) => {
          const isLocal =
            result.timestamp &&
            !result._id &&
            !results.some((r) => r.timestamp === result.timestamp);
          return (
            <div
              key={result.timestamp ?? idx}
              className={`bg-card-bg border rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden group transition-all duration-200 ${
                isLocal
                  ? "border-accent/30"
                  : "border-card-border hover:border-card-border-hover"
              }`}
            >
              {isLocal && (
                <div className="absolute top-0 left-0 bg-accent px-2 py-0.5 text-[8px] font-black text-background uppercase tracking-widest rounded-br-lg">
                  Offline Pending
                </div>
              )}
              <div className="flex-1 flex flex-col gap-1.5 pt-2 md:pt-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-foreground">
                    {result.snippetName}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 bg-card-muted text-untyped rounded-md border border-card-border uppercase font-mono">
                    {result.language}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 bg-card-muted text-untyped rounded-md border border-card-border uppercase font-mono">
                    {result.mode}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-[10px] text-untyped">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(result.timestamp).toLocaleDateString()}{" "}
                    {new Date(result.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Duration: {result.elapsedTime}s
                  </span>
                </div>
              </div>

              {/* Score Stats */}
              <div className="flex items-center gap-8 bg-card-muted/40 border border-card-border/50 px-5 py-3 rounded-xl min-w-[240px] justify-around">
                <div className="text-center">
                  <p className="text-[9px] uppercase font-bold text-untyped tracking-wider">WPM</p>
                  <p className="text-2xl font-black text-accent font-mono">{result.wpm}</p>
                </div>
                <div className="text-center border-l border-card-border pl-6">
                  <p className="text-[9px] uppercase font-bold text-untyped tracking-wider">
                    Accuracy
                  </p>
                  <p className="text-2xl font-black text-correct font-mono">
                    {result.accuracy}%
                  </p>
                </div>
                <div className="text-center border-l border-card-border pl-6">
                  <p className="text-[9px] uppercase font-bold text-untyped tracking-wider">
                    Errors
                  </p>
                  <p className="text-2xl font-black text-error font-mono">{result.errorCount}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center mt-2">
          <Button
            onClick={loadMore}
            disabled={loadingMore}
            variant="outline"
            className="rounded-xl text-xs font-bold border-card-border hover:border-accent/40 w-full sm:w-auto px-6 py-2"
          >
            {loadingMore ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
                Loading...
              </>
            ) : (
              "Load More Attempts"
            )}
          </Button>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-card-border pt-4 mt-2">
          <span className="text-xs text-untyped">
            Showing <span className="font-bold text-foreground">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
            <span className="font-bold text-foreground">
              {Math.min(currentPage * itemsPerPage, totalCount)}
            </span>{" "}
            of <span className="font-bold text-foreground">{totalCount}</span> attempts
          </span>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              variant="outline"
              size="icon"
              className="w-8 h-8 rounded-lg border-card-border"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // Compact pagination numbers (show first, last, and current neighbors if too large)
              if (
                totalPages > 5 &&
                page !== 1 &&
                page !== totalPages &&
                Math.abs(page - currentPage) > 1
              ) {
                if (page === 2 && currentPage > 3)
                  return (
                    <span key={page} className="text-untyped text-xs px-1">
                      ...
                    </span>
                  );
                if (page === totalPages - 1 && currentPage < totalPages - 2)
                  return (
                    <span key={page} className="text-untyped text-xs px-1">
                      ...
                    </span>
                  );
                return null;
              }

              return (
                <Button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  variant={currentPage === page ? "default" : "outline"}
                  className={`w-8 h-8 rounded-lg text-xs font-bold ${
                    currentPage === page ? "" : "border-card-border"
                  }`}
                >
                  {page}
                </Button>
              );
            })}

            <Button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              variant="outline"
              size="icon"
              className="w-8 h-8 rounded-lg border-card-border"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
