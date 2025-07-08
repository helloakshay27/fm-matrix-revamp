
import React from 'react';
import { FileText, User } from 'lucide-react';

export const LogsTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center">
          <FileText className="w-3 h-3 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-[#C72030] uppercase">Logs</h3>
      </div>

      {/* Log Entry */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
          <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-blue-600 font-medium">Abhishek Sharma</span>
            <span className="text-gray-600">Created this asset</span>
          </div>
        </div>
      </div>
    </div>
  );
};
