"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { QrCode, Camera, Hash } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { TopBar } from "@/components/layout/TopBar";
import { useDispatch } from "react-redux";
import { setRestaurant, setMode } from "@/store/slices/dineInSlice";
import { RESTAURANTS } from "@/services/restaurants";
import { useDineInLockGuard } from "@/hooks/useSessionGuard";

export default function Scan() {
  useDineInLockGuard();
  const router = useRouter();
  const dispatch = useDispatch();
  const [code, setCode] = useState("");

  const simulate = () => {
    const r = RESTAURANTS[0];
    dispatch(setMode("dine-in"));
    dispatch(setRestaurant({ id: r.id, name: r.name, table: "T-12" }));
    router.push(`/restaurant/${r.id}/menu`);
  };

  const goCode = () => {
    const r = RESTAURANTS[0];
    dispatch(setMode("dine-in"));
    dispatch(setRestaurant({ id: r.id, name: r.name, table: code || "T-12" }));
    router.push(`/restaurant/${r.id}/menu`);
  };

  return (
    <Container className="min-h-screen pb-10">
      <TopBar title="Scan table QR" />
      <div className="mt-8 text-center">
        <h2 className="text-2xl font-bold tracking-tight">Point at the QR code</h2>
        <p className="mt-1 text-sm text-muted-foreground">You'll find it on your table tent.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mt-8 mx-auto relative aspect-square w-full max-w-xs rounded-[2rem] glass-strong overflow-hidden grid place-items-center"
      >
        <div className="absolute inset-6 rounded-2xl border-2 border-dashed border-primary/40" />
        <motion.div
          initial={{ y: -120 }}
          animate={{ y: 120 }}
          transition={{ repeat: Infinity, repeatType: "mirror", duration: 1.8, ease: "easeInOut" }}
          className="absolute inset-x-8 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
        />
        <div className="relative grid place-items-center text-muted-foreground">
          <Camera className="h-10 w-10" />
          <span className="mt-2 text-xs">Camera preview</span>
        </div>
      </motion.div>

      <button
        onClick={simulate}
        className="mt-6 w-full rounded-2xl bg-primary text-primary-foreground h-14 font-semibold flex items-center justify-center gap-2"
      >
        <QrCode className="h-5 w-5" />
        Simulate scan
      </button>

      <div className="mt-8">
        <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground">
          <div className="h-px flex-1 bg-border" /> or enter code <div className="h-px flex-1 bg-border" />
        </div>
        <div className="mt-4 flex gap-2">
          <div className="flex-1 flex items-center gap-2 rounded-xl glass px-3 h-12">
            <Hash className="h-4 w-4 text-muted-foreground" />
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="T-12"
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
            />
          </div>
          <button onClick={goCode} className="rounded-xl bg-secondary px-5 h-12 text-sm font-semibold">
            Go
          </button>
        </div>
      </div>
    </Container>
  );
}
