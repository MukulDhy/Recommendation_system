import React from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRouteError = () => {
  const history = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
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
        <path d="M12 1L3 5v6c0 7.732 5.268 14 12 14s12-6.268 12-14V5l-9-4zM8 14v6M16 14v6"></path>
      </svg>
      <p className="text-gray-500 text-lg mb-4">
        This is a protected route. You need to log in to see it.
      </p>
      <button
        onClick={() => history("/login")}
        className="bg-primeColor text-white py-2 px-6 rounded-full font-bold hover:bg-primeDark transition-colors duration-300 ease-in-out"
      >
        Go to Login
      </button>
    </div>
  );
};

export default ProtectedRouteError;
