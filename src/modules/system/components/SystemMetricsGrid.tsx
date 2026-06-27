"use client";

import { MetricCard, StatusCard } from "@/shared";
import { useSystemMetrics } from "../hooks/useSystemMetrics";
import { formatBytes, formatUptime } from "@/shared/utils";
import type { HealthStatus } from "@/shared";

export function SystemMetricsGrid() {
  const { metrics, loading, error, networkSpeed } = useSystemMetrics({ interval: 5000 });

  if (error) {
    return (
      <StatusCard
        title="System"
        value="Error"
        status="down"
        description={error}
      />
    );
  }

  if (loading || !metrics) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-lg bg-card"
          />
        ))}
      </div>
    );
  }

  const memHealth: HealthStatus =
    metrics.memory.percentage > 90 ? "degraded" : "healthy";

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="CPU Usage"
          value={metrics.cpu.usage}
          unit="%"
          icon={
            <span className="text-xs text-muted-foreground">
              {metrics.cpu.cores} cores
            </span>
          }
        />
        <MetricCard
          title="Memory"
          value={formatBytes(metrics.memory.used)}
          unit={`/ ${formatBytes(metrics.memory.total)}`}
          change={metrics.memory.percentage}
          icon={
            <span
              className={`text-xs ${memHealth === "degraded" ? "text-red-500" : "text-muted-foreground"}`}
            >
              {metrics.memory.percentage}%
            </span>
          }
        />
        <MetricCard
          title="Uptime"
          value={formatUptime(metrics.uptime)}
        />
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">
          Disk
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {metrics.disks.map((disk) => (
            <MetricCard
              key={disk.mount}
              title={disk.mount === "/" ? "Macintosh HD" : disk.mount}
              value={formatBytes(disk.used)}
              unit={`/ ${formatBytes(disk.total)}`}
              change={disk.percentage}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">
          Network
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <MetricCard
            title="Download"
            value={`${formatBytes(networkSpeed.rxPerSec)}/s`}
          />
          <MetricCard
            title="Upload"
            value={`${formatBytes(networkSpeed.txPerSec)}/s`}
          />
          {metrics.thermalPressure !== undefined && (
            <MetricCard
              title="Thermal Pressure"
              value={metrics.thermalPressure}
              unit="%"
            />
          )}
        </div>
      </div>

      <div className="border-t border-border pt-4 text-xs text-muted-foreground">
        {metrics.hostname} &middot; {metrics.platform} &middot;{" "}
        {metrics.cpu.model}
      </div>
    </div>
  );
}