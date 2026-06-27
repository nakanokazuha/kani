export interface CpuInfo {
  usage: number;
  cores: number;
  model: string;
}

export interface MemoryInfo {
  total: number;
  used: number;
  free: number;
  percentage: number;
}

export interface DiskInfo {
  mount: string;
  total: number;
  used: number;
  free: number;
  percentage: number;
}

export interface NetworkInfo {
  rxBytes: number;
  txBytes: number;
  interfaces: NetworkInterface[];
}

export interface NetworkInterface {
  name: string;
  rx: number;
  tx: number;
}

export interface SystemMetrics {
  cpu: CpuInfo;
  memory: MemoryInfo;
  disks: DiskInfo[];
  network: NetworkInfo;
  uptime: number;
  hostname: string;
  platform: string;
  thermalPressure?: number;
}

export type { HealthStatus } from "@/shared";