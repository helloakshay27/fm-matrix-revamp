
import React from 'react';
import { Button } from '@/components/ui/button';

export const EnergyAttachmentsTab = () => {
  const attachmentTypes = [
    { name: 'Manual Uploads', count: 1, active: true },
    { name: 'Insurance Details', count: 1, active: false },
    { name: 'Purchase Invoice', count: 1, active: false },
    { name: 'Other Uploads', count: 1, active: false }
  ];

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        {attachmentTypes.map((type, index) => (
          <Button
            key={index}
            variant={type.active ? "default" : "outline"}
            className={type.active 
              ? "bg-[#C72030] hover:bg-[#A61B2A] text-white border-[#C72030]" 
              : "border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white"
            }
          >
            📄 {type.name} {type.count}
          </Button>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-200 rounded mr-3"></div>
          <div className="flex-1">
            <div className="text-blue-600 underline cursor-pointer">Download</div>
          </div>
        </div>
      </div>
    </div>
  );
};
