import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { clearCart, removeFromCart } from "../../redux-toolkit/feature/CartSlice";
const InfomationPay = ({ totalPrice, arrProduct }) => {
  const [user, setUser] = useState({});
  const [couponCode, setCouponCode] = useState("");
  const [sale, setSale] = useState();
  const [paymentMethod, setPaymentMethod] = useState("");
  // const paymentRoute = paymentMethod === "zalopay" ? "/zalopay" : "/vnpay";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const finalPrice = sale
    ? sale.type === "amount"
      ? totalPrice - sale.discount
      : totalPrice * (1 - sale.discount / 100)
    : totalPrice;

  const generateObjectId = () => {
    return Array(24)
      .fill(0)
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join("");
  };
  const useCoupon = async () => {
    const token = localStorage.getItem("access_token");
    const res = await axios.post(
      "http://localhost:3000/coupons/apply",
      { code: couponCode }, //  Thay bằng mã giảm giá thực tế
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setSale(res.data);

  };
  console.log(sale, "xxx");
  const getInfo = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await axios.get("http://localhost:3000/auth/info", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(res.data); // Thông tin user
    } catch (error) {
      console.error(
        "Lỗi khi lấy thông tin user:",
        error.response?.data || error.message
      );
    }
  };

  const createPayment = async () => {
    if (!user.address) {
      toast.error("Vui lòng cập nhật địa chỉ trước khi thanh toán!");
      return; // Dừng lại nếu chưa có địa chỉ
    }
    try {
      if (paymentMethod === "cod") {
        // Nếu là COD, tạo đơn hàng ngay
        const response = await axios.post("http://localhost:3000/orders", {
          customerId: user._id,
          ...(sale?.couponId && { couponId: sale.couponId }),
          name: user.name,
          phone: user.phone,
          email: user.email,
          address: user.address,
          items: arrProduct.map(item => ({
            ...item,
            quantity: item.quantity, // ✅ Chuyển stockQuantity thành quantity
          })),
          priceOders: finalPrice,
          status: "Chưa thanh toán",
          deliveryStatus: "Chưa giao hàng",
          paymentMethod: "COD",
        });
        
        if (response.status === 201 || response.status === 200) {
          toast.success("Đơn hàng đã được tạo thành công!");
          dispatch(clearCart())
          navigate("/orderuser")
        } else {
          throw new Error("Lỗi khi tạo đơn hàng COD!");
        }
        return;
      }

      const apiUrl =
        paymentMethod === "zalopay"
          ? "http://localhost:3000/zalopay/create-payment"
          : "http://localhost:3000/vnpay/create-payment";

      const orderId = generateObjectId();
      // Tiếp tục gọi API thanh toán
      let paymentBody;
      if (paymentMethod === "zalopay") {
        paymentBody = {
          amount: finalPrice,
          appUser: user._id,
          app_trans_id: orderId,
        };
      } else if (paymentMethod === "vnpay") {
        paymentBody = {
          orderId: orderId,
          amount: finalPrice,
          orderDescription: `${user._id}`,
        };
      }
      //Call API payment
      const response = await axios.post(apiUrl, paymentBody);

      if (response.data.paymentUrl) {
        window.location.href = response.data.paymentUrl; // FE tự điều hướng
      } else if (response.data.order_url) {
        window.location.href = response.data.order_url;
      } else {
        throw new Error("Không tìm thấy order_url trong phản hồi API");
      }
    } catch (error) {
      console.error("Lỗi khi xử lý thanh toán:", error);
      toast.error("Đã có lỗi xảy ra khi xử lý thanh toán.");
    }
  };
  useEffect(() => {
    getInfo();
  }, []);

  return (
    <div className="flex flex-col gap-5 ">
      <div>
        <span>Tên người nhận </span> :{" "}
        <span className="font-semibold ml-2">{user.name}</span>
      </div>

      {user.address ? (
        <div>
          Địa chỉ : <span className="font-semibold ml-3">{user.address}</span>{" "}
        </div>
      ) : (
        <div>
          {" "}
          Địa chỉ :{" "}
          <span className="font-semibold ml-2">
            Địa chỉ của bạn chưa có!
          </span>{" "}
          <button className="ml-5 text-[14px] font-bold text-slate-500">
            <Link to={"/infouser"}>
              Thêm
            </Link>
            
          </button>
        </div>
      )}
      <div>
        Số điện thoại nhận hàng:{" "}
        <span className="font-semibold ml-2">
          {" "}
          {user.phone
            ? user.phone.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3")
            : "Chưa có số điện thoại"}
        </span>
      </div>
      <div>
        Tổng tiền hàng:{" "}
        <span className="font-semibold ml-2">
          {Number(totalPrice || 0).toLocaleString("vi-VN")} đ
        </span>
      </div>
      <div>
        Phí vận chuyển:{" "}
        <span className="font-semibold ml-2">Miễn phí vận chuyển</span>
      </div>
      <div>
        Mã giảm giá:
        <input
          className="border-[1px] ml-2"
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />
        <button
          onClick={useCoupon}
          className="ml-1 px-3 py-1 text-sm rounded-full bg-orange-600 text-white font-medium shadow hover:bg-orange-400 transition-all"
        >
          Áp dụng
        </button>
      </div>
      <div>
        Tổng thanh toán:{" "}
        <span className="font-bold ml-2 text-red-700">
          {sale && (
            <span className="text-gray-500 line-through mr-2">
              {Number(totalPrice || 0).toLocaleString("vi-VN")} đ
            </span>
          )}
          {Number(finalPrice || 0).toLocaleString("vi-VN")} đ
        </span>
      </div>
      <div>Chọn hình thức thanh toán:</div>
      <div className="space-y-2 ml-4">
        {/* ZaloPay */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="payment"
            value="zalopay"
            checked={paymentMethod === "zalopay"}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-5 h-5 text-blue-600"
          />
          <span>Thanh toán qua ZaloPay</span>
        </label>

        {/* VNPay */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="payment"
            value="vnpay"
            checked={paymentMethod === "vnpay"}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-5 h-5 text-red-600"
          />
          <span>Thanh toán qua VNPay</span>
        </label>

        {/* COD */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="payment"
            value="cod"
            checked={paymentMethod === "cod"}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-5 h-5 text-red-600"
          />
          <span>Thanh toán sau khi nhận hàng</span>
        </label>
      </div>

      {paymentMethod && (
        <p className="text-blue-600 font-semibold mt-3">
          Bạn đã chọn: {paymentMethod === "zalopay" ? "ZaloPay" : paymentMethod==="vnpay" ? "VNPay": "Thanh toán khi nhận hàng (COD)"}
        </p>
      )}
      <div className="flex justify-center mt-8 mb-8">
        <button
          onClick={createPayment}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold rounded-lg shadow-lg hover:from-green-600 hover:to-green-800 transition-all duration-300 transform hover:scale-105"
        >
          Thanh toán ngay 💳
        </button>
      </div>
    </div>
  );
};

export default InfomationPay;
