"use client";

import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChefHat, Flame, Receipt, Plus, X, UtensilsCrossed, CalendarClock } from "lucide-react";
import { useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { TopBar } from "@/components/layout/TopBar";
import { useDispatch, useSelector } from "react-redux";
import {
  updateGroupStatus,
  activateScheduledGroup,
  showBillConfirmModal,
  hideBillConfirmModal,
  generateBill,
  selectCanGenerateBill,
  selectIsBillGenerated,
  selectAllGroupsServed,
} from "@/store/slices/dineInSlice";
import {
  GROUP_STATUS,
  GROUP_STATUS_ACTIVE_ORDER,
  GROUP_STATUS_LABELS,
  GROUP_STATUS_DESC,
} from "@/constants";
import { formatTime } from "@/lib/format";
import { cn } from "@/lib/cn";

// Each step in the demo takes this long before auto-advancing
const STEP_MS = 5000;

export default function OrderTracking() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const dispatch = useDispatch();

  const restaurantName = useSelector((s) => s.dineIn.restaurantName);
  const restaurantId = useSelector((s) => s.dineIn.restaurantId);
  const tableNumber = useSelector((s) => s.dineIn.tableNumber);
  const mode = useSelector((s) => s.dineIn.mode);
  const billConfirmModal = useSelector((s) => s.dineIn.billConfirmModal);
  const canGenerateBill = useSelector(selectCanGenerateBill);
  const isBillGenerated = useSelector(selectIsBillGenerated);
  const allServed = useSelector(selectAllGroupsServed);
  const orderGroups = useSelector((s) => s.dineIn.orderGroups);

  // Redirect takeaway orders to their own page
  useEffect(() => {
    if (mode === "takeaway") router.replace(`/takeaway-order/${id}`);
  }, [mode, id, router]);

  // Activate scheduled groups when their time arrives
  useEffect(() => {
    if (isBillGenerated) return;
    const timer = setInterval(() => {
      const now = Date.now();
      orderGroups.forEach((group) => {
        if (
          group.status === GROUP_STATUS.SCHEDULED &&
          group.scheduledAt &&
          now >= group.scheduledAt
        ) {
          dispatch(activateScheduledGroup({ groupId: group.id }));
        }
      });
    }, 2000);
    return () => clearInterval(timer);
  }, [orderGroups, isBillGenerated, dispatch]);

  // Progress each group independently based on its own placedAt timestamp
  useEffect(() => {
    if (isBillGenerated) return;
    const timer = setInterval(() => {
      orderGroups.forEach((group) => {
        if (!group.placedAt) return;
        if (group.status === GROUP_STATUS.SCHEDULED || group.status === GROUP_STATUS.SERVED) return;

        const currentIdx = GROUP_STATUS_ACTIVE_ORDER.indexOf(group.status);
        if (currentIdx < 0 || currentIdx >= GROUP_STATUS_ACTIVE_ORDER.length - 1) return;

        const elapsed = Date.now() - group.placedAt;
        if (elapsed >= STEP_MS * (currentIdx + 1)) {
          dispatch(updateGroupStatus({
            groupId: group.id,
            status: GROUP_STATUS_ACTIVE_ORDER[currentIdx + 1],
          }));
        }
      });
    }, 2000);
    return () => clearInterval(timer);
  }, [orderGroups, isBillGenerated, dispatch]);

  const confirmGenerateBill = () => {
    dispatch(generateBill());
    router.push(`/order/${id}/bill`);
  };

  const activeGroups = orderGroups.filter((g) => g.status !== GROUP_STATUS.SERVED);

  return (
    <Container className="min-h-screen pb-10">
      <TopBar
        title="Your order"
        subtitle={`${restaurantName ?? ""}${tableNumber ? ` · Table ${tableNumber}` : ""}`}
        noBack={isBillGenerated}
        backTo={!isBillGenerated ? `/restaurant/${restaurantId}/menu` : undefined}
      />

      {/* Summary hero */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-5 glass-strong rounded-3xl p-5 ring-glow overflow-hidden relative"
      >
        <div className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-primary/25 blur-3xl" />
        <div className="relative">
          {allServed ? (
            <>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">All done</p>
              <p className="mt-1 text-3xl font-bold tracking-tight text-[oklch(0.84_0.17_155)]">
                All items served!
              </p>
            </>
          ) : (
            <>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">In progress</p>
              <p className="mt-1 text-3xl font-bold tracking-tight">
                {activeGroups.length} group{activeGroups.length !== 1 ? "s" : ""} in kitchen
              </p>
            </>
          )}
          <p className="mt-1 text-xs text-muted-foreground">Order #{id}</p>
        </div>
      </motion.div>

      {/* Order groups — each completely independent */}
      <div className="mt-5 space-y-4">
        {orderGroups.map((group, i) => (
          <OrderGroupCard key={group.id} group={group} index={i} />
        ))}
      </div>

      {/* Add more items */}
      {!isBillGenerated && (
        <div className="mt-5 space-y-3">
          <p className="text-xs text-center text-muted-foreground px-2">
            You can still add more items. New items will be added to a new group on the same bill.
          </p>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push(`/restaurant/${restaurantId}/menu`)}
            className="w-full rounded-2xl border border-border h-12 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-white/5 transition inline-flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add more items
          </motion.button>
        </div>
      )}

      {/* Bill button */}
      {!isBillGenerated && (
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => dispatch(showBillConfirmModal())}
          disabled={!canGenerateBill}
          className="mt-3 flex items-center justify-center gap-2 w-full rounded-2xl bg-primary text-primary-foreground h-14 font-semibold ring-glow disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Receipt className="h-5 w-5" />
          {canGenerateBill ? "Generate bill" : "Waiting for all items to be served…"}
        </motion.button>
      )}

      {/* Bill confirm modal */}
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
                Once the bill is generated you won&apos;t be able to add more items to this order.
              </p>
              <div className="mt-6 space-y-2.5">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => dispatch(hideBillConfirmModal())}
                  className="w-full rounded-2xl border border-border h-12 text-sm font-semibold hover:bg-white/5 transition"
                >
                  Continue dining
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={confirmGenerateBill}
                  className="w-full rounded-2xl bg-primary text-primary-foreground h-12 text-sm font-semibold ring-glow"
                >
                  Generate final bill
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Container>
  );
}

// ─── Order Group Card ─────────────────────────────────────────────────────────

function OrderGroupCard({ group, index }) {
  const isServed = group.status === GROUP_STATUS.SERVED;
  const isScheduled = group.status === GROUP_STATUS.SCHEDULED;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className={cn(
        "glass-strong rounded-3xl overflow-hidden",
        isServed && "border border-[oklch(0.74_0.17_155/0.35)]"
      )}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold">Group {group.groupNumber}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {group.servingTimeLabel}
            {group.placedAt ? ` · ${formatTime(group.placedAt)}` : ""}
          </p>
        </div>
        <GroupStatusPill status={group.status} />
      </div>

      {/* Progress steps — only for active groups */}
      {!isServed && !isScheduled && (
        <GroupProgressBar status={group.status} />
      )}

      {/* Scheduled info */}
      {isScheduled && group.scheduledAt && (
        <div className="px-4 pb-3 flex items-center gap-2 text-xs text-accent">
          <CalendarClock className="h-3.5 w-3.5" />
          Starts at {formatTime(group.scheduledAt)}
        </div>
      )}

      {/* Item list */}
      <div className="border-t border-white/5 divide-y divide-white/5">
        {group.items.map((item) => (
          <div key={item.id} className="px-4 py-3 flex items-center gap-3">
            <img
              src={item.image}
              alt={item.name}
              loading="lazy"
              className="h-10 w-10 rounded-lg object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{item.name}</p>
              <p className="text-xs text-muted-foreground">Qty {item.qty}</p>
            </div>
            {isServed ? (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-[oklch(0.84_0.17_155)]">
                <Check className="h-3.5 w-3.5" /> Served
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">
                {isScheduled ? "Scheduled" : GROUP_STATUS_LABELS[group.status]}
              </span>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function GroupProgressBar({ status }) {
  const steps = GROUP_STATUS_ACTIVE_ORDER;
  const currentIdx = steps.indexOf(status);

  return (
    <div className="px-4 pb-4">
      <div className="flex gap-1.5 mb-2.5">
        {steps.map((step, i) => (
          <div
            key={step}
            className={cn(
              "flex-1 h-1.5 rounded-full transition-colors duration-500",
              i < currentIdx
                ? "bg-[oklch(0.74_0.17_155)]"
                : i === currentIdx
                ? "bg-primary"
                : "bg-white/10"
            )}
          />
        ))}
      </div>
      <p className="text-xs text-primary font-medium">
        {GROUP_STATUS_LABELS[status]}
        <span className="text-muted-foreground font-normal"> — {GROUP_STATUS_DESC[status]}</span>
      </p>
    </div>
  );
}

// ─── Status Pill ──────────────────────────────────────────────────────────────

function GroupStatusPill({ status }) {
  const isServed = status === GROUP_STATUS.SERVED;
  const isScheduled = status === GROUP_STATUS.SCHEDULED;
  const base = "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border";

  if (isServed) {
    return (
      <span className={cn(base, "bg-[oklch(0.74_0.17_155/0.15)] text-[oklch(0.84_0.17_155)] border-[oklch(0.74_0.17_155/0.3)]")}>
        <Check className="h-3 w-3" /> Served
      </span>
    );
  }
  if (isScheduled) {
    return (
      <span className={cn(base, "bg-accent/15 text-accent border-accent/30")}>
        <CalendarClock className="h-3 w-3" /> Scheduled
      </span>
    );
  }
  return (
    <span className={cn(base, "bg-primary/15 text-primary border-primary/30")}>
      <StepIcon status={status} className="h-3 w-3" />
      {GROUP_STATUS_LABELS[status]}
    </span>
  );
}

function StepIcon({ status, className }) {
  if (status === GROUP_STATUS.RECEIVED) return <Check className={className} />;
  if (status === GROUP_STATUS.PREPARING) return <ChefHat className={className} />;
  if (status === GROUP_STATUS.COOKING) return <Flame className={className} />;
  if (status === GROUP_STATUS.SERVED) return <UtensilsCrossed className={className} />;
  return <Check className={className} />;
}
