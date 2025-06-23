
import React from 'react';

interface SectionHeaderProps {
  title: string;
}

export const SectionHeader = ({ title }: SectionHeaderProps) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        <h3 className="text-sm font-medium text-gray-900">BASIC INFO</h3>
      </div>
      <h3 className="text-sm font-medium text-gray-900 mb-3">{title}</h3>
    </div>
  );
};
