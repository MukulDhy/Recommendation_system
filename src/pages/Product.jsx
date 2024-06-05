import React, { useState, useEffect } from "react";
import ProductCart from "../components/Product/ProductCart";
import Loading from "../components/Loading/Loading";

const ProductSearch = () => {
  const [categories, setCategories] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/api/products/categories"
        );
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/api/products/all?keyword=${searchQuery + selectedCategory}`
        );
        const data = await response.json();
        setFilteredProducts(data.products);
      } catch (error) {
        console.error("Error fetching filtered products:", error);
      }
    };

    fetchFilteredProducts();
  }, [searchQuery, selectedCategory]);

  if (!categories || !filteredProducts) {
    return <Loading></Loading>;
  }

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-1/4 p-4 bg-gray-200 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-2">Categories</h2>
        <ul>
          {categories.map((category, index) => (
            <li
              key={index}
              className="cursor-pointer hover:text-blue-500 transition duration-300 ease-in-out transform hover:scale-105"
              onClick={() => handleCategorySelect(category)}
            >
              {category}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 bg-gray-100 p-4 overflow-y-auto">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full md:w-4/5 p-4 rounded border border-gray-300 transition duration-300 ease-in-out transform hover:scale-100"
        />
        

        <div className="bg-lightBaground py-8">
          <div className="container mx-auto px-1">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {filteredProducts.map((product, i) => (
                <ProductCart product={product} key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSearch;
