import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartConflictModal: false,
  pendingRestaurantId: null,
  pendingRestaurantName: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    showCartConflictModal(state, action) {
      state.cartConflictModal = true;
      state.pendingRestaurantId = action.payload.id;
      state.pendingRestaurantName = action.payload.name;
    },
    hideCartConflictModal(state) {
      state.cartConflictModal = false;
      state.pendingRestaurantId = null;
      state.pendingRestaurantName = null;
    },
  },
});

export const { showCartConflictModal, hideCartConflictModal } = uiSlice.actions;
export default uiSlice.reducer;
