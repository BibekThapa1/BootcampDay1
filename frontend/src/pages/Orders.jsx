import { useState, useEffect } from "react";
// import api from "../services/api";
import { format } from "date-fns";
import Loading from "../components/Loading";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import { FaStar, FaImage } from "react-icons/fa";
import SummaryApi from "../api/api";
import axios from "axios";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const [shippingAddress, setShippingAddress] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);

  // Add common addresses for suggestions
  const commonAddresses = [
    "Mama Chowk, Dharan",
    "Vanuchowk, Dharan",
    "Putali Line, Dharan",
    "Traffic Chowk, Dharan",
    "Bhanu Chowk, Dharan",
    "Clock Tower, Dharan",
  ];

  const handleAddressChange = (e) => {
    const value = e.target.value;
    setShippingAddress(value);

    // Filter suggestions based on input
    const filtered = commonAddresses.filter((addr) =>
      addr.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filtered);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    setShippingAddress(suggestion);
    setShowSuggestions(false);
  };

  useEffect(() => {
    fetchOrders();
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(SummaryApi.getUserOrder.url, {
        withCredentials: true,
      });
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        setCancellingOrderId(orderId);
        const response = await axios.put(
          `${SummaryApi.cancelOrder.url}/${orderId}`,
          {},
          { withCredentials: true }
        );
       
        if (response.data.success) {
          toast.success("Order cancelled successfully");
          fetchOrders(); // Refresh orders to show updated status
        } else {
          toast.error(response.data.message || "Failed to cancel order");
        }
      } catch (error) {
        console.error("Error cancelling order:", error);
        toast.error(error.response?.data?.message || "Failed to cancel order");
      } finally {
        setCancellingOrderId(null);
      }
    }
  };

  const getOrderStatus = (status) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) return <Loading />;
  if (error)
    return <div className="text-center text-red-500 py-4">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg shadow">
            <p className="text-gray-600">No orders found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                {/* Order Header */}
                <div className="p-6 border-b">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500">
                        Order placed on{" "}
                        {format(new Date(order.createdAt), "MMM dd, yyyy")}
                      </p>
                      <p className="text-sm text-gray-500">
                        Order #{order._id.slice(-8)}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getOrderStatus(
                          order.status
                        )}`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>

                      {order.status === "pending" && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          disabled={cancellingOrderId === order._id}
                          className="ml-3 text-sm text-red-600 hover:text-red-800 transition-colors"
                        >
                          {cancellingOrderId === order._id
                            ? "Cancelling..."
                            : "Cancel Order"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center gap-4 py-4 border-b last:border-0"
                      >
                        <img
                          src={item.product?.image}
                          alt={item.product?.name}
                          className="w-20 h-20 object-cover rounded-md"
                          onError={(e) => {
                            e.target.src = "/images/default-product.png";
                            e.target.onerror = null;
                          }}
                        />
                        <div className="flex-1">
                          <h3 className="font-medium">{item.product?.name}</h3>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity} × Rs.{item.price}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            Rs.{item.quantity * item.price}
                          </p>
                          {/* {order.status === "delivered" && !item.reviewed && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedItem({
                                  ...item,
                                  orderId: order._id,
                                });
                                setIsReviewModalOpen(true);
                              }}
                              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                            >
                              Write Review
                            </button>
                          )} */}
                          {item.reviewed && (
                            <span className="text-sm text-green-600">
                              Reviewed ✓
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="mt-6 pt-6 border-t">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <p>Total</p>
                      <p>Rs.{order.total}</p>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Shipping Address: {order.shippingAddress}
                    </p>
                    {order.note && (
                      <p className="mt-2 text-sm text-gray-500">
                        Note: {order.note}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {isReviewModalOpen && selectedItem && (
        <Review
          isOpen={isReviewModalOpen}
          onClose={() => {
            setIsReviewModalOpen(false);
            setSelectedItem(null);
          }}
          orderId={selectedItem.orderId}
          item={selectedItem}
          onReviewSubmit={fetchOrders}
        />
      )}
    </div>
  );
};

export default Order;
