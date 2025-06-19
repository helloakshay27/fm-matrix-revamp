
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

export const WaterAttachmentsTab = () => {
  const [activeType, setActiveType] = useState('Manual Uploads');
  
  const attachmentTypes = [
    { name: 'Manual Uploads', count: 1, active: true },
    { name: 'Insurance Details', count: 0, active: false },
    { name: 'Purchase Invoice', count: 1, active: false },
    { name: 'Other Uploads', count: 0, active: false }
  ];

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        {attachmentTypes.map((type, index) => (
          <Button
            key={index}
            variant={type.name === activeType ? "default" : "outline"}
            className={type.name === activeType 
              ? "bg-[#C72030] hover:bg-[#A61B2A] text-white border-[#C72030]" 
              : "border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white"
            }
            onClick={() => setActiveType(type.name)}
          >
            📄 {type.name} {type.count}
          </Button>
        ))}
      </div>

      {activeType === 'Manual Uploads' && (
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-200 rounded mr-3"></div>
            <div className="flex-1">
              <div className="text-blue-600 underline cursor-pointer">Download</div>
            </div>
          </div>
        </div>
      )}

      {activeType === 'Purchase Invoice' && (
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-200 rounded mr-3"></div>
            <div className="flex-1">
              <div className="text-blue-600 underline cursor-pointer">Download</div>
            </div>
          </div>
        </div>
      )}

      {(activeType === 'Insurance Details' || activeType === 'Other Uploads') && (
        <div className="text-center py-8 text-gray-500 border border-dashed border-gray-300 rounded-lg">
          No attachments
        </div>
      )}
    </div>
  );
};
