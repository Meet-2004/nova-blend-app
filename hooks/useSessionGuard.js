"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import {
  selectIsActiveSession,
  selectIsBillGenerated,
} from "@/store/slices/dineInSlice";

/**
 * Global session guard.
 *
 * Dine-in rules:
 *   - Before bill: user can freely visit menu, cart, and tracking pages.
 *   - After bill generated: lock to /order/:id/bill.
 *
 * Takeaway rules:
 *   - After paid: lock to /takeaway-order/:id.
 *   - Placed but not yet paid: lock to /takeaway-payment.
 */
export function useSessionGuard() {
  const router = useRouter();
  const pathname = usePathname();
  const isBillGenerated = useSelector(selectIsBillGenerated);
  const sessionStatus = useSelector((s) => s.dineIn.sessionStatus);
  const mode = useSelector((s) => s.dineIn.mode);
  const orderId = useSelector((s) => s.dineIn.orderId);
  const isPaid = useSelector((s) => s.dineIn.isPaid);

  useEffect(() => {
    // Dine-in: bill generated — lock to bill page
    if (mode === "dine-in" && sessionStatus === "active" && orderId && isBillGenerated) {
      const billPath = `/order/${orderId}/bill`;
      if (!pathname.startsWith(billPath)) {
        router.replace(billPath);
      }
      return;
    }

    // Takeaway: paid — lock to order tracking
    if (mode === "takeaway" && sessionStatus === "active" && orderId && isPaid) {
      const takeawayPath = `/takeaway-order/${orderId}`;
      if (!pathname.startsWith(takeawayPath)) {
        router.replace(takeawayPath);
      }
      return;
    }

    // Takeaway: placed but not paid — lock to payment
    if (mode === "takeaway" && sessionStatus === "active" && orderId && !isPaid) {
      if (pathname !== "/takeaway-payment") {
        router.replace("/takeaway-payment");
      }
    }
  }, [isBillGenerated, sessionStatus, mode, orderId, isPaid, pathname, router]);
}

/**
 * Prevents pre-order entry pages (mode select, scan, dine-in chooser) from
 * being accessible once an active dine-in order exists but bill is not yet paid.
 */
export function useDineInLockGuard() {
  const router = useRouter();
  const mode = useSelector((s) => s.dineIn.mode);
  const sessionStatus = useSelector((s) => s.dineIn.sessionStatus);
  const orderId = useSelector((s) => s.dineIn.orderId);
  const isBillGenerated = useSelector(selectIsBillGenerated);

  useEffect(() => {
    if (mode === "dine-in" && sessionStatus === "active" && orderId && !isBillGenerated) {
      router.replace(`/order/${orderId}`);
    }
  }, [mode, sessionStatus, orderId, isBillGenerated, router]);
}

export function useTakeawayAuthGuard() {
  const router = useRouter();
  const phone = useSelector((s) => s.auth.phone);
  const isVerified = useSelector((s) => s.auth.isVerified);

  useEffect(() => {
    if (!phone || !isVerified) router.replace("/takeaway-login");
  }, [phone, isVerified, router]);
}

export function useTakeawayCartGuard() {
  const router = useRouter();
  const itemCount = useSelector((s) => s.cart.items.length);
  const mode = useSelector((s) => s.dineIn.mode);

  useEffect(() => {
    if (mode !== "takeaway" || itemCount === 0) router.replace("/takeaway-restaurants");
  }, [mode, itemCount, router]);
}
