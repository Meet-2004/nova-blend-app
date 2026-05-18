"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useSelector } from "react-redux";
import { selectCount, selectSubtotal } from "@/store/slices/cartSlice";
import { formatPrice } from "@/lib/format";

export function CartBar() {
  const count = useSelector(selectCount);
  const subtotal = useSelector(selectSubtotal);

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
