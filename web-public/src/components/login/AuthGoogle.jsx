import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { fetchCart } from '../../redux-toolkit/feature/CartSlice';
import { setLogin } from '../../redux-toolkit/feature/LoginSlice';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID // Lấy từ Google Cloud Console

const AuthGoogle = () => {
  const dispatch = useDispatch()
  const handleSuccess = async (response) => {
    console.log('Google Login Success:', response);
    // Gửi token Google lên Backend để xác thực
    try {
      const res = await axios.post('http://localhost:3000/auth/google', {
        token: response.credential,
      });

      const data = res.data;
      localStorage.setItem('access_token', data.token);
      localStorage.setItem('name', data.name);
      window.dispatchEvent(new Event('storage'));

      dispatch(setLogin(true));
      dispatch(fetchCart());
      handleClose(); 
    } catch (error) {
      console.error('Lỗi khi gửi token lên Backend:', error);
    }
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.log('Google Login Failed')}
        useOneTap
      />
    </GoogleOAuthProvider>
  );
};

export default AuthGoogle;
