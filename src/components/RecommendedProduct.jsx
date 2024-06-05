import React, { useEffect, useState } from "react";
import ProductCart from "./Product/ProductCart";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const RecommendedProduct = () => {
  const [products, setProducts] = useState([]);
  const { token } = useSelector((state) => state.user);
  useEffect(() => {
    // Fetch products from the backend
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/products/recommend",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
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

  return (
    <div className="w-full pt-8 shadow-xl bg-[#F5F5F3] relative">
      <div className="max-w-container mx-auto">
        <div className="title">
          <h2 className="text-primeColor text-center font-titleFont font-bold text-2xl">
            Recommended Products
          </h2>
          <div className="bg-lightBackground py-8">
            <div className="container mx-auto px-1">
              {products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  {products.map((product, i) => (
                    <ProductCart product={product} key={i} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  {/* Shopping bag SVG icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-24 h-24 text-gray-400 mb-4"
                  >
                    <path d="M2 6l2-2h16l2 2H2zM9 12v8a2 2 0 002 2h2a2 2 0 002-2v-8"></path>
                    <path d="M17 12L12 7 7 12"></path>
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      d="M0 0h24v24H0z"
                    ></path>
                  </svg>
                  <p className="text-gray-500 text-lg mb-4">
                    No recommended products available.
                  </p>
                  <Link to="/products">
                    <button className="bg-primeColor text-white py-2 px-6 rounded-full font-bold hover:bg-primeDark transition-colors duration-300 ease-in-out">
                      View All Products
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendedProduct;
