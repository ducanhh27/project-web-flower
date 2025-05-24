import { configureStore, createReducer } from "@reduxjs/toolkit";
import productSlice from "./feature/ProductSlice";
import categoriesSlice from "./feature/Categories";
import loginSlice from "./feature/LoginSlice";



const store = configureStore({
    reducer:{
        productSlice:productSlice.reducer,
        categoriesSlice:categoriesSlice.reducer,
        loginSlice:loginSlice.reducer,

    }
})

export default store;
