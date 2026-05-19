"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, UtensilsCrossed, Package } from "lucide-react";
import { useSelector } from "react-redux";
import { selectCount, selectSubtotal } from "@/store/slices/cartSlice";
import { selectHasActiveDineInOrder, selectHasActiveTakeawayOrder, selectIsBillGenerated } from "@/store/slices/dineInSlice";
import { GROUP_STATUS } from "@/constants";
import { formatPrice } from "@/lib/format";

export function CartBar() {
  const count = useSelector(selectCount);
  const subtotal = useSelector(selectSubtotal);
  const hasDineInOrder = useSelector(selectHasActiveDineInOrder);
  const hasTakeawayOrder = useSelector(selectHasActiveTakeawayOrder);
  const isBillGenerated = useSelector(selectIsBillGenerated);
  const orderId = useSelector((s) => s.dineIn.orderId);
  const restaurantName = useSelector((s) => s.dineIn.restaurantName);
  const tableNumber = useSelector((s) => s.dineIn.tableNumber);
  const orderGroups = useSelector((s) => s.dineIn.orderGroups);
  const takeawayStatus = useSelector((s) => s.takeaway.takeawayStatus);

  // Active dine-in order banner
  if (hasDineInOrder && orderId) {
    const activeGroups = orderGroups.filter((g) => g.status !== GROUP_STATUS.SERVED);
    const allServed = activeGroups.length === 0 && orderGroups.length > 0;

    const statusLabel = isBillGenerated
      ? "Bill generated"
      : allServed
      ? "All served"
      : `${activeGroups.length} group${activeGroups.length !== 1 ? "s" : ""} in kitchen`;

    const href = isBillGenerated ? `/order/${orderId}/bill` : `/order/${orderId}`;
    const cta = isBillGenerated ? "View bill" : "Track order";

    return (
      <AnimatePresence>
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 safe-bottom"
        >
          <Link href={href} className="block mx-auto max-w-md">
            <div className="glass-strong rounded-2xl p-3 pl-4 flex items-center justify-between ring-glow">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-[oklch(0.74_0.17_155)] text-background">
                  <UtensilsCrossed className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Current Order</p>
                  <p className="text-xs text-muted-foreground">
                    {restaurantName}{tableNumber ? ` · Table ${tableNumber}` : ""} · {statusLabel}
                  </p>
                </div>
              </div>
              <div className="rounded-xl bg-[oklch(0.74_0.17_155)] px-4 py-2.5 text-sm font-semibold text-background">
                {cta}
              </div>
            </div>
          </Link>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Active takeaway order banner
  if (hasTakeawayOrder && orderId) {
    const TAKEAWAY_LABELS = {
      completed: "Completed",
      ready: "Ready for pickup",
      preparing: "Preparing",
      received: "Order received",
    };
    const statusLabel = TAKEAWAY_LABELS[takeawayStatus] ?? "Order received";

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
                  <p className="text-sm font-semibold">Your Pickup Order</p>
                  <p className="text-xs text-muted-foreground">
                    {restaurantName} · {statusLabel}
                  </p>
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

  // Pending cart items bar
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
                  <p className="text-sm font-semibold">
                    {count} item{count > 1 ? "s" : ""} in cart
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatPrice(subtotal)} · taxes extra
                  </p>
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
