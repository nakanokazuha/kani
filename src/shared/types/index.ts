// Shared base types used across modules.

/** Standard API response wrapper */
export interface ApiResponse<T> {
  data: T;
  error?: string;
}

/** Generic health status */
export type HealthStatus = "healthy" | "degraded" | "down" | "unknown";

/** Generic metric value with optional change */
export interface MetricValue {
  value: number;
  unit: string;
  change?: number;
  timestamp: number;
}

/** Pagination params for list endpoints */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/** Time range selector */
export type TimeRange = "1h" | "6h" | "24h" | "7d" | "30d";