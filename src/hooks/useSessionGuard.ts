import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useCart } from "@/store/cart";

/**
 * Redirect away from public/landing routes if a session is active.
 * Restores users into their flow (menu / cart / order / payment).
 */
export function useSessionGuard() {
  const nav = useNavigate();
  const sessionStatus = useCart((s) => s.sessionStatus);
  const mode = useCart((s) => s.mode);
  const restaurantId = useCart((s) => s.restaurantId);
  const orderId = useCart((s) => s.orderId);
  const isPaid = useCart((s) => s.isPaid);

  useEffect(() => {
    if (sessionStatus !== "active" || !restaurantId || !mode) return;

    // Dine-in: route into menu/order/bill
    if (mode === "dine-in") {
      if (orderId) {
        nav({ to: "/order/$id", params: { id: orderId }, replace: true });
      } else {
        nav({ to: "/restaurant/$id/menu", params: { id: restaurantId }, replace: true });
      }
      return;
    }

    // Takeaway: route into menu/payment/order
    if (mode === "takeaway") {
      if (orderId && isPaid) {
        nav({ to: "/takeaway-order/$id", params: { id: orderId }, replace: true });
      } else if (orderId && !isPaid) {
        nav({ to: "/takeaway-payment", replace: true });
      } else {
        nav({ to: "/restaurant/$id/menu", params: { id: restaurantId }, replace: true });
      }
    }
  }, [sessionStatus, mode, restaurantId, orderId, isPaid, nav]);
}
