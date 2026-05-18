import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CreditCard, Smartphone, Wallet, Check, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { TopBar } from "@/components/layout/TopBar";
import { useCart, selectSubtotal } from "@/store/cart";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";

export const Route = createFileRoute("/takeaway-payment")({ component: TakeawayPayment });

type Method = "upi" | "card" | "cash";

function TakeawayPayment() {
  const nav = useNavigate();
  const { items, mode, restaurantName, placeOrder, markPaid, phone } = useCart();
  const subtotal = useCart(selectSubtotal);
  const taxes = Math.round(subtotal * 0.05);
  const total = subtotal + taxes;

  const [method, setMethod] = useState<Method>("upi");
  const [paying, setPaying] = useState(false);

  // Guards: must be takeaway, signed-in, have items
  useEffect(() => {
    if (mode !== "takeaway") {
      nav({ to: "/", replace: true });
    } else if (!phone) {
      nav({ to: "/takeaway-login", replace: true });
    } else if (items.length === 0) {
      nav({ to: "/takeaway-restaurants", replace: true });
    }
  }, [mode, phone, items.length, nav]);

  const pay = () => {
    setPaying(true);
    setTimeout(() => {
      markPaid();
      const id = placeOrder();
      nav({ to: "/takeaway-order/$id", params: { id }, replace: true });
    }, 1200);
  };

  const itemCount = items.reduce((n, i) => n + i.qty, 0);

  return (
    <Container className="min-h-screen pb-10">
      <TopBar title="Pay to confirm" subtitle={restaurantName ?? "Takeaway"} />

      {/* Amount summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 glass-strong rounded-3xl p-5 overflow-hidden relative"
      >
        <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Amount due</div>
          <div className="mt-1 text-3xl font-bold tracking-tight tabular-nums">{formatPrice(total)}</div>
          <div className="mt-1 text-xs text-muted-foreground">
            {itemCount} item{itemCount !== 1 ? "s" : ""} · taxes included
          </div>
        </div>
      </motion.div>

      {/* Order items */}
      <div className="mt-4 glass rounded-2xl divide-y divide-white/5">
        {items.map((i) => (
          <div key={i.id} className="p-3 flex items-center gap-3">
            <img src={i.image} alt={i.name} loading="lazy" className="h-10 w-10 rounded-lg object-cover" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{i.name}</div>
              <div className="text-xs text-muted-foreground">Qty {i.qty}</div>
            </div>
            <div className="text-sm font-medium tabular-nums">{formatPrice(i.price * i.qty)}</div>
          </div>
        ))}
        <div className="p-3 flex justify-between text-xs text-muted-foreground">
          <span>Taxes (5%)</span>
          <span className="text-foreground tabular-nums">{formatPrice(taxes)}</span>
        </div>
        <div className="p-3 flex justify-between font-semibold text-sm">
          <span>Total</span>
          <span className="tabular-nums">{formatPrice(total)}</span>
        </div>
      </div>

      {/* Payment method */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold tracking-tight px-1 mb-3">Payment method</h3>
        <div className="grid grid-cols-3 gap-2">
          <PayOption
            m="upi"
            current={method}
            onClick={setMethod}
            icon={<Smartphone className="h-5 w-5" />}
            label="UPI"
          />
          <PayOption
            m="card"
            current={method}
            onClick={setMethod}
            icon={<CreditCard className="h-5 w-5" />}
            label="Card"
          />
          <PayOption
            m="cash"
            current={method}
            onClick={setMethod}
            icon={<Wallet className="h-5 w-5" />}
            label="Pay at pickup"
          />
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.98 }}
        disabled={paying}
        onClick={pay}
        className="mt-8 w-full rounded-2xl bg-primary text-primary-foreground h-14 font-semibold ring-glow disabled:opacity-60 inline-flex items-center justify-center gap-2"
      >
        {paying ? (
          <>
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block h-4 w-4 rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground"
            />
            Processing...
          </>
        ) : (
          <>
            <Check className="h-5 w-5" />
            Pay {formatPrice(total)}
          </>
        )}
      </motion.button>

      <button
        onClick={() => nav({ to: "/cart" })}
        className="mt-3 w-full rounded-2xl border border-border h-11 text-sm text-muted-foreground hover:text-foreground transition inline-flex items-center justify-center gap-2"
      >
        <ShoppingBag className="h-4 w-4" />
        Edit cart
      </button>
    </Container>
  );
}

function PayOption({
  m, current, onClick, icon, label,
}: { m: Method; current: Method; onClick: (m: Method) => void; icon: React.ReactNode; label: string }) {
  const active = m === current;
  return (
    <button
      onClick={() => onClick(m)}
      className={cn(
        "rounded-2xl p-4 flex flex-col items-center gap-2 border transition text-center",
        active ? "border-primary/50 bg-primary/10 text-primary" : "border-border glass text-foreground/80",
      )}
    >
      {icon}
      <span className="text-xs font-semibold leading-tight">{label}</span>
    </button>
  );
}
