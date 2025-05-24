import React from 'react'

const DetailProductPay = ({item}) => {
    const {thumbnail, price, quantity, name} = item
  return (
    <div className="flex gap-5 border-b-2 mb-5 font-sans">
        <div className='fex flex-col text-center'>
            <img className='w-36' src={thumbnail} alt="" />
            
        </div>
        <div className='flex flex-col gap-3'>
            <p className='w-32 text-left'>{name}</p>
            <p>Số lượng : {quantity}</p>
            <p>Thành tiền : {Number(price*quantity || 0).toLocaleString('vi-VN')}đ</p>
        </div>
    </div>
  )
}

export default DetailProductPay
