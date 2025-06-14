import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  FaHeart,
  FaStar,
  FaShoppingCart,
  FaStarHalf,
  FaRegStar,
  FaRegHeart,
  FaImage,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";
import Loading from "../components/Loading";
import axios from "axios";
import SummaryApi from "../api/api";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const { addToCart } = useCart();
  //   const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewImage, setReviewImage] = useState(null);
  const location = useLocation();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    fetchProductAndReviews();
    checkReviewEligibility();
    if (location.state?.showReviewModal) {
      setShowReviewModal(true);
    }
  }, [id, location]);

  const fetchProductAndReviews = async () => {
    try {
      setLoading(true);
      const productRes = await axios.get(
        `${SummaryApi.getProductById.url}/${id}`,
        {
          withCredentials: true,
        }
      );
      console.log(productRes);
      if (productRes.data.success) {
        const productData = productRes.data.product;
        console.log("Full image URL:", productData.image);
        setProduct(productData);
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
      toast.error("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  const checkReviewEligibility = async () => {
    try {
      const response = await axios.get(SummaryApi.getUserOrder.url, {
        withCredentials: true,
      });
      if (response.data.success) {
        const delivered = response.data.orders.filter(
          (order) =>
            order.status === "delivered" &&
            order.items.some((item) => item.product._id === id)
        );
        setDeliveredOrders(delivered);
        setCanReview(delivered.length > 0);
      }
    } catch (error) {
      console.error("Error checking review eligibility:", error);
    }
  };

  const handleAddToCart = () => {
    if (product.stock < quantity) {
      toast.error("Not enough stock available");
      return;
    }
    addToCart({ ...product, quantity });
  };
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        toast.error("Please login to submit a review");
        return;
      }

      // Check if user has a delivered order for this product
      const eligibleOrder = deliveredOrders.find((order) =>
        order.items.some((item) => item.product._id === id)
      );

      if (!eligibleOrder) {
        toast.error("You can only review products from delivered orders");
        return;
      }

      const response = await api.post(
        `/product/${id}/review`,
        {
          rating,
          comment,
          orderId: eligibleOrder._id, // Add the order ID
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Review submitted successfully!");
        setComment("");
        setRating(5);
        setShowReviewForm(false);
        fetchProductAndReviews(); // Refresh product data to show new review
        checkReviewEligibility(); // Recheck review eligibility
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      const message =
        error.response?.data?.message || "Failed to submit review";
      toast.error(message);
    }
  };

  if (loading) return <Loading />;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Product Details Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Image */}
          <div className="aspect-w-1 aspect-h-1 bg-white rounded-lg overflow-hidden">
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 bg-gray-100 animate-pulse" />
            )}
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className={`w-full h-full object-center object-cover ${
                  !imageLoaded && "opacity-0"
                }`}
                onLoad={() => {
                  console.log("Image loaded successfully");
                  setImageLoaded(true);
                }}
                onError={(e) => {
                  console.log("Failed to load image:", product.image);
                  setImageError(true);
                  e.target.src = "/images/default-product.png";
                  e.target.onerror = null;
                }}
              />
            )}
          </div>

          {/* Right Column - Details */}
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 capitalize">
              {product.name}
            </h1>

            <p className="text-2xl md:text-3xl font-bold text-green-600 mb-4">
              Rs.{product.price}
              {product.unit && ` / ${product.unit}`}
            </p>

            <p className="text-gray-600 mb-6 whitespace-pre-wrap">
              {product.description}
            </p>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => quantity > 1 && setQuantity((q) => q - 1)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-4 py-2 border-x">{quantity}</span>
                <button
                  onClick={() =>
                    quantity < product.stock && setQuantity((q) => q + 1)
                  }
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
              <span className="text-gray-600">
                {product.stock} units available
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!product.stock}
              className={`w-full md:w-auto px-6 py-3 rounded-lg flex items-center justify-center gap-2 ${
                product.stock
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <FaShoppingCart />
              Add to Cart
            </button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>

          {/* Review Stats */}
          <div className="bg-white rounded-lg p-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold">
                {product.rating?.toFixed(1) || "0.0"}
              </div>
              <div>
                <div className="flex text-yellow-400 mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={
                        star <= product.rating
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-500">
                  Based on {product.totalReviews} reviews
                </div>
              </div>
            </div>
          </div>

          {/* Review List */}
          <div className="space-y-8">
            {reviews.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-lg">
                <p className="text-gray-500">No reviews yet</p>
              </div>
            ) : (
              reviews.map((review) => (
                <div key={review._id} className="bg-white rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="font-medium">{review.user?.name}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={
                            star <= review.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{review.comment}</p>

                  {/* Review Image */}
                  {review.image && (
                    <div className="mt-4">
                      <img
                        src={review.imageUrl}
                        alt="Review"
                        className="max-w-xs rounded-lg"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-2xl ${
                        star <= rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                    >
                      <FaStar />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Comment
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  rows="4"
                  placeholder="Write your review here..."
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Add Photo
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && file.size > 5 * 1024 * 1024) {
                        toast.error("Image size should be less than 5MB");
                        return;
                      }
                      setReviewImage(file);
                    }}
                    className="hidden"
                    id="review-image"
                  />
                  <label
                    htmlFor="review-image"
                    className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-50"
                  >
                    <FaImage /> Choose Image
                  </label>
                  {reviewImage && (
                    <span className="text-sm text-gray-600">
                      {reviewImage.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowReviewModal(false);
                    setRating(0);
                    setComment("");
                    setReviewImage(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!rating && !comment.trim() && !reviewImage}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
