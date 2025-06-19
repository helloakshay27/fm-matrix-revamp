
import React from 'react';

export const EnergyLogsTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">📝</div>
        <h3 className="text-lg font-semibold text-orange-500 uppercase">Logs</h3>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
        <p className="text-gray-500 text-lg">No logs available</p>
      </div>
    </div>
  );
};
