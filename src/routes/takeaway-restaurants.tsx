import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Search, Star, MapPin, Clock } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Container } from "@/components/ui/Container";
import { TopBar } from "@/components/layout/TopBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { RESTAURANTS } from "@/services/restaurants";
import { useCart } from "@/store/cart";

export const Route = createFileRoute("/takeaway-restaurants")({ component: TakeawayRestaurants });

function TakeawayRestaurants() {
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const setRestaurant = useCart((s) => s.setRestaurant);
  const setMode = useCart((s) => s.setMode);
  const phone = useCart((s) => s.phone);

  // Auth guard: takeaway requires phone
  useEffect(() => {
    if (!phone) nav({ to: "/takeaway-login", replace: true });
  }, [phone, nav]);

  const list = useMemo(
    () =>
      RESTAURANTS.filter(
        (r) =>
          r.name.toLowerCase().includes(q.toLowerCase()) ||
          r.cuisine.toLowerCase().includes(q.toLowerCase())
      ),
    [q]
  );

  const pick = (id: string, name: string) => {
    setMode("takeaway");
    setRestaurant(id, name, null);
    nav({ to: "/restaurant/$id/menu", params: { id } });
  };

  return (
    <Container className="min-h-screen pb-10">
      <TopBar title="Pick a restaurant" subtitle="Takeaway · pre-order & pay" />

      <div className="mt-5 flex items-center gap-2 rounded-2xl glass px-4 h-12">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search cuisine or place"
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
        />
      </div>

      <div className="mt-6 space-y-4">
        {list.map((r, i) => (
          <motion.button
            key={r.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            onClick={() => pick(r.id, r.name)}
            className="block w-full text-left group"
          >
            <div className="relative overflow-hidden rounded-3xl glass-strong">
              <div className="relative h-40 overflow-hidden">
                <img src={r.cover} alt={r.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  {r.tags.slice(0, 2).map((t) => (
                    <StatusBadge key={t}>{t}</StatusBadge>
                  ))}
                </div>
                <div className="absolute top-3 right-3">
                  <div className="flex items-center gap-1 rounded-full bg-black/40 backdrop-blur px-2.5 py-1 text-xs font-medium">
                    <Star className="h-3 w-3 fill-primary text-primary" /> {r.rating}
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold tracking-tight truncate">{r.name}</h3>
                <p className="text-xs text-muted-foreground truncate">{r.cuisine}</p>
                <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {r.eta}</span>
                  <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {r.distance}</span>
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </Container>
  );
}
