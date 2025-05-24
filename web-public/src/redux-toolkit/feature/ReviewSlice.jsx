import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  canReview: false,
  orderId: null, // Thêm trường orderId
};

const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    enableReview: (state, action) => {
      state.canReview = true;
      state.orderId = action.payload.orderId; // Nhận orderId từ payload
    },
    disableReview: (state) => {
      state.canReview = false;
      state.orderId = null; // Xóa orderId khi disable
    },
  },
});

export const { enableReview, disableReview } = reviewSlice.actions;

export default reviewSlice;
