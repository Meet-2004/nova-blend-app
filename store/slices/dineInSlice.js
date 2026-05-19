import { createSlice } from "@reduxjs/toolkit";
import { BATCH_STATUS, SERVING_TIME_OPTIONS } from "@/constants";

let groupCounter = 0;

const initialState = {
  mode: null,
  sessionStatus: "idle",
  restaurantId: null,
  restaurantName: null,
  tableNumber: null,
  orderId: null,
  billStatus: "none",
  isPaid: false,
  billConfirmModal: false,
  orderGroups: [],
};

function createOrderGroup(items, servingTimeId) {
  groupCounter += 1;
  const servingTime = SERVING_TIME_OPTIONS.find((o) => o.id === servingTimeId) || SERVING_TIME_OPTIONS[0];
  const now = Date.now();
  const scheduledAt = servingTime.delay > 0 ? now + servingTime.delay * 60 * 1000 : null;
  const initialStatus = servingTime.delay > 0 ? BATCH_STATUS.SCHEDULED : BATCH_STATUS.RECEIVED;
  return {
    id: `grp-${groupCounter}`,
    groupNumber: groupCounter,
    items: items.map((i) => ({ ...i })),
    servingTimeId: servingTime.id,
    servingTimeLabel: servingTime.label,
    servingDelay: servingTime.delay,
    scheduledAt,
    status: initialStatus,
    placedAt: now,
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
    startSession(state) {
      state.sessionStatus = "active";
    },
    placeOrder(state, action) {
      const { orderId, items, servingTimeId } = action.payload;
      state.orderId = orderId;
      state.sessionStatus = "active";
      state.billStatus = "none";
      const group = createOrderGroup(items, servingTimeId);
      state.orderGroups = [group];
    },
    addOrderGroup(state, action) {
      const { items, servingTimeId } = action.payload;
      const group = createOrderGroup(items, servingTimeId);
      state.orderGroups.push(group);
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
      if (group && group.status === BATCH_STATUS.SCHEDULED) {
        group.status = BATCH_STATUS.RECEIVED;
        group.placedAt = Date.now();
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
    endSession() {
      groupCounter = 0;
      return initialState;
    },
  },
});

export const {
  setMode,
  setRestaurant,
  startSession,
  placeOrder,
  addOrderGroup,
  updateGroupStatus,
  activateScheduledGroup,
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
  state.dineIn.billStatus === "generated" || state.dineIn.billStatus === "paid";

export const selectCanGenerateBill = (state) => {
  if (state.dineIn.mode !== "dine-in" || !state.dineIn.orderId) return false;
  if (state.dineIn.billStatus !== "none") return false;
  const groups = state.dineIn.orderGroups;
  if (groups.length === 0) return false;
  return groups.every((g) => g.status === BATCH_STATUS.SERVED);
};

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

export const selectAllGroupsServed = (state) => {
  const groups = state.dineIn.orderGroups;
  return groups.length > 0 && groups.every((g) => g.status === BATCH_STATUS.SERVED);
};

export default dineInSlice.reducer;
