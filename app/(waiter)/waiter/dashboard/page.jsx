"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { useDispatch, useSelector } from "react-redux";
import { selectAllOrders, updateGroupStatus } from "@/store/slices/ordersSlice";
import { Check } from "lucide-react";

export default function WaiterDashboard() {
  const dispatch = useDispatch();
  const orders = useSelector(selectAllOrders);

  const handleMarkServed = (orderId, groupId) => {
    dispatch(updateGroupStatus({ orderId, groupId, status: "served" }));
  };

  // Get only groups that are ready to serve
  const readyToServe = orders
    .flatMap((order) =>
      order.groups.map((group) => ({
        ...group,
        orderId: order.id,
        tableNumber: order.tableNumber,
      }))
    )
    .filter((g) => g.status === "ready");

  return (
    <Container className="min-h-screen pb-10">
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur -mx-5 px-5 py-3 border-b border-white/5 mb-4">
        <h1 className="text-xl font-bold">Ready to Serve</h1>
        <p className="text-xs text-muted-foreground mt-1">{readyToServe.length} order group(s) ready</p>
      </div>

      {readyToServe.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No items ready yet</p>
          <p className="text-xs text-muted-foreground mt-1">Check back soon</p>
        </div>
      ) : (
        <div className="grid gap-4 auto-rows-max">
          {readyToServe.map((group, idx) => (
            <motion.div
              key={`${group.orderId}-${group.id}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="rounded-3xl p-6 bg-gradient-to-br from-green-500/20 via-green-500/10 to-transparent border-2 border-green-500/30 ring-glow overflow-hidden"
            >
              {/* Huge table number */}
              <p className="text-6xl font-black mb-2">T {group.tableNumber}</p>

              {/* Items to serve */}
              <div className="bg-black/20 rounded-2xl p-4 mb-6">
                <p className="text-xs text-muted-foreground mb-3 font-semibold">ITEMS TO SERVE</p>
                <div className="space-y-2">
                  {group.items.map((item) => (
                    <div key={item.id} className="flex items-baseline justify-between">
                      <p className="text-2xl font-bold">{item.name}</p>
                      <p className="text-4xl font-black">×{item.qty}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mark served button - HUGE */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => handleMarkServed(group.orderId, group.id)}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-black text-2xl py-8 rounded-2xl ring-glow transition-all flex items-center justify-center gap-3"
              >
                <Check className="h-8 w-8" />
                SERVED
              </motion.button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Group {group.number} · Order {group.orderId}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </Container>
  );
}
