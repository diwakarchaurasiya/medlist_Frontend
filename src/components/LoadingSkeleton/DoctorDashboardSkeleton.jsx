import React from "react";
import SkeletonBlock from "../common/SkeletonBlock";

const DoctorDashboardSkeleton = () => {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <SkeletonBlock width={260} height={28} />

        {/* Quick nav */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg p-4 border animate-pulse"
            >
              <SkeletonBlock
                width={44}
                height={44}
                rounded="9999px"
                className="mx-auto mb-2"
              />
              <SkeletonBlock width={100} height={12} className="mx-auto" />
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg p-6 border animate-pulse"
            >
              <SkeletonBlock width={120} height={12} className="mb-2" />
              <SkeletonBlock width={80} height={28} className="mb-2" />
              <SkeletonBlock width={60} height={12} />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6 border">
            <SkeletonBlock width="100%" height={300} rounded="0.5rem" />
          </div>
          <div className="bg-white rounded-lg p-6 border">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <SkeletonBlock width={160} height={14} />
                <SkeletonBlock width={80} height={12} />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border">
          <SkeletonBlock width={180} height={20} className="mb-4" />
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="grid grid-cols-5 gap-4 py-2">
              {Array.from({ length: 5 }).map((__, j) => (
                <SkeletonBlock key={j} height={14} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboardSkeleton;
