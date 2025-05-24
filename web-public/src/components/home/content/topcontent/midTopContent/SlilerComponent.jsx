import React from 'react'
import Slider from 'react-slick'

const SlilerComponent = ({arrImages}) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay:true,
        autoplaySpeed:2000
      };
  return (
    <div>
      <Slider {...settings}>
        {arrImages.map((images,idex) => {
            return(<img key={idex} src={images}/>)
            })}
      </Slider>
    </div>
  )
}

export default SlilerComponent
