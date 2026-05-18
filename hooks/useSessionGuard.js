"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { selectIsDineInLocked, selectIsActiveSession } from "@/store/slices/dineInSlice";

/**
 * useSessionGuard — used on public/landing pages.
 * Redirects users with active sessions back into their flow.
 */
export function useSessionGuard() {
  const router = useRouter();
  const pathname = usePathname();
  const isDineInLocked = useSelector(selectIsDineInLocked);
  const isActiveSession = useSelector(selectIsActiveSession);
  const sessionStatus = useSelector((s) => s.dineIn.sessionStatus);
  const mode = useSelector((s) => s.dineIn.mode);
  const restaurantId = useSelector((s) => s.dineIn.restaurantId);
  const orderId = useSelector((s) => s.dineIn.orderId);
  const isPaid = useSelector((s) => s.dineIn.isPaid);

  useEffect(() => {
    if (isDineInLocked && orderId) {
      const isOnOrderPages = pathname.startsWith(`/order/${orderId}`);
      if (!isOnOrderPages) {
        router.replace(`/order/${orderId}`);
      }
      return;
    }

    if (sessionStatus !== "active" || !restaurantId || !mode) return;

    if (mode === "dine-in" && !orderId) {
      const isOnMenuOrCart =
        pathname === `/restaurant/${restaurantId}/menu` || pathname === "/cart";
      if (!isOnMenuOrCart) {
        router.replace(`/restaurant/${restaurantId}/menu`);
      }
      return;
    }

    if (mode === "takeaway") {
      if (orderId && isPaid) {
        const isOnTakeaway = pathname.startsWith(`/takeaway-order/${orderId}`);
        if (!isOnTakeaway) {
          router.replace(`/takeaway-order/${orderId}`);
        }
      } else if (orderId && !isPaid) {
        if (pathname !== "/takeaway-payment") {
          router.replace("/takeaway-payment");
        }
      }
    }
  }, [isDineInLocked, sessionStatus, mode, restaurantId, orderId, isPaid, pathname, router]);
}

/**
 * useDineInLockGuard — place on pages that must not be accessible during
 * an active locked dine-in session (landing, mode, scan, dine-in, etc.).
 */
export function useDineInLockGuard() {
  const router = useRouter();
  const isDineInLocked = useSelector(selectIsDineInLocked);
  const orderId = useSelector((s) => s.dineIn.orderId);

  useEffect(() => {
    if (isDineInLocked && orderId) {
      router.replace(`/order/${orderId}`);
    }
  }, [isDineInLocked, orderId, router]);
}

/**
 * useTakeawayAuthGuard — ensures user has authenticated (phone + OTP)
 * before accessing takeaway routes.
 */
export function useTakeawayAuthGuard() {
  const router = useRouter();
  const phone = useSelector((s) => s.auth.phone);
  const isVerified = useSelector((s) => s.auth.isVerified);

  useEffect(() => {
    if (!phone || !isVerified) {
      router.replace("/takeaway-login");
    }
  }, [phone, isVerified, router]);
}

/**
 * useTakeawayCartGuard — ensures user has items in cart before payment.
 */
export function useTakeawayCartGuard() {
  const router = useRouter();
  const itemCount = useSelector((s) => s.cart.items.length);
  const mode = useSelector((s) => s.dineIn.mode);

  useEffect(() => {
    if (mode !== "takeaway" || itemCount === 0) {
      router.replace("/takeaway-restaurants");
    }
  }, [mode, itemCount, router]);
}
