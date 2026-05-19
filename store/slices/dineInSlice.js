import { createSlice } from "@reduxjs/toolkit";
import { GROUP_STATUS, SERVING_TIME_OPTIONS } from "@/constants";

const initialState = {
  mode: null,
  sessionStatus: "idle",
  restaurantId: null,
  restaurantName: null,
  tableNumber: null,
  orderId: null,
  orderGroups: [],
  billStatus: "none",
  billConfirmModal: false,
};

// Create a new order group with independent status tracking
function createOrderGroup(items, servingTimeId, groupNumber) {
  const servingTime = SERVING_TIME_OPTIONS.find((o) => o.id === servingTimeId) || SERVING_TIME_OPTIONS[0];
  const now = Date.now();
  const isScheduled = servingTime.delay > 0;

  return {
    id: `grp-${groupNumber}-${now}`,
    groupNumber,
    items: items.map((item) => ({ ...item })),
    servingTimeId: servingTime.id,
    servingTimeLabel: servingTime.label,
    servingDelay: servingTime.delay,
    status: isScheduled ? GROUP_STATUS.SCHEDULED : GROUP_STATUS.PREPARING,
    scheduledAt: isScheduled ? now + servingTime.delay * 60 * 1000 : null,
    createdAt: now,
    eta: null,
  };
}

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

    placeOrder(state, action) {
      const { orderId, items, servingTimeId } = action.payload;
      if (!state.orderId) {
        state.orderId = orderId;
      }
      const groupNumber = state.orderGroups.length + 1;
      const group = createOrderGroup(items, servingTimeId, groupNumber);
      state.orderGroups.push(group);
      state.billStatus = "none";
    },

    updateGroupStatus(state, action) {
      const { groupId, status } = action.payload;
      const group = state.orderGroups.find((g) => g.id === groupId);
      if (group) {
        group.status = status;
      }
    },

    activateScheduledGroup(state, action) {
      const { groupId } = action.payload;
      const group = state.orderGroups.find((g) => g.id === groupId);
      if (group && group.status === GROUP_STATUS.SCHEDULED) {
        group.status = GROUP_STATUS.PREPARING;
      }
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

    setOrderId(state, action) {
      state.orderId = action.payload;
    },

    endSession() {
      return initialState;
    },
  },
});

export const {
  setMode,
  setRestaurant,
  placeOrder,
  updateGroupStatus,
  activateScheduledGroup,
  showBillConfirmModal,
  hideBillConfirmModal,
  generateBill,
  completeBillPayment,
  markPaid,
  setOrderId,
  endSession,
} = dineInSlice.actions;

// Legacy aliases for backward compatibility
export const placeFirstOrder = placeOrder;
export const addOrderGroup = placeOrder;

export const selectIsBillGenerated = (state) =>
  state.dineIn.billStatus === "generated" || state.dineIn.billStatus === "paid";

export const selectCanGenerateBill = (state) => {
  if (state.dineIn.mode !== "dine-in" || !state.dineIn.orderId) return false;
  if (state.dineIn.billStatus !== "none") return false;
  const groups = state.dineIn.orderGroups;
  return groups.length > 0 && groups.every((g) => g.status === GROUP_STATUS.SERVED);
};

export const selectHasActiveDineInOrder = (state) =>
  state.dineIn.mode === "dine-in" &&
  !!state.dineIn.orderId &&
  state.dineIn.sessionStatus === "active" &&
  state.dineIn.billStatus !== "paid";

export const selectIsDineInLocked = (state) =>
  state.dineIn.mode === "dine-in" &&
  state.dineIn.sessionStatus === "active" &&
  !!state.dineIn.orderId &&
  state.dineIn.billStatus !== "paid";

export default dineInSlice.reducer;
