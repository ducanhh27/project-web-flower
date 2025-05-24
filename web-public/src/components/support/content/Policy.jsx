import React from 'react'

const Policy = () => {
  return (
       <div class="Content-alignedMid">
        <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
            <h1 class="text-2xl font-bold text-green-600 mb-4">Chính sách đổi hàng</h1>
            <p class="mb-4">Khách hàng vui lòng kiểm tra kỹ Sản phẩm trước khi giao nhận thành công.</p>
            <p class="mb-4">Hình ảnh sản phẩm sẽ được đính kèm vào Phiếu Giao hàng và khách hàng được yêu cầu xác minh đã nhận và kiểm tra chất lượng...</p>
            <p class="font-semibold">Liên hệ:</p>
            <p>Số điện thoại: <span class="text-blue-600 font-semibold">0123 456 789</span></p>
            <p>Email: <span class="text-blue-600 font-semibold">ducstudyandwork@gmail.com</span></p>

            <h2 class="text-2xl font-bold text-green-600 mt-6 mb-4">Cách thức hoàn tiền</h2>
            <p class="mb-4">Nếu quý khách không hài lòng với sản phẩm, vui lòng liên hệ Call Center <span class="text-blue-600 font-semibold">18001234</span> để được tư vấn.</p>

            <h3 class="text-xl font-semibold text-gray-700 mt-4">Mức độ hoàn tiền</h3>
            <p class="mb-4">Tùy theo từng trường hợp cụ thể mà chúng tôi sẽ có giải pháp đền bù một phần hoặc toàn bộ giá trị của đơn hàng.</p>

            <h3 class="text-xl font-semibold text-gray-700 mt-4">Thủ tục hoàn tiền</h3>
            <ul class="list-disc ml-6 mb-4">
                <li>Chứng minh là chủ sở hữu của đơn hàng</li>
                <li>Gửi thông tin khiếu nại trong vòng 24h</li>
                <li>Bồi hoàn qua voucher, sản phẩm thay thế hoặc hoàn tiền trực tiếp</li>
            </ul>

            <h3 class="text-xl font-semibold text-gray-700 mt-4">Thời gian và hình thức bồi hoàn</h3>
            <table class="w-full border-collapse border border-gray-300 mt-4">
                <thead>
                    <tr class="bg-gray-200">
                        <th class="border border-gray-300 p-2">Hình thức bồi hoàn</th>
                        <th class="border border-gray-300 p-2">Thời gian thực hiện (ngày)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="border border-gray-300 p-2">Tặng voucher điện tử</td>
                        <td class="border border-gray-300 p-2 text-center">1</td>
                    </tr>
                    <tr>
                        <td class="border border-gray-300 p-2">Tặng sản phẩm thay thế</td>
                        <td class="border border-gray-300 p-2 text-center">1</td>
                    </tr>
                    <tr>
                        <td class="border border-gray-300 p-2">Hoàn tiền vào tài khoản</td>
                        <td class="border border-gray-300 p-2 text-center">1 - 14</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

  )
}

export default Policy
