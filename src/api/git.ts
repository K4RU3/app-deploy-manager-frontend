import { request } from "./client";
import type { Commit } from "../types/commit";

export const gitApi = {
  getCommits: (serviceId: string) =>
    request<Commit[]>(`/services/${serviceId}/commits`),
};
