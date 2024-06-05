// import axios from "axios";
import PropTypes from "prop-types";
// import { useState } from "react";
// import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ProductAiCart = ({ product, data, index }) => {
  //   const [liked, setLiked] = useState(false);
  //   const { token } = useSelector((state) => state.user);

  return (
    <div key={index} className="bg-white rounded-lg shadow-lg p-8">
      <div className="relative overflow-hidden h-40 group">
        <img
          className="object-contain w-full h-full transition-transform duration-300 ease-in-out transform group-hover:scale-110"
          src={JSON.parse(product.image)[0]}
          alt={product.name}
        />
        <div className="hidden group-hover:block transition-opacity duration-300 ease-in-out">
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-300 ease-in-out"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Link>
              <button className="bg-white text-gray-900 py-2 px-6 rounded-full font-bold hover:bg-gray-300 transition-colors duration-300 ease-in-out"></button>
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
        <span className="text-gray-900 font-bold text-lg">
          ₹{product.price}
        </span>
      </div>
    </div>
  );
};

export default ProductAiCart;
