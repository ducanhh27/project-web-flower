import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import MainAdmin from "./components/admin/MainAdmin";
import Dashboard from "./components/admin/Dashboard";
import Product from "./components/admin/Product";
import Categories from "./components/admin/Categories";
import Order from "./components/admin/Order";
import Customer from "./components/admin/Customer";
import Discount from "./components/admin/Discount";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginAdmin from "./components/admin/LoginAdmin";
import NotFound from "./components/admin/NotFound";
import Message from "./components/admin/Message";

const App = () => {
  const [role, setRole] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); // Trạng thái kiểm tra token

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role);
      } catch (error) {
        localStorage.removeItem("access_token");
      }
    }
    setIsCheckingAuth(false); // Kết thúc kiểm tra token
  }, []);

  if (isCheckingAuth) return null; // Chờ kiểm tra xong mới render giao diện

  return (
    <div>
      <Routes>
        {/* Trang đăng nhập */}
        <Route path="/admin/login" element={<LoginAdmin />} />

        {/* Các route admin */}
        {role === 1 ? (
          <Route path="/admin" element={<MainAdmin />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="message" element={<Message />} />
            <Route path="products" element={<Product />} />
            <Route path="categories" element={<Categories />} />
            <Route path="order" element={<Order />} />
            <Route path="customer" element={<Customer />} />
            <Route path="discounts" element={<Discount />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        ) : (
          <Route path="/admin/*" element={<NotFound />} />
        )}

        {/* Route Not Found chung */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default App;
