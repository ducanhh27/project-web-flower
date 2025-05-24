import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios
import { toast } from "react-toastify";

export default function LoginAdmin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        username,
        password,
      });
  
      const data = response.data;
  
      localStorage.setItem("access_token", data.accessToken);
      localStorage.setItem("name", data.name);
      window.dispatchEvent(new Event("storage")); // Báo hiệu thay đổi localStorage
  
      toast.success("Đăng nhập thành công!", { position: "top-right", autoClose: 3000 });
  
      // Cập nhật state bằng cách set lại role
      window.location.href = "/admin/dashboard";
    } catch (err) {
      setError("Thông tin đăng nhập không đúng");
      console.error("Error:", err.response ? err.response.data : err.message);
  
      toast.error("Đăng nhập thất bại! Vui lòng kiểm tra lại tài khoản hoặc mật khẩu.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold text-center text-gray-800">Admin Login</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tên tài khoản</label>
            <input 
              type="text" 
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
            <input 
              type="password" 
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button 
            type="submit" 
            className="w-full p-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
}
