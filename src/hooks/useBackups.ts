import { useState, useEffect, useCallback } from "react";
import { backupsApi } from "../api/backups";
import type { Backup } from "../types/backup";

export function useBackups(serviceId?: string) {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBackups = useCallback(async () => {
    if (!serviceId) return;
    setLoading(true);
    try {
      const data = await backupsApi.list(serviceId);
      setBackups(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch backups");
    } finally {
      setLoading(false);
    }
  }, [serviceId]);

  useEffect(() => {
    fetchBackups();
  }, [fetchBackups]);

  const createBackup = async () => {
    if (!serviceId) return;
    try {
      await backupsApi.create(serviceId);
      await fetchBackups();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create backup");
    }
  };

  const restoreBackup = async (file: string) => {
    if (!serviceId) return;
    try {
      await backupsApi.restore(serviceId, file);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to restore backup");
    }
  };

  const deleteBackup = async (file: string) => {
    if (!serviceId) return;
    try {
      await backupsApi.delete(serviceId, file);
      await fetchBackups();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete backup");
    }
  };

  const downloadBackup = (file: string) => {
    if (!serviceId) return;
    const url = backupsApi.getDownloadUrl(serviceId, file);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", file);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  };

  return {
    backups,
    loading,
    error,
    refresh: fetchBackups,
    createBackup,
    restoreBackup,
    deleteBackup,
    downloadBackup,
  };
}
