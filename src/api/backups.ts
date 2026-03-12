import { request, getUrl } from "./client";
import type { Backup } from "../types/backup";

export const backupsApi = {
  list: (serviceId: string) =>
    request<Backup[]>(`/services/${serviceId}/backups`),
  getDownloadUrl: (serviceId: string, file: string) =>
    getUrl(`/services/${serviceId}/backups/${file}`),
  create: (serviceId: string) =>
    request<Backup>(`/services/${serviceId}/backup`, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
    }),
  restore: (serviceId: string, file: string) =>
    request<void>(`/services/${serviceId}/restore`, {
      method: "POST",
      body: JSON.stringify({ file }),
    }),
  delete: (serviceId: string, file: string) =>
    request<void>(`/services/${serviceId}/backups/${file}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "text/plain",
      },
    }),
};
