import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import {
  FaTrash,
  FaMinus,
  FaPlus,
  FaMoneyBillWave,
  FaCreditCard,
  FaShoppingCart,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import SummaryApi from "../api/api";

const Cart = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    loading: cartLoading,
  } = useCart();
  const { auth } = useAuth();
  const isAuthenticated = auth.status;
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [location, setLocation] = useState("kathmandu");
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
  const [orderId, setOrderId] = useState(null);

  // Add shipping form state
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
  });

  // Pre-fill shipping info from localStorage if available
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const savedShipping = JSON.parse(
      localStorage.getItem("shippingInfo") || "null"
    );
    if (savedShipping) {
      setShippingInfo(savedShipping);
    } else if (userData) {
      setShippingInfo({
        fullName: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        address: userData.address || "",
        city: userData.city || "",
        state: userData.state || "",
      });
    }
  }, []);

  const handleShippingInfoChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => {
      const updated = { ...prev, [name]: value };
      localStorage.setItem("shippingInfo", JSON.stringify(updated));
      return updated;
    });
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/signin");
    }
  }, [isAuthenticated, navigate]);

  // Calculate total
  const total = Array.isArray(cart)
    ? cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    : 0;

  // Calculate delivery fee based on location
  const deliveryFee = location === "kathmandu" ? 0 : 100;

  // Update total to include delivery fee
  const finalTotal = total + deliveryFee;

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      setLoading(true);
      await updateQuantity(productId, newQuantity);
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      setLoading(true);
      await removeFromCart(productId);
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item from cart");
    } finally {
      setLoading(false);
    }
  };

  const handleOrderSuccess = async () => {
    try {
      await clearCart();
      setIsCheckingOut(false);
      setShowPaymentConfirmation(true);
      setTimeout(() => {
        setShowPaymentConfirmation(false);
        navigate("/orders");
      }, 2000);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  // Show loading state
  if (loading || cartLoading) {
    return (
      <div className="min-h-screen pt-20 flex justify-center items-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500 mb-4"></div>
          <p className="text-lg">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (!Array.isArray(cart) || cart.length === 0) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-2xl mx-auto text-center py-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link
            to="/"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (showPaymentConfirmation) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100 text-center">
          <div className="flex flex-col items-center justify-center">
            <svg
              className="w-16 h-16 text-green-500 mb-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-green-700 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-700 mb-4">
              Thank you for your order. Redirecting to your orders...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isCheckingOut) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <OrderConfirmation
          cart={cart}
          total={finalTotal}
          onOrderSuccess={handleOrderSuccess}
        />
      </div>
    );
  }

  // Main checkout page: cart items, then shipping/payment, then summary
  return (
    <div className="min-h-screen pt-20 px-4 bg-gradient-to-br from-purple-50 to-green-50">
      <div className="max-w-4xl w-full mx-auto flex flex-col gap-8">
        {/* Cart Items List */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
          <h2 className="text-2xl font-bold mb-4 text-green-700 flex items-center gap-2">
            <FaShoppingCart className="text-green-500" /> Your Cart
          </h2>
          <ul className="divide-y divide-gray-200 mb-4">
            {Array.isArray(cart) && cart.length > 0 ? (
              cart.map((item) => (
                <li
                  key={item._id}
                  className="py-4 flex items-center justify-between gap-4 flex-wrap"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded border"
                      onError={(e) => {
                        e.target.src = "/vite.svg";
                      }}
                    />
                    <div className="min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {item.name}
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {item.description}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleQuantityChange(item._id, item.quantity - 1)
                      }
                      className="p-2 bg-gray-100 rounded hover:bg-gray-200"
                      disabled={loading || item.quantity <= 1}
                    >
                      <FaMinus />
                    </button>
                    <span className="px-3 font-semibold">{item.quantity}</span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item._id, item.quantity + 1)
                      }
                      className="p-2 bg-gray-100 rounded hover:bg-gray-200"
                      disabled={loading || item.quantity >= item.stock}
                    >
                      <FaPlus />
                    </button>
                  </div>
                  <div className="text-right min-w-[80px]">
                    <div className="text-lg font-semibold text-gray-900">
                      Rs.{item.price * item.quantity}
                    </div>
                    <div className="text-xs text-gray-500">
                      Rs.{item.price} {item.unit && `/ ${item.unit}`}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item._id)}
                    className="text-red-500 hover:text-red-600 ml-2"
                    disabled={loading}
                    title="Remove"
                  >
                    <FaTrash />
                  </button>
                </li>
              ))
            ) : (
              <li className="text-center text-gray-500 py-8">
                Your cart is empty.
              </li>
            )}
          </ul>
        </div>
        {/* Shipping & Payment Form + Order Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {/* Shipping & Payment Form */}
          <form
            className="bg-white rounded-2xl shadow-xl p-8 border border-green-100 space-y-6 w-full max-w-2xl mx-auto md:max-w-3xl lg:max-w-4xl"
            style={{ minWidth: 0 }}
            onSubmit={async (e) => {
              e.preventDefault();
              // Validate required fields
              if (
                !shippingInfo.fullName ||
                !shippingInfo.phone ||
                !shippingInfo.address
              ) {
                toast.error("Please fill in required shipping information");
                return;
              }
              setLoading(true);
              try {
                // Save shipping info for next time
                localStorage.setItem(
                  "shippingInfo",
                  JSON.stringify(shippingInfo)
                );
                // Create order
                const orderData = {
                  items: cart.map((item) => ({
                    product: item._id,
                    quantity: item.quantity,
                    price: item.price,
                  })),
                  shippingAddress: shippingInfo.address,
                  phone: shippingInfo.phone,
                  city: shippingInfo.city || location,
                  total: finalTotal,
                  paymentMethod,
                };
                const orderResponse = await axios.post(
                  SummaryApi.createOrder.url,
                  orderData,
                  { withCredentials: true }
                );
                if(orderResponse.data.success){
                    toast.success("Order created successfully")
                }
                clearCart()
                console.log(orderResponse);
                if (!orderResponse.data.success)
                  throw new Error(
                    orderResponse.data.message || "Failed to create order"
                  );
                const orderId = orderResponse.data.order._id;
                setOrderId(orderId);
              } catch (error) {
                console.log(error);
                toast.error(
                  error.response?.data?.message ||
                    error.message ||
                    "Checkout failed"
                );
              } finally {
                setLoading(false);
              }
            }}
          >
            <h2 className="text-2xl font-bold mb-4 text-green-700 flex items-center gap-2">
              <svg
                className="w-7 h-7 text-green-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 11c0-1.657-1.343-3-3-3s-3 1.343-3 3 1.343 3 3 3 3-1.343 3-3zm0 0c0-1.657 1.343-3 3-3s3 1.343 3 3-1.343 3-3 3-3-1.343-3-3zm0 0v2m0 4v.01"
                />
              </svg>
              Shipping Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={shippingInfo.fullName}
                  onChange={handleShippingInfoChange}
                  placeholder="Full Name"
                  className="w-full p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-400"
                  required
                  autoComplete="name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={shippingInfo.email}
                  onChange={handleShippingInfoChange}
                  placeholder="Email"
                  className="w-full p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-400"
                  required
                  autoComplete="email"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={shippingInfo.phone}
                  onChange={handleShippingInfoChange}
                  placeholder="Phone"
                  className="w-full p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-400"
                  required
                  autoComplete="tel"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleShippingInfoChange}
                  placeholder="Address"
                  className="w-full p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-400"
                  required
                  autoComplete="street-address"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={shippingInfo.city}
                  onChange={handleShippingInfoChange}
                  placeholder="City"
                  className="w-full p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-400"
                  required
                  autoComplete="address-level2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={shippingInfo.state}
                  onChange={handleShippingInfoChange}
                  placeholder="State"
                  className="w-full p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-400"
                  required
                  autoComplete="address-level1"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Location
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="kathmandu">Inside Kathmandu Valley</option>
                <option value="outside">Outside Kathmandu Valley</option>
              </select>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <div className="space-y-3">
                <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="h-4 w-4 text-green-600 focus:ring-green-500"
                  />
                  <div className="ml-3 flex items-center">
                    <FaMoneyBillWave className="text-gray-600 mr-2" />
                    <span>Cash on Delivery</span>
                  </div>
                </label>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-3 px-4 rounded-xl hover:from-green-600 hover:to-green-800 shadow-lg text-lg font-semibold flex items-center justify-center gap-2 mt-4 transition-all duration-200"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin fh-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <FaMoneyBillWave />
                  Place Order
                </>
              )}
            </button>
          </form>
          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <ul className="divide-y divide-gray-200 mb-4">
              {Array.isArray(cart) &&
                cart.map((item) => (
                  <li
                    key={item._id}
                    className="py-2 flex items-center justify-between"
                  >
                    <span className="font-medium text-gray-800">
                      {item.name}
                    </span>
                    <span className="text-gray-600">x{item.quantity}</span>
                    <span className="text-gray-900 font-semibold">
                      Rs.{item.price * item.quantity}
                    </span>
                  </li>
                ))}
            </ul>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>Rs.{total}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Delivery</span>
              <span>{deliveryFee === 0 ? "Free" : `Rs.${deliveryFee}`}</span>
            </div>
            <div className="border-t pt-4 flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>Rs.{finalTotal}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
