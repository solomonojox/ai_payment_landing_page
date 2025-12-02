import React from 'react';

const AdminActivityLogsSkeleton = ({ count = 5 }) => {
  return (
    <div className="animate-pulse">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex items-start space-x-3 p-3 rounded-lg transition-colors"
        >
          {/* Icon placeholder */}
          <div className="p-2 bg-gray-200 rounded-full">
            <div className="h-4 w-4 bg-gray-300 rounded" />
          </div>

          {/* Text placeholders */}
          <div className="flex-1 min-w-0 space-y-1">
            <div className="h-3 bg-gray-200 rounded w-3/4" /> {/* description */}
            <div className="h-2 bg-gray-200 rounded w-1/4" /> {/* time */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminActivityLogsSkeleton;