
import React from 'react';

export const AttachmentsSection: React.FC = () => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Attachments
      </label>
      <div className="border-2 border-dashed border-blue-400 rounded-lg text-center p-6 bg-gray-50">
        <p className="text-base text-gray-700">
          Drag & Drop or <span className="text-blue-600 cursor-pointer underline">browse</span>
        </p>
      </div>
    </div>
  );
};
