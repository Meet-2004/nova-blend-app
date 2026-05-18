"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Building2, ChartBar as BarChart3 } from "lucide-react";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/super-admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/super-admin/restaurants", label: "Restaurants", icon: Building2 },
  { href: "/super-admin/analytics", label: "Analytics", icon: BarChart3 },
];

export default function SuperAdminLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex">
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card">
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-accent-foreground font-bold text-sm">S</div>
            <span className="font-semibold tracking-tight">Super Admin</span>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                  active
                    ? "bg-accent/10 text-accent font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden glass-strong border-t border-border">
        <div className="flex justify-around py-2">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] transition",
                  active ? "text-accent" : "text-muted-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <main className="flex-1 p-6 md:p-8 pb-20 md:pb-8">
        {children}
      </main>
    </div>
  );
}
