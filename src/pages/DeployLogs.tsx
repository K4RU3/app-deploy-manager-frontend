import * as React from "react";
import { useState, useEffect } from "react";
import { RefreshCw, Terminal } from "lucide-react";
import { deployApi } from "../api/deploy";
import type { DeployLog } from "../types/deploy";
import { Card, CardContent } from "../components/ui/Card";
import { StatusBadge } from "../components/ui/StatusBadge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../components/ui/Table";
import { Button } from "../components/ui/Button";

export function DeployLogs() {
  const [logs, setLogs] = useState<DeployLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await deployApi.list();
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Deploy Logs</h1>
          <p className="text-zinc-400 text-sm">Historical record of all deployment activities.</p>
        </div>
        <Button variant="secondary" onClick={fetchLogs}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Commit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-500" />
                  </TableCell>
                </TableRow>
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-zinc-500">
                    No deployment logs found.
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <React.Fragment key={log.id}>
                    <TableRow>
                      <TableCell className="font-semibold text-white">{log.serviceId}</TableCell>
                      <TableCell className="font-mono text-xs text-zinc-400">{log.commit.slice(0, 7)}</TableCell>
                      <TableCell>
                        <StatusBadge status={log.status as "Success" | "Error" | "Pending"} />
                      </TableCell>
                      <TableCell className="text-zinc-500">{new Date(log.createdAt).toLocaleString()}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                        >
                          <Terminal className="w-4 h-4 mr-2" />
                          View Logs
                        </Button>
                      </TableCell>
                    </TableRow>
                    {expandedLog === log.id && (
                      <TableRow className="bg-zinc-950/50">
                        <TableCell colSpan={5} className="p-4">
                          <pre className="bg-zinc-950 p-4 rounded border border-zinc-800 font-mono text-xs text-zinc-300 overflow-auto max-h-96">
                            {log.logs || "No log content available."}
                          </pre>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
