import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  categories: [], // Mảng categories ban đầu rỗng
};

const categoriesSlice = createSlice({
  name: 'categoriesSlice',
  initialState,
  reducers: {
    setListCategories: (state, action) => {
      state.categories = action.payload; // Lưu dữ liệu vào state
    },
  },
});

export const { setListCategories } = categoriesSlice.actions;

export default categoriesSlice
