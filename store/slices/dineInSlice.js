import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: null, // "dine-in" | "takeaway" | null
  sessionStatus: "idle", // "idle" | "active" | "completed"
  restaurantId: null,
  restaurantName: null,
  tableNumber: null,
  orderId: null,
  billStatus: "none", // "none" | "generated" | "paid"
  isPaid: false,
};

const dineInSlice = createSlice({
  name: "dineIn",
  initialState,
  reducers: {
    setMode(state, action) {
      state.mode = action.payload;
    },
    setRestaurant(state, action) {
      const { id, name, table } = action.payload;
      state.restaurantId = id;
      state.restaurantName = name;
      state.tableNumber = table ?? null;
      state.sessionStatus = "active";
    },
    startSession(state) {
      state.sessionStatus = "active";
    },
    placeOrder(state, action) {
      state.orderId = action.payload;
      state.sessionStatus = "active";
      state.billStatus = "none";
    },
    generateBill(state) {
      state.billStatus = "generated";
    },
    completeBillPayment(state) {
      state.billStatus = "paid";
    },
    markPaid(state) {
      state.isPaid = true;
    },
    endSession() {
      return initialState;
    },
  },
});

export const {
  setMode,
  setRestaurant,
  startSession,
  placeOrder,
  generateBill,
  completeBillPayment,
  markPaid,
  endSession,
} = dineInSlice.actions;

export const selectIsDineInLocked = (state) =>
  state.dineIn.mode === "dine-in" &&
  state.dineIn.sessionStatus === "active" &&
  !!state.dineIn.orderId &&
  state.dineIn.billStatus !== "paid";

export const selectIsActiveSession = (state) =>
  state.dineIn.sessionStatus === "active" && !!state.dineIn.restaurantId && !!state.dineIn.mode;

export default dineInSlice.reducer;
