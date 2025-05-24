import { Button, IconButton } from '@mui/material';
import React, { useEffect } from 'react'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart, RemoveFromCart } from '../../redux-toolkit/feature/CartSlice';
import { toast } from 'react-toastify';


const CartBoxItem = ({item}) => {
    const {thumbnail , price , quantity, name} = item
    const total = price *quantity
    const roundedTotal =total.toFixed(2);
    const dispatch =useDispatch()
    
    const addCart = () => {
      dispatch(
        addToCart({
          productId:item._id,
          quantity: 1,
        })
      )
    };
    const removeCart = () => {
      dispatch(removeFromCart(item._id));
    };

  return (
    <div>
      <div className="flex ml-2 my-2">
        <div className='flex flex-col items-center '>
          <img className="w-32 border-2 rounded-2xl transition-transform duration-300 ease-in-out hover:scale-105" src={thumbnail} alt="" />
          <p className="text-l font-medium text-orange-900 italic w-[150px] text-center">
            {name}
          </p>
        </div>
        <div className="w-32">
        </div>
        <div className="flex w-28 ">
        {Number(price || 0).toLocaleString('vi-VN')}đ
        </div>
        <div className="flex ml-36 border-2 h-8 items-center justify-center rounded-lg w-24">
          <div className="border-r-2 w-1/3"><IconButton color="error" aria-label="delete" size="small" onClick={removeCart} ><DeleteIcon fontSize="small" /></IconButton></div>
          <div className="w-1/3 flex justify-center">{quantity}</div>
          <div className="border-l-2 w-1/3" ><IconButton size="small" color="success" onClick={addCart}> <AddShoppingCartIcon fontSize="small" /> </IconButton></div>
        </div>
        <div className="ml-44">
          {Number(roundedTotal || 0).toLocaleString('vi-VN')} đ
        </div>
      </div>
    </div>
  );
}

export default CartBoxItem
