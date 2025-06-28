
import React from 'react';
import { cn } from '@/lib/utils';

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
    <div className={cn(
      "bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200",
      // Remove border radius as per design specs
      "rounded-none",
      // Desktop spacing (default) - 24px padding
      "p-6",
      // Tablet spacing - 20px padding  
      "md:p-5",
      // Mobile spacing - 16px padding
      "sm:p-4"
    )}>
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
