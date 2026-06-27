"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/utils";
import {
  Monitor,
  Cpu,
  Container,
  Network,
  ScrollText,
  Bell,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { label: "System", href: "/system", icon: Cpu },
  { label: "OpenClaw", href: "/openclaw", icon: Monitor },
  { label: "Docker", href: "/docker", icon: Container },
  { label: "Network", href: "/network", icon: Network },
  { label: "Logs", href: "/logs", icon: ScrollText },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-56 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex h-14 items-center gap-2 px-4">
        <Monitor className="h-5 w-5 text-sidebar-foreground" />
        <span className="text-sm font-semibold tracking-tight text-sidebar-foreground">
          Kani
        </span>
      </div>
      <Separator className="bg-sidebar-border" />
      <ScrollArea className="flex-1 py-2">
        <nav className="flex flex-col gap-1 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
      <Separator className="bg-sidebar-border" />
      <div className="p-2 text-center text-xs text-sidebar-foreground/40">
        v0.1.0
      </div>
    </aside>
  );
}