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

const Categories = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoriesNew, setCategoriesNew] = useState("");
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [categoriesEdit, setCategoriesEdit] = useState("");
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  // Lấy danh sách thể loại
  const getCategories = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/categories/statistics"
      );
      setCategories(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh mục:", error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  // Thêm thể loại mới
  const handleAddCategory = async () => {
    if (!categoriesNew.trim()) return;
    try {
      const res = await axios.post(
        "http://localhost:3000/categories",
        { name: categoriesNew },
        { headers: { "Content-Type": "application/json" } }
      );
      const newCategory = {
        categoryId:res.data._id,
        categoryName: res.data.name, // Giả sử API chỉ trả về 'name'
        stockQuantity: res.data.stockQuantity ?? 0, // Nếu không có, set mặc định là 0
        totalSold: res.data.totalSold ?? 0, // Nếu không có, set mặc định là 0
      };
      setCategories((prev) => [...prev, newCategory]); // Cập nhật danh sách
      setCategoriesNew("");
      setOpenAddDialog(false);
    } catch (error) {
      console.error("Lỗi khi thêm thể loại:", error);
    }
  };
  //Xóa sản phẩm
  const handleOpenConfirm = (id) => {
    setDeleteId(id);
    setOpenConfirm(true);
  };
  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    await axios.delete(`http://localhost:3000/categories/${deleteId}`);
    setCategories((prev) =>
      prev.filter((category) => category.categoryId !== deleteId)
    );
    setDeleteId(null);
    setOpenConfirm(false); 
  };
 console.log(deleteId,"id đây")
  //Sửa sản phẩm
  const handleEditCategory = async () => {};
  // Lọc danh mục theo từ khóa tìm kiếm
  const filteredCategories = Array.isArray(categories)
    ? categories.filter(
        (category) =>
          category?.categoryName &&
          category.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];
  const sortedCategories = [...filteredCategories].sort((a, b) =>
    a.categoryName === "Chưa xác định"
      ? 1
      : b.categoryName === "Chưa xác định"
      ? -1
      : 0
  );
  console.log(filteredCategories, "đây");
  return (
    <div>
      <h1 className="text-[25px] mb-5 font-semibold ital">Quản lý danh mục</h1>
      <div className="items-center flex justify-between">
        {/* Ô tìm kiếm */}
        <TextField
          label="Tìm kiếm danh mục"
          variant="outlined"
          size="small"
          margin="normal"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          variant="contained"
          color="success"
          size="small"
          onClick={() => setOpenAddDialog(true)}
          startIcon={<AddIcon />}
        >
          Thêm danh mục
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table size="medium">
          <TableHead>
            <TableRow>
              <TableCell align="left" sx={{ px: 2, fontWeight: "bold" }}>
                Tên danh mục
              </TableCell>
              <TableCell align="left" sx={{ px: 2, fontWeight: "bold" }}>
                Số lượng
                <p>sản phẩm</p>
              </TableCell>
              <TableCell align="right" sx={{ px: 2, fontWeight: "bold" }}>
                Đã bán
              </TableCell>
              <TableCell align="center" sx={{ px: 2, fontWeight: "bold" }}>
                Hành động
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedCategories.length > 0 ? (
              sortedCategories.map((category) => (
                <TableRow key={category.categoryId || Math.random()}>
                  <TableCell align="left" sx={{ px: 2 }}>
                    {category.categoryName || "Không xác định"}
                  </TableCell>
                  <TableCell align="left" sx={{ px: 4 }}>
                    {category.stockQuantity ?? 0}
                  </TableCell>
                  <TableCell align="right" sx={{ px: 3 }}>
                    {category.totalSold ?? 0}
                  </TableCell>
                  <TableCell align="center" sx={{ px: 2 }}>
                    {category.categoryName !== "Chưa xác định" && ( // Ẩn nếu là "Uncategorized"
                      <>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => setOpenAddDialog(true)}
                        >
                          Sửa
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          sx={{ ml: 1 }}
                          onClick={() => handleOpenConfirm(category.categoryId)}
                        >
                          Xóa
                        </Button>
                      </>
                    )}
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

      {/* Dialog thêm thể loại */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>Thêm thể loại mới</DialogTitle>
        <DialogContent>
          <TextField
            value={categoriesNew}
            autoFocus
            margin="dense"
            label="Tên thể loại"
            fullWidth
            onChange={(e) => setCategoriesNew(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Hủy</Button>
          <Button onClick={handleAddCategory} color="primary">
            Thêm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog sửa thể loại */}
      <Dialog open={openEditDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>Sửa thể loại mới</DialogTitle>
        <DialogContent>
          <TextField
            value={categoriesEdit}
            autoFocus
            margin="dense"
            label="Tên thể loại"
            fullWidth
            onChange={(e) => setCategoriesEdit(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Hủy</Button>
          <Button onClick={handleEditCategory} color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
        {/* Dialog xóa */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <p>Bạn có chắc chắn muốn xóa thể loại này không?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Hủy</Button>
          <Button onClick={handleConfirmDelete} color="error">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Categories;
