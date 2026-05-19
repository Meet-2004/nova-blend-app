"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Star, MapPin, Clock, TriangleAlert as AlertTriangle } from "lucide-react";
import { useMemo, useState } from "react";
import { Container } from "@/components/ui/Container";
import { TopBar } from "@/components/layout/TopBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { RESTAURANTS } from "@/services/restaurants";
import { useDispatch, useSelector } from "react-redux";
import { setRestaurant, setMode } from "@/store/slices/dineInSlice";
import { clearCart, selectCount } from "@/store/slices/cartSlice";
import { showCartConflictModal, hideCartConflictModal } from "@/store/slices/uiSlice";
import { useTakeawayAuthGuard } from "@/hooks/useSessionGuard";

export default function TakeawayRestaurants() {
  useTakeawayAuthGuard();
  const router = useRouter();
  const dispatch = useDispatch();
  const [q, setQ] = useState("");
  const cartCount = useSelector(selectCount);
  const currentRestaurantId = useSelector((s) => s.dineIn.restaurantId);
  const cartConflictModal = useSelector((s) => s.ui.cartConflictModal);
  const pendingRestaurantId = useSelector((s) => s.ui.pendingRestaurantId);
  const pendingRestaurantName = useSelector((s) => s.ui.pendingRestaurantName);

  const list = useMemo(() => RESTAURANTS.filter((r) => r.name.toLowerCase().includes(q.toLowerCase()) || r.cuisine.toLowerCase().includes(q.toLowerCase())), [q]);

  const pick = (id, name) => {
    if (cartCount > 0 && currentRestaurantId && currentRestaurantId !== id) { dispatch(showCartConflictModal({ id, name })); return; }
    confirmPick(id, name);
  };

  const confirmPick = (id, name) => {
    dispatch(setMode("takeaway"));
    dispatch(setRestaurant({ id, name, table: null }));
    router.push(`/restaurant/${id}/menu`);
  };

  const handleClearAndContinue = () => {
    if (!pendingRestaurantId) return;
    dispatch(clearCart());
    dispatch(setMode("takeaway"));
    dispatch(setRestaurant({ id: pendingRestaurantId, name: pendingRestaurantName, table: null }));
    dispatch(hideCartConflictModal());
    router.push(`/restaurant/${pendingRestaurantId}/menu`);
  };

  return (
    <>
      <Container className="min-h-screen pb-10">
        <TopBar title="Pick a restaurant" subtitle="Pre-order & pay for pickup" />
        <div className="mt-5 flex items-center gap-2 rounded-2xl glass px-4 h-12">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search cuisine or place" className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground" />
        </div>
        <div className="mt-6 space-y-4">
          {list.map((r, i) => (
            <motion.button key={r.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.4 }} onClick={() => pick(r.id, r.name)} className="block w-full text-left group">
              <div className="relative overflow-hidden rounded-3xl glass-strong">
                <div className="relative h-40 overflow-hidden">
                  <img src={r.cover} alt={r.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                  <div className="absolute top-3 left-3 flex gap-1.5">{r.tags.slice(0, 2).map((t) => <StatusBadge key={t}>{t}</StatusBadge>)}</div>
                  <div className="absolute top-3 right-3"><div className="flex items-center gap-1 rounded-full bg-black/40 backdrop-blur px-2.5 py-1 text-xs font-medium"><Star className="h-3 w-3 fill-primary text-primary" /> {r.rating}</div></div>
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
      <AnimatePresence>
        {cartConflictModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => dispatch(hideCartConflictModal())} />
            <motion.div initial={{ y: 50, opacity: 0, scale: 0.96 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 50, opacity: 0, scale: 0.96 }} transition={{ type: "spring", stiffness: 300, damping: 28 }} className="relative w-full max-w-sm glass-strong rounded-3xl p-6 ring-glow">
              <div className="flex items-center gap-3 mb-4"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-warning/15 text-warning"><AlertTriangle className="h-5 w-5" /></div><h3 className="font-semibold tracking-tight">Replace your cart?</h3></div>
              <p className="text-sm text-muted-foreground leading-relaxed">You already have items from <strong className="text-foreground">another restaurant</strong>. Starting a new order will clear your existing cart.</p>
              <div className="mt-6 flex flex-col gap-2">
                <button onClick={handleClearAndContinue} className="w-full rounded-2xl bg-primary text-primary-foreground h-12 font-semibold text-sm ring-glow">Clear cart &amp; continue</button>
                <button onClick={() => dispatch(hideCartConflictModal())} className="w-full rounded-2xl border border-border h-12 text-sm font-medium text-muted-foreground hover:text-foreground transition">Keep existing cart</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
