import axios from "axios";
import PropTypes from "prop-types";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ProductCart = ({ product }) => {
  const [liked, setLiked] = useState(false);
  const { token } = useSelector((state) => state.user);
  const handleLike = async (productId) => {
    try {

      console.log(product)
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

  return (
    <div key={product._id} className="bg-white rounded-lg shadow-lg p-8">
      <div className="relative overflow-hidden h-40 group">
        <img
          className="object-contain w-full h-full transition-transform duration-300 ease-in-out transform group-hover:scale-110"
          src={product.image}
          alt={product.name}
        />
        <div className="hidden group-hover:block transition-opacity duration-300 ease-in-out">
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-300 ease-in-out"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Link to={`/product/${product._id}`}>
              <button className="bg-white text-gray-900 py-2 px-6 rounded-full font-bold hover:bg-gray-300 transition-colors duration-300 ease-in-out">
                View Product
              </button>
            </Link>
          </div>
        </div>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mt-4">
        {product.name.length < 40
          ? product.name
          : product.name.slice(0, 40) + "..."}
      </h3>
      <p className="text-gray-500 text-sm mt-2">
        {product.description.length < 100
          ? product.description
          : product.description.slice(0, 100) + "..."}
      </p>
      <div className="flex items-center justify-between mt-4">
        <span className="text-gray-900 font-bold text-lg">₹{product.price}</span>
        <button
          onClick={() => handleLike(product._id)}
          className={`w-1/2 py-2 px-4 rounded-full font-bold ${
            liked
              ? "bg-green-600 text-white"
              : "bg-gray-900 dark:bg-gray-600 text-white hover:bg-gray-800 dark:hover:bg-gray-700"
          }`}
          disabled={liked}
        >
          {liked ? "Liked" : "Like"}
        </button>
      </div>
    </div>
  );
};



ProductCart.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
  }).isRequired,
};

export default ProductCart;
