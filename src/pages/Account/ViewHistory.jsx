import React, { useEffect, useState } from "react";
import ProductCard from "../../components/Product/ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserViewHistory } from "../../Store/Slice/productSlice";
import axios from "axios";

const ViewHistory = () => {
  const [products, setProducts] = useState(null);
  const dispatch = useDispatch();

  const { viewHistory } = useSelector((state) => state.products);
  const { token } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch user view history if it's not already available
      if (!viewHistory) {
        try {
          const response = await axios.get(
            `http://localhost:4000/api/user/viewHistory`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setProducts(response.data.products);
        } catch (error) {
          console.error("Error fetching user view history:", error);
        }
      }
    };

    fetchData();
  }, [token, dispatch, viewHistory]);

  const handleRemoveProduct = async (productId) => {
    try {
      const response = await axios.post(
        `http://localhost:4000/api/products/deleteHistory/${productId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data);
      if (response.status === 200) {
        setProducts(
          products.filter((product) => product.productId._id !== productId)
        );
      } else {
        console.error("Failed to remove product from view history");
      }
      // Optionally update the state based on the response
    } catch (error) {
      console.error("Error removing product from view history:", error);
    }
  };

  return (
    <div>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">View History</h1>
        {products && products.length > 0 ? (
          <div className="grid grid-row-4 gap-4">
            {products.map((product) => (
              <ProductCard
                key={product.productId._id}
                product={product.productId}
                onRemove={() => handleRemoveProduct(product.productId._id)}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-lg">No products in view history</p>
        )}
      </div>
    </div>
  );
};

export default ViewHistory;
