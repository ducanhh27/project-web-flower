import React from 'react'
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import CallIcon from '@mui/icons-material/Call';
import { Link } from 'react-router-dom';
import { animateScroll } from 'react-scroll';
const Botcontent = () => {
 
    const handleClick = () => {
      animateScroll.scrollToTop();
    }
  return (
    <div className="mt-10">
      <div className="border-top-dashed"></div>
      <div className="flex Content-alignedMid">
        <div className="mb-10"> 
            <img className='w-80 h-28'  src="/src/assets/image/leftFootLogo.jpg" alt="" />
            <div className="text-[25px] font-semibold mt-4 mb-2"> 
            Công ty TNHH Thang Long Farm
            </div>
            <div className='text-[14px]'>
                <p>Dalat Hasfarm - Được biết đến là công ty tiên phong mở đầu cho việc</p>
                <p>trồng hoa chuyên nghiệp tại Việt Nam được thành lập từ năm 2024.</p>
                <p>Năm 2025 Dalat Hasfarm được tạp chí Flowers Tech có trụ sở tại Nghiêm Xuân Yêm</p>
                <p>chọn là công ty hoa tươi lớn nhất Đông Nam Á.</p>
                <p>- Địa chỉ trụ sở: Nghiêm Xuân Yêm, Đại Kim, Hoàng Mai, Hà Nội</p>
                <p>- Giấy chứng nhận Đăng ký Doanh nghiệp số 5800000167 do</p>
                <p>Sở Kế hoạch và Đầu tư Tỉnh Lâm Đồng cấp ngày 1/1/2025</p>
            </div>
        </div>
        <div className="flex flex-col gap-5 text-[14px] ">
            <strong>WEBSHOP</strong>
            <Link to={"/"} onClick={handleClick} ><p>Trang chủ</p></Link>
            <p>Cẩm nang</p>
            <p>Khuyến mãi</p>
        </div>
        <div className="flex flex-col gap-5  text-[14px]">
            <strong>Thông tin</strong>
            <p>Giới thiệu Thang Long Farm</p>
            <p>Shop Thang Long Farm</p>
            <p>Chính sách bảo mật</p>
            <p>Hướng dẫn mua hàng</p>
            <p>Điều khoản sử dụng</p>
        </div>
        <div className="flex flex-col gap-5  text-[14px]">
            <strong>Liên hệ</strong>
            <div className='flex gap-3'><MailOutlineIcon/> 
              <div>Email Đặt Hàng : 
                <p>muahangnhantoi@gmail.com</p>
              </div>
            </div>
            <div className='flex gap-3'><CallIcon />Hotline : 19001001</div>
            <Link to={"/"} onClick={handleClick} ><img className='w-44 h-44 relative bottom-5' src="/src/assets/image/logfoot.webp" alt="" /></Link>
        </div>

      </div>
      {/* <div className="border-top-dashed"></div> */}
      <div className="bg-zinc-200 text-[12px] flex items-center justify-center py-8 mt-4">
        © 2020 Dalathasfarm. All rights reserved.
      </div>
    </div>
  )
}

export default Botcontent

