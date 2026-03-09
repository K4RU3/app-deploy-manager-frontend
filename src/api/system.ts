import { request } from "./client";
import type { SystemStats, SystemEvent } from "../types/system";

export const systemApi = {
  getStats: () => request<SystemStats>("/system/stats"),
  getEvents: () => request<SystemEvent[]>("/system/events"),
};
