import { Remove } from "@mui/icons-material";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";


//Lấy cart
export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
    const token = localStorage.getItem("access_token"); 
    console.log(token,"Token đây")
    if (!token) throw new Error("Không tìm thấy token!");

    const res = await axios.get("http://localhost:3000/cart", {
        headers: { Authorization: `Bearer ${token}` },
    });
    console.log(res.data,"đăng nhập thành công")
    return res.data.items;
});

// thêm vao cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity = 1 }, { getState, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        // Trả về lỗi một lần và không tiếp tục thực hiện
        return rejectWithValue("Vui lòng đăng nhập để mua hàng!");
      }

      const res = await axios.post(
        "http://localhost:3000/cart/add",
        { items: [{ productId, quantity }] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const cartItems = res.data.items;

      const fetchProductDetails = async (id) => {
        const res = await axios.get(`http://localhost:3000/products/${id}`);
        return res.data;
      };

      const updatedCart = await Promise.all(
        cartItems.map(async (item) => {
          const existingItem = getState().cartSlice.cart.find((i) => i._id === item.productId);
          if (existingItem) {
            return { ...existingItem, quantity: item.quantity };
          } else {
            const productDetails = await fetchProductDetails(item.productId);
            return { ...productDetails, quantity: item.quantity };
          }
        })
      );

      return updatedCart;
    } catch (error) {
      console.log("lỗi đây 1")
      return rejectWithValue(error.response?.data?.message || "Vui lòng đăng nhập để mua hàng!");
    }
  }
);

//Xóa sản phẩm
export const removeFromCart = createAsyncThunk(
    "cart/removeFromCart",
    async (productId, { getState, rejectWithValue }) => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("Không tìm thấy token!");
  
        const res = await axios.post(
          "http://localhost:3000/cart/remove",
          { productId }, // Gửi ID sản phẩm cần xóa
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        const cartItems = res.data.items; // Lấy danh sách mới sau khi xóa
  
        // 🔍 Lấy thông tin sản phẩm nếu vẫn còn trong giỏ hàng
        const fetchProductDetails = async (id) => {
          const res = await axios.get(`http://localhost:3000/products/${id}`);
          return res.data;
        };
  
        const updatedCart = await Promise.all(
          cartItems.map(async (item) => {
            const existingItem = getState().cartSlice.cart.find((i) => i._id === item.productId);
            if (existingItem) {
              return { ...existingItem, quantity: item.quantity };
            } else {
              const productDetails = await fetchProductDetails(item.productId);
              return { ...productDetails, quantity: item.quantity };
            }
          })
        );
  
        return updatedCart;
      } catch (error) {
        return rejectWithValue(error.response?.data || "Lỗi khi xóa sản phẩm!");
      }
    }
  );
  
  
const cartSlice = createSlice({
    name:"cartSlice",
    initialState:{
        cart:[],
    },
    reducers:{
        clearCart: (state) => {
            state.cart = [];
        },
        clearError: (state) => {
          state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
          .addCase(fetchCart.pending, (state) => {
            state.status = "loading";
          })
          .addCase(fetchCart.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.cart = action.payload.map((item) => ({
              ...item.productId,
              quantity: item.quantity,
            }));
          })
          .addCase(fetchCart.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error.message;
          })
          .addCase(addToCart.pending, (state) => {
            state.isLoading = true;
            state.error = null; // Xóa lỗi trước đó
          })
          .addCase(addToCart.fulfilled, (state, action) => {
            state.isLoading = false;
            state.cart = action.payload;
          })
          .addCase(addToCart.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload; // Lưu lỗi từ server
            toast.error(action.payload || "Lỗi khi thêm sản phẩm vào giỏ hàng!");
          
            // Không gọi clearError nhiều lần nếu lỗi chưa được xóa
            if (state.error) {
              state.error = null;  // Xóa lỗi sau khi đã xử lý
            }
          })
          .addCase(removeFromCart.fulfilled, (state, action) => {
            state.cart = action.payload; // ✅ Cập nhật giỏ hàng sau khi xóa
          })
          .addCase(removeFromCart.rejected, (state, action) => {
            state.error = action.payload;
          });
          ;
      },
});
export const {AddToCart,RemoveFromCart,clearCart,clearError } = cartSlice.actions
export default cartSlice;
