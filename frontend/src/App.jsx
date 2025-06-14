import React from "react";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import { AuthProvider } from "./context/AuthContext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/Signup";
import Products from "./pages/Products";
import { CartProvider } from "./context/CartContext";
import Cart from "./pages/Cart";
import Order from "./pages/Orders";
import Profile from "./pages/Profile";
import Dashboard from "./Admin/pages/Dashboard";
import Layout from "./Admin/layouts/Layout";
import Product from "./Admin/components/Product";
import User from "./Admin/components/User";
import AdminOrder from "./Admin/components/Order";
import ProductDetail from "./pages/ProductsDetail";

const App = () => {
  return (
    <>
      <AuthProvider>
        <CartProvider>
          <Router>
            <ToastContainer />
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/signin" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/products" element={<Products />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/orders" element={<Order />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin/*" element={<Layout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="products" element={<Product />} />
                <Route path="users" element={<User />} />
                <Route path="orders" element={<AdminOrder />} />

                {/* Add more admin child routes here, e.g. products, users, orders, etc. */}
              </Route>
            </Routes>
            <Footer />
          </Router>
        </CartProvider>
      </AuthProvider>
    </>
  );
};

export default App;
