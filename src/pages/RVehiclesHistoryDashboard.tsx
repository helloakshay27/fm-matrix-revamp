import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';
import { RVehiclesHistoryFilterModal } from '@/components/RVehiclesHistoryFilterModal';
import { useNavigate } from 'react-router-dom';

const vehicleHistoryData = [
  {
    id: 1,
    vehicleNumber: 'DD55GG5555',
    category: '',
    staffName: '',
    inDate: '13/04/2020',
    inTime: '12:08 PM',
    outDate: '05/10/2020',
    outTime: '1:16 PM'
  },
  {
    id: 2,
    vehicleNumber: 'DD55GG5555',
    category: '',
    staffName: '',
    inDate: '13/04/2020',
    inTime: '',
    outDate: '05/10/2020',
    outTime: '1:16 PM'
  },
  {
    id: 3,
    vehicleNumber: 'DD55GG5555',
    category: '',
    staffName: '',
    inDate: '13/04/2020',
    inTime: '12:38 PM',
    outDate: '',
    outTime: ''
  },
  {
    id: 4,
    vehicleNumber: 'GG55GG5555',
    category: '',
    staffName: '',
    inDate: '13/04/2020',
    inTime: '12:45 PM',
    outDate: '',
    outTime: ''
  },
  {
    id: 5,
    vehicleNumber: 'GG55GG5555',
    category: '',
    staffName: '',
    inDate: '13/04/2020',
    inTime: '12:45 PM',
    outDate: '',
    outTime: ''
  },
  {
    id: 6,
    vehicleNumber: 'GG55GG5555',
    category: '',
    staffName: '',
    inDate: '13/04/2020',
    inTime: '12:45 PM',
    outDate: '',
    outTime: ''
  },
  {
    id: 7,
    vehicleNumber: '123456',
    category: 'Owned',
    staffName: '',
    inDate: '05/10/2020',
    inTime: '4:25 PM',
    outDate: '05/10/2020',
    outTime: '5:14 PM'
  },
  {
    id: 8,
    vehicleNumber: '8888',
    category: 'Owned',
    staffName: '',
    inDate: '05/10/2020',
    inTime: '4:57 PM',
    outDate: '05/10/2020',
    outTime: '5:14 PM'
  },
  {
    id: 9,
    vehicleNumber: '9999',
    category: 'Owned',
    staffName: '',
    inDate: '05/10/2020',
    inTime: '5:18 PM',
    outDate: '05/10/2020',
    outTime: '5:19 PM'
  },
  {
    id: 10,
    vehicleNumber: '7878',
    category: 'Staff',
    staffName: 'Nupuraa Admin',
    inDate: '05/10/2020',
    inTime: '6:51 PM',
    outDate: '05/10/2020',
    outTime: '6:52 PM'
  },
  {
    id: 11,
    vehicleNumber: '9999',
    category: 'Owned',
    staffName: '',
    inDate: '05/10/2020',
    inTime: '6:59 PM',
    outDate: '05/10/2020',
    outTime: '6:59 PM'
  },
  {
    id: 12,
    vehicleNumber: 'RJ02G7356',
    category: 'Staff',
    staffName: 'Akash G',
    inDate: '05/10/2020',
    inTime: '6:59 PM',
    outDate: '05/10/2020',
    outTime: '7:01 PM'
  },
  {
    id: 13,
    vehicleNumber: '9999',
    category: 'Owned',
    staffName: '',
    inDate: '05/10/2020',
    inTime: '7:00 PM',
    outDate: '06/10/2020',
    outTime: '5:11 PM'
  },
  {
    id: 14,
    vehicleNumber: '123456',
    category: 'Owned',
    staffName: '',
    inDate: '06/10/2020',
    inTime: '10:39 AM',
    outDate: '06/10/2020',
    outTime: '5:11 PM'
  }
];

export const RVehiclesHistoryDashboard = () => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleAllVehiclesClick = () => {
    navigate('/security/vehicle/r-vehicles');
  };

  return (
    <div className="p-6 bg-[#f6f4ee] min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>vehicles</span>
          <span>&gt;</span>
          <span>Vehicle History</span>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-6">VEHICLE HISTORY</h1>
        
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Action Buttons */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex gap-3">
              <Button 
                onClick={() => setIsFilterModalOpen(true)}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded flex items-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </Button>
              <Button 
                onClick={handleAllVehiclesClick}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded"
              >
                All Vehicles
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle Number</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">In Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">In Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Out Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Out Time</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vehicleHistoryData.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{vehicle.vehicleNumber}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{vehicle.category}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600">{vehicle.staffName}</td>
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

      <RVehiclesHistoryFilterModal 
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      />
    </div>
  );
};
