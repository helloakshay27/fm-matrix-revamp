
import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  color: 'orange' | 'green' | 'red';
  icon: React.ReactNode;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, color, icon }) => {
  const colorClasses = {
    orange: 'from-[#F4C790] to-[#DBC2A9]',
    green: 'from-[#A4F4E7] to-[#AAB9C5]',
    red: 'from-[#E4626F] to-[#C72030]'
  };

  return (
    <div className={`bg-gradient-to-r ${colorClasses[color]} p-6 rounded-xl shadow-sm`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="bg-[#f6f4ee] px-3 py-1 rounded-md inline-block mb-2">
            <p className="text-sm font-medium text-[#1a1a1a]">{title}</p>
          </div>
          <p className="text-3xl font-bold text-[#1a1a1a] mt-1">{value}</p>
        </div>
        <div className="text-[#1a1a1a] opacity-70">
          {icon}
        </div>
      </div>
    </div>
  );
};
