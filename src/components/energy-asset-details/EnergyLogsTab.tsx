
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

      <div className="text-sm text-gray-600 mb-4">
        marked the asset as
      </div>

      <div className="text-sm text-gray-600 mb-4">
        <strong>Reason:</strong> yEs
      </div>

      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
            <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">👤</span>
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-600 font-medium">PSPL1</span>
              <span className="text-gray-600">made below changes:</span>
            </div>
            <div className="space-y-1 text-sm">
              <div><strong>Breakdown:</strong> <span className="text-gray-600">From: false Changed: to true</span></div>
              <div><strong>Breakdown Date:</strong> <span className="text-gray-600">From: 21/05/2025, 11:58 AM Changed: to NA</span></div>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
            <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">👤</span>
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gray-600">made below changes:</span>
            </div>
            <div className="space-y-1 text-sm">
              <div><strong>Breakdown:</strong> <span className="text-gray-600">From: true Changed: to false</span></div>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
            <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">👤</span>
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-600 font-medium">Shubh jhaevri</span>
              <span className="text-gray-600">made below changes:</span>
            </div>
            <div className="space-y-1 text-sm">
              <div><strong>Breakdown:</strong> <span className="text-gray-600">From: NA Changed: to true</span></div>
              <div><strong>Breakdown Date:</strong> <span className="text-gray-600">From: NA Changed: to 21/05/2025, 11:58 AM</span></div>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
            <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">👤</span>
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-600 font-medium">PSPL1</span>
              <span className="text-gray-600">made below changes:</span>
            </div>
            <div className="space-y-1 text-sm">
              <div><strong>Warranty Expiry:</strong> <span className="text-gray-600">From: 01/01/2027 Changed: to NA</span></div>
              <div><strong>Commissioning Date:</strong> <span className="text-gray-600">From: 02/02/2025 Changed: to NA</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
