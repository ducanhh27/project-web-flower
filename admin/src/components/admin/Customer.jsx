import { useEffect, useState } from "react";
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";

const Customer = () => {
  const [infoUser,setInfoUser] = useState([])
  const getCategories = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/auth/users-with-total-paid"
      );
  setInfoUser(res.data)
  console.log(res.data,"Dữ liệu ở đây")
    } catch (error) {
      console.error("Lỗi khi lấy danh mục:", error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  // Thêm thể loại mới
 
  return (
    <div>
      <h1 className="text-[25px] mb-20 font-semibold ital">Quản lý khách hàng</h1>

      <TableContainer component={Paper}>
        <Table size="medium">
          <TableHead>
            <TableRow>
              <TableCell align="left" sx={{ px: 2, fontWeight: "bold" }}>
                Tên khách hàng
              </TableCell>
              <TableCell align="left" sx={{ px: 2, fontWeight: "bold" }}>
                Email
              </TableCell>
              <TableCell align="left" sx={{ px: 2, fontWeight: "bold" }}>
                Địa chỉ
              </TableCell>
              <TableCell align="center"   sx={{ px: 2, fontWeight: "bold" }}>
                SĐT
              </TableCell>
              <TableCell align="center" sx={{ px: 2, fontWeight: "bold" }}>
                Tổng đơn hàng đã mua
              </TableCell>
              <TableCell align="center" sx={{ px: 2, fontWeight: "bold" }}>
                Tổng số tiền đã mua
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {infoUser.length > 0 ? (
              infoUser.map((info) => (
                <TableRow >
                  <TableCell align="left" sx={{ px: 2 }}>
                    {info.name || "Không xác định"}
                  </TableCell>
                  <TableCell align="left" >
                    {info.email ?? 0}
                  </TableCell>
                  <TableCell align="left" >
                    {info.address ?? "Chưa thêm địa chỉ"}
                  </TableCell>
                  <TableCell align="right"  >
                    {info.phone ?? "Chưa thêm SĐT"}
                  </TableCell>
                  <TableCell align="center" sx={{ px: 2 }}>
                    {info.totalOrders}
                  </TableCell>
                  <TableCell align="center" sx={{ px: 2 }}>
                    {info.totalPaid ?? "Chưa mua hàng"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      
    </div>
  );
};

export default Customer;
