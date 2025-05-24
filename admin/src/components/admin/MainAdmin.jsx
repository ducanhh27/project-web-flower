import { useState } from "react";
import {
  Card,
  Typography,
  List,
  IconButton,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  MapPinIcon,
  PowerIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Squares2X2Icon,
  ClipboardDocumentListIcon,
  TicketIcon,
  ChatBubbleOvalLeftEllipsisIcon,
} from "@heroicons/react/24/solid";
import { Link, Outlet, useLocation } from "react-router-dom";
import { UsersIcon } from "lucide-react";

export function MainAdmin() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();
  
  //Handle Logout
  const Logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("name");
    window.dispatchEvent(new Event("storage"));
    window.location.href = "/admin/login";
  };

  // Handle sidebar collapse toggle
  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Check if the current path matches the link
  const isActivePath = (path) => {
    return location.pathname.includes(path);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Card className={`h-screen w-64 p-4 shadow-md bg-white flex flex-col rounded-none fixed z-10 ${isSidebarCollapsed ? "w-16" : "w-64"}`}>
        <div className="mb-2 p-4 flex justify-between items-center">
          {!isSidebarCollapsed && (
            <Typography variant="h5" color="blue-gray" className="flex items-center">
              <span className="text-blue-500 mr-2">●</span>
              Quản trị viên
            </Typography>
          )}
          <IconButton variant="text" color="blue-gray" onClick={toggleSidebarCollapse}>
            {isSidebarCollapsed ? <ChevronRightIcon className="h-6 w-6" /> : <ChevronLeftIcon className="h-6 w-6" />}
          </IconButton>
        </div>

        {!isSidebarCollapsed && (
          <div className="mb-6 px-4">
            <div className="flex items-center gap-3 py-2">
              <div className="bg-blue-500 rounded-full h-10 w-10 flex items-center justify-center">
                <UserCircleIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <Typography variant="small" className="font-medium">Admin User</Typography>
                <Typography variant="small" color="gray" className="text-xs">nganhduc@gmail.com</Typography>
              </div>
            </div>
          </div>
        )}

        <List className="gap-3 space-y-1 px-2">
          <Link to="dashboard">
            <div className="flex gap-5 border-[1px] p-2 rounded-3xl">
              <PresentationChartBarIcon className={`h-5 w-5 ${isActivePath("dashboard") ? "text-blue-500" : "text-gray-600"}`} />
              Dashboard
            </div>
          </Link>
          <Link to="message">
            <div className="flex gap-5 border-[1px] p-2 rounded-3xl">
              <ChatBubbleOvalLeftEllipsisIcon className={`h-5 w-5 ${isActivePath("message") ? "text-blue-500" : "text-gray-600"}`} />
              Tin nhắn
            </div>
          </Link>
          <Link to="products">
            <div className="flex gap-5 border-[1px] p-2 rounded-3xl">
              <ShoppingBagIcon className={`h-5 w-5 ${isActivePath("products") ? "text-blue-500" : "text-gray-600"}`} />
              Quản lý sản phẩm
            </div>
          </Link>
          <Link to="categories">
            <div className="flex gap-5 border-[1px] p-2 rounded-3xl">
              <Squares2X2Icon className={`h-5 w-5 ${isActivePath("categories") ? "text-blue-500" : "text-gray-600"}`} />
              Quản lý danh mục
            </div>
          </Link>
          <Link to="order">
            <div className="flex gap-5 border-[1px] p-2 rounded-3xl">
              <ClipboardDocumentListIcon className={`h-5 w-5 ${isActivePath("order") ? "text-blue-500" : "text-gray-600"}`} />
              Quản lý đơn hàng
            </div>
          </Link>
          <Link to="customer">
            <div className="flex gap-5 border-[1px] p-2 rounded-3xl">
              <UsersIcon className={`h-5 w-5 ${isActivePath("customer") ? "text-blue-500" : "text-gray-600"}`} />
              Quản lý khách hàng
            </div>
          </Link>
          <Link to="discounts">
            <div className="flex gap-5 border-[1px] p-2 rounded-3xl">
              <TicketIcon className={`h-5 w-5 ${isActivePath("discounts") ? "text-blue-500" : "text-gray-600"}`} />
              Quản lý giảm giá
            </div>
          </Link>
          <div className="pt-4 mt-4 border-t border-gray-200 text-[18px]">
            <button className="flex items-center gap-2" onClick={Logout}>
              Đăng xuất <PowerIcon className="h-5 w-5 text-red-500" />
            </button>
          </div>
        </List>
      </Card>

      {/* Main Content */}
      <div className="flex-grow ml-64">
        <div className="p-4 bg-gray-50 min-h-screen">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default MainAdmin;