"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, UtensilsCrossed, Package } from "lucide-react";
import { useSelector } from "react-redux";
import { selectCount, selectSubtotal } from "@/store/slices/cartSlice";
import { selectHasActiveDineInOrder, selectHasActiveTakeawayOrder } from "@/store/slices/dineInSlice";
import { BATCH_STATUS, BATCH_STATUS_LABELS } from "@/constants";
import { formatPrice } from "@/lib/format";

export function CartBar() {
  const count = useSelector(selectCount);
  const subtotal = useSelector(selectSubtotal);
  const hasDineInOrder = useSelector(selectHasActiveDineInOrder);
  const hasTakeawayOrder = useSelector(selectHasActiveTakeawayOrder);
  const orderId = useSelector((s) => s.dineIn.orderId);
  const restaurantName = useSelector((s) => s.dineIn.restaurantName);
  const tableNumber = useSelector((s) => s.dineIn.tableNumber);
  const orderGroups = useSelector((s) => s.dineIn.orderGroups);
  const billStatus = useSelector((s) => s.dineIn.billStatus);
  const takeawayStatus = useSelector((s) => s.takeaway.takeawayStatus);

  const isBillGenerated = billStatus === "generated" || billStatus === "paid";

  if (hasDineInOrder && orderId) {
    const activeGroups = orderGroups.filter((g) => g.status !== BATCH_STATUS.SERVED);
    const servedGroups = orderGroups.filter((g) => g.status === BATCH_STATUS.SERVED);
    const statusLabel = isBillGenerated
      ? "Bill generated"
      : servedGroups.length === orderGroups.length
        ? "All served"
        : `${activeGroups.length} in progress`;

    return (
      <AnimatePresence>
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 safe-bottom"
        >
          <Link href={`/order/${orderId}`} className="block mx-auto max-w-md">
            <div className="glass-strong rounded-2xl p-3 pl-4 flex items-center justify-between ring-glow">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-[oklch(0.74_0.17_155)] text-background">
                  <UtensilsCrossed className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Current Order</div>
                  <div className="text-xs text-muted-foreground">
                    {restaurantName}{tableNumber ? ` · Table ${tableNumber}` : ""} · {statusLabel}
                  </div>
                </div>
              </div>
              <div className="rounded-xl bg-[oklch(0.74_0.17_155)] px-4 py-2.5 text-sm font-semibold text-background">
                {isBillGenerated ? "View bill" : "Track order"}
              </div>
            </div>
          </Link>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (hasTakeawayOrder && orderId) {
    const statusLabel = takeawayStatus === "completed"
      ? "Completed"
      : takeawayStatus === "ready"
        ? "Ready for pickup"
        : takeawayStatus === "preparing"
          ? "Preparing"
          : "Order received";

    return (
      <AnimatePresence>
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 safe-bottom"
        >
          <Link href={`/takeaway-order/${orderId}`} className="block mx-auto max-w-md">
            <div className="glass-strong rounded-2xl p-3 pl-4 flex items-center justify-between ring-glow">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-primary-foreground">
                  <Package className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Your Pickup Order</div>
                  <div className="text-xs text-muted-foreground">
                    {restaurantName} · {statusLabel}
                  </div>
                </div>
              </div>
              <div className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">
                Track order
              </div>
            </div>
          </Link>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 safe-bottom"
        >
          <Link href="/cart" className="block mx-auto max-w-md">
            <div className="glass-strong rounded-2xl p-3 pl-4 flex items-center justify-between ring-glow">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-primary-foreground">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold">
                    {count} item{count > 1 ? "s" : ""} in cart
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatPrice(subtotal)} · taxes extra
                  </div>
                </div>
              </div>
              <div className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">
                View cart
              </div>
            </div>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
