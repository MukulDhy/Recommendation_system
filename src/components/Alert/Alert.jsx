// src/components/Alert.js
import React, { useEffect } from "react";
import { useState } from "react";

const Alert = ({ type, message, duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center justify-between p-4 border-l-4 rounded shadow-lg transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }
      ${
        type === "success"
          ? "bg-green-100 border-green-500"
          : "bg-red-100 border-red-500"
      }`}
    >
      <span className="mr-2">
        {type === "success" ? (
          <svg
            className="w-4 h-4 flex text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="12 12 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#c8e6c9"
              d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"
            ></path>
            <path
              fill="#4caf50"
              d="M34.586,14.586l-13.57,13.586l-5.602-5.586l-2.828,2.828l8.434,8.414l16.395-16.414L34.586,14.586z"
            ></path>
          </svg>
        ) : (
          <svg
            className="w-6 h-6 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        )}
      </span>
      <span>{message}</span>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-300">
        <div
          className="h-full bg-current"
          style={{ animation: `fadeOut ${duration}ms linear` }}
        ></div>
      </div>
    </div>
  );
};

export default Alert;
