import axios from "axios";
import React, { useEffect, useState } from "react";
import SummaryApi from "../../api/api";
import ProductCard from "../ProductsCard";
import { useNavigate } from "react-router-dom";

const Product = () => {
  const [items, setItems] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fn = async () => {
      const res = await axios.get(SummaryApi.getAllProducts.url, {
        withCredentials: true,
      });
      console.log("getallProdict", res.data.products);
      setItems(res.data.products);
    };
    fn();
  }, []);

  if (!items) {
    return <h1>No products found</h1>;
  }
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
        {items &&
          items
            .slice(0, 3) // Display only the first 3 products
            .map((item) => <ProductCard product={item} key={item._id} />)}
      </div>
      <div className="flex justify-center">
        {items && (
          <button
            onClick={() => navigate("/products")}
            className="mt-4 self-center p-3 bg-gray-300 rounded-xl cursor-pointer"
          >
            Load More
          </button>
        )}
      </div>
    </div>
  );
};

export default Product;
