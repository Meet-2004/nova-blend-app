import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  phone: null,
  isVerified: false,
  otpSent: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setPhone(state, action) {
      state.phone = action.payload;
    },
    setVerified(state, action) {
      state.isVerified = action.payload;
    },
    setOtpSent(state, action) {
      state.otpSent = action.payload;
    },
    clearAuth() {
      return initialState;
    },
  },
});

export const { setPhone, setVerified, setOtpSent, clearAuth } = authSlice.actions;
export default authSlice.reducer;
