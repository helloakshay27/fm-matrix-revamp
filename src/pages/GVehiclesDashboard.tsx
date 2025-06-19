
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, Plus, Filter } from 'lucide-react';
import { AddGVehicleModal } from '@/components/AddGVehicleModal';
import { GVehicleFilterModal } from '@/components/GVehicleFilterModal';
import { GVehicleOutDashboard } from './GVehicleOutDashboard';

const gVehicleData = [
  {
    id: 1,
    type: 'Host',
    name: 'Vinayak Mane',
    vehicleNumber: '3131',
    mobileNumber: '8898447639',
    purpose: '',
    inDate: '',
    inTime: '',
    outDate: '09/12/2024',
    outTime: '12:21 PM'
  },
  {
    id: 2,
    type: 'Host',
    name: 'Vinayak Mane',
    vehicleNumber: '5551',
    mobileNumber: '8898447639',
    purpose: '',
    inDate: '',
    inTime: '',
    outDate: '09/12/2024',
    outTime: '12:21 PM'
  },
  {
    id: 3,
    type: 'Host',
    name: 'Vinayak Mane',
    vehicleNumber: '2346',
    mobileNumber: '8898447639',
    purpose: '',
    inDate: '',
    inTime: '',
    outDate: '09/12/2024',
    outTime: '12:21 PM'
  },
  {
    id: 4,
    type: 'Host',
    name: 'Vinayak Mane',
    vehicleNumber: '2434',
    mobileNumber: '8898447639',
    purpose: '',
    inDate: '',
    inTime: '',
    outDate: '09/12/2024',
    outTime: '12:19 PM'
  },
  {
    id: 5,
    type: 'Host',
    name: 'Vinayak Mane',
    vehicleNumber: '3134',
    mobileNumber: '8898447639',
    purpose: '',
    inDate: '',
    inTime: '',
    outDate: '30/08/2024',
    outTime: '11:09 AM'
  },
  {
    id: 6,
    type: 'Host',
    name: 'Vinayak Mane',
    vehicleNumber: '9090',
    mobileNumber: '8898447639',
    purpose: '',
    inDate: '11/04/2024',
    inTime: '04:02 PM',
    outDate: '11/04/2024',
    outTime: '04:10 PM'
  },
  {
    id: 7,
    type: 'Host',
    name: 'Vinayak Mane',
    vehicleNumber: 'MH8BJ9090',
    mobileNumber: '8898447639',
    purpose: '',
    inDate: '11/04/2024',
    inTime: '04:00 PM',
    outDate: '09/12/2024',
    outTime: '12:20 PM'
  },
  {
    id: 8,
    type: 'Host',
    name: 'Vinayak Mane',
    vehicleNumber: 'MH55R5555',
    mobileNumber: '8898447639',
    purpose: '',
    inDate: '10/04/2024',
    inTime: '05:38 PM',
    outDate: '09/12/2024',
    outTime: '12:20 PM'
  },
  {
    id: 9,
    type: 'Host',
    name: 'Vinayak Mane',
    vehicleNumber: 'mh0101',
    mobileNumber: '8898447639',
    purpose: '',
    inDate: '06/04/2024',
    inTime: '02:24 PM',
    outDate: '09/12/2024',
    outTime: '12:20 PM'
  },
  {
    id: 10,
    type: 'Host',
    name: 'Vinayak Mane',
    vehicleNumber: 'bp2234',
    mobileNumber: '8898447639',
    purpose: '',
    inDate: '06/04/2024',
    inTime: '02:15 PM',
    outDate: '09/12/2024',
    outTime: '12:20 PM'
  },
  {
    id: 11,
    type: 'Host',
    name: 'Vinayak Mane',
    vehicleNumber: 'MH09Q8090',
    mobileNumber: '8898447639',
    purpose: '',
    inDate: '05/04/2024',
    inTime: '05:16 PM',
    outDate: '09/12/2024',
    outTime: '12:20 PM'
  }
];

export const GVehiclesDashboard = () => {
  const [activeTab, setActiveTab] = useState('History');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState('history'); // 'history' or 'vehicle-out'

  const handleHistoryClick = () => {
    setCurrentView('history');
    setActiveTab('History');
  };

  const handleVehicleOutClick = () => {
    setCurrentView('vehicle-out');
    setActiveTab('Vehicle Out');
  };

  // If Vehicle Out view is active, render the Vehicle Out component
  if (currentView === 'vehicle-out') {
    return <GVehicleOutDashboard onHistoryClick={handleHistoryClick} />;
  }

  return (
    <div className="p-6 bg-[#f6f4ee] min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>G Vehicles</span>
          <span>&gt;</span>
          <span>G Vehicles List</span>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-6">G VEHICLES LIST</h1>
        
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Action Buttons */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex gap-3">
              <Button 
                onClick={() => setIsAddModalOpen(true)}
                style={{ backgroundColor: '#C72030' }}
                className="hover:bg-[#C72030]/90 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </Button>
              <Button 
                onClick={handleHistoryClick}
                className={`px-6 py-2 rounded ${
                  activeTab === 'History' 
                    ? 'bg-[#C72030] hover:bg-[#C72030]/90 text-white' 
                    : 'bg-[#C72030] hover:bg-[#C72030]/90 text-white'
                }`}
              >
                History
              </Button>
              <Button 
                onClick={handleVehicleOutClick}
                className={`px-6 py-2 rounded ${
                  activeTab === 'Vehicle Out' 
                    ? 'bg-[#C72030] hover:bg-[#C72030]/90 text-white' 
                    : 'bg-[#C72030] hover:bg-[#C72030]/90 text-white'
                }`}
              >
                Vehicle Out
              </Button>
              <Button 
                onClick={() => setIsFilterModalOpen(true)}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded flex items-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle Number</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile Number</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">In Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">In Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Out Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Out Time</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {gVehicleData.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{vehicle.type}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{vehicle.name}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600">{vehicle.vehicleNumber}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600">{vehicle.mobileNumber}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{vehicle.purpose}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{vehicle.inDate}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600">{vehicle.inTime}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{vehicle.outDate}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600">{vehicle.outTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddGVehicleModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      
      <GVehicleFilterModal 
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      />
    </div>
  );
};
