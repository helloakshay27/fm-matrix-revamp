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
    <div className={`bg-[#f6f4ee] rounded-lg p-6 shadow-[0px_1px_8px_rgba(45,45,45,0.05)] hover:shadow-lg transition-shadow flex items-center gap-4 ${className}`} onClick={onClick}>
      <div className="w-14 h-14 bg-[#C4B89D54]  flex items-center justify-center">{icon}</div>
      <div>
        <p className="text-2xl font-semibold text-[#1A1A1A]">{value}</p>
        <p className="text-sm font-medium text-[#1A1A1A]">{title}</p>
      </div>
    </div>
  );
};
