
import React from 'react';

export const StatsCard = ({ title, value, color, icon }) => {
  const getGradientClass = (color) => {
    switch (color) {
      case '#8B5FBF':
        return 'bg-gradient-to-r from-purple-600 to-orange-500';
      case '#10B981':
        return 'bg-gradient-to-r from-green-500 to-green-400';
      case '#EF4444':
        return 'bg-gradient-to-r from-red-500 to-red-400';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-400';
    }
  };

  return (
    <div className={`${getGradientClass(color)} p-6 rounded-xl shadow-sm text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-4xl font-bold mb-1">{value}</p>
          <p className="text-sm font-medium opacity-90">{title}</p>
        </div>
        <div className="opacity-80">
          {icon}
        </div>
      </div>
    </div>
  );
};
