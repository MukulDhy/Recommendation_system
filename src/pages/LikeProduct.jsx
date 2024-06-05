import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import ProductCard from "../components/Product/ProductCard";

const Wishlist = () => {
  const [products, setProducts] = useState(null);
  const dispatch = useDispatch();

  const { wishlist } = useSelector((state) => state.products);
  const { token } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch user wishlist if it's not already available
      if (!wishlist) {
        try {
          const response = await axios.get(
            `http://localhost:4000/api/user/wishlist`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setProducts(response.data.products);
        } catch (error) {
          console.error("Error fetching user wishlist:", error);
        }
      }
    };

    fetchData();
  }, [token, dispatch, wishlist]);

  const handleRemoveProduct = async (productId) => {
    try {
      const response = await axios.delete(
        `http://localhost:4000/api/user/wishlist/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        setProducts(products.filter((product) => product._id !== productId));
      } else {
        console.error("Failed to remove product from wishlist");
      }
    } catch (error) {
      console.error("Error removing product from wishlist:", error);
    }
  };

  return (
    <div>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Wishlist</h1>
        {products && products.length > 0 ? (
          <div className="grid grid-row-4 gap-4">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onRemove={() => handleRemoveProduct(product._id)}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-lg">No products in wishlist</p>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
