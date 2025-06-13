
import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  color: 'orange' | 'green' | 'red';
  icon: React.ReactNode;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, color, icon }) => {
  return (
    <div className="bg-[#f6f4ee] p-6 rounded-xl shadow-sm">
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
