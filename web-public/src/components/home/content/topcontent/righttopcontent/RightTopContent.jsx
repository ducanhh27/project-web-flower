import React from 'react'

const RightTopContent = () => {
  return (
    <div className="RightTopContent w-full">
      <div className="flex">
        <div className="box-item-righttop mr-5 mb-5 border-orange-500">
            <img src="/src/assets/image/itemrighttopcontent.png"  />
            <h4>Cam kết</h4>
            <p>Giá cả hợp lí</p>
        </div>
        <div className="box-item-righttop border-green-500 ">
        <img src="/src/assets/image/itrighttopcontent2.png"  />
            <h4>Giao nhanh</h4>
            <p>Nội thành</p>
        </div>
      </div>
      <div className="flex">
      <div className="box-item-righttop mr-5 mb-5 border-green-500">
        <img src="/src/assets/image/itrighttopcontent3.png"  />
            <h4>Đảm bảo</h4>
            <p>Sạch, tươi, mới</p>
        </div>
        <div className="box-item-righttop border-orange-500">
        <img src="/src/assets/image/itrighttopcontent4.png"  />
            <h4>Thân thiện</h4>
            <p>Môi trường sống</p>
        </div>
      </div>
    </div>
  )
}

export default RightTopContent
