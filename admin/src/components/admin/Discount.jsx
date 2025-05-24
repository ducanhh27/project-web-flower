import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { toast } from "react-toastify";

const Discount = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [coupon, setCoupon] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editCoupon, setEditCoupon] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [code, setCode] = useState("");
  const [type, setType] = useState("amount");
  const [quantity, setQuantity] = useState();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const getCoupon = async () => {
    try {
      const res = await axios.get("http://localhost:3000/coupons");
      setCoupon(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy mã giảm giá:", error);
    }
  };

  useEffect(() => {
    getCoupon();
  }, []);

  const handleSubmit = async () => {
    const numericValue = Number(value);
    if (isNaN(numericValue)) {
      setError("Giá trị phải là số");
      return;
    }

    if (type === "amount" && numericValue <= 0) {
      setError("Giá trị phải lớn hơn 0");
      return;
    }

    if (type === "percentage" && (numericValue < 0 || numericValue > 100)) {
      setError("Giá trị phần trăm phải từ 0 đến 100");
      return;
    }

    setError("");

    try {
      await axios.post("http://localhost:3000/coupons", {
        code,
        type,
        max_usage: Number(quantity),
        discount_value: numericValue,
        is_active: true, 
      });
      getCoupon();
      setOpenAddDialog(false);
      setCode("");
      setType("amount");
      setQuantity(0);
      setValue("");
      toast.success("Thêm mã giảm giá thành công!")
    } catch (err) {
      console.error("Lỗi khi thêm mã giảm giá:", err);
    }
  };

  const handleUpdateCoupon = async () => {
    const numericValue = Number(editCoupon.discount_value);
    if (isNaN(numericValue)) {
      setError("Giá trị phải là số");
      return;
    }

    if (editCoupon.type === "amount" && numericValue <= 0) {
      setError("Giá trị phải lớn hơn 0");
      return;
    }

    if (editCoupon.type === "percentage" && (numericValue < 0 || numericValue > 100)) {
      setError("Giá trị phần trăm phải từ 0 đến 100");
      return;
    }

    setError("");

    try {
      await axios.patch(
        `http://localhost:3000/coupons/${editCoupon._id}`,
        {
          code: editCoupon.code,
          type: editCoupon.type,
          max_usage: editCoupon.max_usage,
          discount_value: numericValue,
          is_active: editCoupon.is_active,
        }
      );
      getCoupon();
      setOpenEditDialog(false);
      setEditCoupon(null);
    } catch (err) {
      console.error("Lỗi khi cập nhật mã giảm giá:", err);
    }
  };

  return (
    <div>
      <h1 className="text-[25px] mb-5 font-semibold ital">Quản lý giảm giá</h1>
      <div className="items-center flex justify-self-end mb-10 mr-2">
  
        <Button
          variant="contained"
          color="success"
          size="small"
          onClick={() => setOpenAddDialog(true)}
          startIcon={<AddIcon />}
        >
          Thêm mã giảm giá
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table size="medium">
          <TableHead>
            <TableRow>
              <TableCell align="left" sx={{ px: 2, fontWeight: "bold" }}>Mã giảm giá</TableCell>
              <TableCell align="left" sx={{ px: 3, fontWeight: "bold" }}>Loại giảm giá</TableCell>
              <TableCell align="left" sx={{ px: 2, fontWeight: "bold" }}>Số lượng</TableCell>
              <TableCell align="right" sx={{ px: 3, fontWeight: "bold" }}>Giá trị</TableCell>
              <TableCell align="right" sx={{ px: 4, fontWeight: "bold" }}>Hoạt động</TableCell>
              <TableCell align="center" sx={{ px: 2, fontWeight: "bold" }}>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {coupon.length > 0 ? (
              coupon.map((coupon) => (
                <TableRow key={coupon._id}>
                  <TableCell align="left" sx={{ px: 2 }}>{coupon.code || "Không xác định"}</TableCell>
                  <TableCell align="left" sx={{ px: 3 }}>
                    {coupon.type === "amount" ? "Giảm giá theo giá trị" : "Giảm giá theo phần trăm"}
                  </TableCell>
                  <TableCell align="left" sx={{ px: 4 }}>{coupon.max_usage ?? 0}</TableCell>
                  <TableCell align="right" sx={{ px: 3 }}>
                    {coupon.type === "amount"
                      ? `${coupon.discount_value.toLocaleString("vi-VN")}₫`
                      : `${coupon.discount_value}%`}
                  </TableCell>
                  <TableCell align="right" sx={{ px: 3 }}>
                    <Typography color={coupon.is_active ? "green" : "red"}>
                      {coupon.is_active ? "Hoạt động" : "Dừng hoạt động"}
                    </Typography>
                  </TableCell>
                  <TableCell align="center" sx={{ px: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => {
                        setEditCoupon(coupon);
                        setOpenEditDialog(true);
                      }}
                    >
                      Sửa
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      sx={{ ml: 1 }}
                      onClick={async () => {
                        try {
                          await axios.delete(`http://localhost:3000/coupons/${coupon._id}`);
                          getCoupon();
                        } catch (err) {
                          console.error("Lỗi khi xóa mã giảm giá:", err);
                        }
                      }}
                    >
                      Xóa
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">Không có dữ liệu</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog Thêm */}
      <Dialog
        PaperProps={{ sx: { width: "500px", maxWidth: "90%" } }}
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
      >
        <DialogTitle>Thêm mã giảm giá</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Mã giảm giá"
            fullWidth
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Loại giảm giá</InputLabel>
            <Select
              value={type}
              label="Loại giảm giá"
              onChange={(e) => setType(e.target.value)}
            >
              <MenuItem value="amount">Giảm giá theo giá trị</MenuItem>
              <MenuItem value="percentage">Giảm giá theo phần trăm</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Số lượng áp dụng"
            fullWidth
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Giá trị"
            fullWidth
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            error={!!error}
            helperText={error}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Hủy</Button>
          <Button color="primary" onClick={handleSubmit}>Thêm</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Sửa */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        PaperProps={{ sx: { width: "500px", maxWidth: "90%" } }}
      >
        <DialogTitle>Chỉnh sửa mã giảm giá</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Mã giảm giá"
            fullWidth
            value={editCoupon?.code || ""}
            onChange={(e) =>
              setEditCoupon((prev) => ({ ...prev, code: e.target.value }))
            }
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Loại giảm giá</InputLabel>
            <Select
              value={editCoupon?.type || ""}
              label="Loại giảm giá"
              onChange={(e) =>
                setEditCoupon((prev) => ({ ...prev, type: e.target.value }))
              }
            >
              <MenuItem value="amount">Giảm giá theo giá trị</MenuItem>
              <MenuItem value="percentage">Giảm giá theo phần trăm</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Số lượng áp dụng"
            fullWidth
            type="number"
            value={editCoupon?.max_usage || ""}
            onChange={(e) =>
              setEditCoupon((prev) => ({ ...prev, max_usage: e.target.value }))
            }
          />
          <TextField
            margin="dense"
            label="Giá trị"
            fullWidth
            type="number"
            value={editCoupon?.discount_value || ""}
            onChange={(e) =>
              setEditCoupon((prev) => ({ ...prev, discount_value: e.target.value }))
            }
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Hoạt động</InputLabel>
            <Select
              value={editCoupon?.is_active || false}
              label="Hoạt động"
              onChange={(e) =>
                setEditCoupon((prev) => ({ ...prev, is_active: e.target.value }))
              }
            >
              <MenuItem value={true}>Hoạt động</MenuItem>
              <MenuItem value={false}>Dừng hoạt động</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Hủy</Button>
          <Button color="primary" onClick={handleUpdateCoupon}>Lưu</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Discount;
