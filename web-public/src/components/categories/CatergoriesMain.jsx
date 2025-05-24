import React, { useEffect, useState } from 'react'
import CategoriesLeft from './content/CategoriesFilter'
import { useParams } from 'react-router-dom';
const CatergoriesMain = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/categories/${slug}`);
        setCategory(res.data);
      } catch (error) {
        console.error("Lỗi tải danh mục:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [slug]);

  if (loading) return <p>Loading...</p>;
  return (
    <div >
      <CategoriesLeft slug={slug}/>
      
    </div>
  )
}

export default CatergoriesMain
