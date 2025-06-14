import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaCartPlus, FaEye, FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  console.log(product);
  const { auth } = useAuth();
  const { addToCart } = useCart();
  const isAuthenticated = auth.status;
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please sign in to add to cart");
      navigate("/signin");
      return;
    }

    if (product.stock > 0) {
      addToCart({ ...product, quantity: 1 });
    }
  };

  const handleProductClick = () => {
    navigate(`/product/${product._id}`);
  };

  const handleViewDetails = (e) => {
    e.preventDefault(); // Prevent default behavior
    e.stopPropagation(); // Stop event from bubbling up
    navigate(`/product/${product._id}`);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleProductClick}
      key={product._id}
    >
      <div className="relative group cursor-pointer">
        {/* Loading placeholder */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}

        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-48 object-cover transition-opacity duration-300 ${
            !imageLoaded ? "opacity-0" : "opacity-100"
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            console.log("Image failed to load:", product.image); // For debugging
            e.target.src = "/images/default-product.png";
            e.target.onerror = null;
            setImageLoaded(true);
          }}
        />

        {/* Stock badge */}
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs bg-green-500 text-white z-10">
          {product.stock > 0 ? `${product.stock} left` : "Out of Stock"}
        </div>

        {/* Action buttons */}
        <div
          className={`absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center transition-opacity duration-300 z-20
            ${isHovered ? "opacity-100" : "opacity-0"}`}
        >
          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              disabled={!product.stock}
              className={`p-1.5 bg-white rounded-full ${
                product.stock > 0
                  ? "text-green-500 hover:text-green-600"
                  : "text-gray-400 cursor-not-allowed"
              }`}
            >
              <FaCartPlus className="w-4 h-4" />
            </button>
            <button
              onClick={handleViewDetails}
              className="p-1.5 bg-white rounded-full text-gray-700 hover:text-gray-900"
            >
              <FaEye className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 cursor-pointer">
        <h3 className="text-sm font-medium text-gray-800 line-clamp-1">
          {product.name || "Untitled Product"}
        </h3>
        <p
          className="text-xs text-gray-600 mt-1 overflow-hidden text-ellipsis whitespace-pre-line line-clamp-2"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            maxHeight: "2.6rem", // Approximately 2 lines of text with some spacing
          }}
        >
          {product.description || "No description available"}
        </p>
        <p className="py-3">Price: ${product.price || "0.00"}</p>
      </div>
    </div>
  );
};

export default ProductCard;
