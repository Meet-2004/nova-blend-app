"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Minus, ShoppingBag, ArrowRight, Trash2, Clock } from "lucide-react";
import { useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { TopBar } from "@/components/layout/TopBar";
import { useDispatch, useSelector } from "react-redux";
import {
  incrementItem,
  decrementItem,
  removeItem,
  selectSubtotal,
  selectServingTime,
  clearCart,
} from "@/store/slices/cartSlice";
import {
  placeOrder,
  selectHasActiveDineInOrder,
  selectHasActiveTakeawayOrder,
  selectIsBillGenerated,
} from "@/store/slices/dineInSlice";
import { SERVING_GROUPS } from "@/services/restaurants";
import { formatPrice } from "@/lib/format";

function generateOrderId() {
  return "ORD-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

export default function CartPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const items = useSelector((s) => s.cart.items);
  const mode = useSelector((s) => s.dineIn.mode);
  const restaurantName = useSelector((s) => s.dineIn.restaurantName);
  const restaurantId = useSelector((s) => s.dineIn.restaurantId);
  const orderId = useSelector((s) => s.dineIn.orderId);
  const hasDineInOrder = useSelector(selectHasActiveDineInOrder);
  const isBillGenerated = useSelector(selectIsBillGenerated);
  const servingTime = useSelector(selectServingTime);
  const subtotal = useSelector(selectSubtotal);

  const taxes = Math.round(subtotal * 0.05);
  const service = mode === "dine-in" ? Math.round(subtotal * 0.05) : 0;
  const total = subtotal + taxes + service;

  // If bill already generated, send to bill page
  useEffect(() => {
    if (hasDineInOrder && orderId && isBillGenerated) {
      router.replace(`/order/${orderId}/bill`);
    }
  }, [hasDineInOrder, orderId, isBillGenerated, router]);

  // Group cart items by food category for display
  const grouped = SERVING_GROUPS
    .map((g) => ({ group: g, items: items.filter((i) => i.group === g.id) }))
    .filter((s) => s.items.length > 0);

  const handlePlaceOrder = () => {
    if (mode === "dine-in") {
      const id = orderId || generateOrderId();
      dispatch(placeOrder({ orderId: id, items: [...items], servingTimeId: servingTime.id }));
      dispatch(clearCart());
      router.push(`/order/${id}`);
    } else {
      // Takeaway: payment page handles order placement
      router.push("/takeaway-payment");
    }
  };

  if (items.length === 0) {
    return (
      <Container className="min-h-screen grid place-items-center">
        <div className="text-center">
          <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground" />
          <h2 className="mt-4 text-lg font-semibold">Your cart is empty</h2>
          <p className="mt-1 text-sm text-muted-foreground">Add items from the menu to get started.</p>
          {restaurantId && (
            <button
              onClick={() => router.push(`/restaurant/${restaurantId}/menu`)}
              className="mt-4 rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold"
            >
              Browse menu
            </button>
          )}
        </div>
      </Container>
    );
  }

  return (
    <Container className="min-h-screen pb-10">
      <TopBar title="Your cart" subtitle={restaurantName ?? "Restaurant"} />

      {/* Serving time info — shown for dine-in */}
      {mode === "dine-in" && (
        <div className="mt-5 glass rounded-2xl p-3 flex items-center gap-3">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-semibold">Serving: {servingTime.label}</p>
            <p className="text-[11px] text-muted-foreground">
              {hasDineInOrder
                ? "These items will be added as a new group to your current order."
                : "Items will be served according to this schedule."}
            </p>
          </div>
        </div>
      )}

      {/* Cart items grouped by category */}
      <div className="mt-5 space-y-5">
        {grouped.map(({ group, items }) => (
          <div key={group.id}>
            <div className="mb-2 flex items-center gap-2 px-1">
              <span>{group.emoji}</span>
              <h3 className="text-sm font-semibold">{group.label}</h3>
            </div>
            <div className="glass rounded-2xl divide-y divide-white/5">
              {items.map((item) => (
                <div key={item.id} className="p-3 flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-12 w-12 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{formatPrice(item.price)} each</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => dispatch(decrementItem(item.id))}
                      className="grid h-7 w-7 place-items-center rounded-md bg-white/5 hover:bg-white/10"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-sm font-bold tabular-nums w-5 text-center">{item.qty}</span>
                    <button
                      onClick={() => dispatch(incrementItem(item.id))}
                      className="grid h-7 w-7 place-items-center rounded-md bg-white/5 hover:bg-white/10"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => dispatch(removeItem(item.id))}
                      className="grid h-7 w-7 place-items-center rounded-md text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bill summary */}
      <div className="mt-6 glass-strong rounded-3xl p-5">
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span className="text-foreground">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Taxes (5%)</span>
            <span className="text-foreground">{formatPrice(taxes)}</span>
          </div>
          {service > 0 && (
            <div className="flex justify-between text-muted-foreground">
              <span>Service charge (5%)</span>
              <span className="text-foreground">{formatPrice(service)}</span>
            </div>
          )}
          <div className="my-3 h-px bg-border" />
          <div className="flex justify-between font-bold text-base">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={handlePlaceOrder}
        className="mt-6 w-full rounded-2xl bg-primary text-primary-foreground h-14 font-semibold ring-glow inline-flex items-center justify-center gap-2"
      >
        {hasDineInOrder
          ? "Add to current order"
          : mode === "dine-in"
          ? "Place order"
          : "Proceed to pay"}
        <ArrowRight className="h-5 w-5" />
      </motion.button>
    </Container>
  );
}
