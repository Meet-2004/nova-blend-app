import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, ShoppingBag, ArrowRight, Trash2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { TopBar } from "@/components/layout/TopBar";
import { useCart, selectSubtotal } from "@/store/cart";
import { formatPrice } from "@/lib/format";
import { SERVING_GROUPS, type ServingGroup } from "@/services/restaurants";

export const Route = createFileRoute("/cart")({ component: CartPage });

function CartPage() {
  const nav = useNavigate();
  const { items, increment, decrement, remove, placeOrder, mode, tableNumber, restaurantName } = useCart();
  const subtotal = useCart(selectSubtotal);
  const taxes = Math.round(subtotal * 0.05);
  const service = mode === "dine-in" ? Math.round(subtotal * 0.05) : 0;
  const total = subtotal + taxes + service;

  // Group items by serving group
  const grouped = SERVING_GROUPS.map((g) => ({
    group: g,
    items: items.filter((i) => i.group === g.id),
  })).filter((s) => s.items.length > 0);

  const onPrimary = () => {
    if (mode === "takeaway") {
      // Takeaway pays BEFORE the order is confirmed
      nav({ to: "/takeaway-payment" });
      return;
    }
    const id = placeOrder();
    nav({ to: "/order/$id", params: { id } });
  };

  const ctaLabel =
    mode === "takeaway"
      ? `Pay & confirm · ${formatPrice(total)}`
      : `Place order · ${formatPrice(total)}`;

  if (items.length === 0) {
    return (
      <Container className="min-h-screen pb-10">
        <TopBar title="Your cart" />
        <div className="mt-24 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl glass">
            <ShoppingBag className="h-7 w-7 text-muted-foreground" />
          </div>
          <h2 className="mt-5 text-lg font-semibold">Cart is empty</h2>
          <p className="mt-1 text-sm text-muted-foreground">Browse the menu and add a few dishes.</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="min-h-screen pb-44">
      <TopBar
        title="Your cart"
        subtitle={restaurantName ? `${restaurantName}${tableNumber ? ` · Table ${tableNumber}` : ""}` : undefined}
      />

      <div className="mt-6 space-y-5">
        <AnimatePresence>
          {grouped.map(({ group, items }) => (
            <motion.div
              key={group.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-2 flex items-center gap-2 px-1">
                <span className="text-sm">{group.emoji}</span>
                <h3 className="text-sm font-semibold tracking-tight">{group.label}</h3>
                <span className="text-[11px] text-muted-foreground">· {group.hint}</span>
              </div>
              <div className="glass rounded-2xl divide-y divide-white/5">
                {items.map((i) => (
                  <motion.div layout key={i.id} className="p-3 flex gap-3">
                    <img src={i.image} alt={i.name} loading="lazy" className="h-16 w-16 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">{i.name}</div>
                      <div className="text-xs text-muted-foreground">{formatPrice(i.price)}</div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2 rounded-lg bg-white/5 h-8 px-1.5">
                          <button onClick={() => decrement(i.id)} className="grid h-6 w-6 place-items-center rounded-md hover:bg-white/10">
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-5 text-center text-xs font-bold tabular-nums">{i.qty}</span>
                          <button onClick={() => increment(i.id)} className="grid h-6 w-6 place-items-center rounded-md hover:bg-white/10">
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <button onClick={() => remove(i.id)} className="text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <div className="text-sm font-semibold tabular-nums">{formatPrice(i.price * i.qty)}</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Bill summary */}
        <div className="glass rounded-2xl p-4 space-y-2 text-sm">
          <Row label="Subtotal" value={formatPrice(subtotal)} />
          <Row label="Taxes (5%)" value={formatPrice(taxes)} />
          {service > 0 && <Row label="Service (5%)" value={formatPrice(service)} />}
          <div className="h-px bg-border my-2" />
          <Row label={<span className="font-semibold">Total</span>} value={<span className="font-bold">{formatPrice(total)}</span>} large />
        </div>
      </div>

      {/* Place order */}
      <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 safe-bottom">
        <div className="mx-auto max-w-md glass-strong rounded-2xl p-3 ring-glow">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onPlace}
            className="w-full h-13 rounded-xl bg-primary text-primary-foreground py-3.5 font-semibold flex items-center justify-between px-5"
          >
            <span className="text-sm">Place order · {formatPrice(total)}</span>
            <ArrowRight className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
    </Container>
  );
}

function Row({ label, value, large }: { label: React.ReactNode; value: React.ReactNode; large?: boolean }) {
  return (
    <div className={`flex justify-between ${large ? "text-base" : "text-sm"} ${large ? "" : "text-muted-foreground"}`}>
      <span>{label}</span>
      <span className={large ? "" : "text-foreground"}>{value}</span>
    </div>
  );
}

// note: ServingGroup type used implicitly via SERVING_GROUPS
export type _ = ServingGroup;
