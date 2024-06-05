import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import { useSelector } from "react-redux";
import axios from "axios";
import { FaStar } from "react-icons/fa"; // Import star icons
import ProtectedRouteError from "../../components/ProtectedRoute";

const truncateText = (text, limit) => {
  if (!text) {
    return "";
  }
  if (text.length <= limit) {
    return text;
  }
  return text.substring(0, limit) + "...";
};

const ProductScreen = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [liked, setLiked] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [hasRated, setHasRated] = useState(false);
  const { token } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/products/find/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProduct(response.data.product);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    
    fetchProduct();
  }, [id, token]);
  
  const { user } = useSelector((state) => state.user);
  if (!user) {
    return <ProtectedRouteError></ProtectedRouteError>;
  }
  const handleLike = async (productId) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/user/wishlist/${productId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        setLiked(true);
      } else {
        console.error("Failed to remove product from wishlist");
      }
    } catch (error) {
      console.error("Error removing product from wishlist:", error);
    }
  };
  const handleRatingSubmit = async (newRating) => {
    if (hasRated) return;
    try {
      const response = await axios.post(
        `http://localhost:4000/api/products/rate/${id}`,
        { rating: newRating },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        // setProduct((prevProduct) => ({
        //   ...prevProduct,
        //   ratings: [...prevProduct.ratings, newRating],
        // }));
        setHasRated(true);
        setRating(newRating);
      }
    } catch (error) {
      console.error("Error rating the product:", error);
    }
  };

  if (!product) {
    return <Loading />;
  }
  

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  let truncatedDescription = "";
  if (product) {
    truncatedDescription = truncateText(product.description, 700);
  }

  const averageRating = product.ratings.length
    ? (
        product.ratings.reduce((acc, rating) => acc + rating.rating, 0) /
        product.ratings.length
      ).toFixed(1)
    : "No ratings";

  return (
    <div className="bg-gray-100 dark:bg-gray-800 py-8 h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row -mx-4">
          <div className="md:flex-1 px-4">
            <div className="h-[460px] rounded-lg bg-gray-300 dark:bg-gray-700 mb-4">
              <img
                className="w-full h-full object-cover"
                src={product.image}
                alt={product.name}
              />
            </div>
            <div className="flex -mx-2 mb-4">
              <div className="w-1/2 px-2">
                <button
                  onClick={() => handleLike(product._id)}
                  className={`w-full py-2 px-4 rounded-full font-bold ${
                    liked
                      ? "bg-green-600 text-white"
                      : "bg-gray-900 dark:bg-gray-600 text-white hover:bg-gray-800 dark:hover:bg-gray-700"
                  }`}
                  disabled={liked}
                >
                  {liked ? "Liked" : "Like"}
                </button>
              </div>
              <div className="w-1/2 px-2">
                <button className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-2 px-4 rounded-full font-bold hover:bg-gray-300 dark:hover:bg-gray-600">
                  Add to Wishlist
                </button>
              </div>
            </div>
          </div>
          <div className="md:flex-1 px-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              {product.name}
            </h2>
            <div className="mb-4">
              <span className="font-bold text-gray-700 dark:text-gray-300">
                Product Description:
              </span>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                {showFullDescription
                  ? product.description
                  : truncatedDescription}
              </p>
              {product.description && product.description.length > 700 && (
                <button onClick={toggleDescription} className="text-blue-500">
                  {showFullDescription ? "Show Less" : "Read More"}
                </button>
              )}
            </div>
            <div className="flex mb-4">
              <div className="mr-4">
                <span className="font-bold text-gray-700 dark:text-gray-300">
                  Price:
                </span>
                <span className="text-gray-600 dark:text-gray-300 ml-2">
                  ₹{product.price}
                </span>
              </div>
              <div>
                <span className="font-bold text-gray-700 dark:text-gray-300">
                  Category:
                </span>
                <span className="text-gray-600 dark:text-gray-300 ml-2 capitalize">
                  {product.category}
                </span>
              </div>
            </div>
            <div className="flex mb-4">
              <div>
                <span className="font-bold text-gray-700 dark:text-gray-300">
                  Availability:
                </span>
                <span className="text-gray-600 dark:text-gray-300">
                  In Stock
                </span>
              </div>
              <div className="ml-4">
                <span className="font-bold text-gray-700 dark:text-gray-300">
                  Rating:
                </span>
                <span className="text-gray-600 dark:text-gray-300">
                  {averageRating}
                </span>
              </div>
            </div>
            <div className="mb-4">
              <span className="font-bold text-gray-700 dark:text-gray-300">
                Rate this product:
              </span>
              {!hasRated && (
                <div className="flex mt-2">
                  {[...Array(5)].map((star, index) => {
                    const ratingValue = index + 1;
                    return (
                      <label key={index}>
                        <input
                          type="radio"
                          name="rating"
                          value={ratingValue}
                          onClick={() => handleRatingSubmit(ratingValue)}
                          className="hidden"
                          disabled={hasRated}
                        />
                        <FaStar
                          size={24}
                          color={
                            ratingValue <= (hover || rating)
                              ? "#ffc107"
                              : "#e4e5e9"
                          }
                          onMouseEnter={() => setHover(ratingValue)}
                          onMouseLeave={() => setHover(null)}
                          className="cursor-pointer"
                        />
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
            <div>
              <span className="font-bold text-gray-700 dark:text-gray-300">
                Additional Description:
              </span>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                {product.longDescription}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductScreen;
