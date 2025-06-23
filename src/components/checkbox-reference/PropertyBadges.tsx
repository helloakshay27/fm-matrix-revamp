
import React from 'react';

interface PropertyBadgesProps {
  title: string;
  properties: string[];
}

export const PropertyBadges = ({ title, properties }: PropertyBadgesProps) => {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{title}</p>
      <div className="flex flex-wrap gap-2">
        {properties.map((property, index) => (
          <span 
            key={index}
            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border"
          >
            {property}
          </span>
        ))}
      </div>
    </div>
  );
};
