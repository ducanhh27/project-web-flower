import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  Label,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ShoppingCart, Users, DollarSign, Package } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [topSellData, setTopSellData] = useState([]);
  const [topCustomter, setTopCustomter] = useState([]);
  const [totalCustomer, setTotalCustomer] = useState();
  const [totalProduct, setTotalProduct] = useState();
  const [dataCatergories, setDataCatergories] = useState([]);
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrder = revenueData.reduce((sum, item) => sum + item.orders, 0);

  const getOrder = async () => {
    const res = await axios.get("http://localhost:3000/orders/monthly-revenue");
    setRevenueData(res.data);
  };

  const getTopSelling = async () => {
    const res = await axios.get("http://localhost:3000/products/top/selling");
    setTopSellData(res.data);
    console.log(res.data, "topseling");
  };

  const getCustomer = async () => {
    const res = await axios.get("http://localhost:3000/auth/totaluser");
    setTotalCustomer(res.data);
  };

  const getProduct = async () => {
    const res = await axios.get("http://localhost:3000/products/total");
    setTotalProduct(res.data);
  };

  const getTopCustomer = async () => {
    const res = await axios.get("http://localhost:3000/orders/top-customers");
    setTopCustomter(res.data);
  };

  const getCategoriesFigure = async () => {
    const response = await axios.get(
      "http://localhost:3000/orders/best-selling-categories"
    );
    setDataCatergories(response.data);
  };
  useEffect(() => {
    getOrder();
    getTopSelling();
    getCustomer();
    getProduct();
    getTopCustomer();
    getCategoriesFigure();
  }, []);
  console.log(dataCatergories);
  // Chuyển đổi data cho biểu đồ
  const soldCategories = dataCatergories.map((item) => ({
    name: item.categoryName,
    value: item.totalSold,
  }));

  const revenueCategories = dataCatergories.map((item) => ({
    name: item.categoryName,
    value: item.totalRevenue,
  }));

  const COLORS = ["#0088FE", "#FF8042", "#00C49F", "#FFBB28", "#FF6361"];
  return (
    <div className="flex flex-col min-h-screen min-w-full">
      {/* Header hoặc Sidebar */}
      <header className="bg-blue-600 text-white p-4 text-center">
        <h1 className="text-2xl font-bold">📊 Dashboard Admin</h1>
      </header>

      {/* Nội dung chính */}
      <div className="flex-grow p-6 bg-gray-100">
        {/* Thống kê tổng quan */}
        <div className="grid grid-cols-4 gap-4 mb-5">
          <div className="bg-white p-4 rounded-lg shadow flex items-center">
            <DollarSign className="text-green-500 w-10 h-10 mr-4" />
            <div>
              <p className="text-lg font-semibold">Doanh thu</p>
              <p className="text-xl font-bold">
                {totalRevenue.toLocaleString("vi-VN")} VNĐ
              </p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow flex items-center">
            <ShoppingCart className="text-blue-500 w-10 h-10 mr-4" />
            <div>
              <p className="text-lg font-semibold">Đơn hàng</p>
              <p className="text-xl font-bold">{totalOrder}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow flex items-center">
            <Users className="text-purple-500 w-10 h-10 mr-4" />
            <div>
              <p className="text-lg font-semibold">Khách hàng</p>
              <p className="text-xl font-bold">{totalCustomer}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow flex items-center">
            <Package className="text-yellow-500 w-10 h-10 mr-4" />
            <div>
              <p className="text-lg font-semibold">Sản phẩm</p>
              <p className="text-xl font-bold">{totalProduct}</p>
            </div>
          </div>
        </div>

        {/* 📈 Biểu đồ doanh thu & sản phẩm bán chạy*/}
        <div className="grid grid-cols-2 gap-6 max-w-screen">
          {/* Biểu đồ doanh thu */}
          <div className="bg-white shadow-lg p-6 rounded-lg w-full h-[500px]">
            <h2 className="text-xl font-bold mb-7">📈 Doanh thu theo tháng</h2>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart
                data={revenueData}
                margin={{ right: 10, bottom: 30, top: 18 }}
              >
                <XAxis dataKey="month" />
                <YAxis
                  tickCount={12}
                  tickFormatter={(value) => Math.round(value / 1000000)} // Hiển thị số bình thường
                  domain={[0, "auto"]}
                  tick={{ fontSize: 12 }}
                >
                  {/* Sử dụng Label để hiển thị "Triệu đồng" */}
                  <Label
                    value="Triệu đồng"
                    position="outsideTop"
                    dy={-175} //
                    dx={5}
                    offset={10}
                    style={{ fontSize: 14, fill: "#666", fontWeight: "bold" }}
                  />
                </YAxis>

                <Tooltip
                  formatter={(value) => `${value.toLocaleString()} VND`}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4F46E5"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Biểu đồ sản phẩm bán chạy */}
          <div className="bg-white shadow-lg p-6 rounded-lg w-full h-[500px]">
            <h2 className="text-xl font-bold mb-4">📊 Sản phẩm bán chạy</h2>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={topSellData} margin={{ right: 10 }}>
                <YAxis
                  domain={[0, "dataMax"]}
                  tickCount={6}
                  tickFormatter={(value) => `${value} sp`}
                />

                <XAxis
                  dataKey="name"
                  angle={-10}
                  textAnchor="end"
                  tick={{ fontSize: 10 }}
                  interval={0}
                />

                <Tooltip />
                <Legend />
                <Bar dataKey="sold" fill="#22C55E" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table class="w-full text-sm text-left rtl:text-right text-gray-700">
                <thead class="text-xs text-white uppercase  bg-amber-500">
                  <tr>
                    <th scope="col" class="px-6 py-3">
                      Tên khách hàng
                    </th>
                    <th scope="col" class="px-6 py-3">
                      SĐT
                    </th>
                    <th scope="col" class="px-6 py-3">
                      Email
                    </th>
                    <th scope="col" class="px-6 py-3 text-center">
                      Sản Phẩm
                      <p>đã mua</p>
                    </th>
                    <th scope="col" class="px-6 py-3">
                      Số tiền
                      <p>đã mua</p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topCustomter.map((customer) => (
                    <tr class=" border-b-[1px] border-gray-400 bg-amber-100 ">
                      <th
                        scope="row"
                        class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        {customer.name.split(" ").slice(-2).join(" ")}
                      </th>
                      <td class="px-6 py-4">{customer.phone}</td>
                      <td class="px-6 py-4">{customer.email}</td>
                      <td class="px-6 py-4 text-center">
                        {customer.totalQuantity}
                      </td>
                      <td class="px-6 py-4">
                        {customer.totalPriceOrders.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex">
            <div className="w-full md:w-1/2">
              <h2 className="text-xl font-bold text-center mb-2">
                Số Lượng Thể Loại Bán Ra
              </h2>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={soldCategories}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                  >
                    {soldCategories.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="text-xl font-bold text-center mb-2">
                Tổng Doanh Thu Theo Loại
              </h2>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={revenueCategories}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                  >
                    {revenueCategories.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index+2 % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => value.toLocaleString() }VNĐ />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
