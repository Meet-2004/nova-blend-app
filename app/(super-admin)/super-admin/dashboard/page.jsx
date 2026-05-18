"use client";

import { motion } from "framer-motion";
import { Building2, TrendingUp, Users } from "lucide-react";

export default function SuperAdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Super Admin</h1>
      <p className="mt-1 text-sm text-muted-foreground">Platform-wide overview.</p>

      <div className="mt-6 grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "Restaurants", value: "24", icon: Building2, color: "text-accent" },
          { label: "Total revenue", value: "₹12.4L", icon: TrendingUp, color: "text-primary" },
          { label: "Active users", value: "1.2k", icon: Users, color: "text-[oklch(0.74_0.17_155)]" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-strong rounded-2xl p-5"
            >
              <Icon className={`h-5 w-5 ${stat.color}`} />
              <div className="mt-3 text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
