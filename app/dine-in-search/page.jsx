"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, MapPin, Clock, Star, Hash } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { TopBar } from "@/components/layout/TopBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { RESTAURANTS } from "@/services/restaurants";
import { useDispatch } from "react-redux";
import { setRestaurant, setMode } from "@/store/slices/dineInSlice";
import { useDineInLockGuard } from "@/hooks/useSessionGuard";

export default function DineInSearch() {
  useDineInLockGuard();
  const router = useRouter();
  const dispatch = useDispatch();
  const [q, setQ] = useState("");
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

  const pick = (r) => {
    dispatch(setMode("dine-in"));
    dispatch(setRestaurant({ id: r.id, name: r.name, table: table || "T-12" }));
    router.push(`/restaurant/${r.id}/menu`);
  };

  return (
    <Container className="min-h-screen pb-10">
      <TopBar title="Find your restaurant" />

      <div className="mt-5 space-y-3">
        <div className="flex items-center gap-2 rounded-2xl glass px-4 h-12">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name or cuisine"
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex items-center gap-2 rounded-2xl glass px-4 h-12">
          <Hash className="h-4 w-4 text-muted-foreground" />
          <input
            value={table}
            onChange={(e) => setTable(e.target.value)}
            placeholder="Table number (e.g. T-12)"
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {list.map((r, i) => (
          <motion.button
            key={r.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            onClick={() => pick(r)}
            className="block w-full text-left group"
          >
            <div className="relative overflow-hidden rounded-3xl glass-strong">
              <div className="relative h-40 overflow-hidden">
                <img
                  src={r.cover}
                  alt={r.name}
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
                <h3 className="font-semibold tracking-tight truncate">{r.name}</h3>
                <p className="text-xs text-muted-foreground truncate">{r.cuisine}</p>
                <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {r.eta}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {r.distance}
                  </span>
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </Container>
  );
}
