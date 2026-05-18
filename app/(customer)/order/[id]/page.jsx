"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, ChefHat, Clock, Flame, Utensils, Receipt } from "lucide-react";
import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { TopBar } from "@/components/layout/TopBar";
import { useDispatch, useSelector } from "react-redux";
import { generateBill } from "@/store/slices/dineInSlice";
import { SERVING_GROUPS } from "@/services/restaurants";
import { cn } from "@/lib/cn";

const STAGES = [
  { id: "placed", label: "Order placed", icon: Check },
  { id: "kitchen", label: "In the kitchen", icon: ChefHat },
  { id: "cooking", label: "Cooking", icon: Flame },
  { id: "serving", label: "Being served", icon: Utensils },
];

export default function OrderTracking() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const dispatch = useDispatch();
  const items = useSelector((s) => s.cart.items);
  const restaurantName = useSelector((s) => s.dineIn.restaurantName);
  const tableNumber = useSelector((s) => s.dineIn.tableNumber);
  const mode = useSelector((s) => s.dineIn.mode);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (mode === "takeaway") {
      router.replace(`/takeaway-order/${id}`);
    }
  }, [mode, id, router]);

  useEffect(() => {
    const t = setInterval(() => setStage((s) => Math.min(s + 1, STAGES.length - 1)), 4000);
    return () => clearInterval(t);
  }, []);

  const grouped = SERVING_GROUPS.map((g) => ({
    group: g,
    items: items.filter((i) => i.group === g.id),
  })).filter((s) => s.items.length > 0);

  const handleGenerateBill = () => {
    dispatch(generateBill());
    router.push(`/order/${id}/bill`);
  };

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
          <div className="mt-1 text-3xl font-bold tracking-tight">12 - 18 min</div>
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
                current ? "border-primary/40 bg-primary/8" : "border-border bg-white/[0.02]"
              )}
            >
              <div
                className={cn(
                  "grid h-10 w-10 place-items-center rounded-xl",
                  done || current ? "bg-primary text-primary-foreground" : "bg-white/5 text-muted-foreground"
                )}
              >
                {current ? (
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

      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={handleGenerateBill}
        className="mt-8 flex items-center justify-center gap-2 w-full rounded-2xl bg-primary text-primary-foreground h-14 font-semibold ring-glow"
      >
        <Receipt className="h-5 w-5" />
        Generate bill
      </motion.button>
    </Container>
  );
}
