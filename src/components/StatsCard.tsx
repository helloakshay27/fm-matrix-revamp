
import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  color: 'orange' | 'green' | 'red';
  icon: React.ReactNode;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, color, icon }) => {
  const getColorClasses = () => {
    switch (color) {
      case 'orange':
        return 'text-orange-500';
      case 'green':
        return 'text-green-500';
      case 'red':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-full bg-gray-50 ${getColorClasses()}`}>
          {icon}
        </div>
        <div className={`text-2xl font-bold ${getColorClasses()}`}>
          {value}
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
          {title}
        </p>
      </div>
    </div>
  );
};
