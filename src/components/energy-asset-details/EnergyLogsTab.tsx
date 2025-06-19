
import React from 'react';

export const EnergyLogsTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center">
          <span className="text-white text-xs">📄</span>
        </div>
        <h3 className="text-lg font-semibold text-[#C72030] uppercase">Logs</h3>
      </div>

      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
          <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">👤</span>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-blue-600 font-medium">Abhishek Sharma</span>
            <span className="text-gray-600">Created this asset</span>
          </div>
        </div>
      </div>
    </div>
  );
};
