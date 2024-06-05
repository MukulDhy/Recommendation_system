import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product, onRemove }) => {
  const truncatedDescription =
    product.description.length > 100
      ? product.description.substring(0, 200) + "..."
      : product.description;

  return (
    <div className="bg-white p-4 rounded relative shadow-md flex hover:bg-primeColor hover:text-white">
      <Link to={`/product/${product._id}`} className="w-40 h-40">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover mb-4 rounded"
        />
      </Link>
      <div className="p-4 flex flex-col justify-between hover:text-white">
        <div>
          <h2 className="text-lg font-bold">{product.name}</h2>
          <p className="overflow-hidden overflow-ellipsis  break-words">
            {truncatedDescription}
          </p>
          <div className="flex justify-between">
            <p className="font-bold">Category : {product.category}</p>
            <p className="font-bold">Price : ₹{product.price}</p>
          </div>
          <p className="font-bold">
            Rating : {product.ratings.length ? product.ratings.length : "NAN"}
          </p>
        </div>
        {/* <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-600 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a.997.997 0 0 1-.724-.308l-5.776-5.572a1 1 0 1 1 1.448-1.384l5.053 4.863L16.276 6.69a1 1 0 1 1 1.448 1.384l-6.5 6.25A.997.997 0 0 1 10 18zm5.125-9.125a.997.997 0 0 1-1.448 0l-6.5-6.25A1 1 0 1 1 8.724 1.308L14 6.978l-5.776 5.572a1 1 0 1 1-1.448-1.384l6.5-6.25a.997.997 0 0 1 1.448 0l6.5 6.25a1 1 0 0 1 0 1.384z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-gray-600">{product.likes}</span>
        </div> */}
        <button onClick={onRemove} className="absolute right-6 top-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 8.293l4.646-4.647a1 1 0 0 1 1.414 1.414L11.414 10l4.646 4.646a1 1 0 0 1-1.414 1.414L10 11.414l-4.646 4.646a1 1 0 0 1-1.414-1.414L8.586 10 3.94 5.354a1 1 0 1 1 1.414-1.414L10 8.293z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
