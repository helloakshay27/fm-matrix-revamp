
import React from 'react';
import { Button } from '@/components/ui/button';

export const PPMTab = () => {
const statusCards = [
  { count: 0, label: 'Schedule', bgColor: '#F2C8C4' },
  { count: 0, label: 'Open', bgColor: '#F2C8C4' },
  { count: 0, label: 'In Progress', bgColor: '#F2C8C4' },
  { count: 0, label: 'Closed', bgColor: '#F2C8C4' },
  { count: 0, label: 'Overdue', bgColor: '#F2C8C4' },
];

  return (
    <div className="space-y-6">
      {/* Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
    {statusCards.map((card, index) => (
      <div
        key={index}
        className="p-4 min-h-[96px] bg-[#f6f4ee] text-sm text-black shadow-sm"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm"
            style={{
              backgroundColor: card.bgColor,
              color: '#C72030', // ← your requested text color
            }}
          >
            {card.count}
          </div>
          <div className="font-medium text-sm">{card.label}</div>
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
