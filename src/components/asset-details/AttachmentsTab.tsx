
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

export const AttachmentsTab = () => {
  const attachmentTypes = [
    { name: 'Manual Uploads', count: 0, active: true },
    { name: 'Insurance Details', count: 0, active: false },
    { name: 'Purchase Invoice', count: 0, active: false },
    { name: 'Other Uploads', count: 0, active: false }
  ];

  return (
    <div className="space-y-6">
      {/* Attachment Type Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 overflow-x-auto pb-2">
        {attachmentTypes.map((type, index) => (
          <Button
            key={index}
            variant={type.active ? "default" : "outline"}
            className={`flex items-center gap-2 whitespace-nowrap min-w-fit ${
              type.active 
                ? "bg-[#C72030] hover:bg-[#A61B2A] text-white border-[#C72030]" 
                : "border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white"
            }`}
          >
            <FileText className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">{type.name} {type.count}</span>
          </Button>
        ))}
      </div>

      {/* No Attachments */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 sm:p-12 text-center">
        <p className="text-gray-500 text-base sm:text-lg">No attachments</p>
      </div>
    </div>
  );
};
