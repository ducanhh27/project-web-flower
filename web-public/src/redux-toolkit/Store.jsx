import { configureStore, createReducer } from "@reduxjs/toolkit";
import productSlice from "./feature/ProductSlice";
import cartSlice from "./feature/CartSlice";
import categoriesSlice from "./feature/Categories";
import loginSlice from "./feature/LoginSlice";
import resetPasswordSlice from "./feature/ResetPassword";
import reviewSlice from "./feature/ReviewSlice";


const store = configureStore({
    reducer:{
        productSlice:productSlice.reducer,
        cartSlice:cartSlice.reducer,
        categoriesSlice:categoriesSlice.reducer,
        loginSlice:loginSlice.reducer,
        resetPasswordSlice:resetPasswordSlice.reducer,
        reviewSlice:reviewSlice.reducer

    }
})

export default store;
