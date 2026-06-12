import { useCallback, useEffect, useRef } from "react";
import { useAuthContext } from "@/_context/AuthContext";

export interface SavePayload {
  wpm: number;
  cpm: number;
  accuracy: number;
  errorCount: number;
  elapsedTime: number;
  language: string;
  mode: string;
  snippetName: string;
  timestamp: number;
}

const LOCAL_STORAGE_KEY = "monkeycode_pending_results";

export function useResultsSync() {
  const { isAuthenticated } = useAuthContext();
  const syncInProgressRef = useRef(false);

  // Helper to get pending results from localStorage
  const getPendingResults = useCallback((): SavePayload[] => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Failed to read pending results from localStorage:", e);
      return [];
    }
  }, []);

  // Helper to save pending results to localStorage
  const savePendingResults = useCallback((results: SavePayload[]) => {
    if (typeof window === "undefined") return;
    try {
      if (results.length === 0) {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      } else {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(results));
      }
    } catch (e) {
      console.error("Failed to save pending results to localStorage:", e);
    }
  }, []);

  // Function to upload a single result
  const uploadResult = useCallback(async (payload: SavePayload): Promise<boolean> => {
    try {
      const response = await fetch("/api/results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        return true;
      }
      // If unauthorized (401), keep in local storage until user is logged in
      if (response.status === 401) {
        return false;
      }
      return false;
    } catch (err) {
      console.error("Network error uploading result:", err);
      return false;
    }
  }, []);

  // Sync function to upload all pending results
  const syncPendingResults = useCallback(async () => {
    if (!isAuthenticated || syncInProgressRef.current) return;
    const pending = getPendingResults();
    if (pending.length === 0) return;

    syncInProgressRef.current = true;
    const remaining: SavePayload[] = [...pending];

    while (remaining.length > 0) {
      const item = remaining[0];
      const success = await uploadResult(item);
      if (success) {
        // Remove successfully uploaded item
        remaining.shift();
        savePendingResults(remaining);
      } else {
        // If it failed (offline, server error, etc.), stop sync and try later
        break;
      }
    }
    syncInProgressRef.current = false;
  }, [isAuthenticated, getPendingResults, savePendingResults, uploadResult]);

  // Save a new result
  const saveResult = useCallback(
    async (payload: Omit<SavePayload, "timestamp">) => {
      const fullPayload: SavePayload = {
        ...payload,
        timestamp: Date.now(),
      };

      if (!isAuthenticated) {
        // Store in localStorage if user is not authenticated yet
        const pending = getPendingResults();
        savePendingResults([...pending, fullPayload]);
        return false;
      }

      // Try uploading immediately
      const success = await uploadResult(fullPayload);
      if (!success) {
        // Save to local storage on failure
        const pending = getPendingResults();
        savePendingResults([...pending, fullPayload]);
        return false;
      }

      return true;
    },
    [isAuthenticated, getPendingResults, savePendingResults, uploadResult]
  );

  // Trigger sync on mount/startup when authentication status changes
  useEffect(() => {
    if (isAuthenticated) {
      syncPendingResults();
    }
  }, [isAuthenticated, syncPendingResults]);

  return {
    saveResult,
    syncPendingResults,
    getPendingResultsCount: () => getPendingResults().length,
  };
}
