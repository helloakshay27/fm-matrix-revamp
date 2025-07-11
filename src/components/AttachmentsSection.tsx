
import React from 'react';

export const AttachmentsSection: React.FC = () => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Attachments
      </label>
      <div className="border-2 border-dashed border-blue-400 rounded-lg text-center bg-gray-50 min-h-[96px] flex items-center justify-center">
        <p className="text-base text-gray-700">
          Drag & Drop or <span className="text-blue-600 cursor-pointer underline">browse</span>
        </p>
      </div>
    </div>
  );
};
