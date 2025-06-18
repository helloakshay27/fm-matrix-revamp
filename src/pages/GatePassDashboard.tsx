
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

export const GatePassDashboard = () => {
  const [activeTab, setActiveTab] = useState('inwards');

  return (
    <div className="p-6 bg-[#f6f4ee] min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>security</span>
          <span>&gt;</span>
          <span>Gate Pass</span>
        </div>
        
        {/* Sub Navigation */}
        <div className="flex gap-1 mb-6 bg-gray-200 p-1 rounded-lg w-fit">
          <Button 
            onClick={() => setActiveTab('inwards')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'inwards' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'bg-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Inwards
          </Button>
          <Button 
            onClick={() => setActiveTab('outwards')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'outwards' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'bg-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Outwards
          </Button>
        </div>

        {/* Content based on active tab */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 min-h-[400px] flex items-center justify-center">
          <div className="text-center text-gray-500">
            <h2 className="text-xl font-semibold mb-2">
              {activeTab === 'inwards' ? 'Inwards Gate Pass' : 'Outwards Gate Pass'}
            </h2>
            <p>
              {activeTab === 'inwards' 
                ? 'Inwards gate pass content will be displayed here' 
                : 'Outwards gate pass content will be displayed here'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
