import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TotalReviewProduct = (props) => {
  const [rating, setRating] = useState(null);
  const { product } = props;

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/reviews/product/${product._id}/summary`);
        setRating(res.data);
      } catch (error) {
        console.error("Failed to fetch review summary:", error);
      }
    };

    fetchReview();
  }, []);

  if (!rating) {
    return <div>Loading...</div>;
  }

  const { averageRating, totalReviews, starCounts } = rating;

  return (
    <div className="max-w-xl w-1/2 p-4 bg-gray-50 text-[20px]">
      Tổng quan đánh giá sản phẩm
      {/* Rating summary */}
      <div className="flex items-center mb-2 mt-5">
        {[...Array(5)].map((_, index) => (
          <svg
            key={index}
            className={`w-4 h-4 ${
              index < Math.round(averageRating) ? 'text-yellow-300' : 'text-gray-300'
            } me-1`}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 22 20"
          >
            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
          </svg>
        ))}
        <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">{averageRating}</p>
        <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">out of</p>
        <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">5</p>
      </div>

      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{totalReviews} đánh giá</p>

      {/* Rating distribution */}
      {[5, 4, 3, 2, 1].map((star) => (
        <div key={star} className="flex items-center mt-4">
          <span className="text-sm font-medium text-blue-600 dark:text-blue-500 w-10">
            {star} star
          </span>
          <div className="w-2/4 h-5 mx-4 bg-gray-200 rounded-sm dark:bg-gray-700">
            <div
              className="h-5 bg-yellow-300 rounded-sm"
              style={{ width: `${starCounts[star]?.percent || 0}%` }}
            />
          </div>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {starCounts[star]?.percent || 0}%
          </span>
        </div>
      ))}
    </div>
  );
};

export default TotalReviewProduct;
