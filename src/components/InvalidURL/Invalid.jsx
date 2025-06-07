import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets_frontend/assets";

const Invalid = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white text-black px-6">
      {/* 404 Image */}
      <img src={assets.sad404} alt="404" className="w-36 mb-8" />

      {/* Title */}
      <h1 className="text-3xl md:text-5xl font-semibold mb-4 text-center">
        Oops! Page Not Found
      </h1>

      {/* Subtext */}
      <p className="text-base text-gray-600 mb-6 text-center">
        The page you are looking for doesn’t exist or has been moved.
      </p>

      {/* Back to Home Button */}
      <Link to="/">
        <button className="bg-primary text-white px-6 py-2 rounded-full font-medium hover:opacity-90 transition duration-200">
          Go to Homepage
        </button>
      </Link>
    </div>
  );
};

export default Invalid;
