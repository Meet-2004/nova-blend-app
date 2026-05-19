"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Flame, Info, Plus, Minus, Search, Star, Receipt, UtensilsCrossed, Clock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { TopBar } from "@/components/layout/TopBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CartBar } from "@/components/cart/CartBar";
import { getMenu, getRestaurant, SERVING_GROUPS } from "@/services/restaurants";
import { useDispatch, useSelector } from "react-redux";
import { addItem, incrementItem, decrementItem, selectServingTime } from "@/store/slices/cartSlice";
import { selectIsBillGenerated, selectHasActiveDineInOrder } from "@/store/slices/dineInSlice";
import { SERVING_TIME_OPTIONS } from "@/constants";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";

export default function MenuPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  const restaurant = getRestaurant(id);
  const menu = getMenu(id);
  const [active, setActive] = useState("starters");
  const [q, setQ] = useState("");
  const isBillGenerated = useSelector(selectIsBillGenerated);
  const hasActiveOrder = useSelector(selectHasActiveDineInOrder);
  const orderId = useSelector((s) => s.dineIn.orderId);
  const servingTime = useSelector(selectServingTime);
  const dispatch = useDispatch();

  const filtered = useMemo(() => menu.filter((m) => m.group === active && (m.name.toLowerCase().includes(q.toLowerCase()) || m.description.toLowerCase().includes(q.toLowerCase()))), [menu, active, q]);

  if (!restaurant) return <div className="p-8 text-center">Restaurant not found</div>;

  return (
    <Container className="min-h-screen pb-32">
      <TopBar title={restaurant.name} subtitle={restaurant.cuisine} right={<div className="flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1 text-xs"><Star className="h-3 w-3 fill-primary text-primary" /> {restaurant.rating}</div>} />

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-5 glass rounded-2xl p-3 flex items-start gap-3">
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary"><Info className="h-4 w-4" /></div>
        <div className="text-xs text-muted-foreground leading-relaxed">
          <span className="text-foreground font-medium">Smart serving groups</span> — choose when each group is served: now, after 20 min, or on your schedule.
        </div>
      </motion.div>

      {isBillGenerated && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-3 glass rounded-2xl p-3 flex items-center gap-3 border border-[oklch(0.74_0.17_155/0.3)]">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[oklch(0.74_0.17_155/0.15)] text-[oklch(0.74_0.17_155)]"><Receipt className="h-4 w-4" /></div>
          <div className="text-xs text-muted-foreground leading-relaxed">
            <span className="text-foreground font-medium">Bill generated</span> — your order is finalised. No more items can be added.
          </div>
        </motion.div>
      )}

      {hasActiveOrder && !isBillGenerated && (
        <motion.button initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} onClick={() => router.push(`/order/${orderId}`)} className="mt-3 w-full glass rounded-2xl p-3 flex items-center gap-3 border border-primary/30 text-left">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary"><UtensilsCrossed className="h-4 w-4" /></div>
          <div className="flex-1">
            <div className="text-xs font-medium">Order in progress</div>
            <div className="text-[11px] text-muted-foreground">Add more items or track your order</div>
          </div>
          <span className="text-xs text-primary font-semibold">Track</span>
        </motion.button>
      )}

      {!isBillGenerated && (
        <div className="mt-3 glass rounded-2xl p-3">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium">When should this be served?</span>
          </div>
          <div className="flex gap-2 overflow-x-auto scroll-hide">
            {SERVING_TIME_OPTIONS.map((opt) => (
              <button key={opt.id} onClick={() => dispatch({ type: "cart/setServingTime", payload: opt.id })} className={cn("shrink-0 rounded-xl px-3 py-2 text-xs font-medium transition", servingTime.id === opt.id ? "bg-primary text-primary-foreground" : "bg-white/5 text-muted-foreground hover:text-foreground")}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center gap-2 rounded-2xl glass px-4 h-12">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search the menu" className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground" />
      </div>

      <div className="mt-5 -mx-5 px-5 flex gap-2 overflow-x-auto scroll-hide">
        {SERVING_GROUPS.map((g) => {
          const isActive = active === g.id;
          return (
            <button key={g.id} onClick={() => setActive(g.id)} className={cn("shrink-0 rounded-2xl px-4 py-3 text-left transition relative", isActive ? "bg-primary text-primary-foreground" : "glass text-foreground/80")}>
              <div className="flex items-center gap-2">
                <span className="text-base">{g.emoji}</span>
                <div>
                  <div className="text-sm font-semibold leading-none">{g.label}</div>
                  <div className={cn("mt-1 text-[10px]", isActive ? "text-primary-foreground/80" : "text-muted-foreground")}>{g.hint}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((item) => (
            <motion.div key={item.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
              <MenuRow item={item} isBillGenerated={isBillGenerated} />
            </motion.div>
          ))}
        </AnimatePresence>
        {filtered.length === 0 && <div className="text-center py-12 text-sm text-muted-foreground">Nothing here yet.</div>}
      </div>

      <CartBar />
    </Container>
  );
}

function MenuRow({ item, isBillGenerated }) {
  const dispatch = useDispatch();
  const qty = useSelector((s) => s.cart.items.find((i) => i.id === item.id)?.qty ?? 0);

  return (
    <div className="glass rounded-2xl p-3 flex gap-3">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
        <img src={item.image} alt={item.name} loading="lazy" className="h-full w-full object-cover" />
        {item.popular && <div className="absolute top-1.5 left-1.5"><StatusBadge tone="primary">* Popular</StatusBadge></div>}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <StatusBadge tone={item.veg ? "veg" : "nonveg"}>{item.veg ? "● VEG" : "▲ NON-VEG"}</StatusBadge>
          {item.spicy && <span className="inline-flex items-center gap-0.5 text-[11px] text-destructive"><Flame className="h-3 w-3" /> spicy</span>}
        </div>
        <h4 className="mt-1 font-semibold leading-tight truncate">{item.name}</h4>
        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{item.description}</p>
        <div className="mt-2 flex items-center justify-between">
          <div className="font-semibold text-sm">{formatPrice(item.price)}</div>
          {isBillGenerated ? (
            <span className="text-xs text-muted-foreground">Bill generated</span>
          ) : qty === 0 ? (
            <motion.button whileTap={{ scale: 0.93 }} onClick={() => dispatch(addItem({ id: item.id, name: item.name, price: item.price, image: item.image, group: item.group }))} className="rounded-lg bg-primary text-primary-foreground h-8 px-3 text-xs font-semibold inline-flex items-center gap-1">
              <Plus className="h-3.5 w-3.5" /> Add
            </motion.button>
          ) : (
            <div className="flex items-center gap-2 rounded-lg bg-primary text-primary-foreground h-8 px-1.5">
              <button onClick={() => dispatch(decrementItem(item.id))} className="grid place-items-center h-6 w-6 rounded-md hover:bg-white/10"><Minus className="h-3.5 w-3.5" /></button>
              <span className="text-xs font-bold w-5 text-center tabular-nums">{qty}</span>
              <button onClick={() => dispatch(incrementItem(item.id))} className="grid place-items-center h-6 w-6 rounded-md hover:bg-white/10"><Plus className="h-3.5 w-3.5" /></button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
