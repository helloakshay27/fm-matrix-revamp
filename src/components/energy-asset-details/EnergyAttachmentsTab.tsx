
import React from 'react';
import { Button } from '@/components/ui/button';

export const EnergyAttachmentsTab = () => {
  const attachmentTypes = [
    { name: 'Manual Uploads', count: 0, active: true },
    { name: 'Insurance Details', count: 0, active: false },
    { name: 'Purchase Invoice', count: 0, active: false },
    { name: 'Other Uploads', count: 0, active: false }
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

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
        <p className="text-gray-500 text-lg">No attachments</p>
      </div>
    </div>
  );
};
