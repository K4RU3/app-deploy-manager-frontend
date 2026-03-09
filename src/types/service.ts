export type DeployMode = "branch" | "commit";

export interface Service {
  id: string;
  name: string;
  domain: string;
  repo: string;
  branch: string;
  deployMode: DeployMode;
  selectedCommit?: string;
  containerPort: number;
  enabled: boolean;
  dockerVolume: string;
  autoBackup: boolean;
  status: "Running" | "Stopped" | "Error";
}
