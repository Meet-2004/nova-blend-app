"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingCart, Users, DollarSign, Clock, ChevronRight, Plus } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { TopBar } from "@/components/layout/TopBar";
import { useSelector } from "react-redux";
import { selectActiveOrders } from "@/store/slices/ordersSlice";
import { selectOccupiedTables, selectTablesWaitingBill } from "@/store/slices/tablesSlice";
import { formatPrice } from "@/lib/format";

export default function AdminDashboard() {
  const router = useRouter();
  const activeOrders = useSelector(selectActiveOrders);
  const occupiedTables = useSelector(selectOccupiedTables);
  const waitingBillTables = useSelector(selectTablesWaitingBill);

  const totalRevenue = activeOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const avgOrderValue = activeOrders.length > 0 ? totalRevenue / activeOrders.length : 0;

  const stats = [
    {
      label: "Active Orders",
      value: activeOrders.length,
      icon: ShoppingCart,
      color: "from-primary/30 via-primary/10 to-transparent",
      action: () => router.push("/admin/orders"),
    },
    {
      label: "Occupied Tables",
      value: occupiedTables.length,
      icon: Users,
      color: "from-blue-500/30 via-blue-500/10 to-transparent",
      action: () => router.push("/admin/tables"),
    },
    {
      label: "Waiting Bill",
      value: waitingBillTables.length,
      icon: DollarSign,
      color: "from-green-500/30 via-green-500/10 to-transparent",
      action: () => router.push("/admin/orders"),
    },
    {
      label: "Today Revenue",
      value: formatPrice(totalRevenue),
      icon: Clock,
      color: "from-yellow-500/30 via-yellow-500/10 to-transparent",
      action: () => {},
    },
  ];

  const quickActions = [
    { label: "View Orders", icon: ShoppingCart, path: "/admin/orders" },
    { label: "Manage Tables", icon: Users, path: "/admin/tables" },
    { label: "Update Menu", icon: Plus, path: "/admin/menu" },
    { label: "Billing", icon: DollarSign, path: "/admin/billing" },
  ];

  return (
    <Container className="min-h-screen pb-10">
      <TopBar title="Admin Dashboard" subtitle="Restaurant Management" noBack />

      {/* Stats Grid */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((stat, idx) => (
          <motion.button
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={stat.action}
            className={`relative rounded-2xl glass-strong p-4 overflow-hidden ring-glow hover:ring-primary/50 transition-all`}
          >
            <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${stat.color}`} />
            <div className="relative">
              <stat.icon className="h-5 w-5 mb-2 text-muted-foreground" />
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-[11px] text-muted-foreground mt-1">{stat.label}</div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-sm font-semibold mb-3 px-1">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {quickActions.map((action, idx) => (
            <motion.button
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (stats.length + idx) * 0.05 }}
              onClick={() => router.push(action.path)}
              className="glass rounded-2xl p-4 flex flex-col items-center gap-2 hover:bg-white/10 transition group"
            >
              <action.icon className="h-5 w-5 text-primary group-hover:scale-110 transition" />
              <span className="text-xs font-semibold text-center">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="mt-8">
        <div className="flex items-center justify-between px-1 mb-3">
          <h2 className="text-sm font-semibold">Active Orders</h2>
          <button
            onClick={() => router.push("/admin/orders")}
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
            View all <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        <div className="space-y-2">
          {activeOrders.slice(0, 3).map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass rounded-2xl p-3 flex items-center justify-between"
            >
              <div>
                <p className="font-semibold text-sm">Table {order.tableNumber}</p>
                <p className="text-xs text-muted-foreground">
                  {order.groups.length} group{order.groups.length !== 1 ? "s" : ""} · {order.status}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-sm">{formatPrice(order.totalAmount)}</p>
                <p className="text-xs text-muted-foreground">
                  {Math.round((Date.now() - order.createdAt) / 60000)} min
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Container>
  );
}
