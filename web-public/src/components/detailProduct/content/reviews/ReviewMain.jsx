import React from 'react'
import ReviewProducts from './ReviewProducts'
import TotalReviewProduct from './TotalReviewProduct'

const ReviewMain = ({product}) => {
  return (
    <div className='Content-alignedMid'>
    <TotalReviewProduct product={product} />
    <ReviewProducts product={product} />
    </div>
  )
}

export default ReviewMain
