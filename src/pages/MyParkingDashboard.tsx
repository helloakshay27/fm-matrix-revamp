
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

export const MyParkingDashboard = () => {
  const [activeTab, setActiveTab] = useState('My Parking');
  const navigate = useNavigate();

  const handleTabClick = (tabName: string) => {
    if (tabName === 'Tickets') {
      navigate('/tickets');
    } else if (tabName === 'My Bills') {
      navigate('/finance/my-bills');
    } else {
      setActiveTab(tabName);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-purple-900 to-purple-800 text-white shadow-lg">
        <div className="p-4">
          <div className="space-y-2">
            <div 
              className={`p-3 rounded-lg cursor-pointer flex items-center gap-3 transition-all duration-200 ${activeTab === 'Tickets' ? 'bg-purple-700 shadow-md' : 'hover:bg-purple-800'}`}
              onClick={() => handleTabClick('Tickets')}
            >
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-purple-900 text-lg font-bold">🎫</span>
              </div>
              <span className="font-medium">Tickets</span>
            </div>
            
            <div 
              className={`p-3 rounded-lg cursor-pointer flex items-center gap-3 transition-all duration-200 ${activeTab === 'My Bills' ? 'bg-purple-700 shadow-md' : 'hover:bg-purple-800'}`}
              onClick={() => handleTabClick('My Bills')}
            >
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-purple-900 text-lg font-bold">📄</span>
              </div>
              <span className="font-medium">My Bills</span>
            </div>
            
            <div 
              className={`p-3 rounded-lg cursor-pointer flex items-center gap-3 transition-all duration-200 ${activeTab === 'My Parking' ? 'bg-purple-700 shadow-md border-l-4 border-white' : 'hover:bg-purple-800'}`}
              onClick={() => handleTabClick('My Parking')}
            >
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-purple-900 text-lg font-bold">🅿️</span>
              </div>
              <span className="font-medium">My Parking</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Breadcrumb */}
          <div className="mb-4">
            <span className="text-sm text-gray-600">Parking</span>
          </div>

          <h1 className="text-2xl font-bold mb-6 text-gray-800">Client Parking details</h1>

          {/* Parking Details */}
          <div className="space-y-4 mb-8">
            <div className="grid grid-cols-2 gap-8">
              <div className="flex">
                <span className="w-32 text-gray-700">Client Name</span>
                <span className="mr-4">:</span>
                <span className="text-gray-900">lockated</span>
              </div>
              <div className="flex">
                <span className="w-32 text-gray-700">No. of 4 Wheeler</span>
                <span className="mr-4">:</span>
                <span className="text-gray-900">0</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <div className="flex">
                <span className="w-32 text-gray-700">No. of 2 Wheeler</span>
                <span className="mr-4">:</span>
                <span className="text-gray-900">0</span>
              </div>
            </div>
          </div>

          {/* Lease Period */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Lease Period: 01/07/2024 - 01/07/2025
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};
