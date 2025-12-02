import React from 'react';

const TermHighlightsSkeleton = () => {
  return (
    <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-200 p-4 md:p-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center space-x-2 md:space-x-3 mb-3 md:mb-4">
        <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-200 rounded-lg md:rounded-xl" />
        <div className="h-4 md:h-5 bg-gray-200 rounded w-32" />
      </div>

      <div className="space-y-2 md:space-y-3">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center p-2 bg-gray-50 rounded-lg border border-gray-100"
          >
            <div className="h-3 md:h-4 bg-gray-200 rounded w-24" />
            <div className="h-3 md:h-4 bg-gray-200 rounded w-20" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TermHighlightsSkeleton;