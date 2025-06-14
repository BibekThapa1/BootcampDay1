import { useState, useEffect, useRef } from "react";
import { FaTrash, FaCheck, FaStar, FaPrint, FaBell } from "react-icons/fa";
import { toast } from "react-toastify";
import Loading from "../../components/Loading";
import { format } from "date-fns";
import axios from "axios";
import SummaryApi from "../../api/api";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [imageLoadedMap, setImageLoadedMap] = useState({});
  const [imageErrorMap, setImageErrorMap] = useState({});
  const [newOrdersCount, setNewOrdersCount] = useState(0);

  const statusOptions = [
    {
      value: "pending",
      label: "Pending",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      value: "processing",
      label: "Processing",
      color: "bg-blue-100 text-blue-800",
    },
    {
      value: "delivered",
      label: "Delivered",
      color: "bg-green-100 text-green-800",
    },
    {
      value: "cancelled",
      label: "Cancelled",
      color: "bg-red-100 text-red-800",
    },
  ];

  const getStatusColor = (status) => {
    return (
      statusOptions.find((option) => option.value === status)?.color ||
      "bg-gray-100 text-gray-800"
    );
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(checkForNewOrders, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(SummaryApi.getAllOrder.url, {
        withCredentials: true,
      });
      if (response.data.success) {
        setOrders(response.data.orders);

        // Save last viewed timestamp
        const now = new Date().toISOString();
        localStorage.setItem("admin_last_viewed_orders", now);
        setNewOrdersCount(0);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const checkForNewOrders = async () => {
    try {
      const lastViewed = localStorage.getItem("admin_last_viewed_orders");
      if (!lastViewed) return;

      const response = await api.get("/admin/orders/new", {
        params: { since: lastViewed },
      });

      if (response.data.success) {
        setNewOrdersCount(response.data.count);
        if (response.data.count > 0) {
          // Play notification sound
          const audio = new Audio("/notification-sound.mp3");
          audio.play().catch((e) => console.log("Audio play failed:", e));
        }
      }
    } catch (error) {
      console.error("Error checking for new orders:", error);
    }
  };

  const handleStatusChange = async (orderId, newStatus, prevStatus) => {
    try {
      if (!orderId) {
        toast.error("Invalid order ID");
        return;
      }

      const response = await axios.put(
        `${SummaryApi.updateOrderStatus.url}/${orderId}`,
        { status: newStatus },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Order status updated successfully");
        // Update local state to avoid refetch
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );

        // If status changed to delivered, show review prompt
        if (newStatus === "delivered" && prevStatus !== "delivered") {
          toast.info("Customer can now review their order", {
            autoClose: 5000,
          });
        }
      }
    } catch (error) {
      console.error("Status update error:", error);
      toast.error(
        error.response?.data?.message || "Failed to update order status"
      );
    }
  };

  const handleImageLoad = (itemId) => {
    setImageLoadedMap((prev) => ({
      ...prev,
      [itemId]: true,
    }));
  };

  const handleImageError = (itemId) => {
    setImageErrorMap((prev) => ({
      ...prev,
      [itemId]: true,
    }));
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) {
      return;
    }

    try {
      const response = await axios.delete(
        `${SummaryApi.deleteOrder.url}/${orderId}`,
        {
          withCredentials: true,
        }
      );
      console.log(response);
      if (response.data.success) {
        toast.success("Order deleted successfully");
        // Remove the order from local state
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order._id !== orderId)
        );
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order");
    }
  };

  const handlePrintOrder = (order) => {
    setSelectedOrderForPrint(order);
    setShowPrintView(true);

    // Use setTimeout to ensure the DOM is updated before printing
    setTimeout(() => {
      if (printRef.current) {
        window.print();
      }
    }, 300);
  };

  const closePrintView = () => {
    setShowPrintView(false);
    setSelectedOrderForPrint(null);
  };

  const filteredOrders =
    selectedStatus === "all"
      ? orders
      : orders.filter((order) => order.status === selectedStatus);

  if (loading) return <Loading />;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
          Orders
          {newOrdersCount > 0 && (
            <span className="ml-2 bg-red-600 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs animate-pulse">
              {newOrdersCount}
            </span>
          )}
        </h2>
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="font-medium">Total Orders:</span> {orders.length}
          </div>
          <div className="text-sm">
            <span className="font-medium">Delivered:</span>{" "}
            {orders.filter((o) => o.status === "delivered").length}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
          <div className="flex gap-4 items-center">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <div className="text-sm text-gray-600">
              Showing {filteredOrders.length} orders
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <h3 className="text-lg font-semibold">
                      Order #{order._id.slice(-6)}
                    </h3>
                    {/* Show new indicator for recent orders */}
                    {new Date(order.createdAt) >
                      new Date(Date.now() - 24 * 60 * 60 * 1000) && (
                      <span className="ml-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                        New
                      </span>
                    )}
                    <p className="text-sm text-gray-500 ml-2">
                      {format(new Date(order.createdAt), "MMM d, yyyy h:mm a")}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                   
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(
                          order._id,
                          e.target.value,
                          order.status
                        )
                      }
                      className={`px-4 py-2 rounded-lg border ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleDeleteOrder(order._id)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors"
                      title="Delete Order"
                    >
                      <FaTrash className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item._id} className="flex items-center gap-4">
                      <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                        {!imageLoadedMap[item._id] &&
                          !imageErrorMap[item._id] && (
                            <div className="absolute inset-0 bg-gray-100 animate-pulse" />
                          )}
                        {item.product?.image ? (
                          <img
                            src={item.product.image}
                            alt={item.product?.name}
                            className={`w-full h-full object-cover transition-opacity duration-300 ${
                              !imageLoadedMap[item._id] && "opacity-0"
                            }`}
                            onLoad={() => handleImageLoad(item._id)}
                            onError={(e) => {
                              console.log(
                                "Failed to load image:",
                                item.product.image
                              );
                              handleImageError(item._id);
                              e.target.src = "/images/default-product.png";
                              e.target.onerror = null;
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No image
                          </div>
                        )}
                      </div>

                      <div className="flex-grow">
                        <h4 className="font-medium text-gray-900">
                          {item.product?.name}
                        </h4>
                        <div className="mt-1 text-sm text-gray-500">
                          <span>Quantity: {item.quantity}</span>
                          <span className="mx-2">·</span>
                          <span>Rs.{item.product?.price} each</span>
                        </div>
                        {order.status === "delivered" && (
                          <div className="mt-2">
                            {item.reviewed ? (
                              <span className="text-green-600 flex items-center gap-1">
                                <FaStar className="text-yellow-400" />
                                Reviewed
                              </span>
                            ) : (
                              <span className="text-gray-500">
                                Awaiting review
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          Rs.{(item.product?.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-700">
                      Customer Details
                    </h4>
                    <div className="mt-2 text-sm space-y-1">
                      <p className="text-gray-600">
                        <span className="font-medium">Name:</span>{" "}
                        {order.user?.name || "Customer"}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Email:</span>{" "}
                        {order.user?.email || "Not provided"}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Phone:</span>{" "}
                        {order.phone ||
                          order.contactNumber ||
                          order.user?.phone ||
                          "Not provided"}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Shipping Address:</span>{" "}
                        {order.shippingAddress}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Payment Method:</span>{" "}
                        <span
                          className={
                            order.paymentMethod === "khalti"
                              ? "text-purple-700 font-semibold"
                              : "text-green-700 font-semibold"
                          }
                        >
                          {order.paymentMethod === "khalti"
                            ? "Khalti"
                            : "Cash on Delivery"}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <h4 className="font-medium text-gray-700">Order Summary</h4>
                    <div className="mt-2 space-y-1 text-sm">
                      <p className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>Rs.{order.total}</span>
                      </p>
                      <p className="flex justify-between">
                        <span>Shipping:</span>
                        <span>Free</span>
                      </p>
                      <p className="flex justify-between font-medium text-lg pt-2 border-t">
                        <span>Total:</span>
                        <span>Rs.{order.total}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredOrders.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No orders found for the selected status
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Order;
