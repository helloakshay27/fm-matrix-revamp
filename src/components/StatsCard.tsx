// import React from 'react';

// interface StatsCardProps {
//   title: string;
//   value: string | number;
//   icon: React.ReactNode;
//   onClick?: (status: string) => void;
//   className?: string
// }

// export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, onClick, className }) => {
//   return (
//     <div className={`bg-[#f6f4ee] rounded-lg p-6 shadow-[0px_1px_8px_rgba(45,45,45,0.05)] hover:shadow-lg transition-shadow flex items-center gap-4 ${className}`} onClick={onClick}>
//       <div className="w-14 h-14 bg-[#C4B89D54]  flex items-center justify-center">{icon}</div>
//       <div>
//         <p className="text-2xl font-semibold text-[#1A1A1A]">{value}</p>
//         <p className="text-sm font-medium text-[#1A1A1A]">{title}</p>
//       </div>
//     </div>
//   );
// };

import React, { useState } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  onClick?: (status: string) => void;
  className?: string;
  selected?: boolean; // <-- add prop for selection
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  onClick,
  className,
  selected = false,
}) => {
  return (
    <div
      className={`rounded-lg p-3 sm:p-4 lg:p-6 shadow-sm hover:shadow-lg transition-shadow flex items-center gap-2 sm:gap-3 lg:gap-4 cursor-pointer 
      ${selected ? "bg-[rgb(230_226_218_/_1)]" : "bg-[#f6f4ee]"} ${className}`}
      onClick={() => onClick?.(title)}
    >
      <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-[#C4B89D54] flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-[#1A1A1A] truncate">{value}</p>
        <p className="text-xs sm:text-sm font-medium text-[#1A1A1A] truncate">{title}</p>
      </div>
    </div>
  );
};
