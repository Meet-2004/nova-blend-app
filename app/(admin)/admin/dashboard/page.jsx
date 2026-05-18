"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, TrendingUp, Users, Clock } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Restaurant operations overview.</p>

      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active tables", value: "12", icon: Users, color: "text-primary" },
          { label: "Orders today", value: "84", icon: LayoutDashboard, color: "text-[oklch(0.74_0.17_155)]" },
          { label: "Revenue", value: "₹48.2k", icon: TrendingUp, color: "text-accent" },
          { label: "Avg wait", value: "14 min", icon: Clock, color: "text-warning" },
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
