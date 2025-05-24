import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLogin: false, // Mảng categories ban đầu rỗng
};

const loginSlice = createSlice({
  name: 'loginSlice',
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.isLogin = action.payload; // Lưu dữ liệu vào state
    },
  },
});

export const { setLogin } = loginSlice.actions;

export default loginSlice