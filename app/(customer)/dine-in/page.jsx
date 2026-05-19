"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { QrCode, MapPin, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { TopBar } from "@/components/layout/TopBar";
import { useDineInLockGuard } from "@/hooks/useSessionGuard";

export default function DineInEntry() {
  useDineInLockGuard();

  return (
    <Container className="min-h-screen pb-10">
      <TopBar title="Dine-in" />

      <div className="mt-8">
        <h2 className="text-2xl font-bold tracking-tight">Find your table</h2>
        <p className="mt-1 text-sm text-muted-foreground">Scan your table QR or search for the restaurant.</p>
      </div>

      <div className="mt-8 space-y-4">
        <OptionTile
          href="/scan"
          icon={<QrCode className="h-6 w-6" />}
          title="Scan QR"
          desc="Point your camera at the QR code on your table for instant access."
          gradient="from-primary/30 via-primary/10 to-transparent"
        />

        <OptionTile
          href="/dine-in-search"
          icon={<MapPin className="h-6 w-6" />}
          title="Search restaurant"
          desc="Find your restaurant by name and enter your table number."
          gradient="from-accent/30 via-accent/10 to-transparent"
          delay={0.05}
        />
      </div>
    </Container>
  );
}

function OptionTile({ href, icon, title, desc, gradient, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={href}
        className="relative block rounded-3xl glass-strong p-6 overflow-hidden ring-glow hover:ring-primary/50 transition-all active:scale-98"
      >
        <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${gradient}`} />
        <div className="relative">
          <div className="flex items-center justify-between">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 backdrop-blur">
              {icon}
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="mt-5 text-xl font-bold tracking-tight">{title}</div>
          <p className="mt-1.5 text-sm text-muted-foreground max-w-sm">{desc}</p>
        </div>
      </Link>
    </motion.div>
  );
}
