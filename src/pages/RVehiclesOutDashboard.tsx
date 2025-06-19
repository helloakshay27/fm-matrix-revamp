import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { RVehicleOutDialog } from '@/components/RVehicleOutDialog';

const vehicleData = [
  {
    id: 1,
    vehicleNumber: '5000',
    category: 'Owned',
    parkingSlot: '903',
    vehicleIcon: '🚗'
  },
  {
    id: 2,
    vehicleNumber: '4645654645',
    category: 'Staff - check Major',
    parkingSlot: '',
    vehicleIcon: '🚗'
  },
  {
    id: 3,
    vehicleNumber: '4564',
    category: 'Staff - clone stage',
    parkingSlot: '',
    vehicleIcon: '🚗'
  },
  {
    id: 4,
    vehicleNumber: '9091',
    category: 'Owned',
    parkingSlot: 'A - 0111',
    vehicleIcon: '🚗'
  },
  {
    id: 5,
    vehicleNumber: '1111',
    category: 'Staff - Pms User',
    parkingSlot: '',
    vehicleIcon: '🛵'
  },
  {
    id: 6,
    vehicleNumber: '3333',
    category: 'Staff - Monica Lad',
    parkingSlot: 'A - 201',
    vehicleIcon: '🚗'
  },
  {
    id: 7,
    vehicleNumber: '5654',
    category: 'Owned',
    parkingSlot: 'A - 202',
    vehicleIcon: '🚗'
  },
  {
    id: 8,
    vehicleNumber: '123456',
    category: 'Owned',
    parkingSlot: 'P-123',
    vehicleIcon: '🛵'
  },
  {
    id: 9,
    vehicleNumber: '8888',
    category: 'Owned',
    parkingSlot: 'A - 101',
    vehicleIcon: '🚗'
  },
  {
    id: 10,
    vehicleNumber: '6767',
    category: 'Staff - Sonali I',
    parkingSlot: 'A - 104',
    vehicleIcon: '🛵'
  },
  {
    id: 11,
    vehicleNumber: 'RJ02G7534',
    category: 'Owned',
    parkingSlot: '102',
    vehicleIcon: '🚗'
  },
  {
    id: 12,
    vehicleNumber: '123456',
    category: 'Owned',
    parkingSlot: 'P-123',
    vehicleIcon: '🛵'
  }
];

export const RVehiclesOutDashboard = () => {
  const [activeTab, setActiveTab] = useState('Out');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const navigate = useNavigate();

  const filteredVehicles = vehicleData.filter(vehicle =>
    vehicle.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'History') {
      navigate('/security/vehicle/r-vehicles/history');
    } else if (tab === 'All') {
      navigate('/security/vehicle/r-vehicles');
    } else if (tab === 'In') {
      navigate('/security/vehicle/r-vehicles/in');
    }
  };

  const handleOutButtonClick = (vehicleNumber: string) => {
    setSelectedVehicle(vehicleNumber);
    setIsDialogOpen(true);
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
            <div className="flex items-center gap-2 max-w-md ml-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search using Vehicle number"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              {filteredVehicles.map((vehicle) => (
                <div key={vehicle.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{vehicle.vehicleIcon}</span>
                      <div>
                        <div className="font-semibold text-lg">{vehicle.vehicleNumber}</div>
                        <div className="text-sm text-gray-600">{vehicle.category}</div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleOutButtonClick(vehicle.vehicleNumber)}
                      style={{ backgroundColor: '#EF4444' }}
                      className="hover:opacity-90 text-white px-3 py-1 text-sm"
                    >
                      Out
                    </Button>
                  </div>
                  {vehicle.parkingSlot && (
                    <div className="bg-green-500 text-white text-xs px-2 py-1 rounded inline-block">
                      {vehicle.parkingSlot}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <RVehicleOutDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        vehicleNumber={selectedVehicle}
      />
    </div>
  );
};
