import { request } from "./client";
import type { DeployLog } from "../types/deploy";

export const deployApi = {
  list: () => request<DeployLog[]>("/deploy-logs"),
  deployLatest: (serviceId: string) =>
    request<void>(`/services/${serviceId}/deploy/latest`, {
      method: "POST",
    }),
  deployCommit: (serviceId: string, commitHash: string) =>
    request<void>(`/services/${serviceId}/deploy/commit`, {
      method: "POST",
      body: JSON.stringify({ commit: commitHash }),
    }),
};
