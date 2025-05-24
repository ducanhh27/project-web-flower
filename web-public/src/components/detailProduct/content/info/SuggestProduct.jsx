
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Link } from "react-router-dom";
import { Button, colors } from '@mui/material';
const SuggestProduct = ({product}) => {
    console.log(product,"product")
    const [suggestProduct,setTopProduct] = useState([])
    const topSelling = async () =>{
        const res = await axios.get(`http://localhost:3000/products/categories/${product.categories}`)
        setTopProduct(res.data)
    }
    useEffect(()=>{
        topSelling()
    },[])
  return (
    <div>
      <div className="Content-alignedMid mt-8 flex flex-col">
      <div className="border-[1px py-2] text-center mb-10">
        <span
          className="text-orange-500 uppercase text-[20px] font-bold pl-[30px]"
        >
          Có thể bạn cũng thích
        </span>
        <div className="w-full ">
          <Swiper
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              reverseDirection: false, // Chạy ngược
            }}
            loop={suggestProduct.length > 3}
            dir="rtl"
            slidesPerView={5}
            spaceBetween={30}
            navigation={true} // Thêm navigation (mũi tên trái/phải)
            modules={[Navigation, Autoplay]} // Dùng module Navigation
            className="mySwiper"
          >
            {suggestProduct.slice(0,10).map((i) => (
              <SwiperSlide>
                <div className="flex flex-col items-center">
                  <Link to={`/detail/${i.slug}`}>
                    <img className="h-[250px]" src={i.thumbnail} alt="" />
                    <div>
                        <span className="font-semibold"  >
                            {i.name}
                        </span>
                    </div>
                    
                    <div>
                        <span className="font-semibold text-red-700"  >
                        {Number(i.price || 0).toLocaleString('vi-VN')}đ
                        </span>
                    </div>
                    <div>
                       <Button style={{paddingTop:"2px",paddingBottom:"2px",marginTop:"5px", backgroundColor: "blueviolet", color: "white" }}>
                        Xem ngay
                        </Button>
                    </div>
                  </Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
    </div>
  )
}

export default SuggestProduct
