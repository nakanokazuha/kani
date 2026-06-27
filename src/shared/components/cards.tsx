import type { ReactNode } from "react";
import { cn } from "@/shared/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { HealthStatus } from "@/shared/types";

interface StatusCardProps {
  title: string;
  value: string | number;
  description?: string;
  status?: HealthStatus;
  icon?: ReactNode;
  className?: string;
}

const statusDot: Record<HealthStatus, string> = {
  healthy: "bg-green-500",
  degraded: "bg-yellow-500",
  down: "bg-red-500",
  unknown: "bg-gray-500",
};

export function StatusCard({
  title,
  value,
  description,
  status,
  icon,
  className,
}: StatusCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="flex items-center gap-2">
          {status && (
            <span
              className={cn("h-2 w-2 rounded-full", statusDot[status])}
            />
          )}
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <CardDescription className="mt-1 text-xs">
            {description}
          </CardDescription>
        )}
      </CardContent>
    </Card>
  );
}

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: number;
  icon?: ReactNode;
  className?: string;
}

export function MetricCard({
  title,
  value,
  unit,
  change,
  icon,
  className,
}: MetricCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold">{value}</span>
          {unit && (
            <span className="text-sm text-muted-foreground">{unit}</span>
          )}
        </div>
        {change !== undefined && (
          <CardDescription
            className={cn(
              "mt-1 text-xs",
              change > 0 && "text-green-500",
              change < 0 && "text-red-500",
            )}
          >
            {change > 0 ? "+" : ""}
            {change}%
          </CardDescription>
        )}
      </CardContent>
    </Card>
  );
}