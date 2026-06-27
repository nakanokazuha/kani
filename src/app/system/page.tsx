"use client";

import { Shell } from "@/shared";
import { SystemMetricsGrid } from "@/modules/system";

export default function SystemPage() {
  return (
    <Shell>
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">System</h2>
          <p className="text-sm text-muted-foreground">
            Real-time macOS metrics
          </p>
        </div>
        <SystemMetricsGrid />
      </div>
    </Shell>
  );
}