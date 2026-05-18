import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check, ChefHat, Package, PartyPopper } from "lucide-react";
import { useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { TopBar } from "@/components/layout/TopBar";
import { useCart, type TakeawayStatus } from "@/store/cart";
import { cn } from "@/lib/cn";

export const Route = createFileRoute("/takeaway-order/$id")({ component: TakeawayOrder });

const STAGES: { id: TakeawayStatus; label: string; icon: typeof Check }[] = [
  { id: "received", label: "Order received", icon: Check },
  { id: "preparing", label: "Preparing", icon: ChefHat },
  { id: "ready", label: "Ready for pickup", icon: Package },
  { id: "completed", label: "Completed", icon: PartyPopper },
];

function TakeawayOrder() {
  const nav = useNavigate();
  const { id } = useParams({ from: "/takeaway-order/$id" });
  const { items, restaurantName, takeawayStatus, setTakeawayStatus, endSession, mode } = useCart();
  const stage = STAGES.findIndex((s) => s.id === takeawayStatus);

  // Simulate progression
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
      <TopBar title="Pickup order" subtitle={`#${id}`} backTo="/" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 glass-strong rounded-3xl p-5 ring-glow overflow-hidden relative"
      >
        <div className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-primary/30 blur-3xl" />
        <div className="relative">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Pickup ETA</div>
          <div className="mt-1 text-3xl font-bold tracking-tight">15 – 25 min</div>
          <div className="mt-1 text-xs text-muted-foreground">{restaurantName} · paid</div>
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
                current ? "border-primary/40 bg-primary/8" : "border-border bg-white/[0.02]"
              )}
            >
              <div
                className={cn(
                  "grid h-10 w-10 place-items-center rounded-xl",
                  done || current ? "bg-primary text-primary-foreground" : "bg-white/5 text-muted-foreground"
                )}
              >
                {current && s.id !== "completed" ? (
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
                {current && <div className="text-xs text-primary mt-0.5">In progress</div>}
                {done && <div className="text-xs text-muted-foreground mt-0.5">Done</div>}
              </div>
              {done && <Check className="h-4 w-4 text-[oklch(0.84_0.17_155)]" />}
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8 space-y-2">
        <h3 className="px-1 text-xs uppercase tracking-wider text-muted-foreground">Items</h3>
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

      {takeawayStatus === "completed" && (
        <button
          onClick={finish}
          className="mt-8 w-full rounded-2xl bg-primary text-primary-foreground h-14 font-semibold ring-glow"
        >
          Done · back to home
        </button>
      )}

      {takeawayStatus !== "completed" && mode === "takeaway" && (
        <button
          onClick={finish}
          className="mt-8 w-full rounded-2xl border border-border h-12 text-sm text-muted-foreground hover:text-foreground"
        >
          End session
        </button>
      )}
    </Container>
  );
}
