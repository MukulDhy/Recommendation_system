import React, { useState } from "react";
import axios from "axios";
import ProductAiCart from "../components/ProductAiCart";

const AiSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/search?query=${searchTerm}`
      ); // Replace with your backend API endpoint
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Product Search</h1>
      <div className="w-full max-w-md mb-8">
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-lg"
          placeholder="Search for products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="w-full mt-4 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
      <div className="w-full max-w-4xl">
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products &&
              products.map((product, index) => (
                <ProductAiCart
                  product={product}
                  key={index}
                  index={index}
                ></ProductAiCart>
              ))}
          </div>
        ) : (
          !loading && <p className="text-gray-600">No products found.</p>
        )}
      </div>
    </div>
  );
};

export default AiSearch;
