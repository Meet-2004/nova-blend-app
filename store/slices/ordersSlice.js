import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [
    {
      id: "ORD001",
      tableNumber: 1,
      customerType: "dine-in",
      status: "preparing",
      groups: [
        {
          id: "grp-1",
          number: 1,
          items: [
            { id: "item-1", name: "Biryani", qty: 2, status: "cooking" },
            { id: "item-2", name: "Butter Chicken", qty: 1, status: "cooking" },
          ],
          servingTime: "now",
          status: "cooking",
          createdAt: Date.now() - 5 * 60 * 1000,
        },
      ],
      totalAmount: 450,
      createdAt: Date.now() - 5 * 60 * 1000,
    },
    {
      id: "ORD002",
      tableNumber: 3,
      customerType: "dine-in",
      status: "received",
      groups: [
        {
          id: "grp-2",
          number: 1,
          items: [
            { id: "item-3", name: "Paneer Tikka", qty: 1, status: "preparing" },
          ],
          servingTime: "now",
          status: "preparing",
          createdAt: Date.now() - 2 * 60 * 1000,
        },
      ],
      totalAmount: 280,
      createdAt: Date.now() - 2 * 60 * 1000,
    },
  ],
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    updateOrderStatus(state, action) {
      const { orderId, status } = action.payload;
      const order = state.orders.find((o) => o.id === orderId);
      if (order) {
        order.status = status;
      }
    },

    updateGroupStatus(state, action) {
      const { orderId, groupId, status } = action.payload;
      const order = state.orders.find((o) => o.id === orderId);
      if (order) {
        const group = order.groups.find((g) => g.id === groupId);
        if (group) {
          group.status = status;
          // Update overall order status based on groups
          const allServed = order.groups.every((g) => g.status === "served");
          if (allServed) {
            order.status = "completed";
          } else if (order.groups.some((g) => g.status === "ready")) {
            order.status = "ready";
          } else if (order.groups.some((g) => g.status === "cooking")) {
            order.status = "preparing";
          }
        }
      }
    },

    addNewOrder(state, action) {
      state.orders.push(action.payload);
    },

    removeOrder(state, action) {
      state.orders = state.orders.filter((o) => o.id !== action.payload);
    },
  },
});

export const { updateOrderStatus, updateGroupStatus, addNewOrder, removeOrder } = ordersSlice.actions;

export const selectAllOrders = (state) => state.orders.orders;

export const selectActiveOrders = (state) =>
  state.orders.orders.filter((o) => o.status !== "completed");

export const selectOrderById = (state, orderId) =>
  state.orders.orders.find((o) => o.id === orderId);

export default ordersSlice.reducer;
