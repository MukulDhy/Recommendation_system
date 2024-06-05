import { Button } from "flowbite-react";
import React from "react";
import { HiOutlineArrowRight, HiShoppingCart } from "react-icons/hi";
import { Link } from "react-router-dom";
// import { Button } from "flowbite-react";
const Banner = () => {
  return (
    <div className="h-[550px] flex items-center banner bg-primeColor text-white text-center py-20">
      <div className="container mx-auto">
        <h1 className="text-5xl font-bold mb-4">
          Welcome to Our E-commerce Store!
        </h1>
        <p className="text-xl mb-8">
          Find the best products at the best prices.
        </p>

        <div className="flex justify-center">
          <Link
            to={"/products"}
            className=" text-center px-6 py-3 rounded-full font-semibold"
          >
            <Button className="bg-white text-lightText px-6 py-3 rounded-full font-semibold">
              Products
              <HiOutlineArrowRight className="ml-2 h-5 w-5 text-red-600" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Banner;
