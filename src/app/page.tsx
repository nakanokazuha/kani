"use client";

import { Shell, StatusCard } from "@/shared";

export default function Home() {
  return (
    <Shell>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatusCard
          title="System"
          value="Healthy"
          status="healthy"
        />
        <StatusCard
          title="OpenClaw"
          value="Offline"
          status="down"
        />
        <StatusCard
          title="Docker"
          value="Not connected"
          status="unknown"
        />
        <StatusCard
          title="Network"
          value="Online"
          status="healthy"
        />
      </div>
    </Shell>
  );
}