import React from 'react';

const AdminStatCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200 animate-pulse">
      <div className="flex items-center justify-between">
        {/* Left content */}
        <div className="flex flex-col space-y-2">
          <div className="h-3 bg-gray-200 rounded w-24" /> {/* title */}
          <div className="h-5 bg-gray-200 rounded w-16" /> {/* value */}
          <div className="h-3 bg-gray-200 rounded w-32" /> {/* subtitle */}
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 bg-gray-200 rounded-full" /> {/* trend icon */}
            <div className="h-3 bg-gray-200 rounded w-16" /> {/* trend text */}
          </div>
        </div>

        {/* Right icon */}
        <div className="p-3 rounded-full bg-gray-200">
          <div className="h-4 w-4 bg-gray-300 rounded" />
        </div>
      </div>
    </div>
  );
};

export default AdminStatCardSkeleton;