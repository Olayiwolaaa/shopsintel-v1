
"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonLoader() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="bg-card rounded-lg shadow-md overflow-hidden border border-gray-700 animate-pulse"
        >
          {/* Video Thumbnail Skeleton */}
          <div className="relative aspect-[3/4] w-full bg-gray-300"></div>

          {/* Content Section */}
          <div className="p-4">
            {/* Video Description */}
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>

            {/* Product Image & Details */}
            <div className="flex items-start mb-3">
              <div className="relative w-16 h-16 mr-3 flex-shrink-0 bg-gray-300 rounded-md"></div>
              <div className="flex-grow min-w-0">
                <div className="h-3 bg-gray-300 rounded w-5/6 mb-1"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-3 bg-gray-300 rounded w-full"></div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
