import React from "react";
import { Link, Outlet } from "react-router-dom";

const Support = () => {
  return (
    <div>
      <div className="mt-9 Content-alignedMid">
        <Link to="/support/intro" className="font-bold text-orange-600 rounded-full p-2 bg-gray-100 hover:bg-gray-200">Giới thiệu về Thăng Long Farm</Link>
        <Link to="/support/instruction" className="font-bold text-orange-600 rounded-full p-2 bg-gray-100 hover:bg-gray-200">Hướng dẫn mua hàng</Link>
        <Link to="/support/shipping" className="font-bold text-orange-600 rounded-full p-2 bg-gray-100 hover:bg-gray-200">Phương thức vận chuyển</Link>
        <Link to="/support/returns" className="font-bold text-orange-600 rounded-full p-2 bg-gray-100 hover:bg-gray-200">Chính sách đổi trả</Link>

      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default Support;
