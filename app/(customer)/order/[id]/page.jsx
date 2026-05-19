"use client";

import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChefHat, Flame, Receipt, Plus, ChevronLeft } from "lucide-react";
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
} from "@/store/slices/dineInSlice";
import { GROUP_STATUS, GROUP_STATUS_LABELS } from "@/constants";
import { formatTime } from "@/lib/format";
import { cn } from "@/lib/cn";

const PROGRESS_STEPS = [GROUP_STATUS.PREPARING, GROUP_STATUS.COOKING, GROUP_STATUS.SERVED];
const STEP_DURATION_MS = 5000;

export default function OrderTrackingPage() {
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
  const orderGroups = useSelector((s) => s.dineIn.orderGroups);

  // Redirect takeaway to their page
  useEffect(() => {
    if (mode === "takeaway") {
      router.replace(`/takeaway-order/${id}`);
    }
  }, [mode, id, router]);

  // Auto-activate scheduled groups
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
    }, 1000);

    return () => clearInterval(timer);
  }, [orderGroups, isBillGenerated, dispatch]);

  // Auto-progress groups through statuses
  useEffect(() => {
    if (isBillGenerated) return;

    const timer = setInterval(() => {
      const now = Date.now();
      orderGroups.forEach((group) => {
        if (
          group.status === GROUP_STATUS.SCHEDULED ||
          group.status === GROUP_STATUS.SERVED
        ) {
          return;
        }

        const currentIdx = PROGRESS_STEPS.indexOf(group.status);
        if (currentIdx < 0 || currentIdx >= PROGRESS_STEPS.length - 1) return;

        const createdAt = group.createdAt;
        const elapsedMs = now - createdAt;
        const nextIdx = currentIdx + 1;
        const requiredMs = STEP_DURATION_MS * (nextIdx + 1);

        if (elapsedMs >= requiredMs) {
          dispatch(
            updateGroupStatus({
              groupId: group.id,
              status: PROGRESS_STEPS[nextIdx],
            })
          );
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [orderGroups, isBillGenerated, dispatch]);

  const handleGenerateBill = () => {
    dispatch(generateBill());
    router.push(`/order/${id}/bill`);
  };

  const handleBackToMenu = () => {
    router.push(`/restaurant/${restaurantId}/menu`);
  };

  const allServed = orderGroups.every((g) => g.status === GROUP_STATUS.SERVED);

  return (
    <Container className="min-h-screen pb-20">
      <TopBar
        title="Order status"
        subtitle={`${restaurantName}${tableNumber ? ` · Table ${tableNumber}` : ""}`}
        backButton={!isBillGenerated}
        onBack={handleBackToMenu}
      />

      {/* Status hero */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 glass-strong rounded-3xl p-6 ring-glow overflow-hidden relative"
      >
        <div className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-primary/25 blur-3xl" />
        <div className="relative">
          {allServed ? (
            <>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Perfect timing</p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-[oklch(0.84_0.17_155)]">
                All items ready!
              </p>
              <p className="text-xs text-muted-foreground mt-1">Order #{id}</p>
            </>
          ) : (
            <>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">In progress</p>
              <p className="mt-2 text-3xl font-bold tracking-tight">
                {orderGroups.filter((g) => g.status !== GROUP_STATUS.SERVED).length} group{
                  orderGroups.filter((g) => g.status !== GROUP_STATUS.SERVED).length !== 1 ? "s" : ""
                } cooking
              </p>
              <p className="text-xs text-muted-foreground mt-1">Order #{id}</p>
            </>
          )}
        </div>
      </motion.div>

      {/* Order groups */}
      <div className="mt-6 space-y-4">
        {orderGroups.map((group, idx) => (
          <OrderGroupCard key={group.id} group={group} index={idx} />
        ))}
      </div>

      {/* Add more items button */}
      {!isBillGenerated && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleBackToMenu}
          className="mt-6 w-full flex items-center justify-center gap-2 rounded-2xl border border-border h-12 text-sm font-medium text-foreground/80 hover:bg-white/5 transition"
        >
          <Plus className="h-4 w-4" />
          Add more items
        </motion.button>
      )}

      {/* Generate bill button */}
      {!isBillGenerated && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => dispatch(showBillConfirmModal())}
          disabled={!canGenerateBill}
          className="mt-3 w-full flex items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground h-12 font-semibold ring-glow disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <Receipt className="h-4 w-4" />
          {canGenerateBill ? "Generate bill" : "Waiting for all items to be served"}
        </motion.button>
      )}

      {/* Bill confirm modal */}
      <AnimatePresence>
        {billConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="glass-strong rounded-3xl p-6 w-full max-w-sm ring-glow"
            >
              <h3 className="text-lg font-bold mb-2">Ready to pay?</h3>
              <p className="text-sm text-muted-foreground mb-6">
                This will finalize your order and prevent adding more items.
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => dispatch(hideBillConfirmModal())}
                  className="w-full rounded-2xl border border-border h-11 text-sm font-semibold hover:bg-white/5 transition"
                >
                  Keep dining
                </button>
                <button
                  onClick={handleGenerateBill}
                  className="w-full rounded-2xl bg-primary text-primary-foreground h-11 text-sm font-semibold ring-glow"
                >
                  Generate bill
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Container>
  );
}

function OrderGroupCard({ group, index }) {
  const isServed = group.status === GROUP_STATUS.SERVED;
  const isScheduled = group.status === GROUP_STATUS.SCHEDULED;
  const currentStepIdx = PROGRESS_STEPS.indexOf(group.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "glass-strong rounded-2xl overflow-hidden border",
        isServed
          ? "border-[oklch(0.74_0.17_155/0.3)] bg-[oklch(0.74_0.17_155/0.05)]"
          : "border-white/10"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <div>
          <p className="font-semibold text-sm">Group {group.groupNumber}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{group.servingTimeLabel}</p>
        </div>
        <StatusBadge status={group.status} />
      </div>

      {/* Progress bar */}
      {!isServed && !isScheduled && (
        <div className="px-4 pt-4 pb-3">
          <div className="flex gap-2 mb-2">
            {PROGRESS_STEPS.map((step, i) => (
              <div
                key={step}
                className={cn(
                  "flex-1 h-2 rounded-full transition-colors",
                  i < currentStepIdx
                    ? "bg-[oklch(0.74_0.17_155)]"
                    : i === currentStepIdx
                    ? "bg-primary"
                    : "bg-white/10"
                )}
              />
            ))}
          </div>
          <p className="text-xs font-medium text-primary">{GROUP_STATUS_LABELS[group.status]}</p>
        </div>
      )}

      {/* Items list */}
      <div className="divide-y divide-white/5">
        {group.items.map((item) => (
          <div key={item.id} className="px-4 py-3 flex gap-3 items-center">
            <img
              src={item.image}
              alt={item.name}
              loading="lazy"
              className="h-12 w-12 rounded-lg object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{item.name}</p>
              <p className="text-xs text-muted-foreground">Qty: {item.qty}</p>
            </div>
            {isServed && (
              <span className="flex items-center gap-1 text-xs font-medium text-[oklch(0.84_0.17_155)]">
                <Check className="h-3.5 w-3.5" /> Served
              </span>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function StatusBadge({ status }) {
  const isServed = status === GROUP_STATUS.SERVED;
  const isScheduled = status === GROUP_STATUS.SCHEDULED;

  let icon = <Check className="h-3 w-3" />;
  let label = GROUP_STATUS_LABELS[status];
  let className = "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold border";

  if (isServed) {
    return (
      <span className={cn(className, "bg-[oklch(0.74_0.17_155/0.15)] text-[oklch(0.84_0.17_155)] border-[oklch(0.74_0.17_155/0.3)]")}>
        <Check className="h-3 w-3" /> {label}
      </span>
    );
  }

  if (isScheduled) {
    return (
      <span className={cn(className, "bg-yellow-500/15 text-yellow-500 border-yellow-500/30")}>
        <ChefHat className="h-3 w-3" /> {label}
      </span>
    );
  }

  if (status === GROUP_STATUS.PREPARING) {
    icon = <ChefHat className="h-3 w-3" />;
  } else if (status === GROUP_STATUS.COOKING) {
    icon = <Flame className="h-3 w-3" />;
  }

  return (
    <span className={cn(className, "bg-primary/15 text-primary border-primary/30")}>
      {icon} {label}
    </span>
  );
}
