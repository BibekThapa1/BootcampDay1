import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import axios from "axios";
import SummaryApi from "../api/api";
import ProductCard from "../components/ProductsCard";

const Products = () => {
  const [items, setItems] = useState(null);

  useEffect(() => {
    const fn = async () => {
      const res = await axios.get(SummaryApi.getAllProducts.url, {
        withCredentials: true,
      });
      console.log("Response:", res);
      setItems(res.data.products);
    };
    fn();
  }, []);
  console.log("Entered");
  if (!items) {
    return <h1 className="text-3xl text-black p-10">No products found</h1>;
  }

  console.log("en");
  return (
    <>
      <h1 className="p-4 text-3xl font-bold italic text-center">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8 p-5">
        {items?.map((item) => (
          <ProductCard product={item} key={item._id} />
        ))}
      </div>
    </>
  );
};

export default Products;
