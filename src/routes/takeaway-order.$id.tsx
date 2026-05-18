import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChefHat, Package, PartyPopper, Sparkles } from "lucide-react";
import { useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { TopBar } from "@/components/layout/TopBar";
import { useCart, type TakeawayStatus } from "@/store/cart";
import { formatPrice } from "@/lib/format";
import { selectSubtotal } from "@/store/cart";
import { cn } from "@/lib/cn";

export const Route = createFileRoute("/takeaway-order/$id")({ component: TakeawayOrder });

const STAGES: { id: TakeawayStatus; label: string; desc: string; icon: typeof Check }[] = [
  { id: "received", label: "Order received", desc: "Your order is confirmed.", icon: Check },
  { id: "preparing", label: "Preparing", desc: "Kitchen is working on it.", icon: ChefHat },
  { id: "ready", label: "Ready for pickup", desc: "Head to the counter!", icon: Package },
  { id: "completed", label: "Completed", desc: "Enjoy your meal!", icon: PartyPopper },
];

function TakeawayOrder() {
  const nav = useNavigate();
  const { id } = useParams({ from: "/takeaway-order/$id" });
  const { items, restaurantName, takeawayStatus, setTakeawayStatus, endSession } = useCart();
  const subtotal = useCart(selectSubtotal);
  const taxes = Math.round(subtotal * 0.05);
  const total = subtotal + taxes;
  const stage = STAGES.findIndex((s) => s.id === takeawayStatus);

  // Simulate status progression
  useEffect(() => {
    if (takeawayStatus === "completed") return;
    const t = setInterval(() => {
      const cur = useCart.getState().takeawayStatus;
      const idx = STAGES.findIndex((s) => s.id === cur);
      if (idx < STAGES.length - 1) setTakeawayStatus(STAGES[idx + 1].id);
    }, 5000);
    return () => clearInterval(t);
  }, [takeawayStatus, setTakeawayStatus]);

  const finish = () => {
    endSession();
    nav({ to: "/", replace: true });
  };

  return (
    <Container className="min-h-screen pb-10">
      <TopBar title="Pickup order" subtitle={`#${id}`} noBack />

      {/* ETA card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 glass-strong rounded-3xl p-5 ring-glow overflow-hidden relative"
      >
        <div className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-primary/30 blur-3xl" />
        <div className="relative">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            {takeawayStatus === "ready" ? "Ready at" : takeawayStatus === "completed" ? "Picked up" : "Pickup ETA"}
          </div>
          <div className="mt-1 text-3xl font-bold tracking-tight">
            {takeawayStatus === "completed" ? "Done!" : "15 – 25 min"}
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <span>{restaurantName}</span>
            <span>·</span>
            <span className="text-[oklch(0.74_0.17_155)]">Paid {formatPrice(total)}</span>
          </div>
        </div>
      </motion.div>

      {/* Status stages */}
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
                "flex items-center gap-3 rounded-2xl p-3 border transition-colors",
                current && s.id === "ready"
                  ? "border-[oklch(0.74_0.17_155/0.4)] bg-[oklch(0.74_0.17_155/0.08)]"
                  : current
                    ? "border-primary/40 bg-primary/8"
                    : "border-border bg-white/[0.02]",
              )}
            >
              <div
                className={cn(
                  "grid h-10 w-10 place-items-center rounded-xl",
                  s.id === "ready" && (done || current)
                    ? "bg-[oklch(0.74_0.17_155)] text-background"
                    : done || current
                      ? "bg-primary text-primary-foreground"
                      : "bg-white/5 text-muted-foreground",
                )}
              >
                {current && s.id !== "completed" && s.id !== "ready" ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
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
                {current && (
                  <div className={cn("text-xs mt-0.5", s.id === "ready" ? "text-[oklch(0.74_0.17_155)]" : "text-primary")}>
                    {s.desc}
                  </div>
                )}
                {done && <div className="text-xs text-muted-foreground mt-0.5">Done</div>}
              </div>
              {done && <Check className="h-4 w-4 text-[oklch(0.84_0.17_155)]" />}
            </motion.div>
          );
        })}
      </div>

      {/* Items list */}
      <div className="mt-8 space-y-2">
        <h3 className="px-1 text-xs uppercase tracking-wider text-muted-foreground">Your order</h3>
        <div className="glass rounded-2xl divide-y divide-white/5">
          {items.map((i) => (
            <div key={i.id} className="p-3 flex items-center gap-3">
              <img src={i.image} alt={i.name} loading="lazy" className="h-12 w-12 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{i.name}</div>
                <div className="text-xs text-muted-foreground">Qty {i.qty}</div>
              </div>
              <div className="text-sm font-medium tabular-nums">{formatPrice(i.price * i.qty)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Completion CTA */}
      <AnimatePresence>
        {takeawayStatus === "completed" && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <div className="glass-strong rounded-3xl p-5 mb-4 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[oklch(0.74_0.17_155/0.15)] text-[oklch(0.74_0.17_155)] mb-3">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="font-semibold">Your order is complete!</div>
              <div className="text-xs text-muted-foreground mt-0.5">Thank you for ordering with us.</div>
            </div>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={finish}
              className="w-full rounded-2xl bg-primary text-primary-foreground h-14 font-semibold ring-glow"
            >
              Back to home
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {takeawayStatus !== "completed" && (
        <button
          onClick={finish}
          className="mt-6 w-full rounded-2xl border border-border h-11 text-sm text-muted-foreground hover:text-foreground transition"
        >
          End session early
        </button>
      )}
    </Container>
  );
}
