import { useState, useEffect, useCallback } from "react";
import { systemApi } from "../api/system";
import type { SystemEvent } from "../types/system";

export function useSystemEvents() {
  const [events, setEvents] = useState<SystemEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    try {
      const data = await systemApi.getEvents();
      setEvents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, loading, refresh: fetchEvents };
}
