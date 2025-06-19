
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Download, SlidersHorizontal, Search } from 'lucide-react';
import { AddVehicleParkingModal } from '@/components/AddVehicleParkingModal';
import { RVehicleImportModal } from '@/components/RVehicleImportModal';
import { RVehicleFilterModal } from '@/components/RVehicleFilterModal';
import { RVehicleOutDialog } from '@/components/RVehicleOutDialog';
import { useNavigate } from 'react-router-dom';

const vehicleOutData = [
  {
    id: 1,
    vehicleNumber: '5000',
    category: 'Owned',
    vehicleIcon: '🚗',
    parkingSlot: 'A-0111',
    status: 'Out',
    qrCode: '🔲'
  },
  {
    id: 2,
    vehicleNumber: '4645654645',
    category: 'Staff - check Major',
    vehicleIcon: '🚗',
    parkingSlot: '903',
    status: 'Out',
    qrCode: '🔲'
  },
  {
    id: 3,
    vehicleNumber: '4564',
    category: 'Staff - clone stage',
    vehicleIcon: '🚗',
    parkingSlot: 'Out',
    status: 'Out',
    qrCode: '🔲'
  },
  {
    id: 4,
    vehicleNumber: '9091',
    category: 'Owned',
    vehicleIcon: '🚗',
    parkingSlot: 'A-0111',
    status: 'Out',
    qrCode: '🔲'
  },
  {
    id: 5,
    vehicleNumber: '1111',
    category: 'Staff - Dms User',
    vehicleIcon: '🏍️',
    parkingSlot: 'P-123',
    status: 'Out',
    qrCode: '🔲'
  },
  {
    id: 6,
    vehicleNumber: '3333',
    category: 'Staff - Monica Lad',
    vehicleIcon: '🚗',
    parkingSlot: 'A-201',
    status: 'Out',
    qrCode: '🔲'
  },
  {
    id: 7,
    vehicleNumber: '5654',
    category: 'Owned',
    vehicleIcon: '🚗',
    parkingSlot: 'A-202',
    status: 'Out',
    qrCode: '🔲'
  },
  {
    id: 8,
    vehicleNumber: '123456',
    category: 'Owned',
    vehicleIcon: '🚗',
    parkingSlot: 'P-123',
    status: 'Out',
    qrCode: '🔲'
  },
  {
    id: 9,
    vehicleNumber: '8888',
    category: 'Owned',
    vehicleIcon: '🚗',
    parkingSlot: 'A-101',
    status: 'Out',
    qrCode: '🔲'
  },
  {
    id: 10,
    vehicleNumber: '6767',
    category: 'Staff - Sonali I',
    vehicleIcon: '🏍️',
    parkingSlot: 'A-104',
    status: 'Out',
    qrCode: '🔲'
  },
  {
    id: 11,
    vehicleNumber: 'RJ02G7534',
    category: 'Owned',
    vehicleIcon: '🚗',
    parkingSlot: '102',
    status: 'Out',
    qrCode: '🔲'
  },
  {
    id: 12,
    vehicleNumber: '123456',
    category: 'Owned',
    vehicleIcon: '🏍️',
    parkingSlot: 'P-123',
    status: 'Out',
    qrCode: '🔲'
  }
];

export const RVehiclesOutDashboard = () => {
  const [activeTab, setActiveTab] = useState('Out');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isOutDialogOpen, setIsOutDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const navigate = useNavigate();

  const handleHistoryClick = () => {
    navigate('/security/vehicle/r-vehicles/history');
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'History') {
      handleHistoryClick();
    } else if (tab === 'All') {
      navigate('/security/vehicle/r-vehicles');
    } else if (tab === 'In') {
      navigate('/security/vehicle/r-vehicles/in');
    }
  };

  const handleOutClick = (vehicleNumber: string) => {
    setSelectedVehicle(vehicleNumber);
    setIsOutDialogOpen(true);
  };

  return (
    <div className="p-6 bg-[#f6f4ee] min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>vehicle parkings</span>
          <span>&gt;</span>
          <span>Vehicle Parkings</span>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-6">VEHICLE PARKINGS</h1>
        
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Action Buttons */}
          <div className="flex items-center gap-3 p-4 border-b border-gray-200">
            <Button 
              onClick={() => setIsAddModalOpen(true)}
              style={{ backgroundColor: '#C72030' }}
              className="hover:opacity-90 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </Button>
            <Button 
              onClick={() => setIsImportModalOpen(true)}
              style={{ backgroundColor: '#C72030' }}
              className="hover:opacity-90 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Import
            </Button>
            <Button 
              onClick={() => setIsFilterModalOpen(true)}
              style={{ backgroundColor: '#C72030' }}
              className="hover:opacity-90 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </Button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200">
            {['History', 'All', 'In', 'Out'].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabClick(tab)}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={activeTab === tab ? { backgroundColor: '#C72030' } : {}}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-2 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search using Vehicle number"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <Button
                style={{ backgroundColor: '#C72030' }}
                className="hover:opacity-90 text-white px-4 py-2"
              >
                Go!
              </Button>
            </div>
          </div>

          {/* Vehicle Grid */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vehicleOutData.map((vehicle) => (
                <div key={vehicle.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{vehicle.vehicleIcon}</span>
                      <div>
                        <h3 className="font-bold text-blue-600">{vehicle.vehicleNumber}</h3>
                        <p className="text-sm text-gray-600">{vehicle.category}</p>
                      </div>
                    </div>
                    <span className="text-lg">{vehicle.qrCode}</span>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        vehicle.parkingSlot.startsWith('A-') ? 'bg-green-100 text-green-800' :
                        vehicle.parkingSlot.startsWith('P-') ? 'bg-green-100 text-green-800' :
                        vehicle.parkingSlot === 'Out' ? 'bg-red-100 text-red-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {vehicle.parkingSlot}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {vehicle.status}
                    </span>
                    
                    <Button
                      onClick={() => handleOutClick(vehicle.vehicleNumber)}
                      style={{ backgroundColor: '#C72030' }}
                      className="hover:opacity-90 text-white px-4 py-1 text-sm"
                    >
                      Out
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AddVehicleParkingModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
      
      <RVehicleImportModal 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)} 
      />
      
      <RVehicleFilterModal 
        isOpen={isFilterModalOpen} 
        onClose={() => setIsFilterModalOpen(false)} 
      />

      <RVehicleOutDialog
        isOpen={isOutDialogOpen}
        onClose={() => setIsOutDialogOpen(false)}
        vehicleNumber={selectedVehicle}
      />
    </div>
  );
};
