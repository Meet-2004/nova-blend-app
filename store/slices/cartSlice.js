import { createSlice } from "@reduxjs/toolkit";
import { SERVING_TIME_OPTIONS } from "@/constants";

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

export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.qty, 0);

export const selectCartSubtotal = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.qty, 0);

export const selectServingTime = (state) => {
  const id = state.cart.servingTimeId;
  return SERVING_TIME_OPTIONS.find((o) => o.id === id) || SERVING_TIME_OPTIONS[0];
};

// Legacy selectors for backward compatibility
export const selectCount = selectCartCount;
export const selectSubtotal = selectCartSubtotal;

export default cartSlice.reducer;
