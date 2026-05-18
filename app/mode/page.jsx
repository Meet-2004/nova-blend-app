"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { QrCode, ShoppingBag, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { TopBar } from "@/components/layout/TopBar";
import { useDispatch } from "react-redux";
import { setMode } from "@/store/slices/dineInSlice";
import { useSessionGuard, useDineInLockGuard } from "@/hooks/useSessionGuard";

export default function ModeSelect() {
  useSessionGuard();
  useDineInLockGuard();
  const router = useRouter();
  const dispatch = useDispatch();

  const pick = (m) => {
    dispatch(setMode(m));
    router.push(m === "dine-in" ? "/dine-in" : "/takeaway-login");
  };

  return (
    <Container className="min-h-screen pb-10">
      <TopBar title="How are you dining?" />
      <div className="mt-8">
        <h2 className="text-2xl font-bold tracking-tight">Choose your flow</h2>
        <p className="mt-1 text-sm text-muted-foreground">Pick one to get started.</p>
      </div>

      <div className="mt-8 space-y-4">
        <Tile
          onClick={() => pick("dine-in")}
          icon={<QrCode className="h-6 w-6" />}
          title="Dine-in"
          desc="Scan the QR at your table or search nearby. No login required."
          gradient="from-primary/30 via-primary/10 to-transparent"
        />
        <Tile
          onClick={() => pick("takeaway")}
          icon={<ShoppingBag className="h-6 w-6" />}
          title="Takeaway"
          desc="Sign in with phone, pre-order, pay, and pick up hot."
          gradient="from-accent/30 via-accent/10 to-transparent"
          delay={0.05}
        />
      </div>
    </Container>
  );
}

function Tile({ onClick, icon, title, desc, gradient, delay = 0 }) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.98 }}
      className="relative w-full text-left rounded-3xl glass-strong p-6 overflow-hidden ring-glow"
    >
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${gradient}`} />
      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 backdrop-blur">{icon}</div>
          <ArrowRight className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="mt-5 text-xl font-bold tracking-tight">{title}</div>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-sm">{desc}</p>
      </div>
    </motion.button>
  );
}
