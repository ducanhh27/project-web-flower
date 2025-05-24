import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CategoriesRight from "./CategoriesContent";

const CategoriesLeft = ({ slug }) => {
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [price, setPrice] = useState(50);


  // Danh sách các màu sắc và thể loại


  // Hàm xử lý thay đổi tick box màu
  const handleColorChange = (color) => {
    setSelectedColors((prevSelectedColors) =>
      prevSelectedColors.includes(color)
        ? prevSelectedColors.filter((item) => item !== color)
        : [...prevSelectedColors, color]
    );
  };
  useEffect(() => {
    console.log(price, "xxxx");
  }, [price]);

  // Hàm xử lý thay đổi tick box thể loại
  const handleCategoryChange = (category) => {
    setSelectedCategories((prevSelectedCategories) =>
      prevSelectedCategories.includes(category)
        ? prevSelectedCategories.filter((item) => item !== category)
        : [...prevSelectedCategories, category]
    );
  };

  // Hàm xử lý thay đổi thanh lọc giá
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(20000000);
    const [minLimit, setMinLimit] = useState(0);
    const [maxLimit, setMaxLimit] = useState(20000000);
  
    // Xử lý khi thay đổi giá trị thanh trượt
    const handleMinPriceChange = (e) => {
      let value = Number(e.target.value);
      if (value >= maxPrice) return; // Đảm bảo min luôn nhỏ hơn max
      setMinPrice(value);
      // onChange(value, maxPrice);
    };
    
    const handleMaxPriceChange = (e) => {
      let value = Number(e.target.value);
      
      if (value > 20000000) value = 20000000; // Giới hạn max = 20.000.000
      if (value <= minPrice) return; // Đảm bảo max luôn lớn hơn min
    
      setMaxPrice(value);
      // onChange(minPrice, value);
    };
  return (
    <div className="Content-alignedMid gap-5">
      <div>
        <div className="w-[250px] max-w-xs p-6 bg-white shadow-lg rounded-xl">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">
            Danh mục lọc
          </h3>

          {/* Lọc Theo Màu */}
          {/* <div className="mb-4 border p-4 rounded-lg">
            <h4 className="text-lg font-medium text-gray-700">Màu</h4>
            <div className="space-y-2 mt-2">
              {colors.map((color) => (
                <div key={color.code} className="flex items-center">
                  <input
                    type="checkbox"
                    id={color.code}
                    name={color.code}
                    value={color.code}
                    checked={selectedColors.includes(color.code)}
                    onChange={() => handleColorChange(color.code)}
                    className="h-4 w-4 border-2 border-gray-500 rounded-sm checked:border-black checked:bg-white checked:text-black focus:ring-0"
                  />
                  <label
                    htmlFor={color.code}
                    className="ml-2 text-sm text-gray-700"
                  >
                    {color.name}
                  </label>
                </div>
              ))}
            </div>
          </div> */}

          {/* Lọc Theo Thể loại */}
          {/* <div className="mb-4 border p-4 rounded-lg">
            <h4 className="text-lg font-medium text-gray-700">Thể loại</h4>
            <div className="space-y-2 mt-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center">
                  <input
                    type="checkbox"
                    id={category}
                    name={category}
                    value={category}
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                    className="h-4 w-4 border-2 border-gray-500 rounded-sm text-black checked:border-black checked:bg-white focus:ring-0"
                  />
                  <label
                    htmlFor={category}
                    className="ml-2 text-sm text-gray-700"
                  >
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </div> */}

          {/* Lọc Theo Giá */}
          <div className="mb-4 border p-4 h-52 rounded-lg">
      <h4 className="text-lg font-medium text-gray-700 mb-2">Lọc Theo Giá</h4>

      {/* Hàng 1: Giá từ [input] VNĐ */}
      <div className="flex items-center text-center gap-5">
        <span className="text-sm text-gray-600">Từ</span>
        <input
          type="number"
          value={minPrice}
          onChange={handleMinPriceChange}
          className="w-32 p-2 border rounded-lg"
          min={minLimit}
          max={maxLimit}
        />
        <span className="text-sm text-gray-600"></span>
      </div>

      {/* Hàng 2: đến [input] VNĐ */}
      <div className="flex items-center text-center gap-3 mt-2">
        <span className="text-sm text-gray-600">đến</span>
        <input
          type="number"
          value={maxPrice}
          onChange={handleMaxPriceChange}
          className="w-32 p-2 border rounded-lg"
          min={minLimit}
          max={maxLimit}
        />
        <span className="text-sm text-gray-600"></span>
      </div>

      {/* Hàng 3: MinLimit - MaxLimit */}
      <div className="flex px-3 justify-between text-sm text-gray-600 mt-3">
        <span>{Number(minPrice || 0).toLocaleString('vi-VN')}</span> -
        <span>{Number(maxPrice || 0).toLocaleString('vi-VN')} VNĐ</span>
      </div>
    </div>
        </div>
      </div>
      <div>
        <CategoriesRight slug={slug} minPrice={minPrice}  maxPrice={maxPrice}/>
      </div>
    </div>
  );
};

export default CategoriesLeft;
