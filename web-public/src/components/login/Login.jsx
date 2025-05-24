import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TextField } from '@mui/material';
import { useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setLogin } from '../../redux-toolkit/feature/LoginSlice';
import { fetchCart } from '../../redux-toolkit/feature/CartSlice';
import AuthGoogle from './AuthGoogle';
import { closeResetPasswordDialog } from '../../redux-toolkit/feature/ResetPassword';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Loginnn = () => {
  const [open, setOpen] = useState(false);
  const [openRegister, setOpenRegister] = useState(false); 
  const [usernameLogin, SetUserNameLogin] = useState("");
  const [passwordLogin, setPassword] = useState("");
  const [fullNameRegister,setfullNameRegister]=useState("")
  const [emailRegister,setemailRegister]=useState("")
  const [passwordRegister,setPasswordRegister]=useState("")
  const [userNameRegister,setUserNameRegister]=useState("")
  const [phoneRegister,setPhoneRegister]=useState("");
  const [addressRegister,setAddressRegister]=useState(""); 
  const [emailForget,setEmailForget]=useState("")
  const [openForgetPass, setOpenForgetPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordReset, setPasswordReset] = useState("");
  const[error,setError] = useState()
  const [confirmPasswordReset, setConfirmPasswordReset] = useState("");

  const navigate = useNavigate();

  const resetPassword =useSelector((state) => state.resetPasswordSlice.showResetDialog)
  const tokenResetPass =useSelector((state) => state.resetPasswordSlice.resetToken)
  const dispatch =useDispatch()
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpenForget = () => {
    setOpenForgetPass(true);
  };
  const handleCloseForget = () => {
    setOpenForgetPass(false);
  };
  const handleOpenRegister = () => {
    setOpenRegister(true);
  };
  const handleCloseRegister = () => {
    setOpenRegister(false);
  };

  const handleRequestPassword =  async () =>{
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/auth/forgot-password", {
        email:emailForget
      });
  
      toast.success("Đã gửi yêu cầu cấp lại mật khẩu!", {
        position: "top-right",
        autoClose: 3000, // Tự động đóng sau 3 giây
      });
    } catch (error) {
      setMessage(error.response?.data?.message || "Có lỗi xảy ra!");
    }finally {
      setIsLoading(false);
      setOpenForgetPass(false); 
    }
  }
  const handleResetPassword = async () => {
    if (passwordReset !== confirmPasswordReset) {
      toast.error("Mật khẩu xác thực không khớp!", {
        position: "top-right",
        autoClose: 3000, // Tự động đóng sau 3 giây
      });
      return;
    }
    try {
        const response = await axios.post("http://localhost:3000/auth/reset-password", {
          token:tokenResetPass,
          newPassword: confirmPasswordReset,
        });
        toast.success("Thay đổi mật khẩu thành công!", {
          position: "top-right",
          autoClose: 3000, // Tự động đóng sau 3 giây
        });
        dispatch(closeResetPasswordDialog()); 

      } catch (error) {
        alert(error.response?.data?.message || "Có lỗi xảy ra!");
    }
    
  };
  const handleLogin = async () => {
    // Lấy thông tin từ input
    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        username: usernameLogin,
        password: passwordLogin,
      });
  
      const data = response.data;
      localStorage.setItem('access_token', response.data.accessToken);
      localStorage.setItem('name', response.data.name);
      window.dispatchEvent(new Event("storage"));
      dispatch(setLogin(true))
      dispatch(fetchCart());
      toast.success("Đăng nhập thành công!");
      console.log("Login successful:", data);
      
      handleClose();

    } catch (err) {
      console.error("Error:", err.response ? err.response.data : err.message);
      toast.error(
        <>
          Đăng nhập thất bại! <br />
          Vui lòng kiểm tra lại tài khoản hoặc mật khẩu.
        </>,
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    }
  };

  const handleRegister = async () => {
    // Lấy thông tin từ input
    try {
      const response = await axios.post("http://localhost:3000/auth/signup", {
        name: fullNameRegister,
        email: emailRegister,
        username:userNameRegister,
        password: passwordRegister,
        phone:phoneRegister,
        address:addressRegister,
      });
  
      // Kiểm tra nếu có lỗi
      if (![200, 201].includes(response.status)) {
        throw new Error("Đăng ký thất bại");
      }
    
      const data = response.data;
      console.log("Đăng ký thành công", data);
      toast.success("Đăng ký thành công!");
      handleCloseRegister();
      console.log(open, "open");
    } catch (err) {
      const errorMessage = err.response?.data?.message?.join('\n') || "Thông tin đăng ký thiếu"; 
      setError(errorMessage); // Set thông báo lỗi
      console.error("Error:", err.response ? err.response.data : err.message);
      toast.error(errorMessage); // Hiển thị các lỗi từ BE hoặc thông báo mặc định
    }
  };
  return (
    <React.Fragment>
      <Button
        sx={{ color: "white", textTransform: "none", fontSize: "15px" }}
        onClick={handleClickOpen}
      >
        Đăng nhập
      </Button>

{/* Dialog đăng nhập */}

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        disableScrollLock={true}
      >
        <DialogTitle sx={{ color: "green", fontSize: "25px" }}>
          {"Đăng Nhập"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <TextField
              sx={{
                width: "100%",
                marginTop: "10px",
                "& .MuiInputLabel-root": {
                  color: "grey", // Màu của label khi chưa focus
                },
                "& .MuiOutlinedInput-root": {
                  "& input": {
                    color: "black", // Màu chữ trong input khi không focus
                  },
                  "&:hover fieldset": {
                    borderColor: "green", // Màu viền khi hover
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "orange", // Màu của label khi focus (đổi thành màu đỏ)
                },
              }}
              id="outlined-basic"
              label="Tên tài khoản"
              variant="outlined"
              onChange={(e) =>SetUserNameLogin(e.target.value)}
            />
            <TextField
              sx={{
                width: "100%",
                marginTop: "10px",
                "& .MuiInputLabel-root": {
                  color: "grey", // Màu của label khi chưa focus
                },
                "& .MuiOutlinedInput-root": {
                  "& input": {
                    color: "black", // Màu chữ trong input khi không focus
                  },
                  "&:hover fieldset": {
                    borderColor: "green", // Màu viền khi hover
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "orange", // Màu của label khi focus (đổi thành màu đỏ)
                },
              }}
              id="outlined-basic"
              label="Mật khẩu"
              variant="outlined"
              type="password"
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              onChange={(e) =>setPassword(e.target.value)}
            />
            
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{ justifyContent: "center", flexDirection: "column" }}
        >
          <button className="self-start ml-5 text-orange-500 -mt-5" onClick={()=>{handleOpenForget();handleClose()}}>
            Quên mật khẩu ?
          </button>
          <button onClick={handleLogin} className="border-2 rounded-2xl w-56 p-2 mt-5 px-4 bg-orange-400 text-white ml-5 ">
            Đăng nhập
          </button>
          <div className='mt-1 font-medium'>
            Hoặc
          </div>
            <div className='mt-1'>
            <AuthGoogle />
            </div>
          <div className="mt-3 mb-5">
            Bạn chưa có tài khoản?
            <button onClick={()=>{handleOpenRegister();handleClose()}} className="text-lg text-orange-500">Tạo ngay</button>
          </div>
        </DialogActions>
      </Dialog>

{/* Dialog đăng ký */}
<Dialog
  open={openRegister}
  TransitionComponent={Transition}
  keepMounted
  onClose={handleCloseRegister}
  aria-describedby="alert-dialog-slide-description"
  disableScrollLock={true}
>
  <DialogTitle sx={{ color: "#FF5722", fontSize: "25px", fontWeight: "bold", textAlign: "center" }}>
    Đăng Ký
  </DialogTitle>
  <DialogContent>
    <DialogContentText id="alert-dialog-slide-description">
      {/* Các trường nhập liệu cho Đăng ký */}
      <TextField
        sx={{
          width: "100%",
          marginTop: "15px",
          "& .MuiInputLabel-root": {
            color: "grey",
          },
          "& .MuiOutlinedInput-root": {
            "& input": {
              color: "black",
              padding: "12px 14px", 
            },
            "&:hover fieldset": {
              borderColor: "#FF5722", 
            },
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#FF5722", // Màu của label khi focus
          },
        }}
        id="outlined-basic"
        label="Email "
        variant="outlined"
        onChange={(e) =>setemailRegister(e.target.value)}
      />

      <TextField
        sx={{
          width: "100%",
          marginTop: "15px",
          "& .MuiInputLabel-root": {
            color: "grey",
          },
          "& .MuiOutlinedInput-root": {
            "& input": {
              color: "black",
              padding: "12px 14px", // Thêm padding cho input
            },
            "&:hover fieldset": {
              borderColor: "#FF5722", // Màu viền khi hover
            },
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#FF5722", // Màu của label khi focus
          },
        }}
        id="outlined-basic"
        label="Họ và tên"
        variant="outlined"
        onChange={(e) =>setfullNameRegister(e.target.value)}
      />
      <TextField
        sx={{
          width: "100%",
          marginTop: "15px",
          "& .MuiInputLabel-root": {
            color: "grey",
          },
          "& .MuiOutlinedInput-root": {
            "& input": {
              color: "black",
              padding: "12px 14px", // Thêm padding cho input
            },
            "&:hover fieldset": {
              borderColor: "#FF5722", // Màu viền khi hover
            },
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#FF5722", // Màu của label khi focus
          },
        }}
        id="outlined-basic"
        label="Số điện thoại"
        variant="outlined"
        onChange={(e) =>setPhoneRegister(e.target.value)}
      />
      <TextField
        sx={{
          width: "100%",
          marginTop: "15px",
          "& .MuiInputLabel-root": {
            color: "grey",
          },
          "& .MuiOutlinedInput-root": {
            "& input": {
              color: "black",
              padding: "12px 14px", // Thêm padding cho input
            },
            "&:hover fieldset": {
              borderColor: "#FF5722", // Màu viền khi hover
            },
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#FF5722", // Màu của label khi focus
          },
        }}
        id="outlined-basic"
        label="Địa chỉ"
        variant="outlined"
        onChange={(e) =>setAddressRegister(e.target.value)}
      />
            <TextField
        sx={{
          width: "100%",
          marginTop: "15px",
          "& .MuiInputLabel-root": {
            color: "grey",
          },
          "& .MuiOutlinedInput-root": {
            "& input": {
              color: "black",
              padding: "12px 14px", // Thêm padding cho input
            },
            "&:hover fieldset": {
              borderColor: "#FF5722", // Màu viền khi hover
            },
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#FF5722", // Màu của label khi focus
          },
        }}
        id="outlined-basic"
        label="Tên đăng nhập"
        variant="outlined"
        onChange={(e) =>setUserNameRegister(e.target.value)}
      />
      <TextField
        sx={{
          width: "100%",
          marginTop: "15px",
          "& .MuiInputLabel-root": {
            color: "grey",
          },
          "& .MuiOutlinedInput-root": {
            "& input": {
              color: "black",
              padding: "12px 14px", // Thêm padding cho input
            },
            "&:hover fieldset": {
              borderColor: "#FF5722", // Màu viền khi hover
            },
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#FF5722", // Màu của label khi focus
          },
        }}
        id="outlined-basic"
        label="Mật khẩu"
        variant="outlined"
        type="password"
      />
      <TextField
        sx={{
          width: "100%",
          marginTop: "15px",
          "& .MuiInputLabel-root": {
            color: "grey",
          },
          "& .MuiOutlinedInput-root": {
            "& input": {
              color: "black",
              padding: "12px 14px", // Thêm padding cho input
            },
            "&:hover fieldset": {
              borderColor: "#FF5722", // Màu viền khi hover
            },
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#FF5722", // Màu của label khi focus
          },
        }}
        id="outlined-basic"
        label="Xác nhận mật khẩu"
        variant="outlined"
        type="password"
        onChange={(e) =>setPasswordRegister(e.target.value)}
      />
    </DialogContentText>
  </DialogContent>
  <DialogActions sx={{ justifyContent: "center", flexDirection: "column", paddingBottom: "20px" }}>
    <button onClick={handleRegister}
      className="border-2 rounded-2xl p-2 px-4 bg-orange-400 text-white"
      style={{
        width: "200px",
        fontSize: "16px",
        borderRadius: "12px",
        padding: "10px 20px",
        textTransform: "uppercase",
        fontWeight: "bold",
      }}
    >
      Đăng ký
    </button>
  </DialogActions>
</Dialog>


{/* Dialog quên mật khẩu */}
<Dialog
  open={openForgetPass}
  TransitionComponent={Transition}
  keepMounted
  onClose={handleCloseForget}
  aria-describedby="alert-dialog-slide-description"
  disableScrollLock={true}
  sx={{ width: "500px", maxWidth: "90%", mx: "auto" }} // ✅ Tăng chiều rộng Dialog
>
  <DialogTitle sx={{ color: "green", fontSize: "25px", textAlign: "center" }}>
    {"Quên mật khẩu"}
  </DialogTitle>
  <DialogContent>
    <DialogContentText id="alert-dialog-slide-description">
      <TextField
        sx={{
          width: "100%",
          minWidth: "400px", // ✅ Giữ input không quá nhỏs
          marginTop: "10px",
          "& .MuiInputLabel-root": { color: "grey" },
          "& .MuiOutlinedInput-root": {
            "& input": { color: "black" },
            "&:hover fieldset": { borderColor: "green" },
          },
          "& .MuiInputLabel-root.Mui-focused": { color: "orange" },
        }}
        id="outlined-basic"
        label="Vui lòng nhập email"
        variant="outlined"
        onChange={(e) =>setEmailForget(e.target.value)}
      />
     <div className='flex flex-col text-left mt-5'>
      <p className='text-black text-[15px]'>❓Sau khi yêu cầu được gửi, hãy kiểm tra tin nhắn được gửi đến email của bạn và ấn vào đường link để đặt lại mật khẩu!</p>
      <p className='text-orange-700 font-light italic text-[12px] mt-2'>Lưu ý: Nếu không thấy tin nhắn trong hòm thư vui lòng kiểm tra thư rác.</p>
    </div>
    </DialogContentText>
  </DialogContent>
  <DialogActions sx={{ justifyContent: "center", flexDirection: "column" }}>
    
  <button
  onClick={handleRequestPassword}
  className="border-2 rounded-2xl w-56 p-2 mt-5 px-4 bg-orange-400 text-white text-center flex items-center justify-center"
  disabled={isLoading} // Vô hiệu hóa khi loading
>
  {isLoading ? (
    <>
      <svg
        className="animate-spin h-5 w-5 mr-2 text-white" // Spinner xoay
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0V4a8 8 0 00-8 8h4z"
        ></path>
      </svg>
      Đang xử lý...
    </>
  ) : (
    "Cấp lại"
  )}
</button>

  
  </DialogActions>
</Dialog>

{/* Dialog Đặt lại mật khẩu */}

<Dialog
  open={resetPassword}
  TransitionComponent={Transition}
  keepMounted
  onClose={handleCloseForget}
  aria-describedby="alert-dialog-slide-description"
  disableScrollLock={true}
  sx={{ width: "500px", maxWidth: "90%", mx: "auto" }} // ✅ Tăng chiều rộng Dialog
>
  <DialogTitle sx={{ color: "green", fontSize: "25px", textAlign: "center" }}>
    {"Đặt lại mật khẩu "}
  </DialogTitle>
  <DialogContent>
    <DialogContentText id="alert-dialog-slide-description">
      <TextField
        sx={{
          width: "100%",
          minWidth: "400px", // ✅ Giữ input không quá nhỏs
          marginTop: "10px",
          "& .MuiInputLabel-root": { color: "grey" },
          "& .MuiOutlinedInput-root": {
            "& input": { color: "black" },
            "&:hover fieldset": { borderColor: "green" },
          },
          "& .MuiInputLabel-root.Mui-focused": { color: "orange" },
        }}
        id="outlined-basic"
        label="Nhập mật khẩu mới"
        variant="outlined"
        onChange={(e) =>setPasswordReset(e.target.value)}
      />

    <TextField
        sx={{
          width: "100%",
          minWidth: "400px", // ✅ Giữ input không quá nhỏs
          marginTop: "10px",
          "& .MuiInputLabel-root": { color: "grey" },
          "& .MuiOutlinedInput-root": {
            "& input": { color: "black" },
            "&:hover fieldset": { borderColor: "green" },
          },
          "& .MuiInputLabel-root.Mui-focused": { color: "orange" },
        }}
        id="outlined-basic"
        label="Xác nhận mật khẩu"
        variant="outlined"
        onChange={(e) =>setConfirmPasswordReset(e.target.value)}
      />
     
    </DialogContentText>
  </DialogContent>
  <DialogActions sx={{ justifyContent: "center", flexDirection: "column" }}>
    
  <button
  onClick={handleResetPassword}
  className="border-2 rounded-2xl w-56 p-2 mb-3 mt-5 px-4 bg-orange-400 text-white text-center flex items-center justify-center"
  disabled={isLoading} // Vô hiệu hóa khi loading
  
>
  {isLoading ? (
    <>
      <svg
        className="animate-spin h-5 w-5 mr-2 text-white" // Spinner xoay
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0V4a8 8 0 00-8 8h4z"
        ></path>
      </svg>
      Đang xử lý...
    </>
  ) : (
    "Đặt lại"
  )}
</button>

  
  </DialogActions>
</Dialog>
    </React.Fragment>
  );
}

export default Loginnn
