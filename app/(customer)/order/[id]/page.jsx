"use client";

import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChefHat, Flame, Utensils, Receipt, Plus, X, UtensilsCrossed, Clock, Package, CalendarClock } from "lucide-react";
import { useEffect, useRef } from "react";
import { Container } from "@/components/ui/Container";
import { TopBar } from "@/components/layout/TopBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useDispatch, useSelector } from "react-redux";
import {
  generateBill,
  updateGroupStatus,
  activateScheduledGroup,
  showBillConfirmModal,
  hideBillConfirmModal,
  selectCanGenerateBill,
  selectIsBillGenerated,
} from "@/store/slices/dineInSlice";
import { BATCH_STATUS, BATCH_STATUS_ORDER, BATCH_STATUS_LABELS, BATCH_STATUS_DESC } from "@/constants";
import { formatTime } from "@/lib/format";
import { cn } from "@/lib/cn";

const STATUS_ICONS = {
  [BATCH_STATUS.SCHEDULED]: CalendarClock,
  [BATCH_STATUS.RECEIVED]: Check,
  [BATCH_STATUS.PREPARING]: ChefHat,
  [BATCH_STATUS.COOKING]: Flame,
  [BATCH_STATUS.SERVING]: Utensils,
  [BATCH_STATUS.SERVED]: UtensilsCrossed,
};

const STATUS_TONES = {
  [BATCH_STATUS.SCHEDULED]: "scheduled",
  [BATCH_STATUS.RECEIVED]: "primary",
  [BATCH_STATUS.PREPARING]: "primary",
  [BATCH_STATUS.COOKING]: "primary",
  [BATCH_STATUS.SERVING]: "primary",
  [BATCH_STATUS.SERVED]: "success",
};

export default function OrderTracking() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const dispatch = useDispatch();
  const restaurantName = useSelector((s) => s.dineIn.restaurantName);
  const restaurantId = useSelector((s) => s.dineIn.restaurantId);
  const tableNumber = useSelector((s) => s.dineIn.tableNumber);
  const mode = useSelector((s) => s.dineIn.mode);
  const billStatus = useSelector((s) => s.dineIn.billStatus);
  const billConfirmModal = useSelector((s) => s.dineIn.billConfirmModal);
  const canGenerateBill = useSelector(selectCanGenerateBill);
  const isBillGenerated = useSelector(selectIsBillGenerated);
  const orderGroups = useSelector((s) => s.dineIn.orderGroups);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (mode === "takeaway") {
      router.replace(`/takeaway-order/${id}`);
    }
  }, [mode, id, router]);

  useEffect(() => {
    if (isBillGenerated) return;

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      orderGroups.forEach((group) => {
        if (group.status === BATCH_STATUS.SCHEDULED && group.scheduledAt && now >= group.scheduledAt) {
          dispatch(activateScheduledGroup({ groupId: group.id }));
        }
      });
    }, 2000);

    return () => clearInterval(intervalRef.current);
  }, [orderGroups, isBillGenerated, dispatch]);

  useEffect(() => {
    if (isBillGenerated) return;
    const progressInterval = setInterval(() => {
      orderGroups.forEach((group) => {
        if (group.status === BATCH_STATUS.SCHEDULED) return;
        const currentIdx = BATCH_STATUS_ORDER.indexOf(group.status);
        if (currentIdx < BATCH_STATUS_ORDER.length - 1 && currentIdx >= 0) {
          const elapsed = Date.now() - group.placedAt;
          const delay = (group.servingDelay || 0) * 1000;
          const adjustedElapsed = elapsed - delay;
          if (adjustedElapsed > 4000 * (currentIdx + 1)) {
            dispatch(updateGroupStatus({ groupId: group.id, status: BATCH_STATUS_ORDER[currentIdx + 1] }));
          }
        }
      });
    }, 3000);
    return () => clearInterval(progressInterval);
  }, [orderGroups, isBillGenerated, dispatch]);

  const handleGenerateBill = () => dispatch(showBillConfirmModal());
  const confirmGenerateBill = () => {
    dispatch(generateBill());
    router.push(`/order/${id}/bill`);
  };
  const handleAddMoreItems = () => router.push(`/restaurant/${restaurantId}/menu`);

  const activeGroups = orderGroups.filter((g) => g.status !== BATCH_STATUS.SERVED);
  const servedGroups = orderGroups.filter((g) => g.status === BATCH_STATUS.SERVED);

  return (
    <Container className="min-h-screen pb-10">
      <TopBar title="Order tracking" subtitle={`#${id}`} noBack />

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-6 glass-strong rounded-3xl p-5 ring-glow overflow-hidden relative">
        <div className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-primary/30 blur-3xl" />
        <div className="relative">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Your order</div>
          <div className="mt-1 text-3xl font-bold tracking-tight">
            {servedGroups.length === orderGroups.length && orderGroups.length > 0 ? "All served!" : `${activeGroups.length} in progress`}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {restaurantName}{mode === "dine-in" && tableNumber ? ` · Table ${tableNumber}` : ""}
          </div>
        </div>
      </motion.div>

      <div className="mt-6 space-y-4">
        {orderGroups.map((group, gi) => (
          <OrderGroupCard key={group.id} group={group} index={gi} />
        ))}
      </div>

      {!isBillGenerated && (
        <motion.button whileTap={{ scale: 0.98 }} onClick={handleAddMoreItems} className="mt-6 w-full rounded-2xl border border-border h-12 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-white/5 transition inline-flex items-center justify-center gap-2">
          <Plus className="h-4 w-4" />
          Add more items
        </motion.button>
      )}

      <motion.button whileTap={{ scale: 0.98 }} onClick={handleGenerateBill} disabled={!canGenerateBill} className="mt-3 flex items-center justify-center gap-2 w-full rounded-2xl bg-primary text-primary-foreground h-14 font-semibold ring-glow disabled:opacity-40 disabled:cursor-not-allowed">
        <Receipt className="h-5 w-5" />
        {canGenerateBill ? "Generate bill" : "Waiting for all items to be served..."}
      </motion.button>

      <AnimatePresence>
        {billConfirmModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 grid place-items-center bg-background/80 backdrop-blur-sm p-6">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 25 }} className="glass-strong rounded-3xl p-6 w-full max-w-sm ring-glow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold tracking-tight">Generate final bill?</h3>
                <button onClick={() => dispatch(hideBillConfirmModal())} className="grid h-8 w-8 place-items-center rounded-full bg-white/5 hover:bg-white/10 transition"><X className="h-4 w-4" /></button>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Are you sure your meal is completed? After generating the bill, you won&apos;t be able to add more items to this order.
              </p>
              <div className="mt-6 space-y-3">
                <motion.button whileTap={{ scale: 0.98 }} onClick={() => dispatch(hideBillConfirmModal())} className="w-full rounded-2xl border border-border h-12 text-sm font-semibold hover:bg-white/5 transition">Continue Dining</motion.button>
                <motion.button whileTap={{ scale: 0.98 }} onClick={confirmGenerateBill} className="w-full rounded-2xl bg-primary text-primary-foreground h-12 text-sm font-semibold ring-glow">Generate Final Bill</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Container>
  );
}

function OrderGroupCard({ group, index }) {
  const statusIdx = BATCH_STATUS_ORDER.indexOf(group.status);
  const isServed = group.status === BATCH_STATUS.SERVED;
  const isScheduled = group.status === BATCH_STATUS.SCHEDULED;
  const Icon = STATUS_ICONS[group.status] || Check;
  const tone = STATUS_TONES[group.status] || "default";

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }} className={cn("glass-strong rounded-3xl overflow-hidden", isServed && "border border-[oklch(0.74_0.17_155/0.3)]")}>
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn("grid h-10 w-10 place-items-center rounded-xl", isServed ? "bg-[oklch(0.74_0.17_155)] text-background" : isScheduled ? "bg-accent/15 text-accent" : "bg-primary/15 text-primary")}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-semibold">Group {group.groupNumber}</div>
            <div className="text-xs text-muted-foreground">
              {group.servingTimeLabel} · {formatTime(group.placedAt)}
            </div>
          </div>
        </div>
        <StatusBadge tone={tone}>{BATCH_STATUS_LABELS[group.status]}</StatusBadge>
      </div>

      {!isServed && !isScheduled && (
        <div className="px-4 pb-3">
          <div className="flex gap-1">
            {BATCH_STATUS_ORDER.filter((s) => s !== BATCH_STATUS.SCHEDULED).map((s, i) => {
              const adjustedIdx = BATCH_STATUS_ORDER.indexOf(s);
              const done = adjustedIdx < statusIdx;
              const current = adjustedIdx === statusIdx;
              return (
                <div key={s} className={cn("flex-1 h-1.5 rounded-full transition-colors", done ? "bg-[oklch(0.74_0.17_155)]" : current ? "bg-primary" : "bg-white/10")} />
              );
            })}
          </div>
        </div>
      )}

      {isScheduled && group.scheduledAt && (
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 text-xs text-accent">
            <CalendarClock className="h-3.5 w-3.5" />
            Scheduled for {formatTime(group.scheduledAt)}
          </div>
        </div>
      )}

      <div className="border-t border-white/5 divide-y divide-white/5">
        {group.items.map((item) => (
          <div key={item.id} className="p-3 flex items-center gap-3">
            <img src={item.image} alt={item.name} loading="lazy" className="h-10 w-10 rounded-lg object-cover" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{item.name}</div>
              <div className="text-xs text-muted-foreground">Qty {item.qty}</div>
            </div>
            <ItemStatusBadge status={group.status} />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ItemStatusBadge({ status }) {
  const isServed = status === BATCH_STATUS.SERVED;
  const isScheduled = status === BATCH_STATUS.SCHEDULED;

  if (isServed) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[oklch(0.84_0.17_155)]">
        <Check className="h-3 w-3" /> Served
      </span>
    );
  }

  if (isScheduled) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-accent">
        <CalendarClock className="h-3 w-3" /> Scheduled
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary">
      <Clock className="h-3 w-3" /> {BATCH_STATUS_LABELS[status]}
    </span>
  );
}
