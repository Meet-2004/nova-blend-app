import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ServingMode = "dine-in" | "takeaway";
export type SessionStatus = "idle" | "active" | "completed";
export type TakeawayStatus = "received" | "preparing" | "ready" | "completed";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
  group: string;
  notes?: string;
}

interface CartState {
  mode: ServingMode | null;
  sessionStatus: SessionStatus;
  restaurantId: string | null;
  restaurantName: string | null;
  tableNumber: string | null;
  items: CartItem[];
  orderId: string | null;
  // takeaway-only
  phone: string | null;
  isPaid: boolean;
  takeawayStatus: TakeawayStatus;
  // actions
  setMode: (m: ServingMode) => void;
  setPhone: (p: string) => void;
  setRestaurant: (id: string, name: string, table?: string | null) => void;
  startSession: () => void;
  endSession: () => void;
  add: (item: Omit<CartItem, "qty">) => void;
  remove: (id: string) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  clear: () => void;
  placeOrder: () => string;
  markPaid: () => void;
  setTakeawayStatus: (s: TakeawayStatus) => void;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      mode: null,
      sessionStatus: "idle",
      restaurantId: null,
      restaurantName: null,
      tableNumber: null,
      items: [],
      orderId: null,
      phone: null,
      isPaid: false,
      takeawayStatus: "received",
      setMode: (mode) => set({ mode }),
      setPhone: (phone) => set({ phone }),
      setRestaurant: (id, name, table = null) =>
        set({ restaurantId: id, restaurantName: name, tableNumber: table, sessionStatus: "active" }),
      startSession: () => set({ sessionStatus: "active" }),
      endSession: () =>
        set({
          sessionStatus: "idle",
          mode: null,
          restaurantId: null,
          restaurantName: null,
          tableNumber: null,
          items: [],
          orderId: null,
          isPaid: false,
          takeawayStatus: "received",
        }),
      add: (item) => {
        const existing = get().items.find((i) => i.id === item.id);
        if (existing) {
          set({ items: get().items.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i)) });
        } else {
          set({ items: [...get().items, { ...item, qty: 1 }] });
        }
      },
      remove: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      increment: (id) =>
        set({ items: get().items.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)) }),
      decrement: (id) =>
        set({
          items: get()
            .items.map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
            .filter((i) => i.qty > 0),
        }),
      clear: () => set({ items: [], orderId: null }),
      placeOrder: () => {
        const id = "ORD-" + Math.random().toString(36).slice(2, 8).toUpperCase();
        set({ orderId: id, sessionStatus: "active" });
        return id;
      },
      markPaid: () => set({ isPaid: true }),
      setTakeawayStatus: (takeawayStatus) => set({ takeawayStatus }),
    }),
    { name: "plate-cart-v2" }
  )
);

export const selectSubtotal = (s: CartState) =>
  s.items.reduce((sum, i) => sum + i.price * i.qty, 0);
export const selectCount = (s: CartState) => s.items.reduce((n, i) => n + i.qty, 0);
export const selectIsActiveSession = (s: CartState) =>
  s.sessionStatus === "active" && !!s.restaurantId && !!s.mode;
