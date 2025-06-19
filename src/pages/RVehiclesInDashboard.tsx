
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Download, SlidersHorizontal, Edit, Search } from 'lucide-react';
import { AddVehicleParkingModal } from '@/components/AddVehicleParkingModal';
import { RVehicleImportModal } from '@/components/RVehicleImportModal';
import { RVehicleFilterModal } from '@/components/RVehicleFilterModal';
import { RVehicleInDialog } from '@/components/RVehicleInDialog';
import { useNavigate } from 'react-router-dom';

const vehicleInData = [
  {
    id: 1,
    vehicleNumber: '5000',
    category: 'Owned',
    vehicleIcon: '🚗',
    status: 'IN',
    qrCode: '🔲'
  },
  {
    id: 2,
    vehicleNumber: '2341',
    category: 'Staff',
    vehicleIcon: '🏍️',
    staffName: 'demo demo',
    status: 'IN',
    qrCode: '🔲'
  },
  {
    id: 3,
    vehicleNumber: '7777',
    category: 'Owned',
    vehicleIcon: '🚗',
    status: 'IN',
    qrCode: '🔲'
  },
  {
    id: 4,
    vehicleNumber: 'MH-02-G-0437',
    category: 'Workshop',
    vehicleIcon: '🚗',
    status: 'IN',
    qrCode: '🔲'
  },
  {
    id: 5,
    vehicleNumber: 'MH-02-C-3456',
    category: 'Warehouse',
    vehicleIcon: '🚗',
    status: 'IN',
    qrCode: '🔲'
  },
  {
    id: 6,
    vehicleNumber: '3344',
    category: 'Staff',
    vehicleIcon: '🏍️',
    staffName: 'srikant mohite',
    status: 'IN',
    qrCode: '🔲'
  },
  {
    id: 7,
    vehicleNumber: '123456',
    category: 'Owned',
    vehicleIcon: '🏍️',
    status: 'IN',
    qrCode: '🔲'
  },
  {
    id: 8,
    vehicleNumber: '214345',
    category: 'Owned',
    vehicleIcon: '🏍️',
    status: 'IN',
    qrCode: '🔲'
  },
  {
    id: 9,
    vehicleNumber: 'MH-02-AB7004',
    category: 'Staff',
    vehicleIcon: '🏍️',
    staffName: 'Swati T',
    status: 'IN',
    qrCode: '🔲'
  },
  {
    id: 10,
    vehicleNumber: '7003',
    category: 'Owned',
    vehicleIcon: '🚗',
    status: 'APROVAL',
    qrCode: '🔲'
  },
  {
    id: 11,
    vehicleNumber: 'MH 02 AB 7002',
    category: 'Locked',
    vehicleIcon: '🚗',
    status: 'LOCKED',
    qrCode: '🔲'
  },
  {
    id: 12,
    vehicleNumber: 'MH 02 AB 7001',
    category: 'Staff',
    vehicleIcon: '🏍️',
    status: 'ENTRY',
    qrCode: '🔲'
  }
];

export const RVehiclesInDashboard = () => {
  const [activeTab, setActiveTab] = useState('In');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isInDialogOpen, setIsInDialogOpen] = useState(false);
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
    } else if (tab === 'Out') {
      navigate('/security/vehicle/r-vehicles/out');
    }
  };

  const handleInClick = (vehicleNumber: string) => {
    setSelectedVehicle(vehicleNumber);
    setIsInDialogOpen(true);
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

          {/* Vehicle Grid */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vehicleInData.map((vehicle) => (
                <div key={vehicle.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{vehicle.vehicleIcon}</span>
                      <div>
                        <h3 className="font-bold text-blue-600">{vehicle.vehicleNumber}</h3>
                        <p className="text-sm text-gray-600">{vehicle.category}</p>
                        {vehicle.staffName && (
                          <p className="text-sm text-gray-600">{vehicle.staffName}</p>
                        )}
                      </div>
                    </div>
                    <span className="text-lg">{vehicle.qrCode}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span 
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        vehicle.status === 'IN' ? 'bg-green-100 text-green-800' :
                        vehicle.status === 'APROVAL' ? 'bg-yellow-100 text-yellow-800' :
                        vehicle.status === 'LOCKED' ? 'bg-red-100 text-red-800' :
                        vehicle.status === 'ENTRY' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {vehicle.status}
                    </span>
                    
                    <Button
                      onClick={() => handleInClick(vehicle.vehicleNumber)}
                      style={{ backgroundColor: '#C72030' }}
                      className="hover:opacity-90 text-white px-4 py-1 text-sm"
                    >
                      In
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

      <RVehicleInDialog
        isOpen={isInDialogOpen}
        onClose={() => setIsInDialogOpen(false)}
        vehicleNumber={selectedVehicle}
      />
    </div>
  );
};
