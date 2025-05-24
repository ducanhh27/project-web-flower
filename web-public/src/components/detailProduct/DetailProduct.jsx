import React, { useEffect, useState } from 'react'
import CarouselProduct from './content/carousel/CarouselProduct'
import InfoProduct from './content/info/InfoProduct'
import './content/carousel/css/embla.css'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import SuggestProduct from './content/info/suggestProduct'
import ReviewProducts from './content/reviews/ReviewProducts'
import ReviewMain from './content/reviews/ReviewMain'
const OPTIONS = {}
const DetailProduct = () => {
  const { slugProduct } = useParams();
  const [product, setProduct] = useState();
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/products/detail/${slugProduct}`);
        setProduct(res.data);
      } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
      }
    };
    
    fetchProduct();
  }, [slugProduct]);
  
  return (
    <div className=" flex flex-col">
    {product ? (
      <>
      <div className='Content-alignedMid mt-2' >
        <CarouselProduct product={product} options={OPTIONS} />
        <div className='flex justify-end'><InfoProduct product={product} /></div>
      </div>
      <div>
        <ReviewMain  product={product} />
      </div>
      <div>
        <SuggestProduct  product={product}/>
      </div>
      </>
    ) : (
      <p>Đang tải sản phẩm...</p>
    )}
  </div>
  )
}

export default DetailProduct
