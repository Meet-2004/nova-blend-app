import { useEffect } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { useCart, selectIsDineInLocked } from "@/store/cart";

/**
 * useSessionGuard — used on public/landing pages.
 * If a dine-in session is locked (order placed, bill not paid),
 * bounces user back to their active order.
 * If a pre-order session is active, restores user into their flow.
 */
export function useSessionGuard() {
  const nav = useNavigate();
  const loc = useLocation();
  const isDineInLocked = useCart(selectIsDineInLocked);
  const sessionStatus = useCart((s) => s.sessionStatus);
  const mode = useCart((s) => s.mode);
  const restaurantId = useCart((s) => s.restaurantId);
  const orderId = useCart((s) => s.orderId);
  const isPaid = useCart((s) => s.isPaid);

  useEffect(() => {
    const path = loc.pathname;

    // Dine-in locked: order placed, bill not yet paid — must stay on order/bill
    if (isDineInLocked && orderId) {
      const isOnOrderPages =
        path.startsWith(`/order/${orderId}`);
      if (!isOnOrderPages) {
        nav({ to: "/order/$id", params: { id: orderId }, replace: true });
      }
      return;
    }

    if (sessionStatus !== "active" || !restaurantId || !mode) return;

    // Dine-in pre-order: send to menu
    if (mode === "dine-in" && !orderId) {
      const isOnMenuOrCart =
        path === `/restaurant/${restaurantId}/menu` || path === "/cart";
      if (!isOnMenuOrCart) {
        nav({ to: "/restaurant/$id/menu", params: { id: restaurantId }, replace: true });
      }
      return;
    }

    // Takeaway: restore based on payment state
    if (mode === "takeaway") {
      if (orderId && isPaid) {
        const isOnTakeaway = path.startsWith(`/takeaway-order/${orderId}`);
        if (!isOnTakeaway) {
          nav({ to: "/takeaway-order/$id", params: { id: orderId }, replace: true });
        }
      } else if (orderId && !isPaid) {
        if (path !== "/takeaway-payment") {
          nav({ to: "/takeaway-payment", replace: true });
        }
      }
      // no order yet — let user browse
    }
  }, [isDineInLocked, sessionStatus, mode, restaurantId, orderId, isPaid, loc.pathname, nav]);
}

/**
 * useDineInLockGuard — place on pages that must not be accessible during
 * an active locked dine-in session (landing, mode, scan, dine-in, restaurants…).
 */
export function useDineInLockGuard() {
  const nav = useNavigate();
  const isDineInLocked = useCart(selectIsDineInLocked);
  const orderId = useCart((s) => s.orderId);

  useEffect(() => {
    if (isDineInLocked && orderId) {
      nav({ to: "/order/$id", params: { id: orderId }, replace: true });
    }
  }, [isDineInLocked, orderId, nav]);
}
