import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { toast } from "react-toastify";
// import api from "../services/api";
import { useAuth } from "./AuthContext";
import axios from "axios";
import SummaryApi from "../api/api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const { auth } = useAuth();
  const isAuthenticated = auth.status;

  // Create a fetchCart function that can be called from anywhere
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(SummaryApi.getCart.url, {
        withCredentials: true,
      });

      console.log("Cart response:", response.data);

      if (response.data.success) {
        if (response.data.cart && Array.isArray(response.data.cart.items)) {
          // Format cart items to match what the components expect
          const formattedItems = response.data.cart.items.map((item) => ({
            ...item.product,
            quantity: item.quantity,
          }));
          setCart(formattedItems);
        } else if (Array.isArray(response.data.cart)) {
          setCart(response.data.cart);
        } else {
          console.warn("Unexpected cart format:", response.data.cart);
          setCart([]);
        }
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCart([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch cart on mount and when authentication changes
  useEffect(() => {
    fetchCart();
  }, [isAuthenticated, fetchCart]);

  const addToCart = async (product) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to add to cart");
      return false;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        SummaryApi.addToCart.url,
        {
          productId: product._id,
          quantity: product.quantity || 1,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        // Immediately fetch the updated cart
        await fetchCart();
        toast.success("Added to cart successfully");
        return true;
      } else {
        throw new Error(response.data.message || "Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(error.message || "Failed to add to cart");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const response = await axios.put(
        SummaryApi.updateCartItem.url,
        {
          productId,
          quantity,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        await fetchCart();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating cart:", error);
      const errorMsg =
        error.response?.data?.message || "Failed to update item quantity";
      toast.error(errorMsg);
      return false;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await axios.delete(
        `${SummaryApi.removeCartItem.url}/${productId}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        await fetchCart();
        toast.info("Removed from cart");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error("Failed to remove from cart");
      return false;
    }
  };

  const clearCart = async () => {
    try {
      const response = await axios.delete(SummaryApi.clearCart.url, {
        withCredentials: true,
      });

      if (response.data.success) {
        await fetchCart();
        return true;
      }
      return false;
    } catch (error) {
      // Suppress error toast if cart is already cleared or API fails
      console.error("Error clearing cart:", error);
      // Do not show toast.error here to avoid unnecessary error toasts
      return false;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        loading,
        fetchCart,
        cartTotal: Array.isArray(cart)
          ? cart.reduce(
              (total, item) => total + item.price * (item.quantity || 1),
              0
            )
          : 0,
        cartItemsCount: Array.isArray(cart) ? cart.length : 0,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

export default CartContext;
