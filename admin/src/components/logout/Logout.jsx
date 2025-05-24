import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
import { clearCart } from '../../redux-toolkit/feature/CartSlice';
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from 'react-router-dom';
const Logout = () => {
    const [showActions, setShowActions] = useState(false);
    const menuRef = useRef(null); // Tham chiếu menu
    const fullName = localStorage.getItem('name')||"";
    const nameParts = fullName.trim().split(" ") ; // Tách chuỗi thành mảng
    const navigate = useNavigate();
    const lastTwoWords = nameParts.slice(-2).join(" "); // Lấy 2 từ cuối
    const token = localStorage.getItem("access_token"||"");
    let role = jwtDecode(token).role;

    const dispatch=useDispatch()
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
          setShowActions(false);
        }
      };
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const onLogout = () =>{
        dispatch(clearCart());
        console.log("đã đăng xuất")
        localStorage.removeItem("access_token");
        localStorage.removeItem("name");
        window.dispatchEvent(new Event("storage"));
    }


  return (
    <div className="relative inline-block text-left"  ref={menuRef}>
  <button
    onClick={() => setShowActions(!showActions)}
    
  >
    {lastTwoWords}
  </button>

  {/* Danh sách hành động */}
  {showActions && (
    <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 min-w-max bg-white border rounded-lg shadow-lg">
      <ul className="py-2 ">
        <li className="px-5 py-2  text-green-900 hover:bg-gray-100 cursor-pointer">{fullName}</li>
        {role === 1 ? ( <Link to="/admin"> <li className="px-5 py-2  text-green-900 hover:bg-gray-100 cursor-pointer">Quản lý</li></Link>) : <></>}
        <Link to="infouser"><li className="px-5 py-2  text-green-900 hover:bg-gray-100 cursor-pointer">Thông tin</li></Link>
        <Link to="orderuser"><li className="px-5 py-2  text-green-900 hover:bg-gray-100 cursor-pointer">Đơn hàng</li></Link>
        <li
          className="px-5 py-2 text-green-900 hover:bg-gray-100 cursor-pointer"
          onClick={onLogout}
        >
          Đăng xuất
        </li>
      </ul>
    </div>
  )}
</div>
  )
}

export default Logout
