"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, CreditCard, Smartphone, Wallet, Share2 } from "lucide-react";
import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { TopBar } from "@/components/layout/TopBar";
import { useDispatch, useSelector } from "react-redux";
import { completeBillPayment, endSession } from "@/store/slices/dineInSlice";
import { clearCart } from "@/store/slices/cartSlice";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";

export default function Bill() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const dispatch = useDispatch();
  const orderGroups = useSelector((s) => s.dineIn.orderGroups);
  const mode = useSelector((s) => s.dineIn.mode);
  const restaurantName = useSelector((s) => s.dineIn.restaurantName);
  const tableNumber = useSelector((s) => s.dineIn.tableNumber);

  const allItems = orderGroups.flatMap((g) => g.items);
  const subtotal = allItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const taxes = Math.round(subtotal * 0.05);
  const service = mode === "dine-in" ? Math.round(subtotal * 0.05) : 0;
  const total = subtotal + taxes + service;

  const [method, setMethod] = useState("upi");
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);

  const pay = () => {
    setPaying(true);
    setTimeout(() => {
      dispatch(completeBillPayment());
      dispatch(clearCart());
      setPaid(true);
      setTimeout(() => {
        dispatch(endSession());
        router.replace("/");
      }, 2000);
    }, 1200);
  };

  if (paid) {
    return (
      <div className="min-h-screen grid place-items-center px-6">
        <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 220, damping: 18 }} className="text-center">
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: [0.8, 1.1, 1] }} transition={{ duration: 0.5, times: [0, 0.6, 1] }} className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[oklch(0.74_0.17_155)] text-background ring-glow">
            <Check className="h-10 w-10" strokeWidth={3} />
          </motion.div>
          <h2 className="mt-6 text-2xl font-bold tracking-tight">Payment received!</h2>
          <p className="mt-1 text-sm text-muted-foreground">Thank you for dining with us. Heading back to home...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <Container className="min-h-screen pb-10">
      <TopBar title="Bill" subtitle={`#${id}`} noBack />

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-6 glass-strong rounded-3xl p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Bill from</div>
            <div className="text-base font-semibold mt-0.5">{restaurantName ?? "Restaurant"}</div>
            <div className="text-xs text-muted-foreground">{mode === "dine-in" && tableNumber ? `Table ${tableNumber}` : "Takeaway"}</div>
          </div>
          <button className="grid h-9 w-9 place-items-center rounded-full bg-white/5 hover:bg-white/10 transition" aria-label="Share bill"><Share2 className="h-4 w-4" /></button>
        </div>

        <div className="my-5 h-px bg-border" />

        {orderGroups.map((group, gi) => (
          <div key={group.id}>
            {gi > 0 && <div className="my-3 h-px bg-border" />}
            <div className="text-xs text-muted-foreground mb-2">Group {group.groupNumber} · {group.servingTimeLabel}</div>
            <ul className="space-y-2">
              {group.items.map((i) => (
                <li key={i.id} className="flex justify-between text-sm">
                  <span className="text-foreground/90"><span className="text-muted-foreground tabular-nums">{i.qty}&times;</span> {i.name}</span>
                  <span className="tabular-nums">{formatPrice(i.price * i.qty)}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="my-5 h-px bg-border" />

        <div className="space-y-1.5 text-sm">
          <BillRow label="Subtotal" value={formatPrice(subtotal)} muted />
          <BillRow label="Taxes (5%)" value={formatPrice(taxes)} muted />
          {service > 0 && <BillRow label="Service charge (5%)" value={formatPrice(service)} muted />}
          <div className="my-3 h-px bg-border" />
          <BillRow label={<span className="font-bold text-base">Total</span>} value={<span className="font-bold text-base">{formatPrice(total)}</span>} />
        </div>
      </motion.div>

      <div className="mt-6">
        <h3 className="text-sm font-semibold tracking-tight px-1 mb-3">Payment method</h3>
        <div className="grid grid-cols-3 gap-2">
          <PayOption m="upi" current={method} onClick={setMethod} icon={<Smartphone className="h-5 w-5" />} label="UPI" />
          <PayOption m="card" current={method} onClick={setMethod} icon={<CreditCard className="h-5 w-5" />} label="Card" />
          <PayOption m="cash" current={method} onClick={setMethod} icon={<Wallet className="h-5 w-5" />} label="Cash" />
        </div>
      </div>

      <motion.button whileTap={{ scale: 0.98 }} onClick={pay} disabled={paying} className="mt-8 w-full rounded-2xl bg-primary text-primary-foreground h-14 font-semibold ring-glow disabled:opacity-60 inline-flex items-center justify-center gap-2">
        {paying ? (
          <><motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="inline-block h-4 w-4 rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground" />Processing...</>
        ) : (<>Pay {formatPrice(total)}</>)}
      </motion.button>
    </Container>
  );
}

function PayOption({ m, current, onClick, icon, label }) {
  const active = m === current;
  return (
    <button onClick={() => onClick(m)} className={cn("rounded-2xl p-4 flex flex-col items-center gap-2 border transition", active ? "border-primary/50 bg-primary/10 text-primary" : "border-border glass text-foreground/80")}>
      {icon}<span className="text-xs font-semibold">{label}</span>
    </button>
  );
}

function BillRow({ label, value, muted }) {
  return (
    <div className={`flex justify-between ${muted ? "text-muted-foreground" : ""}`}>
      <span>{label}</span>
      <span className={muted ? "text-foreground" : ""}>{value}</span>
    </div>
  );
}
