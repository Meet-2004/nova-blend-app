"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { useDispatch, useSelector } from "react-redux";
import { selectAllOrders, updateGroupStatus } from "@/store/slices/ordersSlice";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";

const ORDER_STATUSES = ["preparing", "cooking", "ready"];

export default function KitchenDashboard() {
  const dispatch = useDispatch();
  const orders = useSelector(selectAllOrders);

  const handleStatusChange = (orderId, groupId, newStatus) => {
    dispatch(updateGroupStatus({ orderId, groupId, status: newStatus }));
  };

  const getNextStatus = (currentStatus) => {
    const idx = ORDER_STATUSES.indexOf(currentStatus);
    return idx < ORDER_STATUSES.length - 1 ? ORDER_STATUSES[idx + 1] : currentStatus;
  };

  const getStatusColor = (status) => {
    const colors = {
      preparing: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
      cooking: "bg-orange-500/20 text-orange-500 border-orange-500/30",
      ready: "bg-green-500/20 text-green-500 border-green-500/30",
    };
    return colors[status] || "";
  };

  const getStatusButtonColor = (status) => {
    const colors = {
      preparing: "bg-yellow-500 hover:bg-yellow-600",
      cooking: "bg-orange-500 hover:bg-orange-600",
      ready: "bg-green-500 hover:bg-green-600",
    };
    return colors[status] || "bg-primary";
  };

  const activeGroups = orders
    .flatMap((order) =>
      order.groups.map((group) => ({
        ...group,
        orderId: order.id,
        tableNumber: order.tableNumber,
      }))
    )
    .filter((g) => g.status !== "served");

  return (
    <Container className="min-h-screen pb-10">
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur -mx-5 px-5 py-3 border-b border-white/5 mb-4">
        <h1 className="text-xl font-bold">Kitchen Dashboard</h1>
        <p className="text-xs text-muted-foreground mt-1">{activeGroups.length} orders to prepare</p>
      </div>

      {activeGroups.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">All orders completed!</p>
          <p className="text-xs text-muted-foreground mt-1">Great work 👍</p>
        </div>
      ) : (
        <div className="grid gap-4 auto-rows-max">
          {activeGroups.map((group, idx) => (
            <motion.div
              key={`${group.orderId}-${group.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={cn(
                "rounded-3xl p-6 border-2 ring-glow overflow-hidden relative",
                getStatusColor(group.status)
              )}
            >
              {/* Header */}
              <div className="mb-4">
                <div className="flex items-baseline justify-between mb-1">
                  <p className="text-3xl font-black">Table {group.tableNumber}</p>
                  <p className="text-sm text-current opacity-70">Group {group.number}</p>
                </div>
                <p className="text-sm opacity-75">Order {group.orderId}</p>
              </div>

              {/* Items - BIG AND READABLE */}
              <div className="bg-black/20 rounded-2xl p-4 mb-6">
                <div className="space-y-3">
                  {group.items.map((item) => (
                    <div key={item.id} className="flex items-baseline justify-between">
                      <p className="text-lg font-semibold">{item.name}</p>
                      <p className="text-3xl font-black">×{item.qty}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status button - HUGE AND EASY TO TAP */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => handleStatusChange(group.orderId, group.id, getNextStatus(group.status))}
                className={cn(
                  "w-full rounded-2xl text-white font-bold text-xl py-6 ring-glow transition-all",
                  getStatusButtonColor(group.status)
                )}
              >
                {group.status === "preparing"
                  ? "Start Cooking"
                  : group.status === "cooking"
                  ? "Mark Ready"
                  : "Ready for Service"}
              </motion.button>
            </motion.div>
          ))}
        </div>
      )}
    </Container>
  );
}
