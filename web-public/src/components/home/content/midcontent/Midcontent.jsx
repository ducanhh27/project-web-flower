import React, { useEffect } from 'react'
import Boxmidcontent from './boxitem/Boxmidcontent'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux';
import { setListCategories } from '/src/redux-toolkit/feature/Categories';
import NewProduct from './newProduct/NewProduct';
import { toast } from 'react-toastify';
import { clearError } from '../../../../redux-toolkit/feature/CartSlice';


const Midcontent = () => {
  const dispatch = useDispatch();
  const error  = useSelector((state) => state.cartSlice.error);

  const loadCategories = async () =>{
    const res = await axios.get("http://localhost:3000/categories");
    const filteredCategories = res.data.filter(category => category.name !== "Chưa xác định");

    dispatch(setListCategories(filteredCategories.slice(0,4)))
  }
  const categories = useSelector((state) => state.categoriesSlice.categories)
  useEffect(()=>{
    loadCategories()
    if (error) {
      console.log(error,"lỗi")
      toast.error(error, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    dispatch(clearError());
  },[error])

  return (
    <>
      <div>
        <NewProduct />
      </div>
      <div>
        {categories.slice(0,3).map((item) => (
          <Boxmidcontent key={item._id} name={item.name} slug={item.slug} />
        ))}
      </div>
    </>
  );
}

export default Midcontent


