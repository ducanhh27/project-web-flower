import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  showResetDialog: false,
  resetToken: null,
};

const resetPasswordSlice = createSlice({
  name: "resetPasswordSlice",
  initialState,
  reducers: {
    showResetPasswordDialog: (state, action) => {
      state.showResetDialog = true;
      state.resetToken = action.payload;
    },
    closeResetPasswordDialog: (state) => {
      state.showResetDialog = false;
      state.resetToken = null;
    },
  },
});

export const { showResetPasswordDialog, closeResetPasswordDialog } = resetPasswordSlice.actions;

export default resetPasswordSlice;
