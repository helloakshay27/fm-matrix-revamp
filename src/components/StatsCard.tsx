
import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  color: 'orange' | 'green' | 'red';
  icon: React.ReactNode;
}

const getCardColors = (color: string) => {
  switch (color) {
    case 'orange':
      return 'bg-gradient-to-r from-orange-500 to-red-500';
    case 'green':
      return 'bg-gradient-to-r from-green-500 to-emerald-500';
    case 'red':
      return 'bg-gradient-to-r from-red-500 to-pink-500';
    default:
      return 'bg-gradient-to-r from-gray-500 to-gray-600';
  }
};

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, color, icon }) => {
  return (
    <div className={`${getCardColors(color)} p-6 rounded-xl shadow-sm text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-white/90 mb-2">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        <div className="text-white/80">
          {icon}
        </div>
      </div>
    </div>
  );
};
