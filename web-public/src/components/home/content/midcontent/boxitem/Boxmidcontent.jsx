import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Boxitemmid from './Boxitemmid'
import axios from 'axios'

const Boxmidcontent = ({name, slug}) => {
  const [categoriesProduct,setCategoriesProduct] = useState([])
  const loadCategories = async () =>{
    const res = await axios.get(`http://localhost:3000/products/category/${slug}`);
    setCategoriesProduct(res.data)
  }
  useEffect(()=>{
    loadCategories()
  },[])
  return (
    <div className="Content-alignedMid">
      <div className="ContentMid1">
      <Link className="valentine"  to={`categories/${slug}`} >{name}</Link>
        <div className="container">
        {categoriesProduct.slice(0,10).map(item => <Boxitemmid key={item._id}  item={item} />)}
        </div>
      </div>
      
    </div>
  )
}

export default Boxmidcontent
