"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Minus, ShoppingBag, ArrowRight, Trash2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { TopBar } from "@/components/layout/TopBar";
import { useDispatch, useSelector } from "react-redux";
import { incrementItem, decrementItem, removeItem, selectSubtotal } from "@/store/slices/cartSlice";
import { placeOrder } from "@/store/slices/dineInSlice";
import { formatPrice } from "@/lib/format";
import { SERVING_GROUPS } from "@/services/restaurants";

export default function CartPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const items = useSelector((s) => s.cart.items);
  const mode = useSelector((s) => s.dineIn.mode);
  const tableNumber = useSelector((s) => s.dineIn.tableNumber);
  const restaurantName = useSelector((s) => s.dineIn.restaurantName);
  const subtotal = useSelector(selectSubtotal);
  const taxes = Math.round(subtotal * 0.05);
  const service = mode === "dine-in" ? Math.round(subtotal * 0.05) : 0;
  const total = subtotal + taxes + service;

  const grouped = SERVING_GROUPS.map((g) => ({
    group: g,
    items: items.filter((i) => i.group === g.id),
  })).filter((s) => s.items.length > 0);

  const handlePlaceOrder = () => {
    const id = "ORD-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    dispatch(placeOrder(id));
    if (mode === "dine-in") {
      router.push(`/order/${id}`);
    } else {
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
        </div>
      </Container>
    );
  }

  return (
    <Container className="min-h-screen pb-10">
      <TopBar title="Your cart" subtitle={restaurantName ?? "Restaurant"} />

      <div className="mt-6 space-y-5">
        {grouped.map(({ group, items }) => (
          <div key={group.id}>
            <div className="mb-2 flex items-center gap-2 px-1">
              <span>{group.emoji}</span>
              <h3 className="text-sm font-semibold">{group.label}</h3>
            </div>
            <div className="glass rounded-2xl divide-y divide-white/5">
              {items.map((item) => (
                <div key={item.id} className="p-3 flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="h-12 w-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{item.name}</div>
                    <div className="text-xs text-muted-foreground">{formatPrice(item.price)} each</div>
                  </div>
                  <div className="flex items-center gap-2">
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
        {mode === "dine-in" ? "Place order" : "Proceed to pay"}
        <ArrowRight className="h-5 w-5" />
      </motion.button>
    </Container>
  );
}
