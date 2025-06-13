
import React from 'react';

export const StaffsDashboard = () => {
  return (
    <div className="p-6 bg-[#f6f4ee] min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>visitors</span>
          <span>&gt;</span>
          <span>Staffs</span>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-8 min-h-[400px] flex items-center justify-center">
          <div className="text-center text-gray-500">
            <h2 className="text-xl font-semibold mb-2">Staffs</h2>
            <p>Staffs content will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );
};
