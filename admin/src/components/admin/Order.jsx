import {
  Button,
  FormControl,
  InputLabel,
  Menu,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { useState, useEffect } from "react";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingOrder, setEditingOrder] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("Tất cả");
  const [sortOption, setSortOption] = useState("date_desc");

  const deliveryOptions = [
    "Tất cả",
    "Chưa giao hàng",
    "Đang giao hàng",
    "Đã giao hàng",
    "Hủy đơn hàng",
  ];

  useEffect(() => {
    getOrder();
  }, []);

  const getOrder = async () => {
    const res = await axios.get("http://localhost:3000/orders");
    setOrders(res.data);
  };

  const handleEdit = (order) => {
    setEditingOrder({ ...order });
  };

  const handleSaveStatus = async () => {
    if (editingOrder) {
      await axios.patch(
        `http://localhost:3000/orders/${editingOrder._id}/delivery-status`,
        {
          deliveryStatus: editingOrder.deliveryStatus,
        }
      );

      setOrders((prev) =>
        prev.map((order) =>
          order._id === editingOrder._id
            ? { ...order, deliveryStatus: editingOrder.deliveryStatus }
            : order
        )
      );
      setEditingOrder(null);
      // }
    }
  };

  const handleClose = (newStatus) => {
    setEditingOrder((prev) => ({ ...prev, deliveryStatus: newStatus }));
    setAnchorEl(null);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const orderPriority = {
    "Chưa giao hàng": 1,
    "Đang giao hàng": 2,
    "Đã giao hàng": 3,
    "Hủy đơn hàng": 4,
  };

  //Tìm kiếm, lọc,sắp xếp
  const filteredAndSortedOrders = orders
    .filter(
      (order) =>
        (selectedStatus === "Tất cả" ||
          order.deliveryStatus === selectedStatus) &&
        (order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          searchTerm === "")
    )
    .sort((a, b) => {
      if (sortOption === "date_asc") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortOption === "date_desc") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortOption === "status") {
        return (
          (orderPriority[a.deliveryStatus] || 5) -
          (orderPriority[b.deliveryStatus] || 5)
        );
      }
      return 0;
    });

  console.log(editingOrder, "editingOrder");
  return (
    <div>
      <h1 className="text-[25px] mb-5 font-semibold ital">Quản lý đơn hàng</h1>
      {/* Thanh tìm kiếm */}
      <div className="flex items-center gap-4">
        {/* Thanh tìm kiếm */}
        <TextField
          label="Tìm kiếm đơn hàng"
          variant="outlined"
          size="small"
          margin="normal"
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Lọc theo trạng thái đơn hàng */}
        <FormControl variant="outlined" size="small" style={{ minWidth: 200, marginTop: '5px'}}>
          <InputLabel>Trạng thái đơn hàng</InputLabel>
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            label="Trạng thái đơn hàng"
          >
            {deliveryOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Sắp xếp theo ngày hoặc trạng thái */}
        <FormControl variant="outlined" size="small" style={{ minWidth: 200, marginTop: '5px'}}>
          <InputLabel>Sắp xếp theo</InputLabel>
          <Select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            label="Sắp xếp theo"
          >
            <MenuItem value="date_asc">Ngày đặt hàng (Cũ → Mới)</MenuItem>
            <MenuItem value="date_desc">Ngày đặt hàng (Mới → Cũ)</MenuItem>
            <MenuItem value="status">Trạng thái đơn hàng</MenuItem>
          </Select>
        </FormControl>
      </div>

      <TableContainer component={Paper}>
        <Table size="medium">
          <TableHead>
            <TableRow >
              <TableCell>Mã đơn hàng</TableCell>
              <TableCell>Email khách hàng</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Ngày đặt hàng</TableCell>
              <TableCell>Tổng tiền</TableCell>
              <TableCell>Thanh toán</TableCell>
              <TableCell>Trạng thái thanh toán</TableCell>
              <TableCell>Trạng thái đơn hàng</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAndSortedOrders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order._id}</TableCell>
                <TableCell>{order.email ?? "N/A"}</TableCell>
                <TableCell>{order.phone ?? "N/A"}</TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleString("vi-VN")}
                </TableCell>
                <TableCell>{order.priceOders ?? 0}</TableCell>
                <TableCell>{order.paymentMethod ?? "N/A"}</TableCell>
                <TableCell>{order.status ?? "N/A"}</TableCell>
                <TableCell>
                  {editingOrder && editingOrder._id === order._id ? (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleMenuOpen}
                    >
                      {editingOrder.deliveryStatus ?? "Chưa giao hàng"}
                    </Button>
                  ) : (
                    <span
                      className={
                        order.deliveryStatus === "Chưa giao hàng"
                          ? "text-yellow-500"
                          : order.deliveryStatus === "Đang giao hàng"
                          ? "text-cyan-500"
                          : order.deliveryStatus === "Đã giao hàng"
                          ? "text-green-500"
                          : order.deliveryStatus === "Hủy đơn hàng"
                          ? "text-red-500"
                          : ""
                      }
                    >
                      {order.deliveryStatus ?? "Chưa giao hàng"}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    size="small"
                    disabled={
                      (order.status === "Đã thanh toán" &&
                        order.deliveryStatus === "Đã giao hàng") ||
                      order.deliveryStatus === "Hủy đơn hàng"
                    }
                    onClick={() =>
                      editingOrder && editingOrder._id === order._id
                        ? handleSaveStatus()
                        : handleEdit(order)
                    }
                  >
                    {editingOrder && editingOrder._id === order._id
                      ? "Lưu"
                      : "Cập nhật"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {deliveryOptions.map((option) => (
          <MenuItem key={option} onClick={() => handleClose(option)}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default Order;
