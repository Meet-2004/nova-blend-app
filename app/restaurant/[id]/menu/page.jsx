"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Flame, Plus, Minus, Search, Star, UtensilsCrossed, Clock, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { TopBar } from "@/components/layout/TopBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CartBar } from "@/components/cart/CartBar";
import { getMenu, getRestaurant, SERVING_GROUPS } from "@/services/restaurants";
import { useDispatch, useSelector } from "react-redux";
import { addItem, incrementItem, decrementItem, setServingTime, selectServingTime } from "@/store/slices/cartSlice";
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

  const [activeGroup, setActiveGroup] = useState("starters");
  const [query, setQuery] = useState("");

  const isBillGenerated = useSelector(selectIsBillGenerated);
  const hasActiveOrder = useSelector(selectHasActiveDineInOrder);
  const orderId = useSelector((s) => s.dineIn.orderId);
  const servingTime = useSelector(selectServingTime);
  const dispatch = useDispatch();

  const filteredItems = useMemo(
    () =>
      menu.filter(
        (item) =>
          item.group === activeGroup &&
          (item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase()))
      ),
    [menu, activeGroup, query]
  );

  if (!restaurant) {
    return <div className="p-8 text-center text-muted-foreground">Restaurant not found.</div>;
  }

  return (
    <Container className="min-h-screen pb-32">
      <TopBar
        title={restaurant.name}
        subtitle={restaurant.cuisine}
        right={
          <div className="flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1 text-xs">
            <Star className="h-3 w-3 fill-primary text-primary" />
            {restaurant.rating}
          </div>
        }
      />

      {/* Active order banner */}
      {hasActiveOrder && !isBillGenerated && (
        <motion.button
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => router.push(`/order/${orderId}`)}
          className="mt-4 w-full flex items-center justify-between rounded-2xl border border-[oklch(0.74_0.17_155/0.4)] bg-[oklch(0.74_0.17_155/0.08)] px-4 py-3 text-left"
        >
          <div className="flex items-center gap-2.5">
            <UtensilsCrossed className="h-4 w-4 text-[oklch(0.74_0.17_155)]" />
            <div>
              <p className="text-sm font-semibold">Current order active</p>
              <p className="text-xs text-muted-foreground">Add items below or tap to track</p>
            </div>
          </div>
          <div className="flex items-center gap-0.5 text-xs text-[oklch(0.74_0.17_155)] font-semibold">
            Track
            <ChevronRight className="h-3.5 w-3.5" />
          </div>
        </motion.button>
      )}

      {/* Bill generated banner */}
      {isBillGenerated && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-2xl border border-destructive/30 bg-destructive/8 px-4 py-3"
        >
          <p className="text-sm font-semibold text-destructive">Bill has been generated</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Your order is finalised. No more items can be added.
          </p>
        </motion.div>
      )}

      {/* Serving time picker */}
      {!isBillGenerated && (
        <div className="mt-4 glass rounded-2xl p-3">
          <div className="flex items-center gap-2 mb-2.5">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold">When should these items be served?</span>
          </div>
          <div className="flex gap-2 overflow-x-auto scroll-hide pb-0.5">
            {SERVING_TIME_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => dispatch(setServingTime(opt.id))}
                className={cn(
                  "shrink-0 rounded-xl px-3 py-2 text-xs font-medium transition-colors",
                  servingTime.id === opt.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-white/5 text-muted-foreground hover:text-foreground"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="mt-4 flex items-center gap-2 rounded-2xl glass px-4 h-11">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the menu…"
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
        />
      </div>

      {/* Category tabs */}
      <div className="mt-4 -mx-5 px-5 flex gap-2 overflow-x-auto scroll-hide">
        {SERVING_GROUPS.map((g) => {
          const isActive = activeGroup === g.id;
          return (
            <button
              key={g.id}
              onClick={() => setActiveGroup(g.id)}
              className={cn(
                "shrink-0 rounded-2xl px-4 py-2.5 flex items-center gap-2 transition-colors",
                isActive ? "bg-primary text-primary-foreground" : "glass text-foreground/70 hover:text-foreground"
              )}
            >
              <span>{g.emoji}</span>
              <span className="text-sm font-semibold">{g.label}</span>
            </button>
          );
        })}
      </div>

      {/* Menu items */}
      <div className="mt-5 space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <MenuItem item={item} disabled={isBillGenerated} />
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredItems.length === 0 && (
          <p className="py-12 text-center text-sm text-muted-foreground">Nothing here yet.</p>
        )}
      </div>

      <CartBar />
    </Container>
  );
}

function MenuItem({ item, disabled }) {
  const dispatch = useDispatch();
  const qty = useSelector((s) => s.cart.items.find((i) => i.id === item.id)?.qty ?? 0);

  return (
    <div className="glass rounded-2xl p-3 flex gap-3">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        {item.popular && (
          <div className="absolute top-1.5 left-1.5">
            <StatusBadge tone="primary">Popular</StatusBadge>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <StatusBadge tone={item.veg ? "veg" : "nonveg"}>
            {item.veg ? "VEG" : "NON-VEG"}
          </StatusBadge>
          {item.spicy && (
            <span className="inline-flex items-center gap-0.5 text-[11px] text-destructive">
              <Flame className="h-3 w-3" /> Spicy
            </span>
          )}
        </div>

        <h4 className="mt-1.5 font-semibold leading-snug truncate">{item.name}</h4>
        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{item.description}</p>

        <div className="mt-2 flex items-center justify-between">
          <span className="font-semibold text-sm">{formatPrice(item.price)}</span>

          {disabled ? (
            <span className="text-xs text-muted-foreground italic">Bill generated</span>
          ) : qty === 0 ? (
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() =>
                dispatch(addItem({ id: item.id, name: item.name, price: item.price, image: item.image, group: item.group }))
              }
              className="rounded-lg bg-primary text-primary-foreground h-8 px-3 text-xs font-semibold inline-flex items-center gap-1"
            >
              <Plus className="h-3.5 w-3.5" /> Add
            </motion.button>
          ) : (
            <div className="flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground h-8 px-1.5">
              <button
                onClick={() => dispatch(decrementItem(item.id))}
                className="grid place-items-center h-6 w-6 rounded hover:bg-white/10"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="text-xs font-bold w-5 text-center tabular-nums">{qty}</span>
              <button
                onClick={() => dispatch(incrementItem(item.id))}
                className="grid place-items-center h-6 w-6 rounded hover:bg-white/10"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
