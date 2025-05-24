import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { FaRegNewspaper } from "react-icons/fa";
import { LuStore } from "react-icons/lu";
import { BiSupport } from "react-icons/bi";
import { FaRegUser } from "react-icons/fa";
import { Box, TextField } from "@mui/material";
import { CiSearch } from "react-icons/ci";
import { FiPhone } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { clearFilteredProducts, setFilteredProducts } from "../../redux-toolkit/feature/ProductSlice";
import Loginnn from "../login/Login";
import Logout from "../logout/Logout";
import { PiShoppingCartThin } from "react-icons/pi";
import { PiPhoneLight } from "react-icons/pi";
import { useDebounce } from "../hook/useDebounce";


const NavBar = () => {
  const dispatch = useDispatch();
  const carts = useSelector((state) => state.cartSlice.cart.reduce((acc, item) => acc + item.quantity, 0));
  const [token, setToken] = useState(localStorage.getItem("access_token"));
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 600);


  const handleClick = () => {
    animateScroll.scrollToTop();
  };


  const handleSearchChange = async (query) => {

    if (query.trim()) {
      try {
        const response = await axios.get(
          `http://localhost:3000/products/search/key?name=${query}`
        );
        dispatch(setFilteredProducts(response.data)); // Dispatch vào Redux
      } catch (error) {
        console.error("Lỗi khi tìm kiếm sản phẩm:", error);
      }
    } else {
      dispatch(clearFilteredProducts()); // Clear Redux khi không có kết quả tìm kiếm
    }
  };

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      dispatch(clearFilteredProducts());
      return;
    }
    handleSearchChange(debouncedQuery)
  }, [debouncedQuery]);

  useEffect(() => {
  const checkToken = () => {
    setToken(localStorage.getItem("access_token")); // Cập nhật lại token khi localStorage thay đổi
  };

  window.addEventListener("storage", checkToken);
  
  return () => {
    window.removeEventListener("storage", checkToken); // Xóa listener khi component unmount
  };
}, []);
  return (
    <div >
      <div className="NavBar">
        <div>
        <span className="italic text-orange-200">Ngàn mẫu hoa – Vạn cách thể hiện yêu thương</span>
        </div>
        <div className="flex gap-9">
          
          <Link className="flex gap-2 items-center" to="/findstore">
            <LuStore size={22} />
            Tìm cửa hàng
          </Link>
          <Link className="flex gap-2 items-center" to="/support/intro">
            <BiSupport size={24} />
            Hỗ trợ
          </Link>
          <Link className="flex gap-2 items-center">
            <FaRegUser size={22} />
            {token ? <Logout /> : <Loginnn />}
          </Link>
        </div>
      </div>
    <div className="sticky-navbar">
      <div className="flex justify-between px-[17rem] ">
        <div className="flex gap-5 mt-2">
          <Link to="/" onClick={()=>handleClick}>
            <img
              style={{ width: "150px", height:"50px"}}
              src="/src/assets/image/logo.jpg"
              alt=""
            />
          </Link>
          <Box sx={{ width: 500, display: "flex" }}>
            <TextField
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              label="Tìm kiếm"
              id="fullWidth"
              sx={{
                "& .MuiInputBase-root": {
                  height: "40px",
                  marginTop: "5px",
                },
              }}
            />
            <button style={{ position: "relative", left: "-40px" }}>
              <CiSearch size={30} />
            </button>
          </Box>
        </div>
        <div className="flex ">
          <div className="relative right-16 content-center " >
          <PiPhoneLight size={34}/>
          </div>
          <div className="relative right-14 pr-9 ">
            <p>1800 2002</p>
            <p>Từ 08:00 - 20:00</p>
          </div>
          <div className="border-r-4">

          </div>
          <div className="flex relative left-4 gap-3 items-center">
            <Link to="/cart">
            <PiShoppingCartThin size={34} />
            </Link>
            Giỏ hàng
          </div>
          <div className=" flex bg-yellow-300 justify-center items-center relative -left-16 rounded-lg border-2 h-5 w-5 mt-1">
            {carts}
          </div>
        </div>
      </div>
    </div>
      <div className="border-top-dashed w-100% ">

    </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default NavBar;
