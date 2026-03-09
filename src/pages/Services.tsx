import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Play, Square, ExternalLink, RefreshCw, Trash2 } from "lucide-react";
import { useServices } from "../hooks/useServices";
import { Button } from "../components/ui/Button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../components/ui/Table";
import { StatusBadge } from "../components/ui/StatusBadge";
import { Card, CardContent } from "../components/ui/Card";
import { NewServiceModal } from "../components/service/NewServiceModal";

export function Services() {
  const navigate = useNavigate();
  const { services, loading, error, refresh, toggleService, createService, deleteService } = useServices();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete service "${name}"?`)) {
      await deleteService(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Services</h1>
          <p className="text-zinc-400 text-sm">Manage your deployed applications and services.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={refresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Service
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-md text-sm whitespace-pre-wrap font-mono">
          {error}
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 text-zinc-500">
                    No services found. Create your first service to get started.
                  </TableCell>
                </TableRow>
              ) : (
                services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-white">{service.name}</span>
                        <span className="text-xs text-zinc-500 font-mono truncate max-w-xs">
                          {service.repo}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <a
                        href={`https://${service.domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-400 hover:underline"
                      >
                        {service.domain}
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={service.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigate(`/services/${service.id}`)}
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => toggleService(service.id, service.enabled)}
                        >
                          {service.enabled ? (
                            <Square className="w-3.5 h-3.5 mr-1.5 fill-current" />
                          ) : (
                            <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
                          )}
                          {service.enabled ? "Stop" : "Start"}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          onClick={() => handleDelete(service.id, service.name)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      <NewServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={createService}
      />
    </div>
  );
}
