import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaBox,
  FaUsers,
  FaShoppingCart,
  FaBars,
  FaSignOutAlt,
  FaUser,
  FaTachometerAlt,
  FaStar,
} from "react-icons/fa";
import axios from "axios";
import SummaryApi from "../../api/api";
import { useAuth } from "../../context/AuthContext";
// import api from "../../services/api";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const adminData = JSON.parse(localStorage.getItem("adminData") || "{}");
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);

  useEffect(() => {
    // Fetch pending orders count
    const fetchPendingOrdersCount = async () => {
      try {
        const response = await axios.get(SummaryApi.getPendingOrdersCount.url, {
          withCredentials: true,
        });
        if (response.data.success) {
          setPendingOrdersCount(response.data.count);
        }
      } catch (error) {
        console.error("Error fetching pending orders count:", error);
      }
    };

    fetchPendingOrdersCount();
    // Set up interval to check every minute
    const interval = setInterval(fetchPendingOrdersCount, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    navigate("/");
  };

  const menuItems = [
    {
      path: "dashboard",
      name: "Dashboard",
      icon: <FaTachometerAlt size={20} />,
    },
    { path: "products", name: "Products", icon: <FaBox size={20} /> },
    { path: "users", name: "Users", icon: <FaUsers size={20} /> },
    {
      path: "orders",
      name: "Orders",
      icon: <FaShoppingCart size={20} />,
      badge:
        pendingOrdersCount > 0 ? (
          <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {pendingOrdersCount > 9 ? "9+" : pendingOrdersCount}
          </span>
        ) : null,
    },
  ];

  return (
    <aside
      className={`w-64 bg-gray-800 text-white fixed md:sticky top-0 h-screen transition-transform duration-300 ease-in-out transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 flex flex-col z-30`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h2 className="text-xl font-semibold text-white">Admin Panel</h2>
        <button
          onClick={() => setSidebarOpen(false)}
          className="md:hidden text-white hover:text-gray-200"
        >
          <FaBars className="h-6 w-6" />
        </button>
      </div>

      {/* Admin Profile */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-700 rounded-full">
            <FaUser className="text-white" />
          </div>
          <span className="text-white">{adminData.name}</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={`/admin/${item.path}`}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-gray-200 text-white"
                  : "text-white hover:bg-gray-700 hover:text-white"
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
            {item.badge}
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-white hover:bg-red-600 hover:text-white rounded-lg transition-colors"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
