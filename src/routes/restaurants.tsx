import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Search, Star, MapPin, Clock } from "lucide-react";
import { useMemo, useState } from "react";
import { Container } from "@/components/ui/Container";
import { TopBar } from "@/components/layout/TopBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { RESTAURANTS } from "@/services/restaurants";
import { useCart } from "@/store/cart";

export const Route = createFileRoute("/restaurants")({ component: Restaurants });

function Restaurants() {
  const [q, setQ] = useState("");
  const setRestaurant = useCart((s) => s.setRestaurant);
  const setMode = useCart((s) => s.setMode);

  const list = useMemo(
    () =>
      RESTAURANTS.filter(
        (r) =>
          r.name.toLowerCase().includes(q.toLowerCase()) ||
          r.cuisine.toLowerCase().includes(q.toLowerCase())
      ),
    [q]
  );

  return (
    <Container className="min-h-screen pb-10">
      <TopBar title="Nearby restaurants" subtitle="Pre-order for takeaway" />

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
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
          >
            <Link
              to="/restaurant/$id/menu"
              params={{ id: r.id }}
              onClick={() => { setMode("takeaway"); setRestaurant(r.id, r.name, null); }}
              className="block group"
            >
              <div className="relative overflow-hidden rounded-3xl glass-strong">
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={r.cover}
                    alt={r.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
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
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-semibold tracking-tight truncate">{r.name}</h3>
                      <p className="text-xs text-muted-foreground truncate">{r.cuisine}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {r.eta}</span>
                    <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {r.distance}</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}

        {list.length === 0 && (
          <div className="text-center py-16 text-muted-foreground text-sm">
            No restaurants match "{q}"
          </div>
        )}
      </div>
    </Container>
  );
}
