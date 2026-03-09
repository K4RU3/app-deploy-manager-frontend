import { request } from "./client";
import type { Service } from "../types/service";

export const servicesApi = {
  list: () => request<Service[]>("/services"),
  get: (id: string) => request<Service>(`/services/${id}`),
  create: (data: { repositoryUrl: string; branch?: string }) =>
    request<Service>("/services", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    request<void>(`/services/${id}`, {
      method: "DELETE",
    }),
  enable: (id: string) =>
    request<void>(`/services/${id}/enable`, {
      method: "POST",
    }),
  disable: (id: string) =>
    request<void>(`/services/${id}/disable`, {
      method: "POST",
    }),
};
