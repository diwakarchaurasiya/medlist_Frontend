import React from "react";

const RecommendationLoading = () => {
  return (
    <div className="flex flex-wrap gap-6 justify-center md:justify-start">
      {Array.from({ length: 5 }).map((_, idx) => (
        <div
          key={idx}
          className="w-full sm:w-[250px] rounded-md border border-gray-200 shadow overflow-hidden animate-pulse"
        >
          {/* Image */}
          <div className="h-[200px] bg-gray-300"></div>

          {/* Details */}
          <div className="p-4 space-y-2">
            <div className="h-4 w-3/4 bg-gray-300 rounded-md"></div>
            <div className="h-3 w-1/2 bg-gray-300 rounded-md"></div>
            <div className="h-3 w-1/2 bg-gray-300 rounded-md mt-2"></div>
            <div className="h-3 w-1/3 bg-gray-300 rounded-md"></div>
            <div className="mt-4 h-10 w-full bg-gray-300 rounded-md"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecommendationLoading;
