import { useState, useEffect } from "react";
import { servicesApi } from "../api/services";
import type { Service } from "../types/service";

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await servicesApi.list();
      setServices(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const toggleService = async (id: string, enabled: boolean) => {
    try {
      if (enabled) {
        await servicesApi.disable(id);
      } else {
        await servicesApi.enable(id);
      }
      await fetchServices();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to toggle service");
    }
  };

  return { services, loading, error, refresh: fetchServices, toggleService };
}
