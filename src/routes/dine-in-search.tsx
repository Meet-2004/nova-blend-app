import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Search, MapPin, Clock, Star, Hash } from "lucide-react";
import { useMemo, useState } from "react";
import { Container } from "@/components/ui/Container";
import { TopBar } from "@/components/layout/TopBar";
import { RESTAURANTS } from "@/services/restaurants";
import { useCart } from "@/store/cart";

export const Route = createFileRoute("/dine-in-search")({ component: DineInSearch });

function DineInSearch() {
  const nav = useNavigate();
  const setMode = useCart((s) => s.setMode);
  const setRestaurant = useCart((s) => s.setRestaurant);
  const [q, setQ] = useState("");
  const [picked, setPicked] = useState<string | null>(null);
  const [table, setTable] = useState("");

  const list = useMemo(
    () =>
      RESTAURANTS.filter(
        (r) =>
          r.name.toLowerCase().includes(q.toLowerCase()) ||
          r.cuisine.toLowerCase().includes(q.toLowerCase())
      ),
    [q]
  );

  const confirm = () => {
    const r = RESTAURANTS.find((x) => x.id === picked);
    if (!r) return;
    setMode("dine-in");
    setRestaurant(r.id, r.name, table || "T-1");
    nav({ to: "/restaurant/$id/menu", params: { id: r.id } });
  };

  if (picked) {
    const r = RESTAURANTS.find((x) => x.id === picked)!;
    return (
      <Container className="min-h-screen pb-10">
        <TopBar title="Confirm your table" subtitle={r.name} />
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 glass-strong rounded-3xl overflow-hidden"
        >
          <img src={r.cover} alt={r.name} className="h-32 w-full object-cover" />
          <div className="p-5">
            <h2 className="font-semibold tracking-tight">{r.name}</h2>
            <p className="text-xs text-muted-foreground">{r.cuisine}</p>
          </div>
        </motion.div>

        <div className="mt-6">
          <label className="text-xs uppercase tracking-wider text-muted-foreground">Table number</label>
          <div className="mt-2 flex items-center gap-2 rounded-xl glass px-3 h-12">
            <Hash className="h-4 w-4 text-muted-foreground" />
            <input
              autoFocus
              value={table}
              onChange={(e) => setTable(e.target.value)}
              placeholder="e.g. 12"
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <button
            onClick={() => setPicked(null)}
            className="flex-1 rounded-2xl bg-secondary h-12 text-sm font-semibold"
          >
            Change
          </button>
          <button
            onClick={confirm}
            className="flex-1 rounded-2xl bg-primary text-primary-foreground h-12 text-sm font-semibold ring-glow"
          >
            Start session
          </button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="min-h-screen pb-10">
      <TopBar title="Nearby restaurants" subtitle="Pick where you're dining" />

      <div className="mt-5 flex items-center gap-2 rounded-2xl glass px-4 h-12">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search cuisine or place"
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
        />
      </div>

      <div className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground px-1">
        <MapPin className="h-3 w-3" /> Using approximate location · within 3 km
      </div>

      <div className="mt-5 space-y-3">
        {list.map((r, i) => (
          <motion.button
            key={r.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            onClick={() => setPicked(r.id)}
            className="w-full text-left glass rounded-2xl p-3 flex gap-3 hover:bg-white/5 transition"
          >
            <img src={r.cover} alt={r.name} loading="lazy" className="h-16 w-16 rounded-xl object-cover" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold tracking-tight truncate">{r.name}</h3>
                <div className="flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-[11px]">
                  <Star className="h-3 w-3 fill-primary text-primary" /> {r.rating}
                </div>
              </div>
              <p className="text-xs text-muted-foreground truncate">{r.cuisine}</p>
              <div className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {r.eta}</span>
                <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {r.distance}</span>
              </div>
            </div>
          </motion.button>
        ))}
        {list.length === 0 && (
          <div className="text-center py-16 text-muted-foreground text-sm">No restaurants match "{q}"</div>
        )}
      </div>
    </Container>
  );
}
