"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Flame, Plus, Minus, Search, Star, Clock, ChevronRight, ShoppingCart } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { TopBar } from "@/components/layout/TopBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getMenu, getRestaurant, SERVING_GROUPS } from "@/services/restaurants";
import { useDispatch, useSelector } from "react-redux";
import { addItem, incrementItem, decrementItem, setServingTime, selectServingTime, selectCartItems, selectCartCount } from "@/store/slices/cartSlice";
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
  const tableNumber = useSelector((s) => s.dineIn.tableNumber);
  const servingTime = useSelector(selectServingTime);
  const cartItems = useSelector(selectCartItems);
  const cartCount = useSelector(selectCartCount);
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

  const handleViewOrder = () => {
    router.push(`/order/${orderId}`);
  };

  const handleCheckout = () => {
    router.push(`/cart`);
  };

  return (
    <Container className="min-h-screen pb-32">
      <TopBar
        title={restaurant.name}
        subtitle={`Table ${tableNumber}`}
        right={
          <div className="flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1 text-xs">
            <Star className="h-3 w-3 fill-primary text-primary" />
            {restaurant.rating}
          </div>
        }
        backTo={hasActiveOrder && !isBillGenerated ? `/order/${orderId}` : null}
      />

      {/* Active order banner - small and unobtrusive */}
      {hasActiveOrder && !isBillGenerated && (
        <motion.button
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleViewOrder}
          className="mt-4 w-full flex items-center justify-between rounded-2xl bg-primary/10 border border-primary/20 px-3.5 py-2.5 text-left hover:bg-primary/15 transition"
        >
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-medium">1 active order</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-primary font-semibold">
            Track <ChevronRight className="h-3.5 w-3.5" />
          </div>
        </motion.button>
      )}

      {/* Bill generated state */}
      {isBillGenerated && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-2xl border border-destructive/30 bg-destructive/10 px-3.5 py-2.5"
        >
          <p className="text-xs font-semibold text-destructive">Bill generated</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            No more items can be added to this order.
          </p>
        </motion.div>
      )}

      {/* Serving time picker - only show if no bill generated */}
      {!isBillGenerated && (
        <div className="mt-4 glass rounded-2xl p-3">
          <div className="flex items-center gap-2 mb-2.5">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold">When should these be served?</span>
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
          placeholder="Search menu…"
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
                "shrink-0 rounded-2xl px-4 py-2.5 flex items-center gap-2 transition-colors whitespace-nowrap",
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
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
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
            ))
          ) : (
            <p className="py-12 text-center text-sm text-muted-foreground">No items in this category.</p>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom action bar */}
      {!isBillGenerated && cartCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background to-transparent p-5 pt-8"
        >
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleCheckout}
            className="w-full rounded-2xl bg-primary text-primary-foreground h-14 font-semibold inline-flex items-center justify-between px-6 ring-glow"
          >
            <div className="flex items-center gap-3">
              <ShoppingCart className="h-5 w-5" />
              <div className="text-left">
                <div className="text-sm font-semibold">{cartCount} items</div>
                <div className="text-xs opacity-80">Ready to order</div>
              </div>
            </div>
            <ChevronRight className="h-5 w-5" />
          </motion.button>
        </motion.div>
      )}
    </Container>
  );
}

function MenuItem({ item, disabled }) {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const qty = cartItems.find((i) => i.id === item.id)?.qty ?? 0;

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

      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
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
        </div>

        <div className="mt-2 flex items-center justify-between">
          <span className="font-semibold text-sm">{formatPrice(item.price)}</span>

          {disabled ? (
            <span className="text-xs text-muted-foreground italic">Locked</span>
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
