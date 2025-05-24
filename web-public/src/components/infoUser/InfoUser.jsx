import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { toast } from "react-toastify";

const InfoUser = () => {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const token = localStorage.getItem("access_token");

  const getUserData = async () => {
    const res = await axios.get("http://localhost:3000/auth/info", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = res.data;
    const date = new Date(data.createdAt);
    const formattedDate = date.toLocaleDateString("vi-VN");

    return {
      name: data.name,
      address: data.address || "",
      phone: data.phone,
      email: data.email,
      start: formattedDate,
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getUserData();
      setUser(data);
      setFormData({
        name: data.name,
        address: data.address ?? "",
        phone: data.phone,
        email: data.email,
        password: "",
        confirmPassword: "",
      });
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validation
    if (!formData.name.trim()) {
      toast.error("Tên không được để trống.");
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error("Số điện thoại không hợp lệ. Vui lòng nhập 10 chữ số.");
      return;
    }

    if (formData.password) {
      if (formData.password.length < 6) {
        toast.error("Mật khẩu phải có ít nhất 6 ký tự.");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        toast.error("Mật khẩu và xác nhận mật khẩu không khớp.");
        return;
      }
    }

    try {
      const res = await axios.put(
        "http://localhost:3000/auth/update",
        {
          name: formData.name,
          address: formData.address,
          phone: formData.phone,
          password: formData.password || undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Cập nhật thành công!");
      console.log("Cập nhật thành công:", res.data);

      setUser((prev) => ({
        ...prev,
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
      }));

      setIsEditing(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error.response?.data || error);
      toast.error("Cập nhật thất bại, vui lòng thử lại.");
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="w-full max-w-[600px] mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center mb-6">
        <FaUserCircle className="text-4xl text-gray-500 mr-4" />
        <h2 className="text-xl font-semibold">Thông tin cá nhân</h2>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-600">
              Tên
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md hover:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="address" className="block text-sm font-medium text-gray-600">
              Địa chỉ
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md hover:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-600">
              Số điện thoại
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md hover:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Mật khẩu mới
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md hover:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md hover:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
          >
            Cập nhật
          </button>
        </form>
      ) : (
        <div className="space-y-10">
          <div className="mb-4">
            <strong>Tên khách hàng:</strong> {user.name}
          </div>
          <div className="mb-4">
            <strong>Tên đăng nhập:</strong> {user.phone}
          </div>
          <div className="mb-4">
            <strong>Địa chỉ:</strong> {user.address?.trim() ? user.address : ""}
          </div>
          <div className="mb-4">
            <strong>Số điện thoại:</strong> {user.phone}
          </div>
          <div className="mb-4">
            <strong>Email:</strong> {user.email}
          </div>
          <div className="mb-4">
            <strong>Ngày tham gia:</strong> {user.start}
          </div>
          <button
            onClick={toggleEdit}
            className="w-full py-2 mt-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
          >
            Chỉnh sửa thông tin
          </button>
        </div>
      )}
    </div>
  );
};

export default InfoUser;
