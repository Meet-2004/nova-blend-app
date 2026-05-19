"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronRight, Clock, DollarSign } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { TopBar } from "@/components/layout/TopBar";
import { useSelector } from "react-redux";
import { selectAllOrders } from "@/store/slices/ordersSlice";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";

export default function AdminOrdersPage() {
  const router = useRouter();
  const orders = useSelector(selectAllOrders);

  const statusColors = {
    received: "bg-blue-500/15 text-blue-500",
    preparing: "bg-yellow-500/15 text-yellow-500",
    ready: "bg-green-500/15 text-green-500",
    served: "bg-green-600/15 text-green-600",
    completed: "bg-gray-500/15 text-gray-500",
  };

  const getStatusLabel = (status) => {
    const labels = {
      received: "New",
      preparing: "Cooking",
      ready: "Ready",
      served: "Served",
      completed: "Done",
    };
    return labels[status] || status;
  };

  return (
    <Container className="min-h-screen pb-10">
      <TopBar title="Orders" subtitle="All active orders" backTo="/admin/dashboard" />

      <div className="mt-6 space-y-3">
        {orders.map((order, idx) => (
          <motion.button
            key={order.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => router.push(`/admin/orders/${order.id}`)}
            className="w-full glass-strong rounded-2xl p-4 text-left ring-glow hover:ring-primary/50 transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-lg">Table {order.tableNumber}</p>
                  <span
                    className={cn(
                      "text-xs font-semibold rounded-full px-2 py-1",
                      statusColors[order.status] || "bg-gray-500/15 text-gray-500"
                    )}
                  >
                    {getStatusLabel(order.status)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Order #{order.id} · {order.groups.length} group{order.groups.length !== 1 ? "s" : ""}
                </p>
                <div className="flex flex-wrap gap-2">
                  {order.groups.map((group) => (
                    <div key={group.id} className="text-xs bg-white/5 rounded-lg px-2 py-1">
                      Group {group.number}: {group.items.length} items
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-lg">{formatPrice(order.totalAmount)}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                  <Clock className="h-3 w-3" />
                  {Math.round((Date.now() - order.createdAt) / 60000)} min
                </p>
              </div>
            </div>

            {/* Items preview */}
            <div className="mt-3 pt-3 border-t border-white/5">
              <p className="text-xs text-muted-foreground mb-1">Items:</p>
              <div className="flex flex-wrap gap-1">
                {order.groups.flatMap((g) => g.items).map((item) => (
                  <span key={item.id} className="text-xs bg-primary/10 text-primary rounded px-2 py-1">
                    {item.name} ×{item.qty}
                  </span>
                ))}
              </div>
            </div>
          </motion.button>
        ))}

        {orders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No active orders</p>
          </div>
        )}
      </div>
    </Container>
  );
}
