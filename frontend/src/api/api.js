const backendDomain = "http://localhost:3000/api/v1";

const SummaryApi = {
  // Authentication
  register: {
    url: `${backendDomain}/user/register`,
    method: "POST",
  },
  login: {
    url: `${backendDomain}/user/login`,
    method: "POST",
  },
  logout: {
    url: `${backendDomain}/user/logout`,
    method: "GET",
  },

  //   User Info
  getUserInfo: {
    url: `${backendDomain}/user/profile`,
    method: "GET",
  },
  updateUser: {
    url: `${backendDomain}/user/profile/edit`,
    method: "PATCH",
  },
  getAllUser: {
    url: `${backendDomain}/user/all`,
    method: "GET",
  },
  getMyInfo:{
    url:`${backendDomain}/user/getMyInfo`,
    method:"GET"
  },

  //   Products routes
  getAllProducts: {
    url: `${backendDomain}/product`,
    method: "GET",
  },
  addProduct: {
    url: `${backendDomain}/product`,
    method: "POST",
  },
  updateProduct: {
    url: `${backendDomain}/product`,
    method: "PATCH",
  },
  deleteProduct: {
    url: `${backendDomain}/product`,
    method: "DELETE",
  },
  getProductById: {
    url: `${backendDomain}/product`,
    method: "GET",
  },

  //   Order routes
  createOrder: {
    url: `${backendDomain}/order`,
    method: "POST",
  },
  getAllOrder: {
    url: `${backendDomain}/order`,
    method: "GET",
  },
  getUserOrder: {
    url: `${backendDomain}/order/my-orders`,
    method: "GET",
  },
  updateOrderStatus: {
    url: `${backendDomain}/order/status`,
    method: "PATCH",
  },
  getOrderById: {
    url: `${backendDomain}/order`,
    method: "GET",
  },
  deleteOrder: {
    url: `${backendDomain}/order`,
    method: "DELETE",
  },
  updateProductStock: {
    url: `${backendDomain}/order/product/stock`,
    method: "PATCH",
  },
  cancelOrder: {
    url: `${backendDomain}/order/cancel`,
    method: "PUT",
  },

  //Cart api
  getCart: {
    url: `${backendDomain}/cart`,
    method: "GET",
  },
  addToCart: {
    url: `${backendDomain}/cart/add`,
    method: "POST",
  },
  updateCartItem: {
    url: `${backendDomain}/cart/update`,
    method: "PUT",
  },
  removeCartItem: {
    url: `${backendDomain}/cart/remove`,
    method: "DELETE",
  },
  clearCart: {
    url: `${backendDomain}/cart/clear`,
    method: "DELETE",
  },

  //   Admin routes
  getAllOrder: {
    url: `${backendDomain}/admin/orders`,
    method: "GET",
  },
  getNewOrdersCount: {
    url: `${backendDomain}/admin/orders/new`,
    method: "GET",
  },
  getPendingOrdersCount: {
    url: `${backendDomain}/admin/orders/pending-count`,
    method: "GET",
  },
  getDashboardStats: {
    url: `${backendDomain}/admin/dashboard-stats`,
    method: "GET",
  },
  updateOrderStatus: {
    url: `${backendDomain}/admin/orders`,
    method: "PUT",
  },
};

export default SummaryApi