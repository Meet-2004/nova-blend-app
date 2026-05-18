"use client";

import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChefHat, Clock, Flame, Utensils, Receipt, Plus, X, UtensilsCrossed } from "lucide-react";
import { useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { TopBar } from "@/components/layout/TopBar";
import { useDispatch, useSelector } from "react-redux";
import {
  generateBill,
  setOrderStatus,
  showBillConfirmModal,
  hideBillConfirmModal,
  selectCanGenerateBill,
} from "@/store/slices/dineInSlice";
import { SERVING_GROUPS } from "@/services/restaurants";
import { cn } from "@/lib/cn";

const STAGES = [
  { id: "placed", label: "Order placed", icon: Check },
  { id: "kitchen", label: "In the kitchen", icon: ChefHat },
  { id: "cooking", label: "Cooking", icon: Flame },
  { id: "serving", label: "Being served", icon: Utensils },
  { id: "served", label: "Served", icon: UtensilsCrossed },
];

const STAGE_IDS = STAGES.map((s) => s.id);

export default function OrderTracking() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const dispatch = useDispatch();
  const items = useSelector((s) => s.cart.items);
  const restaurantName = useSelector((s) => s.dineIn.restaurantName);
  const restaurantId = useSelector((s) => s.dineIn.restaurantId);
  const tableNumber = useSelector((s) => s.dineIn.tableNumber);
  const mode = useSelector((s) => s.dineIn.mode);
  const orderStatus = useSelector((s) => s.dineIn.orderStatus);
  const billStatus = useSelector((s) => s.dineIn.billStatus);
  const billConfirmModal = useSelector((s) => s.dineIn.billConfirmModal);
  const canGenerateBill = useSelector(selectCanGenerateBill);

  const stage = Math.max(STAGE_IDS.indexOf(orderStatus), 0);

  useEffect(() => {
    if (mode === "takeaway") {
      router.replace(`/takeaway-order/${id}`);
    }
  }, [mode, id, router]);

  useEffect(() => {
    if (billStatus !== "none" || !orderStatus || orderStatus === "served") return;
    const t = setInterval(() => {
      const currentIdx = STAGE_IDS.indexOf(orderStatus);
      if (currentIdx < STAGE_IDS.length - 1) {
        dispatch(setOrderStatus(STAGE_IDS[currentIdx + 1]));
      }
    }, 4000);
    return () => clearInterval(t);
  }, [orderStatus, billStatus, dispatch]);

  const handleGenerateBill = () => {
    dispatch(showBillConfirmModal());
  };

  const confirmGenerateBill = () => {
    dispatch(generateBill());
    router.push(`/order/${id}/bill`);
  };

  const handleAddMoreItems = () => {
    router.push(`/restaurant/${restaurantId}/menu`);
  };

  const grouped = SERVING_GROUPS.map((g) => ({
    group: g,
    items: items.filter((i) => i.group === g.id),
  })).filter((s) => s.items.length > 0);

  const isBillGenerated = billStatus === "generated" || billStatus === "paid";

  return (
    <Container className="min-h-screen pb-10">
      <TopBar title="Order tracking" subtitle={`#${id}`} noBack />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 glass-strong rounded-3xl p-5 ring-glow overflow-hidden relative"
      >
        <div className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-primary/30 blur-3xl" />
        <div className="relative">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Estimated</div>
          <div className="mt-1 text-3xl font-bold tracking-tight">
            {orderStatus === "served" ? "At your table" : "12 - 18 min"}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {restaurantName}
            {mode === "dine-in" && tableNumber ? ` · Table ${tableNumber}` : ""}
          </div>
        </div>
      </motion.div>

      <div className="mt-6 space-y-3">
        {STAGES.map((s, i) => {
          const Icon = s.icon;
          const done = i < stage;
          const current = i === stage;
          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                "flex items-center gap-3 rounded-2xl p-3 border",
                current && s.id === "served"
                  ? "border-[oklch(0.74_0.17_155/0.4)] bg-[oklch(0.74_0.17_155/0.08)]"
                  : current
                    ? "border-primary/40 bg-primary/8"
                    : "border-border bg-white/[0.02]"
              )}
            >
              <div
                className={cn(
                  "grid h-10 w-10 place-items-center rounded-xl",
                  s.id === "served" && (done || current)
                    ? "bg-[oklch(0.74_0.17_155)] text-background"
                    : done || current
                      ? "bg-primary text-primary-foreground"
                      : "bg-white/5 text-muted-foreground"
                )}
              >
                {current && s.id !== "served" ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                    <Icon className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </div>
              <div className="flex-1">
                <div className={cn("text-sm font-semibold", !done && !current && "text-muted-foreground")}>
                  {s.label}
                </div>
                {current && s.id === "served" && (
                  <div className="text-xs text-[oklch(0.74_0.17_155)] mt-0.5">All items at your table</div>
                )}
                {current && s.id !== "served" && (
                  <div className="text-xs text-primary mt-0.5">In progress</div>
                )}
                {done && <div className="text-xs text-muted-foreground mt-0.5">Done</div>}
              </div>
              {done && <Check className="h-4 w-4 text-[oklch(0.84_0.17_155)]" />}
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8 space-y-5">
        <h3 className="px-1 text-sm font-semibold tracking-tight text-muted-foreground uppercase">Coming to your table</h3>
        {grouped.map(({ group, items }, gi) => (
          <div key={group.id}>
            <div className="mb-2 flex items-center gap-2 px-1">
              <span>{group.emoji}</span>
              <h4 className="text-sm font-semibold">{group.label}</h4>
              <span className="text-[11px] text-muted-foreground">
                <Clock className="inline h-3 w-3 -mt-0.5 mr-0.5" /> ETA +{(gi + 1) * 5}m
              </span>
            </div>
            <div className="glass rounded-2xl divide-y divide-white/5">
              {items.map((i) => (
                <div key={i.id} className="p-3 flex items-center gap-3">
                  <img src={i.image} alt={i.name} loading="lazy" className="h-12 w-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{i.name}</div>
                    <div className="text-xs text-muted-foreground">Qty {i.qty}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {!isBillGenerated && (
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleAddMoreItems}
          className="mt-6 w-full rounded-2xl border border-border h-12 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-white/5 transition inline-flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add more items
        </motion.button>
      )}

      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={handleGenerateBill}
        disabled={!canGenerateBill}
        className="mt-3 flex items-center justify-center gap-2 w-full rounded-2xl bg-primary text-primary-foreground h-14 font-semibold ring-glow disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Receipt className="h-5 w-5" />
        {canGenerateBill ? "Generate bill" : "Waiting for all items to be served..."}
      </motion.button>

      <AnimatePresence>
        {billConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-background/80 backdrop-blur-sm p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="glass-strong rounded-3xl p-6 w-full max-w-sm ring-glow"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold tracking-tight">Generate final bill?</h3>
                <button
                  onClick={() => dispatch(hideBillConfirmModal())}
                  className="grid h-8 w-8 place-items-center rounded-full bg-white/5 hover:bg-white/10 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Are you sure your meal is completed? After generating the bill, you won&apos;t be able to add more items to this order.
              </p>
              <div className="mt-6 space-y-3">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => dispatch(hideBillConfirmModal())}
                  className="w-full rounded-2xl border border-border h-12 text-sm font-semibold hover:bg-white/5 transition"
                >
                  Continue Dining
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={confirmGenerateBill}
                  className="w-full rounded-2xl bg-primary text-primary-foreground h-12 text-sm font-semibold ring-glow"
                >
                  Generate Final Bill
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Container>
  );
}
