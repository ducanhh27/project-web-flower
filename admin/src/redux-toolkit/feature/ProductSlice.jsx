import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
    name:"productSlice",
    initialState:{
        product:[],
        filteredProducts: [],
    },
    reducers:{
        ListProduct:(state,action)=>{
           state.product=action.payload
        },
        setFilteredProducts: (state, action) => {
            state.filteredProducts = action.payload;
        },
        clearFilteredProducts: (state) => {
            state.filteredProducts = [];
        },
        

    }
});
export const {ListProduct,setFilteredProducts, clearFilteredProducts} = productSlice.actions

export default productSlice;
