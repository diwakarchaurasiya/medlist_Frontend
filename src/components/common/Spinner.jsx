import React from "react";

const Spinner = ({ size = 32, className = "" }) => {
  const borderSize = Math.max(2, Math.round(size / 8));
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className="animate-spin rounded-full border-gray-200 border-t-primary"
        style={{
          width: size,
          height: size,
          borderWidth: borderSize,
        }}
        aria-label="Loading"
        role="status"
      />
    </div>
  );
};

export default Spinner;
