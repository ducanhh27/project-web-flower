import React, { useEffect, useState } from 'react';
import { GiStrawberry } from "react-icons/gi";
import { CiCircleList } from "react-icons/ci";
import { GiFlowers } from "react-icons/gi";
import { GiFlowerPot } from "react-icons/gi";
import { BsFlower1 } from "react-icons/bs";
import { LuFlower } from "react-icons/lu";
import { GiFruitTree } from "react-icons/gi";
import { GiCactusPot } from "react-icons/gi";
import axios from 'axios';
import { Link } from 'react-router-dom';

const flowerIcons = [
    <GiFlowers size={22} />,
    <GiFlowerPot size={22} />,
    <BsFlower1 size={22} />,
    <LuFlower size={22} />,
    <GiFruitTree size={22} />,
    <GiCactusPot size={22} />,
  ];
const LeftTopContent = () => {
    const [categories,setCategories]=useState()
    const fetchCategories = async () =>{
        const res = await axios.get("http://localhost:3000/categories")
        console.log(res.data,"data đây")
        setCategories(res.data)
    }
  useEffect(()=>{
    fetchCategories()
 },[])
  return (
    <div className="LeftTopContent w-full">
      <div className="w-48 text-sm font-medium bg-white border border-gray-200 rounded-lg dark:text-white">
        <a
          href="#"
          aria-current="true"
          style={{ backgroundColor: "rgb(7, 122, 103)" }}
          className="flex items-center gap-1 px-4 py-2 text-white border-b border-gray-200 rounded-t-lg cursor-pointer dark:border-gray-600"
        >
          <CiCircleList size={24} />
          Danh mục
        </a>

        {/* Phần cuộn danh mục */}
        <div className="flex flex-col max-h-64 overflow-y-auto">
          {" "}
          <div className="flex flex-col max-h-64 overflow-y-auto">
            {categories &&
              categories
                .filter((i) => i.name !== "Chưa xác định")
                .map((i, index) => (
                  <Link to={`categories/${i.slug}`}  key={index} href="#" className="listtopcontent">
                    {flowerIcons[index % flowerIcons.length]}
                    {i.name}
                  </Link>
                ))}
          </div>
          {/* Thêm các mục khác nếu có */}
        </div>
      </div>
    </div>
  );
};

export default LeftTopContent;
