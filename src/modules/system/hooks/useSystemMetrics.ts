"use client";

import { useEffect, useRef, useState } from "react";
import type { SystemMetrics } from "../types";

interface UseSystemMetricsOptions {
  interval?: number;
}

type PrevNetwork = {
  rxBytes: number;
  txBytes: number;
  timestamp: number;
};

export function useSystemMetrics(options: UseSystemMetricsOptions = {}) {
  const { interval = 5000 } = options;
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [networkSpeed, setNetworkSpeed] = useState({ rxPerSec: 0, txPerSec: 0 });
  const mountedRef = useRef(true);
  const prevNetworkRef = useRef<PrevNetwork | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    const fetchMetrics = async () => {
      try {
        const res = await fetch("/api/system");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: SystemMetrics = await res.json();

        if (mountedRef.current) {
          setMetrics(data);
          setError(null);

          // Calculate network speed from delta
          const prev = prevNetworkRef.current;
          if (prev && data.network) {
            const now = Date.now();
            const elapsed = (now - prev.timestamp) / 1000;
            if (elapsed > 0) {
              setNetworkSpeed({
                rxPerSec: Math.round((data.network.rxBytes - prev.rxBytes) / elapsed),
                txPerSec: Math.round((data.network.txBytes - prev.txBytes) / elapsed),
              });
            }
          }
          prevNetworkRef.current = {
            rxBytes: data.network.rxBytes,
            txBytes: data.network.txBytes,
            timestamp: Date.now(),
          };
        }
      } catch (err) {
        if (mountedRef.current) {
          setError(err instanceof Error ? err.message : "Failed to fetch");
        }
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    };

    fetchMetrics();
    const id = setInterval(fetchMetrics, interval);
    return () => {
      mountedRef.current = false;
      clearInterval(id);
    };
  }, [interval]);

  return { metrics, loading, error, networkSpeed };
}