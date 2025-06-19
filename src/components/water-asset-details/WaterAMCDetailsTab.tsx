
import React from 'react';

export const WaterAMCDetailsTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative mb-6">
          <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="w-12 h-8 bg-gray-300 rounded"></div>
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
            <span className="text-white text-lg">🔍</span>
          </div>
        </div>
        
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">No AMC available</h2>
      </div>
    </div>
  );
};
