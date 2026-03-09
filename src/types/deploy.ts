export interface DeployLog {
  id: string;
  serviceId: string;
  commit: string;
  status: string;
  createdAt: string;
  logs?: string;
}
