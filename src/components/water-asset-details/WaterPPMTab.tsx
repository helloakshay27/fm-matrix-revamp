
import React from 'react';

export const WaterPPMTab = () => {
  const statusCards = [
    { count: 0, label: 'Schedule', color: 'bg-purple-600' },
    { count: 0, label: 'Open', color: 'bg-orange-700' },
    { count: 0, label: 'In Progress', color: 'bg-orange-500' },
    { count: 0, label: 'Closed', color: 'bg-green-600' },
    { count: 0, label: 'Overdue', color: 'bg-red-700' }
  ];

  return (
    <div className="space-y-6">
      {/* Status Cards */}
      <div className="grid grid-cols-5 gap-4">
        {statusCards.map((card, index) => (
          <div key={index} className={`${card.color} text-white p-4 rounded-lg`}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold">{card.count}</span>
              </div>
              <span className="font-medium">{card.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* No Scheduled Task */}
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
        
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Scheduled Task</h2>
      </div>
    </div>
  );
};
