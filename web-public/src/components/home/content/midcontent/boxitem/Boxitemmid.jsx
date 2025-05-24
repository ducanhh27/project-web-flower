import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { addToCart, AddToCart } from '../../../../../redux-toolkit/feature/CartSlice';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
const Boxitemmid = ({item}) => {
  const { thumbnail,name,price } = item;
  const dispatch=useDispatch();
  const addCart = () => {
       dispatch(
         addToCart({
           productId:item._id,
           quantity: 1,
         })
       )
     };
  
  return (
    <div>
      <div className="box-item">
        <Link to={`/detail/${item.slug}`}className='flex flex-col items-center'>
        <img
          className="border-[1px] rounded-3xl hover:scale-105 hover:shadow-lg transition-transform duration-300"
          src={thumbnail}
          alt=""
        />
        <p style={{ fontFamily: 'Roboto', fontSize: '18px', color: 'darkgreen', marginTop: '2px'}}>{name}</p>
        </Link>
        <p style={{ fontFamily: 'Roboto', fontSize: '17px', marginTop: '2px'}} 
        className="font-bold text-black  mb-1">{Number(price || 0).toLocaleString('vi-VN')} đ</p>
        <button
          onClick={addCart}
          className="flex justify-between items-center gap-2 bg-red-600 text-white pl-[10px] py-[1px]  rounded-3xl text-[15px] hover:bg-green-600 hover:text-white"
        >
          Mua ngay
          <AddCircleIcon sx={{ fontSize: 32 }} />
        </button>
      </div>
    </div>
  );
}

export default Boxitemmid
