
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const vehicleData = [
  {
    id: 1,
    vehicleNumber: '2341',
    category: 'Staff - demo demo',
    parkingSlot: '12',
    vehicleIcon: '🛵'
  },
  {
    id: 2,
    vehicleNumber: '4321',
    category: 'Owned',
    parkingSlot: '',
    vehicleIcon: '🚗'
  },
  {
    id: 3,
    vehicleNumber: '7777',
    category: 'Owned',
    parkingSlot: '902',
    vehicleIcon: '🚗'
  },
  {
    id: 4,
    vehicleNumber: '7890',
    category: 'Workshop',
    parkingSlot: '901',
    vehicleIcon: '🚗'
  },
  {
    id: 5,
    vehicleNumber: '5464',
    category: 'Warehouse',
    parkingSlot: '',
    vehicleIcon: '🚗'
  },
  {
    id: 6,
    vehicleNumber: 'MH-09-G-0987',
    category: 'Workshop',
    parkingSlot: '9898',
    vehicleIcon: '🚗'
  },
  {
    id: 7,
    vehicleNumber: 'MH-02-G-3456',
    category: 'Warehouse',
    parkingSlot: '9900',
    vehicleIcon: '🚗'
  },
  {
    id: 8,
    vehicleNumber: '3344',
    category: 'Staff - shrirant mobile',
    parkingSlot: '',
    vehicleIcon: '🛵'
  },
  {
    id: 9,
    vehicleNumber: '123456',
    category: 'Owned',
    parkingSlot: '2',
    vehicleIcon: '🛵'
  },
  {
    id: 10,
    vehicleNumber: '2142455',
    category: 'Owned',
    parkingSlot: '',
    vehicleIcon: '🛵'
  },
  {
    id: 11,
    vehicleNumber: 'MH02A87004',
    category: 'Staff - Sonali I',
    parkingSlot: '7004',
    vehicleIcon: '🛵'
  },
  {
    id: 12,
    vehicleNumber: '7003',
    category: 'Owned',
    parkingSlot: 'A07003',
    vehicleIcon: '🚗'
  },
  {
    id: 13,
    vehicleNumber: 'MH 02 AB 7002',
    category: 'Leased',
    parkingSlot: 'A-07002',
    vehicleIcon: '🚗'
  },
  {
    id: 14,
    vehicleNumber: 'MH 02 AB 7001',
    category: 'Staff',
    parkingSlot: 'A-07001',
    vehicleIcon: '🛵'
  },
  {
    id: 15,
    vehicleNumber: '',
    category: 'Owned',
    parkingSlot: 'A-5555',
    vehicleIcon: '🚗'
  },
  {
    id: 16,
    vehicleNumber: '',
    category: 'Owned',
    parkingSlot: '',
    vehicleIcon: '🚗'
  },
  {
    id: 17,
    vehicleNumber: '',
    category: 'Owned',
    parkingSlot: '',
    vehicleIcon: '🛵'
  }
];

export const RVehiclesInDashboard = () => {
  const [activeTab, setActiveTab] = useState('In');
  const [searchTerm, setSearchTerm] = useState('');
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
    } else if (tab === 'Out') {
      navigate('/security/vehicle/r-vehicles/out');
    }
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
                      style={{ backgroundColor: '#10B981' }}
                      className="hover:opacity-90 text-white px-3 py-1 text-sm"
                    >
                      In
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
    </div>
  );
};
