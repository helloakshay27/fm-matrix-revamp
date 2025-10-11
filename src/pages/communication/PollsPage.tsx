import React from 'react';
import { BarChart3 } from 'lucide-react';

const PollsPage = () => {
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="w-6 h-6 text-[#C72030]" />
        <h1 className="text-2xl font-semibold text-gray-900">Polls</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
        <div className="text-center text-gray-500">
          <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">Polls page content coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default PollsPage;
