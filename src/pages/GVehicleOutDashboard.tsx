import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const vehicleOutData = [
  {
    id: 1,
    vehicleNumber: '3253',
    name: 'Kshitij Rasal',
    status: 'G',
  },
  {
    id: 2,
    vehicleNumber: '233223',
    name: 'dinesh',
    status: 'G',
  },
  {
    id: 3,
    vehicleNumber: '',
    name: 'Pune Sam',
    status: 'G',
  },
  {
    id: 4,
    vehicleNumber: '3452',
    name: 'Sahil',
    status: 'G',
  },
];

interface GVehicleOutDashboardProps {
  onHistoryClick?: () => void;
}

const brandButtonClass =
  'bg-[#C72030] hover:bg-[#C72030]/90 text-white h-9 px-4 text-sm font-medium whitespace-nowrap shadow-none';

export const GVehicleOutDashboard = ({ onHistoryClick }: GVehicleOutDashboardProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleHistoryClick = () => {
    onHistoryClick?.();
  };

  const handleOut = (vehicleId: number) => {
    console.log('Vehicle out:', vehicleId);
  };

  const filteredVehicles = vehicleOutData.filter(
    (vehicle) =>
      vehicle.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 p-6 bg-white min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>Visitor</span>
          <span>&gt;</span>
          <span>Visitor Vehicle Out</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">
          Visitor Vehicle Out
        </h1>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between gap-4 p-4 border-b border-gray-200 flex-wrap">
            <div className="flex items-center gap-2">
              <Button onClick={handleHistoryClick} className={brandButtonClass}>
                History
              </Button>
              <Button className={brandButtonClass}>Vehicle Out</Button>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative w-[300px] max-w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search using Vehicle number"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 h-9 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C72030]/30 focus:border-[#C72030] text-sm"
                />
              </div>
              <Button className={brandButtonClass}>Go!</Button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {filteredVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-12 bg-[#C72030]/15 rounded flex items-center justify-center">
                    <svg
                      className="w-8 h-6 text-[#C72030]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                    </svg>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold text-gray-900">
                        {vehicle.vehicleNumber || vehicle.name}
                      </span>
                      <span className="w-6 h-6 bg-[#F2EBC9] text-gray-800 rounded-full flex items-center justify-center text-sm font-bold">
                        {vehicle.status}
                      </span>
                    </div>
                    {vehicle.vehicleNumber && (
                      <span className="text-gray-600">{vehicle.name}</span>
                    )}
                  </div>
                </div>

                <Button
                  onClick={() => handleOut(vehicle.id)}
                  className={brandButtonClass}
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
