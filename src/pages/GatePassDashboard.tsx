
import React, { useState } from 'react';
import { GatePassInwardsDashboard } from './GatePassInwardsDashboard';
import { GatePassOutwardsDashboard } from './GatePassOutwardsDashboard';

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
        
        {/* Sub Navigation Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-200 p-1 rounded-lg w-fit">
          <button 
            onClick={() => setActiveTab('inwards')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'inwards' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'bg-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Inwards
          </button>
          <button 
            onClick={() => setActiveTab('outwards')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'outwards' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'bg-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Outwards
          </button>
        </div>

        {/* Content based on active tab */}
        <div>
          {activeTab === 'inwards' && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-6">INWARDS GATE PASS</h1>
              <GatePassInwardsDashboard />
            </div>
          )}
          {activeTab === 'outwards' && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-6">OUTWARDS GATE PASS</h1>
              <GatePassOutwardsDashboard />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
