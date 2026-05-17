import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ServingMode = "dine-in" | "takeaway";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
  group: string; // serving group: starters, mains, desserts, drinks
  notes?: string;
}

interface CartState {
  mode: ServingMode | null;
  restaurantId: string | null;
  restaurantName: string | null;
  tableNumber: string | null;
  items: CartItem[];
  orderId: string | null;
  setMode: (m: ServingMode) => void;
  setRestaurant: (id: string, name: string, table?: string | null) => void;
  add: (item: Omit<CartItem, "qty">) => void;
  remove: (id: string) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  clear: () => void;
  placeOrder: () => string;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      mode: null,
      restaurantId: null,
      restaurantName: null,
      tableNumber: null,
      items: [],
      orderId: null,
      setMode: (mode) => set({ mode }),
      setRestaurant: (id, name, table = null) =>
        set({ restaurantId: id, restaurantName: name, tableNumber: table }),
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
        set({ orderId: id });
        return id;
      },
    }),
    { name: "plate-cart-v1" }
  )
);

export const selectSubtotal = (s: CartState) =>
  s.items.reduce((sum, i) => sum + i.price * i.qty, 0);
export const selectCount = (s: CartState) => s.items.reduce((n, i) => n + i.qty, 0);
