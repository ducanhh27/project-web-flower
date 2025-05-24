import { Button } from '@mui/material'
import React from 'react'
import { useDispatch } from 'react-redux';
import { addToCart } from '../../../../redux-toolkit/feature/CartSlice';
import { Link } from 'react-router-dom';

const InfoProduct = ({product}) => {
    const dispatch=useDispatch();
    const addCart = () => {
           dispatch(
             addToCart({
               productId:product._id,
               quantity: 1,
             })
           )
         };
  return (
    <div className='w-4/5'>
      <h1 className="text-xl md:text-2xl lg:text-2xl font-bold mb-3">{product.name}</h1>
      <p className='font-semibold mb-2'>Sản phẩm bao gồm:</p>
      <p >+Lan Hồ Điệp: 1-5 gốc</p>
      <p className='text-orange-500 italic'>Kiểu dáng và màu sắc chậu có thể thay đổi ở từng khu vực khác nhau, tuy nhiên vẫn đảm bảo kích cỡ chuẩn và tính thẩm mỹ cho sản phẩm.</p>
      <p className='mt-3 mb-5 text-[14px] italic'>Sản phẩm thực nhận có thể khác với hình đại diện trên website (đặc điểm thủ công và tính chất tự nhiên của hàng nông nghiệp)</p>
      <p className='font-semibold text-x md:text-xs lg:text-xl text-red-600 mb-3'> Ưu đãi đặc biệt : </p>
      <ul className='flex flex-col gap-2 text-green-800 ml-4'>
        <li>Tặng banner hoặc thiệp (trị giá 20.000đ - 50.000đ) miễn phí!</li>
        <li>Nhận ngay voucher:  <p className='ml-24 text-orange-600'>5% cho đơn hàng Bạn mua ONLINE lần thứ 1.</p>
                                <p className='ml-24 text-orange-600'>10% cho đơn hàng Bạn mua ONLINE lần thứ 5.</p>
                                <p className='ml-24 text-orange-600'>15% cho đơn hàng Bạn mua ONLINE lần thứ 10.</p></li>
        <li>Giao gấp trong vòng 2 giờ.</li>
        <li>Cam kết hoa tươi trên 3 ngày.</li>
        <li>Cam kết 100% hoàn lại tiền nếu Bạn không hài lòng.</li>
      </ul>
      <div className='text-orange-500 font-bold text-2xl mt-10 ml-20 '>
      Giá bán : {Number(product.price || 0).toLocaleString('vi-VN')}đ / Chậu
      </div>
      <div className='mt-10 flex gap-20 ml-10'>
      <Link to="/cart"><Button onClick={addCart} sx={{ backgroundColor: 'green', color:'white', minWidth: '150px','&:hover': { backgroundColor: 'darkgreen' } }}>Mua ngay</Button></Link>
      <Button onClick={addCart}  sx={{ backgroundColor: 'orange', color:'white', minWidth: '150px', '&:hover': { backgroundColor: 'darkorange' } }}>Thêm vào giỏ</Button>
    </div>
    </div>
  )
}

export default InfoProduct
