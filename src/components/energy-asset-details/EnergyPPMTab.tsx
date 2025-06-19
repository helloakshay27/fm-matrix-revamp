
import React from 'react';

export const EnergyPPMTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">📋</div>
        <h3 className="text-lg font-semibold text-orange-500 uppercase">PPM</h3>
      </div>

      {/* Status Cards */}
      <div className="flex gap-4 mb-6">
        <div className="bg-purple-600 text-white px-6 py-3 rounded-lg">
          <div className="text-2xl font-bold">0</div>
          <div className="text-sm">Schedule</div>
        </div>
        <div className="bg-orange-600 text-white px-6 py-3 rounded-lg">
          <div className="text-2xl font-bold">0</div>
          <div className="text-sm">Open</div>
        </div>
        <div className="bg-yellow-600 text-white px-6 py-3 rounded-lg">
          <div className="text-2xl font-bold">0</div>
          <div className="text-sm">In Progress</div>
        </div>
        <div className="bg-green-600 text-white px-6 py-3 rounded-lg">
          <div className="text-2xl font-bold">0</div>
          <div className="text-sm">Closed</div>
        </div>
        <div className="bg-red-600 text-white px-6 py-3 rounded-lg">
          <div className="text-2xl font-bold">0</div>
          <div className="text-sm">Overdue</div>
        </div>
      </div>

      {/* No Scheduled Task */}
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-400 text-xs">📄</span>
          </div>
        </div>
        <p className="text-lg font-medium text-gray-700">No Scheduled Task</p>
      </div>
    </div>
  );
};
