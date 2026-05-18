"use client";

import Link from "next/link";
import { ChefHat, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/cn";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/kitchen/dashboard", label: "Kitchen Display", icon: LayoutDashboard },
];

export default function KitchenLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 glass-strong border-b border-border px-5 py-3 flex items-center gap-4">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
          <ChefHat className="h-4 w-4" />
        </div>
        <span className="font-semibold tracking-tight">Kitchen</span>
        <div className="flex-1" />
        <nav className="flex gap-1">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition",
                  active ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
