import React, { useEffect, useRef } from 'react'
import { GiChainedHeart } from "react-icons/gi";
import { GiSpotedFlower } from "react-icons/gi";
import { GiFlowerPot } from "react-icons/gi";
import { GiVineFlower } from "react-icons/gi";
import { GiCottonFlower } from "react-icons/gi";
import { FaTruck } from "react-icons/fa";
import { Link } from 'react-router-dom';
import banner2 from '/src/assets/image/banner2.jpg'
import banner3 from '/src/assets/image/banner 3.jpg'
import banner4 from '/src/assets/image/banner4.jpg'
import banner5 from '/src/assets/image/banner5.jpg'
import banner6 from '/src/assets/image/banner 6.png'
import SlilerComponent from './SlilerComponent';


const MidTopContent = () => {

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <div className="MidTopContent w-full flex flex-col items-center px-4">
  {/* Danh sách icon + text */}
  <div className="hidden md:flex flex-wrap justify-center gap-x-6 gap-y-3 mb-4">
  <Link to="/news" className="midtopcontent">
    <GiSpotedFlower size={22} />
    Sản phẩm uy tín
  </Link>
  <Link className="midtopcontent">
    <GiFlowerPot size={22} />
    Mẫu mã đa dạng
  </Link>
  <Link className="midtopcontent">
    <GiVineFlower size={22} />
    Hỗ trợ 24/7
  </Link>
  <Link className="midtopcontent">
    <GiCottonFlower size={22} />
    Chất lượng hàng đầu
  </Link>
  <Link className="midtopcontent HCM">
    <FaTruck size={22} />
    Giao hàng 2h
  </Link>
</div>


  {/* Banner */}
  <div className="bannerImg w-full max-w-screen-lg mx-auto">
    <SlilerComponent arrImages={[banner2, banner3, banner4, banner5, banner6]} />
  </div>
</div>

  )
}

export default MidTopContent
