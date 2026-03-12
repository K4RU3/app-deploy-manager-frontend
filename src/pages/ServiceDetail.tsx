import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import {
  ArrowLeft,
  Play,
  Plus,
  Square,
  RefreshCw,
  Database,
  Settings,
  Shield,
  ExternalLink,
  Download,
  Trash2,
} from "lucide-react";
import { servicesApi } from "../api/services";
import { deployApi } from "../api/deploy";
import type { Service } from "../types/service";
import { useCommits } from "../hooks/useCommits";
import { useBackups } from "../hooks/useBackups";
import { Button } from "../components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card";
import { StatusBadge } from "../components/ui/StatusBadge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../components/ui/Table";

export function ServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "commits" | "backups"
  >("overview");

  const { commits, loading: commitsLoading } = useCommits(id);
  const {
    backups,
    loading: backupsLoading,
    createBackup,
    restoreBackup,
    deleteBackup,
    downloadBackup,
  } = useBackups(id);

  const fetchService = useCallback(async () => {
    if (!id) return;
    try {
      const data = await servicesApi.get(id);
      setService(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch service");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchService();
  }, [fetchService]);

  const handleToggle = async () => {
    if (!service) return;
    try {
      if (service.enabled) {
        await servicesApi.disable(service.id);
      } else {
        await servicesApi.enable(service.id);
      }
      fetchService();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to toggle service");
    }
  };

  const handleDeployLatest = async () => {
    if (!id) return;
    try {
      await deployApi.deployLatest(id);
      alert("Deployment started");
    } catch (err) {
      alert(
        "Deployment failed: " +
          (err instanceof Error ? err.message : "Unknown error"),
      );
    }
  };

  const handleDeployCommit = async (hash: string) => {
    if (!id) return;
    try {
      await deployApi.deployCommit(id, hash);
      alert("Deployment started for commit " + hash);
    } catch (err) {
      alert(
        "Deployment failed: " +
          (err instanceof Error ? err.message : "Unknown error"),
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-white">Service not found</h2>
        <Button
          variant="ghost"
          onClick={() => navigate("/services")}
          className="mt-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Services
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/services")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">{service.name}</h1>
            <StatusBadge status={service.status} />
          </div>
          <p className="text-zinc-400 text-sm font-mono">{service.domain}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleToggle}>
            {service.enabled ? (
              <Square className="w-4 h-4 mr-2 fill-current" />
            ) : (
              <Play className="w-4 h-4 mr-2 fill-current" />
            )}
            {service.enabled ? "Stop" : "Start"}
          </Button>
          <Button onClick={handleDeployLatest}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Deploy Latest
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="flex border-b border-zinc-800">
        {(["overview", "commits", "backups"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === tab
                ? "border-blue-500 text-blue-500"
                : "border-transparent text-zinc-400 hover:text-white"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-4 h-4" /> Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-zinc-500 uppercase font-bold">
                    Repository
                  </label>
                  <p className="text-sm font-mono text-zinc-300 break-all">
                    <a
                      href={service.repositoryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-400 transition-colors inline-flex items-center gap-1"
                    >
                      {service.repositoryUrl
                        .split("/")
                        .filter(Boolean)
                        .pop()
                        ?.replace(/\.git$/, "")}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </p>
                </div>
                <div>
                  <label className="text-xs text-zinc-500 uppercase font-bold">
                    Branch
                  </label>
                  <p className="text-sm text-zinc-300">{service.branch}</p>
                </div>
                <div>
                  <label className="text-xs text-zinc-500 uppercase font-bold">
                    Port Mapping
                  </label>
                  <p className="text-sm text-zinc-300">
                    {service.port
                      ? `${service.port.host}:${service.port.container}/${service.port.protocol}`
                      : "None"}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-zinc-500 uppercase font-bold">
                    Deploy Mode
                  </label>
                  <p className="text-sm text-zinc-300 capitalize">
                    {service.deployMode}
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-zinc-800">
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() =>
                    window.open(`https://${service.domain}`, "_blank")
                  }
                >
                  <ExternalLink className="w-4 h-4 mr-2" /> Open Application
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-4 h-4" /> Storage & Backup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs text-zinc-500 uppercase font-bold">
                  Docker Volume
                </label>
                <p className="text-sm font-mono text-zinc-300">
                  {service.dockerVolume}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs text-zinc-500 uppercase font-bold">
                    Auto Backup
                  </label>
                  <p className="text-sm text-zinc-300">
                    {service.autoBackup ? "Enabled" : "Disabled"}
                  </p>
                </div>
                <Button variant="secondary" size="sm" onClick={createBackup}>
                  <Database className="w-4 h-4 mr-2" /> Manual Backup
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "commits" && (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hash</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {commitsLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto text-zinc-500" />
                    </TableCell>
                  </TableRow>
                ) : commits.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-zinc-500"
                    >
                      No commits found.
                    </TableCell>
                  </TableRow>
                ) : (
                  commits.map((commit) => (
                    <TableRow key={commit.hash}>
                      <TableCell className="font-mono text-xs">
                        {commit.shortHash}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {commit.message}
                      </TableCell>
                      <TableCell>{commit.author}</TableCell>
                      <TableCell className="text-zinc-500">
                        {new Date(commit.date).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleDeployCommit(commit.hash)}
                        >
                          Deploy
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {activeTab === "backups" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Backups</CardTitle>
            <Button size="sm" onClick={createBackup}>
              <Plus className="w-4 h-4 mr-2" /> Create Backup
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {backupsLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto text-zinc-500" />
                    </TableCell>
                  </TableRow>
                ) : backups.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-8 text-zinc-500"
                    >
                      No backups found.
                    </TableCell>
                  </TableRow>
                ) : (
                  backups.map((backup) => (
                    <TableRow key={backup.file}>
                      <TableCell className="font-mono text-xs">
                        {backup.file}
                      </TableCell>
                      <TableCell>{backup.size}</TableCell>
                      <TableCell className="text-zinc-500">
                        {new Date(backup.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            title="Download"
                            onClick={() => downloadBackup(backup.file)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => restoreBackup(backup.file)}
                          >
                            Restore
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-400 hover:text-red-300"
                            onClick={() => deleteBackup(backup.file)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
