import React, { useEffect, useState } from 'react'
import banner2 from '/src/assets/image/banner2.jpg'
import banner3 from '/src/assets/image/banner 3.jpg'
import banner4 from '/src/assets/image/banner4.jpg'
import banner5 from '/src/assets/image/banner5.jpg'
import banner6 from '/src/assets/image/banner 6.png'
import axios from 'axios'
import { AddToCart } from '../../../redux-toolkit/feature/CartSlice'
import { useDispatch } from 'react-redux'
import BoxCategorie from './boxcategories/BoxCategorie';
import SlilerComponent from '../../home/content/topcontent/midTopContent/SlilerComponent'
const CategoriesRight = ({slug,minPrice,maxPrice}) => {
  const [dataCategories,setdataCategories]= useState([]);
  const [sortOption, setSortOption] = useState(""); // Mặc định không sắp xếp
  const loadData = async () =>{
    const res = await axios.get(`http://localhost:3000/products/category/${slug}`);
    setdataCategories(res.data)
  }
  
  useEffect(()=>{
    loadData()
    console.log(dataCategories)
  },[])

  return (
    <div className="flex flex-col">
      <div className="w-[1060px] h-[388px] mt-8 ">
        <SlilerComponent
          arrImages={[banner2, banner3, banner4, banner5, banner6]}
        />
      </div>
      <div className="flex justify-end items-center">
        <label className="text-sm font-medium text-gray-700">Sắp xếp:</label>
        <select
          className="ml-2 p-2 border rounded-lg"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="">Mặc định</option>
          <option value="newest">Mới nhất</option>
          <option value="price-asc">Giá thấp đến cao </option>
          <option value="price-desc">Giá cao đến thấp</option>
        </select>
      </div>
      <div className="grid grid-cols-5 ml-4 mt-10">
        {dataCategories
          .filter(
            (product) => product.price >= minPrice && product.price <= maxPrice
          ).sort((a, b) => {
            if (sortOption === "price-asc") return a.price - b.price; // Giá thấp -> cao
            if (sortOption === "price-desc") return b.price - a.price; // Giá cao -> thấp
            if (sortOption === "newest") return new Date(b.updatedAt) - new Date(a.updatedAt); // Sản phẩm mới nhất
            return 0; // Không sắp xếp
          })
          .map((item) => (
            <BoxCategorie key={item._id} item={item} />
          ))}
      </div>
    </div>
  );
}

export default CategoriesRight
