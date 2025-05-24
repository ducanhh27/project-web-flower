import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import axios from "axios";
import { Link } from "react-router-dom";
const NewProduct = () => {
    const [topProduct,setTopProduct] = useState([])
    const topSelling = async () =>{
        const res = await axios.get("http://localhost:3000/products/top/selling")
        setTopProduct(res.data)
    }
    useEffect(()=>{
        topSelling()
    },[])
  return (
    <div className="Content-alignedMid mt-8 flex flex-col" style={{ zIndex: 1 }}>
      <div className="border-[1px py-2] text-center mb-10">
        <span
          className="text-red-700 uppercase text-[22px] font-bold pl-[30px]"
          style={{ animation: "blink .5s infinite" }}
        >
          top bán chạy
        </span>
        <div className="w-full ">
          <Swiper
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
              reverseDirection: false, // Chạy ngược
            }}
            loop={topProduct.length > 3}
            dir="rtl"
            slidesPerView={3}
            spaceBetween={30}
            navigation={true} // Thêm navigation (mũi tên trái/phải)
            modules={[Navigation, Autoplay]} // Dùng module Navigation
            className="mySwiper"
          >
            {topProduct.map((i) => (
              <SwiperSlide key={i.id}>
                <div className="flex flex-col items-center">
                  <Link to={`/detail/${i.slug}`}>
                    <img className="h-[450px]" src={i.thumbnail} alt="" />
                    <span className="font-semibold text-pink-500"  style={{ animation: "blink 1.5s infinite" }}>
                      {i.name}
                    </span>
                  </Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default NewProduct;
