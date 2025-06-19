
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const vehicleOutData = [
  {
    id: 1,
    vehicleNumber: '3253',
    name: 'Kshitij Rasal',
    status: 'G',
    badgeColor: 'bg-yellow-500'
  },
  {
    id: 2,
    vehicleNumber: '233223',
    name: 'dinesh',
    status: 'G',
    badgeColor: 'bg-blue-500'
  },
  {
    id: 3,
    vehicleNumber: '',
    name: 'Pune Sam',
    status: 'G',
    badgeColor: 'bg-blue-500'
  },
  {
    id: 4,
    vehicleNumber: '3452',
    name: 'Sahil',
    status: 'G',
    badgeColor: 'bg-blue-500'
  }
];

interface GVehicleOutDashboardProps {
  onHistoryClick?: () => void;
}

export const GVehicleOutDashboard = ({ onHistoryClick }: GVehicleOutDashboardProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleHistoryClick = () => {
    if (onHistoryClick) {
      onHistoryClick();
    }
  };

  const handleOut = (vehicleId: number) => {
    console.log('Vehicle out:', vehicleId);
    // Handle vehicle out logic
  };

  const filteredVehicles = vehicleOutData.filter(vehicle =>
    vehicle.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-[#f6f4ee] min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>Visitor</span>
          <span>&gt;</span>
          <span>Visitor Vehicle Out</span>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Visitor Vehicle Out</h1>
        
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Action Buttons */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex gap-3">
              <Button 
                onClick={handleHistoryClick}
                style={{ backgroundColor: '#C72030' }}
                className="hover:bg-[#C72030]/90 text-white px-6 py-2 rounded"
              >
                History
              </Button>
              <Button 
                style={{ backgroundColor: '#C72030' }}
                className="hover:bg-[#C72030]/90 text-white px-6 py-2 rounded"
              >
                Vehicle Out
              </Button>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search using Vehicle number"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-80"
                />
              </div>
              <Button 
                style={{ backgroundColor: '#C72030' }}
                className="hover:bg-[#C72030]/90 text-white px-6 py-2 rounded"
              >
                Go!
              </Button>
            </div>
          </div>

          {/* Vehicle Cards */}
          <div className="p-6 space-y-4">
            {filteredVehicles.map((vehicle) => (
              <div key={vehicle.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white">
                <div className="flex items-center gap-4">
                  {/* Vehicle Icon */}
                  <div className="w-16 h-12 bg-blue-500 rounded flex items-center justify-center">
                    <svg className="w-8 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                    </svg>
                  </div>

                  {/* Vehicle Info */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold text-blue-600">
                        {vehicle.vehicleNumber || vehicle.name}
                      </span>
                      <span className={`w-6 h-6 ${vehicle.badgeColor} text-white rounded-full flex items-center justify-center text-sm font-bold`}>
                        {vehicle.status}
                      </span>
                    </div>
                    {vehicle.vehicleNumber && (
                      <span className="text-gray-600">{vehicle.name}</span>
                    )}
                  </div>
                </div>

                {/* Out Button */}
                <Button
                  onClick={() => handleOut(vehicle.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded"
                >
                  Out
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
