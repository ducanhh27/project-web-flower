import React, { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import "./App.css";
import Support from "./components/support/Support";
import Home from "./components/home/Home";
import Cart from "./components/cart/Cart";
import Pay from "./components/Pay/Pay";
import CatergoriesMain from "./components/categories/CatergoriesMain";
import Botcontent from "./components/home/content/botcontent/Botcontent";
import NavBar from "./components/navbar/NavBar";
import ScrollToTop from "./components/scrollToTop/ScrollToTop";
import DetailProduct from "./components/detailProduct/DetailProduct";
import { fetchCart } from "./redux-toolkit/feature/CartSlice";
import { useDispatch } from "react-redux";
import VNPay from "./components/pay/paymentMethod/VNPay";
import ZaloPay from "./components/pay/paymentMethod/ZaloPay";
import { showResetPasswordDialog } from "./redux-toolkit/feature/ResetPassword";
import { jwtDecode } from "jwt-decode";
import Findstore from "./components/findstore/Findstore";
import IntroTL from "./components/support/content/IntroTL";
import Instruction from "./components/support/content/Instruction";
import Policy from "./components/support/content/Policy";
import Shipment from "./components/support/content/Shipment";
import SupportInfo from "./components/support/content/SupportInfo";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ChatMessage from "./components/chatmessage/ChatMessage";
import OrderUser from "./components/orders/OrderUser";
import InfoUser from "./components/InfoUser/InfoUser";

const App = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const tokenReset = searchParams.get("token");

    if (token) {
      dispatch(fetchCart()); // Fetch lại giỏ hàng khi reload nếu có token
    }
    if (tokenReset) {
      dispatch(showResetPasswordDialog(tokenReset)); // Hiện dialog nhập mật khẩu
      navigate("/"); // Chuyển hướng về trang chủ
    }
  }, [searchParams, dispatch, navigate]);


  const token = localStorage.getItem("access_token");
  let role = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      console.log(decoded, "Decoded Token"); // Kiểm tra toàn bộ payload
      role = decoded.role;
      console.log(role, "Role đây");
    } catch (error) {
      alert("lỗi");
      localStorage.removeItem("access_token"); // Xóa token nếu bị lỗi
    }
  }
  return (
    <div className="">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<NavBar />}>
          <Route path="/news" element={<Findstore />}></Route>
          <Route path="/findstore" element={<Findstore />}></Route>
          <Route path="/support" element={<Support />}>
            <Route path="intro" element={<IntroTL />}></Route>
            <Route  path="instruction" element={<Instruction />}></Route>
            <Route path="shipping" element={< Shipment/>}></Route>
            <Route path="returns" element={<Policy />}></Route>
            <Route path="customer-service" element={<SupportInfo/>}></Route>
          </Route>
          <Route path="/cart" element={<Cart />}></Route>
          <Route path="/pay" element={<Pay />}></Route>
          <Route path="/" element={<Home />}></Route>
          <Route path="/detail" element={<Home />}></Route>
          <Route path="categories/:slug" element={<CatergoriesMain />} />
          <Route path="detail/:slugProduct" element={<DetailProduct />} />
          <Route path="/vnpay" element={<VNPay />} />
          <Route path="/zalopay" element={<ZaloPay />} />
          <Route path="/orderuser" element={<OrderUser />} />
          <Route path="/infouser" element={<InfoUser />} />
        </Route>
      </Routes>
      <Botcontent /> 
      <ChatMessage className="chat-message-container" />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default App;
