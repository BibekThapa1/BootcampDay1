import React, { useState, useEffect } from "react";
import {
  FaCheck,
  FaTimes,
  FaTrash,
  FaStar,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../../services/api";
import { format } from "date-fns";
import Loading from "../../components/Loading";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/reviews");
      if (response.data.success) {
        setReviews(response.data.reviews);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleVisibilityToggle = async (reviewId, visible) => {
    try {
      const response = await api.patch(
        `/admin/reviews/${reviewId}/visibility`,
        {
          visible: !visible,
        }
      );
      if (response.data.success) {
        toast.success(
          `Review ${!visible ? "shown to public" : "hidden from public"}`
        );
        setReviews(
          reviews.map((review) =>
            review._id === reviewId ? { ...review, visible: !visible } : review
          )
        );
      }
    } catch (error) {
      console.error("Error toggling review visibility:", error);
      toast.error("Failed to update review");
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      const response = await api.delete(`/admin/reviews/${reviewId}`);
      if (response.data.success) {
        toast.success("Review deleted successfully");
        setReviews(reviews.filter((review) => review._id !== reviewId));
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
    }
  };

  const showReviewDetails = (review) => {
    setSelectedReview(review);
    setShowModal(true);
  };

  // Render star rating
  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={`${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            } w-4 h-4`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          Customer Reviews
        </h2>
        <span className="text-sm text-gray-500">
          {reviews.length} reviews found
        </span>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Product
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  User
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Rating
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reviews.map((review) => (
                <tr key={review._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {review.product?.name || "Unknown Product"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {review.user?.name || "Unknown User"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {review.user?.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderStars(review.rating)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                    <div className="text-sm text-gray-500">
                      {format(new Date(review.createdAt), "MMM d, yyyy")}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        review.visible
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {review.visible ? "Visible" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => showReviewDetails(review)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FaEye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() =>
                          handleVisibilityToggle(review._id, review.visible)
                        }
                        className={`${
                          review.visible
                            ? "text-red-600 hover:text-red-900"
                            : "text-green-600 hover:text-green-900"
                        }`}
                      >
                        {review.visible ? (
                          <FaEyeSlash className="h-5 w-5" />
                        ) : (
                          <FaEye className="h-5 w-5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(review._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Detail Modal */}
      {showModal && selectedReview && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium">
                Review for{" "}
                <span className="font-bold">
                  {selectedReview.product?.name || "Unknown Product"}
                </span>
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <FaTimes />
              </button>
            </div>

            <div className="border-t border-gray-200 py-4">
              <div className="flex flex-col sm:flex-row justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500">
                    By {selectedReview.user?.name || "Unknown User"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {format(
                      new Date(selectedReview.createdAt),
                      "MMMM d, yyyy 'at' h:mm a"
                    )}
                  </p>
                </div>
                <div className="flex mt-2 sm:mt-0">
                  {renderStars(selectedReview.rating)}
                </div>
              </div>

              <div className="mt-4">
                <p className="text-gray-700 whitespace-pre-wrap mb-4">
                  {selectedReview.comment || <em>No comment provided</em>}
                </p>
                {selectedReview.image && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      Attached Image:
                    </p>
                    <img
                      src={selectedReview.image}
                      alt="Review"
                      className="max-h-96 rounded-lg object-contain"
                    />
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={() =>
                    handleVisibilityToggle(
                      selectedReview._id,
                      selectedReview.visible
                    )
                  }
                  className={`flex items-center px-4 py-2 border rounded-md text-sm font-medium ${
                    selectedReview.visible
                      ? "border-red-300 text-red-700 hover:bg-red-50"
                      : "border-green-300 text-green-700 hover:bg-green-50"
                  }`}
                >
                  {selectedReview.visible ? (
                    <>
                      <FaEyeSlash className="mr-2" /> Hide Review
                    </>
                  ) : (
                    <>
                      <FaEye className="mr-2" /> Show Review
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleDelete(selectedReview._id)}
                  className="flex items-center px-4 py-2 border border-red-300 text-red-700 hover:bg-red-50 rounded-md text-sm font-medium"
                >
                  <FaTrash className="mr-2" /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;
