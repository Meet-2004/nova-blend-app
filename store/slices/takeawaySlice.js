import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  takeawayStatus: "received",
};

const takeawaySlice = createSlice({
  name: "takeaway",
  initialState,
  reducers: {
    setTakeawayStatus(state, action) {
      state.takeawayStatus = action.payload;
    },
    clearTakeaway() {
      return initialState;
    },
  },
});

export const { setTakeawayStatus, clearTakeaway } = takeawaySlice.actions;
export default takeawaySlice.reducer;
