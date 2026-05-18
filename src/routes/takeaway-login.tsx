import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Phone, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { TopBar } from "@/components/layout/TopBar";
import { useCart } from "@/store/cart";

export const Route = createFileRoute("/takeaway-login")({ component: TakeawayLogin });

function TakeawayLogin() {
  const nav = useNavigate();
  const setPhone = useCart((s) => s.setPhone);
  const setMode = useCart((s) => s.setMode);
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [num, setNum] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);

  const sendOtp = () => {
    if (num.replace(/\D/g, "").length < 10) return;
    setStep("otp");
  };

  const verify = () => {
    if (otp.join("").length < 4) return;
    setMode("takeaway");
    setPhone(num);
    nav({ to: "/takeaway-restaurants" });
  };

  return (
    <Container className="min-h-screen pb-10">
      <TopBar title="Takeaway sign in" />
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-10">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/15 text-primary">
          {step === "phone" ? <Phone className="h-6 w-6" /> : <ShieldCheck className="h-6 w-6" />}
        </div>
        <h2 className="mt-5 text-2xl font-bold tracking-tight">
          {step === "phone" ? "Enter your phone" : "Verify OTP"}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {step === "phone"
            ? "We'll send a 4-digit code to confirm pickup."
            : `Sent to +${num.replace(/\D/g, "")}`}
        </p>
      </motion.div>

      {step === "phone" ? (
        <div className="mt-8 space-y-4">
          <div className="flex items-center gap-2 rounded-2xl glass px-4 h-14">
            <span className="text-sm font-semibold text-muted-foreground">+91</span>
            <input
              autoFocus
              inputMode="tel"
              value={num}
              onChange={(e) => setNum(e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="98xxxxxxxx"
              className="flex-1 bg-transparent outline-none text-base placeholder:text-muted-foreground"
            />
          </div>
          <button
            onClick={sendOtp}
            disabled={num.length < 10}
            className="w-full rounded-2xl bg-primary text-primary-foreground h-14 font-semibold disabled:opacity-40 ring-glow"
          >
            Send OTP
          </button>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          <div className="flex gap-3 justify-between">
            {otp.map((d, i) => (
              <input
                key={i}
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "").slice(0, 1);
                  const next = [...otp];
                  next[i] = v;
                  setOtp(next);
                  if (v && i < 3) {
                    const el = document.getElementById(`otp-${i + 1}`) as HTMLInputElement | null;
                    el?.focus();
                  }
                }}
                id={`otp-${i}`}
                className="flex-1 h-16 rounded-2xl glass text-center text-2xl font-bold tabular-nums outline-none focus:ring-2 focus:ring-primary/50"
              />
            ))}
          </div>
          <button
            onClick={verify}
            disabled={otp.join("").length < 4}
            className="w-full rounded-2xl bg-primary text-primary-foreground h-14 font-semibold disabled:opacity-40 ring-glow"
          >
            Verify & continue
          </button>
          <button
            onClick={() => setStep("phone")}
            className="w-full text-xs text-muted-foreground py-2"
          >
            Change number
          </button>
        </div>
      )}
    </Container>
  );
}
