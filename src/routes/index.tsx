import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, QrCode, Sparkles, Timer, Utensils } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { GradientBlobs } from "@/components/ui/GradientBlobs";
import { GlassCard } from "@/components/ui/GlassCard";

export const Route = createFileRoute("/")({ component: Landing });

function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <GradientBlobs />
      <Container className="relative pt-10 pb-16">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground font-bold">P</div>
            <span className="font-semibold tracking-tight">Plate</span>
          </div>
          <span className="text-xs text-muted-foreground">v0.1 · beta</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/5 px-3 py-1 text-xs">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            The new restaurant operating system
          </div>
          <h1 className="mt-5 text-[40px] leading-[1.05] font-bold tracking-tight">
            Skip the wait. <br />
            <span className="text-gradient-warm">Order from your seat.</span>
          </h1>
          <p className="mt-4 text-base text-muted-foreground max-w-sm">
            Scan, browse, and pay — all from your table. Built for the rush hour.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 space-y-3"
        >
          <Link to="/mode">
            <GlassCard strong className="p-5 flex items-center justify-between group ring-glow">
              <div className="flex items-center gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
                  <Utensils className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold tracking-tight">Start ordering</div>
                  <div className="text-xs text-muted-foreground">Dine-in or takeaway</div>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
            </GlassCard>
          </Link>

          <div className="grid grid-cols-2 gap-3">
            <Link to="/scan"><FeatureTile icon={<QrCode className="h-5 w-5" />} label="Scan QR" hint="Dine-in fast track" /></Link>
            <Link to="/restaurants"><FeatureTile icon={<Timer className="h-5 w-5" />} label="Pre-order" hint="Takeaway in minutes" /></Link>
          </div>
        </motion.div>

        <div className="mt-16 grid grid-cols-3 gap-3 text-center">
          <Stat n="2.3×" l="Faster service" />
          <Stat n="40%" l="Less wait" />
          <Stat n="4.9★" l="Guest rating" />
        </div>
      </Container>
    </div>
  );
}

function FeatureTile({ icon, label, hint }: { icon: React.ReactNode; label: string; hint: string }) {
  return (
    <div className="glass rounded-2xl p-4 h-full">
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 text-primary">{icon}</div>
      <div className="mt-3 text-sm font-semibold">{label}</div>
      <div className="text-[11px] text-muted-foreground">{hint}</div>
    </div>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div className="glass rounded-2xl py-3">
      <div className="text-lg font-bold text-gradient-warm">{n}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{l}</div>
    </div>
  );
}
