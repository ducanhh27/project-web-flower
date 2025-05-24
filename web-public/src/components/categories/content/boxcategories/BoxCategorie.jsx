import React from 'react'
import { addToCart } from '../../../../redux-toolkit/feature/CartSlice';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

const BoxCategorie = ({item}) => {
    const dispatch = useDispatch()
     const addCart = () => {
           dispatch(
             addToCart({
               productId:item._id,
               quantity: 1,
             })
           )
         };
  return (
    <div
      key={item._id}
      className="flex flex-col items-center text-center mb-32  w-[180px] h-[180px]"
    >
      <Link to={`/detail/${item.slug}`}className='flex flex-col items-center'>
      <img
        className="border-[1px] rounded-3xl hover:scale-105 hover:shadow-lg transition-transform duration-300"
        src={item.thumbnail}
        alt=""
      />
      <p
        style={{
          fontFamily: "Roboto",
          fontSize: "16px",
          color: "darkgreen",
          marginTop: "2px",
        }}
      >
        {item.name}
      </p>
      </Link>
      <p
        style={{ fontFamily: "Roboto", fontSize: "15px", marginTop: "2px" }}
        className="font-bold text-black  mb-1"
      >
        {Number(item.price || 0).toLocaleString("vi-VN")} đ
      </p>
      <button
        onClick={addCart}
        className="flex justify-between items-center gap-2 bg-red-600 text-white pl-[10px] py-[1px]  rounded-3xl text-[15px] hover:bg-green-600 hover:text-white"
      >
        Mua ngay
        <AddCircleIcon sx={{ fontSize: 28 }} />
      </button>
    </div>
  );
}

export default BoxCategorie
