import React, { useEffect, useState } from 'react'
import Topcontent from './content/topcontent/Topcontent'
import Midcontent from './content/midcontent/Midcontent'
import { useSelector } from 'react-redux'
import Boxitemmid from './content/midcontent/boxitem/Boxitemmid'



const Home = () => {
  const filteredProducts = useSelector((state) => state.productSlice.filteredProducts);
  useEffect(()=>{
    console.log(filteredProducts,"xxx")
  },[])

  return (
    <div >
      {filteredProducts.length > 0 ? (
        <div>
          <Topcontent />
          <div className="Content-alignedMid">
      <div className="ContentMid1">
      <span className="valentine"> Sản phẩm tìm kiếm </span>
        <div className="container">
        {filteredProducts.map(item => <Boxitemmid key={item._id}  item={item} />)}
        </div>
      </div>
      </div>
        </div> 
      ):(
      <div>
        <Topcontent />
        <Midcontent />
      </div>
      )}
      

    </div>
  )
}

export default Home
