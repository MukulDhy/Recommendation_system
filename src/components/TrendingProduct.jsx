// import React from "react";
import { useEffect, useState } from "react";
import ProductCart from "./Product/ProductCart";
import axios from "axios";

const TrendingProduct = () => {
  // const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products from the backend
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/products/trending"
        ); // Replace with your backend API endpoint
        const data = response.data;
        console.log(data);
        setProducts(data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const [products, setProducts] = useState();

  return (
    <div className="w-full pt-8 shadow-xl bg-[#F5F5F3] relative">
      <div className="max-w-container mx-auto">
        <div className="title">
          <h2 className="text-primeColor text-center font-titleFont font-bold text-2xl">
            Trending Products
          </h2>
          <div className="bg-lightBaground py-8">
            <div className="container mx-auto px-1">
              <div className="grid grid-cols-3 md:grid-cols-4 gap-8">
                {products &&
                  products.map((product, i) => (
                    <ProductCart product={product} key={i} />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingProduct;
