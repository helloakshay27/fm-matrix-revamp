import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  onClick?: (status: string) => void;
  className?: string
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, onClick, className }) => {
  return (
    <div className={`bg-[#f6f4ee] rounded-lg p-4 shadow-[0px_2px_18px_rgba(45,45,45,0.1)] flex items-center gap-4 md:h-[132px] ${className}`} onClick={onClick}>
      <div className="w-12 h-12 rounded-full bg-[rgba(199,32,48,0.08)] flex items-center justify-center">
        {/* Icon passed as prop */}
        <div className="text-[#D92818]">{icon}</div>
      </div>
      <div>
        <p className="text-[#D92818] font-bold text-lg">{value}</p>
        <p className="text-sm text-gray-500">{title}</p>
      </div>
    </div>
  );
};
