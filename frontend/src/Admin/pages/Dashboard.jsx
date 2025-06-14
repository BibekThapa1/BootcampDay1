import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaShoppingCart,
  FaRupeeSign,
  FaBox,
  FaExclamationTriangle,
} from "react-icons/fa";
// import api from "../../services/api";
import { toast } from "react-toastify";
import Loading from "../../components/Loading";
import axios from "axios";
import SummaryApi from "../../api/api";

const StatCard = ({ title, value, icon, subtext, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
  >
    <div className="flex items-center justify-between mb-4">
      <div className="p-2 bg-gray-100 rounded-lg">{icon}</div>
    </div>
    <div>
      <h3 className="text-gray-600 text-sm">{title}</h3>
      <p className="text-2xl font-bold mt-1">{value}</p>
      {subtext && <p className="text-sm text-gray-500 mt-1">{subtext}</p>}
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: { total: 0, active: 0 },
    products: { total: 0, outOfStock: 0 },
    orders: { total: 0, totalRevenue: 0, pending: 0 },
    recentOrders: [],
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get(SummaryApi.getDashboardStats.url, {
          withCredentials: true,
        });
        console.log(response);
        if (response.data.success) {
          setStats(response.data.data);
        } else {
          toast.error("Failed to fetch dashboard statistics");
        }
      } catch (error) {
        console.error("Dashboard stats error:", error);
        toast.error(
          error.response?.data?.message || "Error fetching dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={stats.users?.total || 0}
          icon={<FaUsers className="h-6 w-6 text-blue-600" />}
          subtext={`${stats.users?.active || 0} active users`}
          onClick={() => navigate("/admin/users")}
        />

        <StatCard
          title="Total Products"
          value={stats.products?.total || 0}
          icon={<FaBox className="h-6 w-6 text-green-600" />}
          subtext={`${stats.products?.outOfStock || 0} out of stock`}
          onClick={() => navigate("/admin/products")}
        />

        <StatCard
          title="Total Orders"
          value={stats.orders?.total || 0}
          icon={<FaShoppingCart className="h-6 w-6 text-yellow-600" />}
          subtext={`${stats.orders?.pending || 0} orders pending`}
          onClick={() => navigate("/admin/orders")}
        />

        <StatCard
          title="Total Revenue"
          value={`Rs. ${(stats.orders?.totalRevenue || 0).toLocaleString()}`}
          icon={<FaRupeeSign className="h-6 w-6 text-purple-600" />}
          subtext="All time revenue"
          onClick={() => navigate("/admin/orders")}
        />
      </div>

      {/* Recent Orders Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {stats.recentOrders && stats.recentOrders.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate("/admin/orders")}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      #{order._id.slice(-6)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.user?.name || "Guest"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Rs. {order.total.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          order.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No recent orders
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
