import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { FaBars } from "react-icons/fa";
import axios from "axios";
import SummaryApi from "../../api/api";
// import api from "../../services/api";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);

  // Fetch pending orders count when component mounts and periodically thereafter
  useEffect(() => {
    fetchPendingOrdersCount();

    // Set up interval to periodically check for new pending orders
    const interval = setInterval(fetchPendingOrdersCount, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

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

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        pendingOrdersCount={pendingOrdersCount} // Pass the pending order count to Sidebar
      />

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-10 px-4 py-3">
        <div className="flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)}>
            <FaBars className="h-6 w-6 text-gray-600" />
          </button>
          {/* Show pending orders badge in mobile header */}
          {pendingOrdersCount > 0 && (
            <div className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {pendingOrdersCount > 9 ? "9+" : pendingOrdersCount}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-x-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-6 mt-14 md:mt-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
