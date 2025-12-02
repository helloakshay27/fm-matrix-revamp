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
import { Download } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  onClick?: (status: string) => void;
  className?: string;
  selected?: boolean; // <-- add prop for selection
  onDownload?: () => void; // <-- add download callback
  downloadData?: any[]; // <-- optional data for CSV export
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  onClick,
  className,
  selected = false,
  onDownload,
  downloadData,
}) => {
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking download button
    
    if (onDownload) {
      onDownload();
    } else if (downloadData) {
      // Default CSV export functionality
      exportToCSV(downloadData, title);
    }
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) {
      console.warn("No data to export");
      return;
    }

    // Get headers from the first object
    const headers = Object.keys(data[0]);
    
    // Create CSV content
    const csvContent = [
      headers.join(","), // Header row
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escape quotes and wrap in quotes if contains comma
          const stringValue = String(value ?? "");
          return stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")
            ? `"${stringValue.replace(/"/g, '""')}"`
            : stringValue;
        }).join(",")
      )
    ].join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename.replace(/\s+/g, "_")}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
      
      {/* Download Button - Positioned absolutely in bottom right */}
      {(onDownload || downloadData) && (
        <button
          onClick={handleDownload}
          className="absolute bottom-2 right-2 p-1.5 rounded-md hover:bg-[#C4B89D54] transition-colors duration-200 group"
          title={`Download ${title} report`}
        >
          <Download className="w-4 h-4 text-[#1A1A1A] group-hover:text-[#C72031]" />
        </button>
      )}
    </div>
  );
};
