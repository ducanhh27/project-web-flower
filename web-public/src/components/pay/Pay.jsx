import { CircularProgress } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import DetailProductPay from './DetailProductPay';
import InfomationPay from './InfomationPay';


const Pay = () => {
  const cartItem = useSelector((state) => state.cartSlice.cart);
  const totalPrice = cartItem.reduce((pro, item) => {
    return pro + item.quantity * item.price;
  }, 0);
  return (
    <div className="mt-9">
      {/* <img src="/src/assets/image/sucess.png" className='w-[50px]' /> */}
      <div className="flex text-[25px] items-center ml-48">
        
        Xác nhận thông tin đặt hàng
      </div>
      <div className=" ml-48 w-1/2  .Content-alignedMid">
        <div className="flex border-2 justify-center text-[20px] mt-5">
          Kiểm tra lại thông tin trước khi thanh toán
        </div>
        <div className="grid grid-cols-2 gap-3 mt-2">
          <div className="border-2 px-6">
            <div className='font-semibold text-[18px] mb-5'>
            Sản phẩm của bạn bao gồm:
            </div>
            {
              cartItem.map((item)=> <DetailProductPay key={item._id} item={item}  />)
            }
            
          </div>
          <div className="border-2 px-6">
            <div className="font-semibold text-[18px] mb-5">
              Thông tin đặt hàng:
            </div>
              <InfomationPay totalPrice={totalPrice} arrProduct= {cartItem}  />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pay
