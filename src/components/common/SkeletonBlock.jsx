import React from "react";

const SkeletonBlock = ({
  width = "100%",
  height = 16,
  rounded = "0.375rem",
  className = "",
}) => {
  return (
    <div
      className={`bg-gray-200 animate-pulse ${className}`}
      style={{ width, height, borderRadius: rounded }}
      aria-hidden
    />
  );
};

export default SkeletonBlock;
