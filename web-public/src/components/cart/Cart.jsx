import React, { useEffect } from "react";
import CartBoxItem from "./CartBoxItem";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { toast } from "react-toastify";
import { clearError } from "../../redux-toolkit/feature/CartSlice";
const Cart = () => {
  const cartItem = useSelector((state) => state.cartSlice.cart);
  const totalQuantity = cartItem.reduce((pro, item) => {
    return pro + item.quantity;
  }, 0);
  const totalPrice = cartItem.reduce((pro, item) => {
    return pro + item.quantity * item.price;
  }, 0);
  const roundedTotalPrice = totalPrice.toFixed(2);
  const error  = useSelector((state) => state.cartSlice.error);
  const dispatch=useDispatch()

  useEffect(()=>{
    if (error) {
      toast.error(error, {
        position: "top-right",
        autoClose: 3000,
      });
    }

    dispatch(clearError());

  },[error])


  return (
    <div className="mt-9">
      {cartItem.length === 0 ? (
        <div>
          <div className="flex items-center justify-center">
            Giỏ hàng của bạn hiện tại đang trống.
          </div>
          <div className="flex items-center justify-center mt-10">
            <Link to="/">
              <Button variant="contained" color="success" size="small">
                Mua hàng ngay <StorefrontIcon fontSize="small" />
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="Content-alignedMid ">
          <div className="border-[1px] border-t-0 rounded-2xl ">
            <div
              style={{ marginLeft: "-1px", marginRight: "-1px" }}
              className="flex border-[1px] rounded-2xl px-8 items-center h-12 font-semibold text-zinc-800"
            >
              <div className="mr-48">Sản phẩm</div>
              <div className="mr-48">Đơn giá</div>
              <div className="mr-52">Số lượng</div>
              <div>Tổng cộng</div>
            </div>
            <div>
              <div>
                {cartItem.map((item) => (
                  <CartBoxItem item={item} key={item.id} />
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="border-[1px] w-[340px] rounded-2xl border-t-0">
              <div
                style={{ margin: "-1px" }}
                className="flex justify-between px-5 text-green-900 font-semibold border-[1px] rounded-2xl"
              >
                Giỏ hàng của tôi
                <div className="text-orange-600 font-semibold">
                  {totalQuantity} Sản phẩm
                </div>
              </div>
              <div className="text-zinc-700 flex flex-col gap-5">
                <div className="flex justify-between px-6 ml-5 mt-3">
                  Tạm tính
                  <div className="font-semibold text-black ">
                  {Number(roundedTotalPrice || 0).toLocaleString('vi-VN')} đ
                  </div>
                </div>
                <div className="flex justify-between px-6 ml-5">
                  Phí giao hàng
                  <div className="font-semibold text-black ">Miễn phí</div>
                </div>
                <div className="flex justify-between px-6 ml-5 ">
                  <div className="font-semibold text-black">Tổng cộng</div>

                  <div>
                    <div className="font-bold text-orange-600 text-[20px]">
                      {Number(roundedTotalPrice || 0).toLocaleString('vi-VN')} đ
                    </div>
                    <p className="italic text-[14px]">đã bao gồm VAT</p>
                  </div>
                </div>
              </div>
            </div>
            <Link to={"/pay"}>
              <div className="flex rounded-3xl border-[1px] bg-orange-400 text-white w-[160px] font-semibold text-[18px] mt-10 justify-center py-2 hover:bg-orange-500 hover:text-gray-500 hover:border-orange-500 hover:shadow-lg hover:scale-105">
                Thanh toán
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
