import { createSlice } from "@reduxjs/toolkit";
import { SERVING_TIME_OPTIONS } from "@/constants";

// Cart holds ONLY pending (not yet placed) items.
// When an order is placed, cart is cleared. Each placement creates a new order group.
const initialState = {
  items: [],
  servingTimeId: "now",
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action) {
      const { id, name, price, image, group } = action.payload;
      const existing = state.items.find((i) => i.id === id);
      if (existing) {
        existing.qty += 1;
      } else {
        state.items.push({ id, name, price, image, group, qty: 1 });
      }
    },
    removeItem(state, action) {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    incrementItem(state, action) {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.qty += 1;
    },
    decrementItem(state, action) {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) {
        item.qty -= 1;
        if (item.qty <= 0) {
          state.items = state.items.filter((i) => i.id !== action.payload);
        }
      }
    },
    setServingTime(state, action) {
      state.servingTimeId = action.payload;
    },
    clearCart() {
      return initialState;
    },
  },
});

export const {
  addItem,
  removeItem,
  incrementItem,
  decrementItem,
  setServingTime,
  clearCart,
} = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectSubtotal = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);
export const selectCount = (state) =>
  state.cart.items.reduce((n, i) => n + i.qty, 0);
export const selectServingTime = (state) => {
  const id = state.cart.servingTimeId;
  return SERVING_TIME_OPTIONS.find((o) => o.id === id) || SERVING_TIME_OPTIONS[0];
};

export default cartSlice.reducer;
