import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { disableReview } from "../../../../redux-toolkit/feature/ReviewSlice";
import { jwtDecode } from "jwt-decode";

// Nhóm đánh giá theo user
const groupReviewsByUser = (reviews) => {
  const grouped = {};

  reviews.forEach((review) => {
    // Dùng key là combination của userId + orderId
    const groupKey = `${review.user._id}_${review.order}`;
    
    if (!grouped[groupKey]) {
      grouped[groupKey] = {
        user: review.user,
        order: review.order,
        initial: null,
        additional: null,
      };
    }

    if (review.type === "initial") {
      grouped[groupKey].initial = review;
    } else if (review.type === "additional") {
      grouped[groupKey].additional = review;
    }
  });

  return Object.values(grouped);
};


const ReviewProducts = (props) => {
  const { product } = props;
  const [groupedReviews, setGroupedReviews] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4);
  const [rating, setRating] = useState(0); // Rating
  const [userHasAdditionalReview, setUserHasAdditionalReview] = useState(false);
  const [comment, setComment] = useState(""); // Comment
  const { orderId, canReview } = useSelector((state) => state.reviewSlice);
  const token = localStorage.getItem("access_token");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
 //Giải mã user id
  let userIdFromToken = null;
  if (token) {
    const decodedToken = jwtDecode(token);
    userIdFromToken = decodedToken.userId; // Giả sử `userId` trong token
  }

  const dispatch= useDispatch()
  const fetchReviews = async () => {
    const res = await axios.get(`http://localhost:3000/reviews/product/${product._id}?page=${page}&limit=4`); 
    console.log(res.data,"list review đây xxx")
    setGroupedReviews(groupReviewsByUser(res.data.reviews));

    setTotalPages(res.data.totalPages)
    
  
  };
  // hàm check đánh giá bổ sung
  const checkAdditionalReview = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/reviews/hasAdditionalReview/${userIdFromToken}/${orderId}`);
      console.log('Has Additional Review:', res.data.hasAdditionalReview);
      setUserHasAdditionalReview(res.data.hasAdditionalReview);
    } catch (error) {
      console.error('Error checking additional review:', error);
      return false;
    }
  };
  // Hàm gửi đánh giá
  const handleSubmitReview = async () => {
    try {
      const reviewData = { productId: product._id,orderId, rating, comment };
      const res = await axios.post("http://localhost:3000/reviews", reviewData,{
        headers: {
          Authorization: `Bearer ${token}`, // 
        },
      });
      console.log("Review submitted:", res.data);
      dispatch(disableReview());
      fetchReviews(); // Cập nhật lại đánh giá
      setRating(0); // Reset rating
      setComment(""); // Reset comment
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };
    useEffect(() => {
        fetchReviews();
        checkAdditionalReview();
        console.log(userHasAdditionalReview, "userHasAdditionalReview after fetch");

      }, [page,orderId]);

    useEffect(() => {
        // Cleanup khi rời khỏi component
        return () => {
          dispatch(disableReview());
        };
      }, []);
    console.log(userHasAdditionalReview,"userHasAdditionalReview đây")
  return (
    <div className="w-1/2">
      <div className="max-w-xl mx-auto p-4 bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Đánh giá của khách hàng</h2>

        {groupedReviews.length === 0 ? (<p className="text-gray-600">Chưa có đánh giá sản phẩm!</p>) :
        groupedReviews.slice(0, visibleCount).map((group, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg p-4 mb-4">
            <div className="flex items-center gap-4 mb-2">
              <img
                src="https://cdn.pixabay.com/photo/2021/07/02/04/48/user-6380868_640.png"
                alt={group.user.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">{group.user.name}</p>
              </div>
            </div>

            {/* Đánh giá ban đầu */}
            {group.initial && (
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-600 mb-1">Đánh giá ban đầu</p>
                <div className="flex items-center mb-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`h-4 w-4 mr-1 ${i < group.initial.rating ? "text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <p className="text-gray-700 text-sm">{group.initial.comment}</p>
              </div>
            )}

            {/* Đánh giá bổ sung */}
            {group.additional && (
              <div className="border-t pt-3">
                <p className="text-sm font-medium text-gray-600 mb-1">Đánh giá bổ sung</p>
                <div className="flex items-center mb-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`h-4 w-4 mr-1 ${i < group.additional.rating ? "text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <p className="text-gray-700 text-sm">{group.additional.comment}</p>
              </div>
            )}
          </div>
        ))}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-4">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Trước
            </button>
            <span className="text-gray-600">Trang {page} / {totalPages}</span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        )}

        {/* Form đánh giá  */}
        {canReview &&  !userHasAdditionalReview && (
  <div className="bg-white shadow-md rounded-lg p-4 mt-4">
    <h3 className="text-xl font-semibold mb-4">Đánh giá sản phẩm</h3>
    <div className="flex items-center mb-4">
      {[...Array(5)].map((_, i) => (
        <FaStar
          key={i}
          className={`h-6 w-6 cursor-pointer ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
          onClick={() => setRating(i + 1)}
        />
      ))}
    </div>
    <textarea
      value={comment}
      onChange={(e) => setComment(e.target.value)}
      placeholder="Viết nhận xét của bạn"
      className="w-full p-2 border rounded-md mb-4"
    ></textarea>
    <div className="flex gap-4">
      <button
        onClick={handleSubmitReview}
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Gửi đánh giá
      </button>
    </div>
  </div>
)}
      </div>
    </div>
  );
};

export default ReviewProducts;
