import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  TablePagination,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Grid,
  IconButton,
  Box,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { toast } from "react-toastify";

const Product = () => {

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({});
  const [thumbnailPreview, setthumbnailPreview] = useState();
  const [imagesPreview, setimagesPreview] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [categoriesFilter, setcategoriesFilter] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openFilterMenu, setOpenFilterMenu] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [openCategory,setOpenCategory ] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    categories: "",
    stockQuantity: "",
    price: "",
    thumbnail: "",
    images: [],
    sold: 0,
  });

  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:3000/products");
    const data = res.data;

    // Chuyển đổi dữ liệu sản phẩm
    const convertedProducts = data.map((product) => ({
      id: product._id,
      name: product.name,
      categories: categories[product.categories] || "Unknown", // Chuyển ID thành tên categories
      stockQuantity: product.stockQuantity || "Hết", // Set stock mặc định
      price: product.price,
      thumbnail: product.thumbnail, // Ảnh thumbnail
      images: product.images, // Các ảnh chi tiết
      sold: product.sold || 0, // Mặc định số lượng đã bán là 0
    }));

    setProducts(convertedProducts); // Cập nhật sản phẩm vào state
  };
  const fetchCategories = async () => {
    const res = await axios.get("http://localhost:3000/categories");
    const categoriesData = res.data;

    // Tạo một object ánh xạ từ categories ID sang tên categories
    const categoriesMap = categoriesData.reduce((acc, categories) => {
      acc[categories._id] = categories.name; // Lưu id danh mục và tên vào object
      return acc;
    }, {});
    setCategories(categoriesMap); // Lưu danh sách danh mục vào state
  };
  useEffect(() => {
    fetchCategories();
  }, []);
  useEffect(() => {
    if (Object.keys(categories).length > 0) {
      console.log(products)
      fetchProducts(); // Sau khi danh mục đã sẵn sàng, mới lấy sản phẩm
    }
  }, [categories]);

  console.log(categories,"category")
  // hàm thêm ảnh chi tiết
  const handleDetailImageChange = (e) => {
    const files = e.target.files; // Lấy tất cả các file đã chọn
    const newImages = [...newProduct.images];  // Sao chép mảng ảnh cũ
    
    // Duyệt qua các file đã chọn và thêm vào mảng images
    for (let i = 0; i < files.length; i++) {
      if (newImages.length < 10) { // Giới hạn tối đa là 10 ảnh
        newImages.push(files[i]); // Thêm file ảnh vào mảng images của sản phẩm
      }
    }
  
    // Cập nhật lại state newProduct với mảng images mới
    setNewProduct({
      ...newProduct,
      images: newImages,
    });
  
    // Tạo URL tạm thời cho việc xem trước ảnh
    const previewImages = Array.from(files).map((file) => URL.createObjectURL(file));
    // Cập nhật state imagesPreview để hiển thị ảnh đã chọn
    setimagesPreview((prev) => [...prev, ...previewImages]);
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Lấy file ảnh đầu tiên mà người dùng đã chọn
    if (file) {
      setNewProduct({
        ...newProduct,
        thumbnail: file, // Lưu trữ file gốc vào state
      });

      // Tạo URL tạm thời để hiển thị ảnh trong giao diện người dùng
      const imageUrl = URL.createObjectURL(file);
      setthumbnailPreview(imageUrl); // Giả sử bạn dùng một state khác để lưu URL tạm thời
    }
  };

  const handleRemoveImage = (index) => {
     // Cập nhật lại newProduct.images sau khi xóa
  const updatedImages = newProduct.images.filter((_, index) => index !== imageIndex);
  setNewProduct(prevProduct => ({
    ...prevProduct,
    images: updatedImages
  }));
    setimagesPreview(updatedImagesPreview);
    console.log(newProduct,"remove")
  };
  
  const handleSelectAll = (event) => {
    const visibleProducts = filteredProducts.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
    if (event.target.checked) {
      setSelected(visibleProducts.map((p) => p.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelect = (id) => {
    setSelected((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id]
    );
  };
  console.log(thumbnailPreview,"test")
  const handleModify = async (product) =>{
    try {
        // Gửi yêu cầu lấy thông tin sản phẩm
        const response = await axios.get(`http://localhost:3000/products/${product.id}`);
        setEditingProduct(response.data); // Lưu thông tin sản phẩm đang chỉnh sửa
        setNewProduct(response.data); // Đặt giá trị form theo thông tin sản phẩm
        setOpenAddDialog(true); // Mở dialog chỉnh sửa
        setthumbnailPreview(response.data.thumbnail)
        setimagesPreview(response.data.images)
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };
    console.log(newProduct,"new")

  //Xóa sản phẩm
  const handleOpenConfirm = (id) => {
    setDeleteId(id);
    setOpenConfirm(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
  
    try {
      await axios.delete(`http://localhost:3000/products/${deleteId}`);
      // Chờ cập nhật danh sách sản phẩm
      await fetchProducts(); 
      setDeleteId(null);
      setOpenConfirm(false); 
      toast.success("Xóa sản phẩm thành công!", { position: "top-right" });
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      toast.error(error.response?.data?.message || "Xóa sản phẩm thất bại!", { position: "top-right" });
    }
  };
  

  const handleAddCategory = async () =>{
    const res = await axios.post("http://localhost:3000/categories",{
      name:newCategory
    })

    setCategories((prev) => ({
      ...prev,
      [res.data._id]: res.data.name, //// Thêm/cập nhật một mục mới với key là `_id` và value là `name`
    }));

    setOpenCategory(false)
  }
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (images) => {
    setSelectedImages(images);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedImages([]);
  };

  // Functions for handling the add product dialog
  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setNewProduct({
      name: "",
      categories: "",
      stockQuantity: "",
      price: "",
      image: "",
      images: [],
      sold: 0,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddProduct = async () => {
    setLoading(true); // Bật trạng thái loading
  
    if (
      !newProduct.name ||
      !newProduct.categories ||
      !newProduct.stockQuantity ||
      !newProduct.price ||
      !newProduct.thumbnail
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin sản phẩm!", {
        position: "top-right",
        autoClose: 3000,
      });
      setLoading(false); // Tắt loading nếu có lỗi
      return;
    }
  
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("categories", newProduct.categories);
    formData.append("stockQuantity", newProduct.stockQuantity);
    formData.append("price", newProduct.price);
  
    if (newProduct.thumbnail) {
      formData.append("thumbnail", newProduct.thumbnail);
    }
  
    if (newProduct.images && newProduct.images.length > 0) {
      for (const image of newProduct.images) {
        if (image instanceof File) {
          formData.append("images", image);
        } else if (typeof image === "string" && image.startsWith("http")) {
          formData.append("imagesString", image);
        }
      }
    }
  
    const apiUrl = editingProduct
      ? `http://localhost:3000/products/${editingProduct._id}`
      : "http://localhost:3000/products/create";
  
    const method = editingProduct ? "patch" : "post";
  
    try {
      const response = await axios({
        method,
        url: apiUrl,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      toast.success(
        editingProduct
          ? "Sản phẩm đã được sửa thành công!"
          : "Sản phẩm đã được thêm thành công!",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
  
      if (editingProduct) {
        setProducts((prev) =>
          prev.map((product) =>
            product._id === response.data._id ? response.data : product
          )
        );
        setNewProduct(response.data);
      } else {
        setProducts((prev) => [...prev, response.data]);
      }
  
      fetchProducts();
      handleCloseAddDialog();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Đã có lỗi xảy ra khi thêm/sửa sản phẩm!";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
      console.error(error);
    } finally {
      setLoading(false); // Đảm bảo tắt loading dù có lỗi hay không
    }
  };
  


  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) &&
      (categoriesFilter ? product.categories === categoriesFilter : true)
  );
  return (
    <div>
      <h1 className="text-[25px] mb-10 font-semibold ital">Quản lý sản phẩm</h1>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "10px",
          mb: "10px",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: "10px",
            flexGrow: 1,
            flexDirection: "row",
          }}
        >
          <TextField
            label="Tìm kiếm"
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Danh mục</InputLabel>
              <Select
                value={categoriesFilter}
                onChange={(e) => setcategoriesFilter(e.target.value)}
                label="Danh mục"
              >
                {/* Item "Tất cả danh mục" */}
                <MenuItem value="">Tất cả danh mục</MenuItem>

                {Object.entries(categories).map(([key, value]) => (
                  <MenuItem key={key} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
        </Box>

        <Button
          variant="contained"
          color="success"
          size={"small"}
          onClick={handleOpenAddDialog}
          startIcon={<AddIcon />}
        >
          Thêm sản phẩm
        </Button>
      </Box>

      {/* Filter dropdown for mobile */}
      {openFilterMenu && (
        <Box sx={{ mb: 2 }}>
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Danh mục</InputLabel>
            <Select
              value={categoriesFilter}
              onChange={(e) => setcategoriesFilter(e.target.value)}
              label="Danh mục"
            >
              <MenuItem value="">Tất cả danh mục</MenuItem>
              <MenuItem value="Laptop">Laptop</MenuItem>
              <MenuItem value="Laptop PC">Laptop PC</MenuItem>
              <MenuItem value="Accessories">Accessories</MenuItem>
              <MenuItem value="Phone">Phone</MenuItem>
              <MenuItem value="Wearables">Wearables</MenuItem>
            </Select>
          </FormControl>
        </Box>
      )}

     
      { (
        <TableContainer component={Paper}>
          <Table size={ "medium"}>
            <TableHead>
              <TableRow>
                
                <TableCell >Ảnh</TableCell>
                <TableCell>Tên sản phẩm</TableCell>
                { <TableCell>Danh mục</TableCell>}
                <TableCell align="right">Số lượng</TableCell>
                <TableCell align="right">Giá</TableCell>
                {<TableCell align="right">Đã bán</TableCell>}
                <TableCell align="center">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((product) => (
                  <TableRow key={product.id}>
                   
                    <TableCell align="left">
                      <img
                        src={product.thumbnail}
                        alt={product.name}
                        width={ "105"}
                        height={ "100"}
                        onClick={() => handleOpenDialog(product.images)}
                        style={{ cursor: "pointer" }}
                      />
                    </TableCell>
                    <TableCell>{product.name}</TableCell>
                    { <TableCell>{product.categories}</TableCell>}
                    <TableCell align="right">{product.stockQuantity}</TableCell>
                    <TableCell align="right">{product.price}</TableCell>
                    { (
                      <TableCell align="right">{product.sold}</TableCell>
                    )}
                    <TableCell align="center">
                        <>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            style={{ marginRight: "8px" }}
                            onClick={() => handleModify(product)}
                          >
                            Sửa
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                             onClick={() => handleOpenConfirm(product.id)}
                          >
                            Xóa
                          </Button>
                        </>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <TablePagination
        rowsPerPageOptions={[5, 10]}
        component="div"
        count={filteredProducts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={ "Số SP:"}
      />

      {/* Dialog for showing product detail images */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
      >
        <DialogTitle>Ảnh chi tiết</DialogTitle>
        <DialogContent>
          {selectedImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt="Detail"
              style={{
                width: "100%",
                marginBottom: "10px",
                maxHeight: "500px",
                objectFit: "contain",
              }}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for adding a new product */}
      {editingProduct ? (<Dialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Thêm sản phẩm mới</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="name"
                label="Tên sản phẩm"
                fullWidth
                value={newProduct.name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Danh mục</InputLabel>
                <Select
                  name="categories"
                  value={newProduct.categories}
                  onChange={handleInputChange}
                  label="Danh mục"
                >
                  {Object.entries(categories).map(([key, value]) => (
                    <MenuItem key={key} value={key}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="stockQuantity"
                label="Số lượng hàng còn"
                fullWidth
                type="number"
                value={newProduct.stockQuantity}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="price"
                label="Giá"
                fullWidth
                type="number"
                value={newProduct.price}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              {/* Chọn file */}
              <input
                type="file"
                accept="image/*" // Chỉ chọn ảnh
                id="file-upload"
                style={{ display: "none" }} // Ẩn input mặc định
                onChange={handleImageChange}
              />
              <label htmlFor="file-upload">
                <Button variant="contained" component="span" color="primary">
                  Chọn ảnh chính
                </Button>
              </label>
            </Grid>
            {/* Hiển thị file */}
            {newProduct.thumbnail && (
              <Grid
                item
                xs={12}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src={thumbnailPreview}
                  alt="Preview"
                  className="w-96 h-96"
                />
              </Grid>
            )}
            {/* Xử lý ảnh chi tiết */}
            <Grid item xs={12} container>
  {/* Hiển thị nút chọn ảnh */}
  {newProduct.images.length < 10 && (
    <Grid item xs={12}>
      <Button
        variant="contained"
        color="primary"
        component="label"
        style={{ marginTop: "20px" }}
      >
        Chọn ảnh chi tiết
        <input
          type="file"
          accept="image/*"
          multiple // Cho phép chọn nhiều ảnh
          onChange={handleDetailImageChange}
          style={{ display: "none" }} // Ẩn input file
        />
      </Button>
    </Grid>
  )}

  {/* Hiển thị tất cả các ảnh đã chọn */}
  {newProduct.images.map((image, index) => (
    <Grid item key={index} xs={2.4}>
      <div style={{ position: "relative" }}>
        {/* Dấu "X" để xóa ảnh */}
        <span
          style={{
            position: "absolute",
            top: "5px",
            right: "5px",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            color: "white",
            borderRadius: "50%",
            cursor: "pointer",
            padding: "5px",
            zIndex: 10,
          }}
          onClick={() => handleRemoveImage(index)} // Gọi hàm xóa ảnh
        >
          X
        </span>

        {/* Ảnh hiển thị */}
        {image && (
          <img
            src={imagesPreview[index]} // Đảm bảo bạn đang sử dụng ảnh xem trước
            alt={`Detail Image ${index + 1}`}
            className="w-40 h-40 m-2"
            style={{
              marginBottom: "10px",
              display: "block",
              width: "100%",
              height: "100%",
            }}
          />
        )}
      </div>
    </Grid>
  ))}
</Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog} color="error">
            Hủy
          </Button>
          <Button
            onClick={handleAddProduct}
            color="primary"
            variant="contained"
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>)
      
      : (<Dialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Thêm sản phẩm mới</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="name"
                label="Tên sản phẩm"
                fullWidth
                value={newProduct.name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Danh mục</InputLabel>
                <Select
                  name="categories"
                  value={newProduct.categories}
                  onChange={handleInputChange}
                  label="Danh mục"
                >
                  {Object.entries(categories).map(([key, value]) => (
                    <MenuItem key={key} value={key}>
                      {value}
                    </MenuItem>
                  ))}
                  <MenuItem onClick={() => setOpenCategory(true)} style={{ color: "blue" }}>
                  ➕ Thêm thể loại mới
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="stockQuantity"
                label="Số lượng hàng còn"
                fullWidth
                type="number"
                value={newProduct.stockQuantity}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="price"
                label="Giá"
                fullWidth
                type="number"
                value={newProduct.price}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              {/* Chọn file */}
              <input
                type="file"
                accept="image/*" // Chỉ chọn ảnh
                id="file-upload"
                style={{ display: "none" }} // Ẩn input mặc định
                onChange={handleImageChange}
              />
              <label htmlFor="file-upload">
                <Button variant="contained" component="span" color="primary">
                  Chọn ảnh chính
                </Button>
              </label>
            </Grid>
            {/* Hiển thị file */}
            {newProduct.thumbnail && (
              <Grid
                item
                xs={12}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src={thumbnailPreview}
                  alt="Preview"
                  className="w-96 h-96"
                />
              </Grid>
            )}
            {/* Xử lý ảnh chi tiết */}
            <Grid item xs={12} container>
              {/* Hiển thị nút chọn ảnh */}
              {newProduct.images.length < 10 && (
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    component="label"
                    style={{ marginTop: "20px" }}
                  >
                    Chọn ảnh chi tiết
                    <input
                      type="file"
                      accept="image/*"
                      multiple // Cho phép chọn nhiều ảnh
                      onChange={handleDetailImageChange}
                      style={{ display: "none" }} // Ẩn input file
                    />
                  </Button>
                </Grid>
              )}
              {/* Hiển thị tất cả các ảnh đã chọn */}
              {newProduct.images.map((image, index) => (
                <Grid item key={index} xs={2.4}>
                  {" "}
                  {/* xs={4} để mỗi ảnh chiếm 1/3 chiều rộng */}
                  <div>
                    {/* Chỉ hiển thị ảnh khi đã có ảnh */}
                    {image && (
                      <img
                        src={imagesPreview[index]}
                        alt={`Detail Image ${index + 1}`}
                        className="w-40 h-40 m-2"
                        style={{
                          marginBottom: "10px",
                          display: "block",
                        }}
                      />
                    )}
                  </div>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog} color="error">
            Hủy
          </Button>
          <Button
            onClick={handleAddProduct}
            color="primary"
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Thêm"}

          </Button>
        </DialogActions>
      </Dialog>) }
      {/* Dialog để nhập danh mục mới */}
      <Dialog open={openCategory} onClose={() => setOpenCategory(false)}>
        <DialogTitle>Thêm thể loại mới</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Tên thể loại"
            fullWidth
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCategory(false)}>Hủy</Button>
          <Button onClick={handleAddCategory} color="primary">
            Thêm
          </Button>
        </DialogActions>
      </Dialog>
        {/* Dialog xóa */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
              <DialogTitle>Xác nhận xóa</DialogTitle>
              <DialogContent>
                <p>Bạn có chắc chắn muốn xóa sản phẩm này không?</p>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenConfirm(false)}>Hủy</Button>
                <Button onClick={handleDelete} color="error">
                  Xóa
                </Button>
              </DialogActions>
            </Dialog>
    </div>
  );
};
export default Product;
