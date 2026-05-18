"use client";

import { motion } from "framer-motion";
import { Clock, Flame } from "lucide-react";

const ORDERS = [
  { id: "ORD-A1B2C3", table: "T-5", items: 3, elapsed: "4m", priority: "high" },
  { id: "ORD-D4E5F6", table: "T-12", items: 5, elapsed: "8m", priority: "medium" },
  { id: "ORD-G7H8I9", table: "T-3", items: 2, elapsed: "12m", priority: "low" },
];

export default function KitchenDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Kitchen Display</h1>
      <p className="mt-1 text-sm text-muted-foreground">Active orders in the queue.</p>

      <div className="mt-6 space-y-3">
        {ORDERS.map((order, i) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-strong rounded-2xl p-4 flex items-center gap-4"
          >
            <div className={`grid h-10 w-10 place-items-center rounded-xl ${
              order.priority === "high" ? "bg-destructive/15 text-destructive" : "bg-primary/15 text-primary"
            }`}>
              {order.priority === "high" ? <Flame className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm">{order.id}</div>
              <div className="text-xs text-muted-foreground">Table {order.table} · {order.items} items</div>
            </div>
            <div className="text-sm font-medium tabular-nums">{order.elapsed}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
