import { useState, useEffect, useCallback } from "react";
import { gitApi } from "../api/git";
import type { Commit } from "../types/commit";

export function useCommits(serviceId?: string) {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCommits = useCallback(async () => {
    if (!serviceId) return;
    setLoading(true);
    try {
      const data = await gitApi.getCommits(serviceId);
      setCommits(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch commits");
    } finally {
      setLoading(false);
    }
  }, [serviceId]);

  useEffect(() => {
    fetchCommits();
  }, [fetchCommits]);

  return { commits, loading, error, refresh: fetchCommits };
}
