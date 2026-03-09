import * as React from "react";
import { Server, Activity, Database, Clock } from "lucide-react";
import { useServices } from "../hooks/useServices";
import { useSystemStats } from "../hooks/useSystemStats";
import { useSystemEvents } from "../hooks/useSystemEvents";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card";
import { cn } from "../utils/cn";

export function Dashboard() {
  const { services, loading: servicesLoading } = useServices();
  const { stats, loading: statsLoading } = useSystemStats();
  const { events, loading: eventsLoading } = useSystemEvents();

  const runningServices = services.filter((s) => s.status === "Running").length;
  const stoppedServices = services.filter((s) => s.status === "Stopped").length;
  const errorServices = services.filter((s) => s.status === "Error").length;

  const summaryStats = [
    {
      label: "Running Services",
      value: runningServices,
      icon: Activity,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      label: "Stopped Services",
      value: stoppedServices,
      icon: Server,
      color: "text-zinc-500",
      bg: "bg-zinc-500/10",
    },
    {
      label: "System Errors",
      value: errorServices,
      icon: AlertCircle,
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
    {
      label: "Total Services",
      value: services.length,
      icon: Database,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">System Overview</h1>
        <p className="text-zinc-400 text-sm">
          Real-time status of your PaaS environment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-500">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {servicesLoading ? "..." : stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Clock className="w-4 h-4 text-zinc-500" /> Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {eventsLoading ? (
                <p className="text-center py-4 text-zinc-500">
                  Loading activity...
                </p>
              ) : events.length === 0 ? (
                <p className="text-center py-4 text-zinc-500">
                  No recent activity.
                </p>
              ) : (
                events.map((event) => (
                  <div
                    key={event.id}
                    className="flex gap-4 items-start relative group"
                  >
                    <div
                      className={cn(
                        "w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 z-10 ring-4 ring-zinc-900",
                        event.status === "success"
                          ? "bg-green-500"
                          : event.status === "error"
                            ? "bg-red-500"
                            : "bg-blue-500",
                      )}
                    />
                    <div>
                      <p className="text-sm text-zinc-100 font-medium">
                        <span className="text-zinc-500 mr-2">
                          [{event.serviceId}]
                        </span>
                        {event.message}
                      </p>
                      <p className="text-xs text-zinc-500 mt-1">
                        {new Date(event.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Activity className="w-4 h-4 text-zinc-500" /> System Resources
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {statsLoading || !stats ? (
              <p className="text-center py-4 text-zinc-500">
                Loading resources...
              </p>
            ) : (
              <>
                <div>
                  <div className="flex justify-between text-sm mb-2.5">
                    <span className="text-zinc-400 font-medium uppercase tracking-wider text-xs">
                      CPU Usage
                    </span>
                    <span className="text-white font-bold">{stats.cpu}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden shadow-inner">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-1000",
                        stats.cpu > 80
                          ? "bg-red-500"
                          : stats.cpu > 50
                            ? "bg-yellow-500"
                            : "bg-blue-500",
                      )}
                      style={{ width: `${stats.cpu}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2.5">
                    <span className="text-zinc-400 font-medium uppercase tracking-wider text-xs">
                      Memory Usage
                    </span>
                    <span className="text-white font-bold">
                      {stats.memory}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden shadow-inner">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-1000",
                        stats.memory > 80
                          ? "bg-red-500"
                          : stats.memory > 50
                            ? "bg-yellow-500"
                            : "bg-blue-500",
                      )}
                      style={{ width: `${stats.memory}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2.5">
                    <span className="text-zinc-400 font-medium uppercase tracking-wider text-xs">
                      Disk Space
                    </span>
                    <span className="text-white font-bold">{stats.disk}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden shadow-inner">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-1000",
                        stats.disk > 90
                          ? "bg-red-500"
                          : stats.disk > 70
                            ? "bg-yellow-500"
                            : "bg-green-500",
                      )}
                      style={{ width: `${stats.disk}%` }}
                    />
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Custom Icons
function AlertCircle(props: React.ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
