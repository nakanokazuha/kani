import { execSync } from "node:child_process";
import os from "node:os";
import type { SystemMetrics, DiskInfo, NetworkInfo, NetworkInterface } from "../types";

type CpuSample = { idle: number; total: number };

function getCpuSample(): CpuSample | null {
  try {
    const cpus = os.cpus();
    let idle = 0;
    let total = 0;
    for (const cpu of cpus) {
      idle += cpu.times.idle;
      total += cpu.times.user + cpu.times.nice + cpu.times.sys + cpu.times.idle + cpu.times.irq;
    }
    return { idle: idle / cpus.length, total: total / cpus.length };
  } catch {
    return null;
  }
}

function getCpuUsage(): number {
  const s1 = getCpuSample();
  if (!s1) return 0;
  // Wait a short interval to measure delta
  const start = Date.now();
  while (Date.now() - start < 250) {
    // busy-spin short delay — acceptable on a monitoring endpoint
  }
  const s2 = getCpuSample();
  if (!s2) return 0;
  const idleDelta = s2.idle - s1.idle;
  const totalDelta = s2.total - s1.total;
  if (totalDelta === 0) return 0;
  return Math.round((1 - idleDelta / totalDelta) * 100);
}

function getMemoryInfo() {
  const total = os.totalmem();
  try {
    const out = execSync("vm_stat", { encoding: "utf8", timeout: 3000 });
    const pageSize = 16384; // macOS uses 16KB pages on Apple Silicon
    const lines = out.trim().split("\n");
    let pagesActive = 0;
    let pagesWired = 0;
    let pagesCompressed = 0;
    let pagesFree = 0;
    let pagesInactive = 0;

    for (const line of lines) {
      const match = line.match(/^Pages\s+(free|active|inactive|wired down|compressed):\s+(\d+)\.?$/);
      if (match) {
        const key = match[1].toLowerCase();
        const val = parseInt(match[2], 10);
        if (key.startsWith("free")) pagesFree = val;
        else if (key.startsWith("active")) pagesActive = val;
        else if (key.startsWith("inactive")) pagesInactive = val;
        else if (key.startsWith("wired")) pagesWired = val;
        else if (key.startsWith("compressed")) pagesCompressed = val;
      }
    }

    const used = (pagesActive + pagesWired + pagesCompressed) * pageSize;
    const free = (pagesFree + pagesInactive) * pageSize;

    return {
      total,
      used,
      free,
      percentage: Math.round((used / total) * 100),
    };
  } catch {
    // Fallback — os.freemem() is not accurate on macOS but better than nothing
    const free = os.freemem();
    const used = total - free;
    return {
      total,
      used,
      free,
      percentage: Math.round((used / total) * 100),
    };
  }
}

function parseDiskUsage(): DiskInfo[] {
  try {
    const out = execSync("df -k /", { encoding: "utf8", timeout: 3000 });
    const lines = out.trim().split("\n");
    if (lines.length < 2) return [];
    const parts = lines[1].trim().split(/\s+/);
    if (parts.length < 6) return [];

    const totalBytes = parseInt(parts[1], 10) * 1024;
    const usedBytes = parseInt(parts[2], 10) * 1024;
    const freeBytes = parseInt(parts[3], 10) * 1024;
    const pct = parseInt(parts[4], 10);

    return [
      {
        mount: parts[parts.length - 1],
        total: totalBytes,
        used: usedBytes,
        free: freeBytes,
        percentage: pct,
      },
    ];
  } catch {
    return [];
  }
}

function parseNetworkUsage(): NetworkInfo {
  try {
    const out = execSync("netstat -ib", { encoding: "utf8", timeout: 3000 });
    const lines = out.trim().split("\n");
    const interfaces: NetworkInterface[] = [];
    let rxBytes = 0;
    let txBytes = 0;

    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      if (parts.length < 10) continue;
      const name = parts[0];
      if (name === "lo0" || name.startsWith("awdl")) continue;

      const rx = parseInt(parts[6], 10);
      const tx = parseInt(parts[9], 10);
      if (isNaN(rx) || isNaN(tx)) continue;

      interfaces.push({ name, rx, tx });
      rxBytes += rx;
      txBytes += tx;
    }
    return { rxBytes, txBytes, interfaces };
  } catch {
    return { rxBytes: 0, txBytes: 0, interfaces: [] };
  }
}

function getCpuModel(): string {
  try {
    return execSync("sysctl -n machdep.cpu.brand_string", {
      encoding: "utf8",
      timeout: 2000,
    }).trim();
  } catch {
    return os.cpus()[0]?.model ?? "Unknown";
  }
}

function getThermalPressure(): number | undefined {
  try {
    const out = execSync("pmset -g therm 2>/dev/null", {
      encoding: "utf8",
      timeout: 2000,
    });
    const match = out.match(/CPU_Scheduler_Limit\s*=\s*(\d+)/);
    if (match) {
      const limit = parseInt(match[1], 10);
      return 100 - limit;
    }
    return undefined;
  } catch {
    return undefined;
  }
}

export async function getSystemMetrics(): Promise<SystemMetrics> {
  const memory = getMemoryInfo();

  return {
    cpu: {
      usage: getCpuUsage(),
      cores: os.cpus().length,
      model: getCpuModel(),
    },
    memory,
    disks: parseDiskUsage(),
    network: parseNetworkUsage(),
    uptime: os.uptime(),
    hostname: os.hostname(),
    platform: `${os.type()} ${os.release()}`,
    thermalPressure: getThermalPressure(),
  };
}