import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { QrCode, MapPin, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { TopBar } from "@/components/layout/TopBar";

export const Route = createFileRoute("/dine-in")({ component: DineInChooser });

function DineInChooser() {
  return (
    <Container className="min-h-screen pb-10">
      <TopBar title="Start dine-in" />
      <div className="mt-8">
        <h2 className="text-2xl font-bold tracking-tight">How do you want to start?</h2>
        <p className="mt-1 text-sm text-muted-foreground">Scan your table QR or find your restaurant.</p>
      </div>

      <div className="mt-8 space-y-4">
        <Tile
          to="/scan"
          icon={<QrCode className="h-6 w-6" />}
          title="Scan table QR"
          desc="Fastest. Point your camera at the QR tent on your table."
          gradient="from-primary/30 via-primary/10 to-transparent"
        />
        <Tile
          to="/dine-in-search"
          icon={<MapPin className="h-6 w-6" />}
          title="Search nearby"
          desc="Find your restaurant by name and enter your table number."
          gradient="from-accent/30 via-accent/10 to-transparent"
          delay={0.05}
        />
      </div>
    </Container>
  );
}

function Tile({
  to, icon, title, desc, gradient, delay = 0,
}: { to: string; icon: React.ReactNode; title: string; desc: string; gradient: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to={to}
        className="relative block rounded-3xl glass-strong p-6 overflow-hidden ring-glow"
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
      </Link>
    </motion.div>
  );
}
