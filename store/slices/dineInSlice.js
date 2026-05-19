import { createSlice } from "@reduxjs/toolkit";
import { GROUP_STATUS, GROUP_STATUS_ACTIVE_ORDER, SERVING_TIME_OPTIONS } from "@/constants";

// Module-level counter survives hot reload but resets on full reload.
// We derive the next group number from state length to be safe in reducers.
const initialState = {
  mode: null,
  sessionStatus: "idle",
  restaurantId: null,
  restaurantName: null,
  tableNumber: null,
  // The shared order ID for this table session (created on first order)
  orderId: null,
  billStatus: "none",  // "none" | "generated" | "paid"
  billConfirmModal: false,
  isPaid: false,
  // Each placed order is a group. Cart items become a new group on "Place Order".
  orderGroups: [],
};

function buildOrderGroup(items, servingTimeId, groupNumber) {
  const servingTime =
    SERVING_TIME_OPTIONS.find((o) => o.id === servingTimeId) ||
    SERVING_TIME_OPTIONS[0];

  const now = Date.now();
  const isScheduled = servingTime.delay > 0;
  const scheduledAt = isScheduled ? now + servingTime.delay * 60 * 1000 : null;

  return {
    id: `grp-${groupNumber}-${now}`,
    groupNumber,
    items: items.map((item) => ({ ...item })),
    servingTimeId: servingTime.id,
    servingTimeLabel: servingTime.label,
    servingDelay: servingTime.delay,
    scheduledAt,
    // Scheduled groups wait until their time; immediate ones start at RECEIVED
    status: isScheduled ? GROUP_STATUS.SCHEDULED : GROUP_STATUS.RECEIVED,
    // placedAt tracks when the group became RECEIVED (used for progress simulation)
    placedAt: isScheduled ? null : now,
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

    // Place first order — assigns the session orderId and creates Group 1
    placeFirstOrder(state, action) {
      const { orderId, items, servingTimeId } = action.payload;
      state.orderId = orderId;
      state.sessionStatus = "active";
      state.billStatus = "none";
      const group = buildOrderGroup(items, servingTimeId, 1);
      state.orderGroups = [group];
    },

    // Add a new order group to an existing session — always independent
    addOrderGroup(state, action) {
      const { items, servingTimeId } = action.payload;
      const nextNumber = state.orderGroups.length + 1;
      const group = buildOrderGroup(items, servingTimeId, nextNumber);
      state.orderGroups.push(group);
    },

    // Advance a single group's status — other groups are NOT touched
    updateGroupStatus(state, action) {
      const { groupId, status } = action.payload;
      const group = state.orderGroups.find((g) => g.id === groupId);
      if (group) {
        group.status = status;
        // When a scheduled group becomes RECEIVED, start its clock
        if (status === GROUP_STATUS.RECEIVED && !group.placedAt) {
          group.placedAt = Date.now();
        }
      }
    },

    // Called by the scheduler when a delayed group's time arrives
    activateScheduledGroup(state, action) {
      const { groupId } = action.payload;
      const group = state.orderGroups.find((g) => g.id === groupId);
      if (group && group.status === GROUP_STATUS.SCHEDULED) {
        group.status = GROUP_STATUS.RECEIVED;
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
      state.isPaid = true;
    },

    // Takeaway-specific
    markPaid(state) {
      state.isPaid = true;
    },

    // Used by takeaway placeOrder (needs to set orderId without groups)
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
  placeFirstOrder,
  addOrderGroup,
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

// --- Selectors ---

export const selectIsBillGenerated = (state) =>
  state.dineIn.billStatus === "generated" || state.dineIn.billStatus === "paid";

export const selectIsBillPaid = (state) => state.dineIn.billStatus === "paid";

export const selectAllGroupsServed = (state) => {
  const groups = state.dineIn.orderGroups;
  return groups.length > 0 && groups.every((g) => g.status === GROUP_STATUS.SERVED);
};

// Bill can only be generated once ALL groups are served
export const selectCanGenerateBill = (state) => {
  if (state.dineIn.mode !== "dine-in" || !state.dineIn.orderId) return false;
  if (state.dineIn.billStatus !== "none") return false;
  return selectAllGroupsServed(state);
};

// Active dine-in: has an order, session open, not yet paid
export const selectHasActiveDineInOrder = (state) =>
  state.dineIn.mode === "dine-in" &&
  !!state.dineIn.orderId &&
  state.dineIn.sessionStatus === "active" &&
  state.dineIn.billStatus !== "paid";

export const selectHasActiveTakeawayOrder = (state) =>
  state.dineIn.mode === "takeaway" &&
  !!state.dineIn.orderId &&
  state.dineIn.sessionStatus === "active";

// Dine-in locked = user is in an active order (bill not yet paid)
export const selectIsDineInLocked = (state) =>
  state.dineIn.mode === "dine-in" &&
  state.dineIn.sessionStatus === "active" &&
  !!state.dineIn.orderId &&
  state.dineIn.billStatus !== "paid";

export const selectIsActiveSession = (state) =>
  state.dineIn.sessionStatus === "active" &&
  !!state.dineIn.restaurantId &&
  !!state.dineIn.mode;

export default dineInSlice.reducer;
