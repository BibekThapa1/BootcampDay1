import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaHeart,
  FaUser,
  FaHome,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaSignInAlt,
  FaStore,
} from "react-icons/fa";
import { BiSolidBriefcaseAlt2 } from "react-icons/bi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { auth, logout } = useAuth();
  const { cartItemsCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthenticated = auth.status;
  const role = auth.userData?.role;
  console.log(role);

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  // Close mobile menu when location changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Helper: Render links for user
  const userLinks = (
    <>
      <Link
        to="/products"
        className="nav-link text-base font-medium text-gray-700 hover:text-green-500 flex items-center"
      >
        <FaStore className="mr-1" />
        <span>Products</span>
      </Link>
      <Link
        to="/cart"
        className="nav-link text-base font-medium text-gray-700 hover:text-green-500 relative flex items-center"
      >
        <FaShoppingCart className="mr-1" />
        <span>Cart</span>
        {cartItemsCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
            {cartItemsCount}
          </span>
        )}
      </Link>
      <Link
        to="/orders"
        className="nav-link text-base font-medium text-gray-700 hover:text-green-500 flex items-center"
      >
        <BiSolidBriefcaseAlt2 className="mr-1" />
        <span>My Orders</span>
      </Link>
      <Link
        to="/profile"
        className="nav-link text-base font-medium text-gray-700 hover:text-green-500 flex items-center"
      >
        <FaUser className="mr-1" />
        <span>Profile</span>
      </Link>
      <button
        onClick={handleLogout}
        className="nav-link text-base font-medium text-gray-700 hover:text-green-500 flex items-center"
      >
        <FaSignOutAlt className="mr-1" />
        <span>Logout</span>
      </button>
    </>
  );

  // Helper: Render links for admin
  const adminLinks = (
    <>
      <Link
        to="/admin/dashboard"
        className="nav-link text-base font-medium text-gray-700 hover:text-green-500 flex items-center"
      >
        <FaHome className="mr-1" />
        <span>Dashboard</span>
      </Link>
      <Link
        to="/admin/products"
        className="nav-link text-base font-medium text-gray-700 hover:text-green-500 flex items-center"
      >
        <FaStore className="mr-1" />
        <span>Products</span>
      </Link>
      <Link
        to="/admin/users"
        className="nav-link text-base font-medium text-gray-700 hover:text-green-500 flex items-center"
      >
        <FaUser className="mr-1" />
        <span>Users</span>
      </Link>
      <button
        onClick={handleLogout}
        className="nav-link text-base font-medium text-gray-700 hover:text-green-500 flex items-center"
      >
        <FaSignOutAlt className="mr-1" />
        <span>Logout</span>
      </button>
    </>
  );

  // Helper: Render links for guest
  const guestLinks = (
    <>
      <Link
        to="/products"
        className="nav-link text-base font-medium text-gray-700 hover:text-green-500 flex items-center"
      >
        <FaStore className="mr-1" />
        <span>Products</span>
      </Link>
      <Link
        to="/signin"
        className="nav-link text-base font-medium text-gray-700 hover:text-green-500 flex items-center"
      >
        <FaSignInAlt className="mr-1" />
        <span>Sign In</span>
      </Link>
    </>
  );

  return (
    <header className="bg-white shadow-md  top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-green-600 hidden sm:block">
              CN Mart
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="nav-link text-base font-medium text-gray-700 hover:text-green-500 flex items-center"
            >
              <FaHome className="mr-1" />
              <span>Home</span>
            </Link>
            {isAuthenticated && role === "user" && userLinks}
            {isAuthenticated && role === "admin" && adminLinks}
            {!isAuthenticated && guestLinks}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-green-500 focus:outline-none"
            >
              {isOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-4 py-2 space-y-3 max-h-[80vh] overflow-y-auto">
            <div className="space-y-2 py-2">
              <Link
                to="/"
                className="mobile-nav-link flex items-center justify-between p-3 rounded-lg hover:bg-green-50 transition-colors"
              >
                <div className="flex items-center">
                  <FaHome className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-gray-800 font-medium">Home</span>
                </div>
              </Link>
              {/* User Links */}
              {isAuthenticated && role === "user" && (
                <>
                  <Link
                    to="/cart"
                    className="mobile-nav-link flex items-center justify-between p-3 rounded-lg hover:bg-green-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <FaShoppingCart className="w-5 h-5 text-green-600 mr-3" />
                      <span className="text-gray-800 font-medium">Cart</span>
                    </div>
                    {cartItemsCount > 0 && (
                      <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                        {cartItemsCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/wishlist"
                    className="mobile-nav-link flex items-center justify-between p-3 rounded-lg hover:bg-green-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <FaHeart className="w-5 h-5 text-green-600 mr-3" />
                      <span className="text-gray-800 font-medium">
                        Wishlist
                      </span>
                    </div>
                    {wishlistItemsCount > 0 && (
                      <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                        {wishlistItemsCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/orders"
                    className="mobile-nav-link flex items-center p-3 rounded-lg hover:bg-green-50 transition-colors"
                  >
                    <BiSolidBriefcaseAlt2 className="w-5 h-5 text-green-600 mr-3" />
                    <span>My Orders</span>
                  </Link>
                  <Link
                    to="/profile"
                    className="mobile-nav-link flex items-center justify-between p-3 rounded-lg hover:bg-green-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <FaUser className="w-5 h-5 text-green-600 mr-3" />
                      <span className="text-gray-800 font-medium">Profile</span>
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="mobile-nav-link w-full flex items-center justify-between p-3 rounded-lg hover:bg-green-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <FaSignOutAlt className="w-5 h-5 text-green-600 mr-3" />
                      <span className="text-gray-800 font-medium">Logout</span>
                    </div>
                  </button>
                </>
              )}
              {/* Admin Links */}
              {isAuthenticated && role === "admin" && (
                <>
                  <Link
                    to="/admin/dashboard"
                    className="mobile-nav-link flex items-center justify-between p-3 rounded-lg hover:bg-green-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <FaHome className="w-5 h-5 text-green-600 mr-3" />
                      <span className="text-gray-800 font-medium">
                        Dashboard
                      </span>
                    </div>
                  </Link>
                  <Link
                    to="/admin/products"
                    className="mobile-nav-link flex items-center justify-between p-3 rounded-lg hover:bg-green-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <FaStore className="w-5 h-5 text-green-600 mr-3" />
                      <span className="text-gray-800 font-medium">
                        Products
                      </span>
                    </div>
                  </Link>
                  <Link
                    to="/admin/users"
                    className="mobile-nav-link flex items-center justify-between p-3 rounded-lg hover:bg-green-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <FaUser className="w-5 h-5 text-green-600 mr-3" />
                      <span className="text-gray-800 font-medium">Users</span>
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="mobile-nav-link w-full flex items-center justify-between p-3 rounded-lg hover:bg-green-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <FaSignOutAlt className="w-5 h-5 text-green-600 mr-3" />
                      <span className="text-gray-800 font-medium">Logout</span>
                    </div>
                  </button>
                </>
              )}
              {/* Guest Links */}
              {!isAuthenticated && (
                <Link
                  to="/signin"
                  className="mobile-nav-link flex items-center justify-between p-3 rounded-lg hover:bg-green-50 transition-colors"
                >
                  <div className="flex items-center">
                    <FaSignInAlt className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-gray-800 font-medium">Sign In</span>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
