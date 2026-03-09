import { request } from "./client";
import type { Backup } from "../types/backup";

export const backupsApi = {
  list: (serviceId: string) =>
    request<Backup[]>(`/services/${serviceId}/backups`),
  create: (serviceId: string) =>
    request<Backup>(`/services/${serviceId}/backup`, {
      method: "POST",
    }),
  restore: (serviceId: string, file: string) =>
    request<void>(`/services/${serviceId}/restore`, {
      method: "POST",
      body: JSON.stringify({ file }),
    }),
  delete: (serviceId: string, file: string) =>
    request<void>(`/services/${serviceId}/backups/${file}`, {
      method: "DELETE",
    }),
};
