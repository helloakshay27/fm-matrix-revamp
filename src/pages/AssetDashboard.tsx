
import React from 'react';

export const AssetDashboard = () => {
  return (
    <div className="p-6 bg-[#f6f4ee] min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>maintenance</span>
          <span>&gt;</span>
          <span>Assets</span>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-6">ASSETS</h1>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-gray-600">Assets dashboard content will be displayed here.</p>
        </div>
      </div>
    </div>
  );
};
