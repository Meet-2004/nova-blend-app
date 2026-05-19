"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, ShieldCheck, RefreshCw, CircleAlert as AlertCircle } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { TopBar } from "@/components/layout/TopBar";
import { useDispatch, useSelector } from "react-redux";
import { setPhone, setVerified, setOtpSent } from "@/store/slices/authSlice";
import { setMode } from "@/store/slices/dineInSlice";
import { useDineInLockGuard } from "@/hooks/useSessionGuard";
import { OTP_LENGTH, OTP_RESEND_COOLDOWN, DEMO_OTP } from "@/constants";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { phoneSchema } from "@/validations";
import { cn } from "@/lib/cn";

export default function TakeawayLogin() {
  useDineInLockGuard();
  const router = useRouter();
  const dispatch = useDispatch();
  const authPhone = useSelector((s) => s.auth.phone);
  const [step, setStep] = useState("phone");
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState(null);
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef([]);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: "" },
  });
  const phoneValue = watch("phone");

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const sendOtp = useCallback(async () => {
    const digits = phoneValue?.replace(/\D/g, "") || "";
    if (digits.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setError(null);
    setSending(true);
    await new Promise((r) => setTimeout(r, 900));
    setSending(false);
    dispatch(setPhone(digits));
    dispatch(setOtpSent(true));
    setStep("otp");
    setResendTimer(OTP_RESEND_COOLDOWN);
    setOtp(Array(OTP_LENGTH).fill(""));
    setTimeout(() => inputRefs.current[0]?.focus(), 150);
  }, [phoneValue, dispatch]);

  const handleOtpChange = (index, value) => {
    setError(null);
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const next = [...otp];
      next[index - 1] = "";
      setOtp(next);
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((d, i) => {
      next[i] = d;
    });
    setOtp(next);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const verify = useCallback(async () => {
    const entered = otp.join("");
    if (entered.length < OTP_LENGTH) {
      setError("Please enter the complete 4-digit OTP.");
      return;
    }
    setError(null);
    setVerifying(true);
    await new Promise((r) => setTimeout(r, 800));
    if (entered !== DEMO_OTP) {
      setVerifying(false);
      setError("Incorrect OTP. Try 1234 for this demo.");
      setOtp(Array(OTP_LENGTH).fill(""));
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
      return;
    }
    setVerifying(false);
    dispatch(setVerified(true));
    dispatch(setMode("takeaway"));
    router.push("/takeaway-restaurants");
  }, [otp, dispatch, router]);

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setError(null);
    setOtp(Array(OTP_LENGTH).fill(""));
    setResendTimer(OTP_RESEND_COOLDOWN);
    await new Promise((r) => setTimeout(r, 500));
    setTimeout(() => inputRefs.current[0]?.focus(), 150);
  };
  const otpComplete = otp.join("").length === OTP_LENGTH;

  return (
    <Container className="min-h-screen pb-10">
      <TopBar title="Order for pickup" />
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          className="mt-10"
        >
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/15 text-primary">
            {step === "phone" ? (
              <Phone className="h-6 w-6" />
            ) : (
              <ShieldCheck className="h-6 w-6" />
            )}
          </div>
          <h2 className="mt-5 text-2xl font-bold tracking-tight">
            {step === "phone" ? "Enter your number" : "Verify OTP"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {step === "phone"
              ? "We'll send a 4-digit code to confirm your number for pickup."
              : `Code sent to +91 ${authPhone || phoneValue}. Demo code: 1234`}
          </p>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -4, height: 0 }}
                className="mt-4 flex items-center gap-2 rounded-xl bg-destructive/10 border border-destructive/25 px-3 py-2.5"
              >
                <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
                <p className="text-xs text-destructive">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {step === "phone" ? (
            <form onSubmit={handleSubmit(sendOtp)} className="mt-6 space-y-3">
              <div className="flex items-center gap-2 rounded-2xl glass px-4 h-14">
                <span className="text-sm font-semibold text-muted-foreground shrink-0">
                  +91
                </span>
                <div className="h-4 w-px bg-border mx-1" />
                <input
                  {...register("phone")}
                  autoFocus
                  inputMode="tel"
                  placeholder="98xxxxxxxx"
                  className="flex-1 bg-transparent outline-none text-base placeholder:text-muted-foreground tracking-wide"
                  onKeyDown={(e) => e.key === "Enter" && sendOtp()}
                />
                {phoneValue && (
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {(phoneValue || "").replace(/\D/g, "").length}/10
                  </span>
                )}
              </div>
              {errors.phone && (
                <p className="text-xs text-destructive">{errors.phone.message}</p>
              )}
              <motion.button
                type="submit"
                whileTap={{ scale: 0.98 }}
                disabled={
                  (phoneValue || "").replace(/\D/g, "").length < 10 || sending
                }
                className="w-full rounded-2xl bg-primary text-primary-foreground h-14 font-semibold disabled:opacity-40 ring-glow inline-flex items-center justify-center gap-2"
              >
                {sending ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="inline-block h-4 w-4 rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground"
                    />
                    Sending...
                  </>
                ) : (
                  "Send OTP"
                )}
              </motion.button>
            </form>
          ) : (
            <div className="mt-6 space-y-4">
              <div className="flex gap-3" onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <motion.input
                    key={i}
                    ref={(el) => {
                      inputRefs.current[i] = el;
                    }}
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.06 }}
                    className={cn(
                      "flex-1 h-16 rounded-2xl text-center text-2xl font-bold tabular-nums outline-none transition border",
                      digit
                        ? "glass-strong border-primary/40 text-foreground ring-1 ring-primary/30"
                        : "glass border-border text-foreground",
                      "focus:border-primary/50 focus:ring-1 focus:ring-primary/40"
                    )}
                  />
                ))}
              </div>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={verify}
                disabled={!otpComplete || verifying}
                className="w-full rounded-2xl bg-primary text-primary-foreground h-14 font-semibold disabled:opacity-40 ring-glow inline-flex items-center justify-center gap-2"
              >
                {verifying ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="inline-block h-4 w-4 rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground"
                    />
                    Verifying...
                  </>
                ) : (
                  "Verify & continue"
                )}
              </motion.button>
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => {
                    setStep("phone");
                    setError(null);
                    setOtp(Array(OTP_LENGTH).fill(""));
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground transition"
                >
                  Change number
                </button>
                <button
                  onClick={handleResend}
                  disabled={resendTimer > 0}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition disabled:opacity-50"
                >
                  <RefreshCw className="h-3 w-3" />
                  {resendTimer > 0
                    ? `Resend in ${resendTimer}s`
                    : "Resend OTP"}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </Container>
  );
}
