import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
      <h1 className="text-7xl font-bold text-blue-600">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mt-4">
        Oops! Trang không tồn tại.
      </h2>
      <p className="text-gray-600 mt-2">
        Trang bạn đang tìm kiếm có thể đã bị xóa hoặc không tồn tại.
      </p>
      <Link
        to="/admin/login"
        className="mt-6 px-6 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition"
      >
        Quay về trang chính
      </Link>
    </div>
  );
}
