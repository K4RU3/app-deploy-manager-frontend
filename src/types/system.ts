export interface SystemStats {
  cpu: number;
  memory: number;
  disk: number;
}

export interface SystemEvent {
  id: string;
  type: "deploy" | "backup" | "service_status";
  serviceId: string;
  message: string;
  timestamp: string;
  status: "success" | "error" | "info";
}
