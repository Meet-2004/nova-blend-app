import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: null, // "dine-in" | "takeaway" | null
  sessionStatus: "idle", // "idle" | "active" | "completed"
  restaurantId: null,
  restaurantName: null,
  tableNumber: null,
  orderId: null,
  orderStatus: "none", // "none" | "placed" | "kitchen" | "cooking" | "serving" | "served"
  billStatus: "none", // "none" | "generated" | "paid"
  isPaid: false,
  billConfirmModal: false,
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
      state.orderStatus = "placed";
    },
    setOrderStatus(state, action) {
      state.orderStatus = action.payload;
    },
    showBillConfirmModal(state) {
      state.billConfirmModal = true;
    },
    hideBillConfirmModal(state) {
      state.billConfirmModal = false;
    },
    generateBill(state) {
      state.billStatus = "generated";
      state.billConfirmModal = false;
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
  setOrderStatus,
  showBillConfirmModal,
  hideBillConfirmModal,
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

export const selectIsBillGenerated = (state) =>
  state.dineIn.billStatus === "generated";

export const selectCanGenerateBill = (state) =>
  state.dineIn.mode === "dine-in" &&
  !!state.dineIn.orderId &&
  state.dineIn.orderStatus === "served" &&
  state.dineIn.billStatus === "none";

export const selectIsActiveSession = (state) =>
  state.dineIn.sessionStatus === "active" && !!state.dineIn.restaurantId && !!state.dineIn.mode;

export const selectHasActiveDineInOrder = (state) =>
  state.dineIn.mode === "dine-in" &&
  !!state.dineIn.orderId &&
  state.dineIn.sessionStatus === "active" &&
  state.dineIn.billStatus !== "paid";

export const selectHasActiveTakeawayOrder = (state) =>
  state.dineIn.mode === "takeaway" &&
  !!state.dineIn.orderId &&
  state.dineIn.sessionStatus === "active";

export default dineInSlice.reducer;
