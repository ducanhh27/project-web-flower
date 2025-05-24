import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { button } from "@material-tailwind/react";
import { enableReview } from "../../redux-toolkit/feature/ReviewSlice";
import { useDispatch } from "react-redux";

const OrderUser = () => {
  const [infoOrder, setInfoOrder] = useState([]);
  const [openDetails, setOpenDetails] = useState([]); // Lưu danh sách đơn hàng đang mở
  const token = localStorage.getItem("access_token");
  const dispatch = useDispatch();
  const getInfoOrder = async () => {
    if (!token) {
      console.error("Không tìm thấy token! Vui lòng đăng nhập lại.");
      return;
    }
    try {
      const res = await axios.get("http://localhost:3000/orders/orderuser", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setInfoOrder(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy đơn hàng:", error.response?.data || error.message);
    }
  };

  const handleToggle = (orderId) => {
    setOpenDetails((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  useEffect(() => {
    getInfoOrder();
  }, []);
  console.log(infoOrder,"open")
  return (
    <div className="Content-alignedMid mt-10">
      <table className="w-full text-sm text-left rtl:text-right">
        <thead className="text-l uppercase font-bold bg-orange-400">
          <tr>
            <th className="px-5 py-3">Mã đơn hàng</th>
            <th className="px-5 py-3">Người nhận</th>
            <th className="px-5 py-3">Số điện thoại</th>
            <th className="px-5 py-3">Địa chỉ nhận hàng</th>
            <th className="px-5 py-3">Tổng hóa đơn</th>
            <th className="px-5 py-3">Thanh toán</th>
            <th className="px-5 py-3">Trạng thái đơn hàng</th>
            <th className="px-5 py-3">Thao tác</th>
          </tr>
        </thead>
        <tbody >
          {infoOrder.map((i) => (
            <React.Fragment key={i._id}>
              <tr className="bg-white border-b text-[16px] border-gray-200">
                <td className="px-5 py-6 ">{i._id}</td>
                <td className="px-5 py-6">{i.name}</td>
                <td className="px-5 py-6">{i.phone}</td>
                <td className="px-5 py-6">{i.address}</td>
                <td className="px-5 py-6">{Number(i.priceOders || 0).toLocaleString('vi-VN')}</td>
                <td className="px-5 py-6">{i.paymentMethod}</td>
                <td className="px-5 py-6 font-bold  uppercase ">
                  <span className={`px-3 py-1 rounded-md min-w-[165px] text-center inline-block ${
                    i.deliveryStatus === "Chưa giao hàng"
                      ? "bg-yellow-200 text-yellow-800"
                      : i.deliveryStatus === "Đang giao hàng"
                      ? "bg-blue-200 text-blue-800"
                      : i.deliveryStatus === "Đã giao hàng"
                      ? "bg-green-200 text-green-800"
                      : i.deliveryStatus === "Hủy đơn hàng"
                      ? "bg-red-200 text-red-800"
                      : "bg-gray-200 text-gray-800"
                  }`}>
                    {i.deliveryStatus}
                  </span>
                </td>
                <td className="px-5 py-4 text-blue-600 font-medium">
                  <button onClick={() => handleToggle(i._id)}>
                    {openDetails.includes(i._id) ? "Ẩn" : "Chi tiết"}
                  </button>
                </td>
              </tr>
              {openDetails.includes(i._id) && (
                <tr className="text-center border-b-[1px]">
                  <td colSpan="8">
                    <div className="pl-16 mb-10">
                      {i.items.map((item, index) => (
                        <div key={item._id} className="flex gap-5 items-center py-2">
                          <span className="font-semibold">{index + 1}.</span>
                          <span className="w-40">{item.name}</span>
                          <img className="w-32 h-32 object-cover" src={item.thumbnail} alt={item.name} />
                          <span>SL: {item.quantity}</span>
                          <span className="ml-24"> x {Number(item.price || 0).toLocaleString('vi-VN')}</span>
                          <span className="ml-24 font-semibold">= {Number(item.quantity * item.price|| 0).toLocaleString('vi-VN')}</span>
                          {i.deliveryStatus === "Đã giao hàng" && (
                                <button  onClick={() =>
                                  dispatch(enableReview({ orderId: i._id }))
                                }> <Link to={`/detail/${item.slug}`}>
                                  <span className="ml-16 text-yellow-600">ĐÁNH GIÁ NGAY</span>
                                </Link>
                                </button>
                          )}
                        </div>
                      ))}
                      <span className="font-bold ml-20  border-b-2 border-red-600">Tổng :{Number(i.priceOders || 0).toLocaleString('vi-VN')} đ </span>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderUser;
