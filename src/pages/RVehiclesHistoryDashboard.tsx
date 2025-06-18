
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';
import { RVehiclesHistoryFilterModal } from '@/components/RVehiclesHistoryFilterModal';
import { useNavigate } from 'react-router-dom';

const vehicleHistoryData = [
  {
    id: 1,
    vehicleNumber: 'MH 02 ET 7179',
    category: 'Staff',
    staffName: 'Abdul G',
    inDate: '09/08/2021',
    inTime: '6:04 PM',
    outDate: '20/08/2021',
    outTime: '11:21 AM'
  },
  {
    id: 2,
    vehicleNumber: 'MH 02 ET 7179',
    category: 'Staff',
    staffName: 'Abdul G',
    inDate: '12/10/2021',
    inTime: '4:12 PM',
    outDate: '02/04/2022',
    outTime: '3:35 PM'
  },
  {
    id: 3,
    vehicleNumber: 'MH 02 ET 7179',
    category: 'Staff',
    staffName: 'Abdul G',
    inDate: '04/04/2022',
    inTime: '2:59 PM',
    outDate: '02/05/2022',
    outTime: '4:37 PM'
  },
  {
    id: 4,
    vehicleNumber: 'GA02G7984',
    category: 'Owned',
    staffName: '',
    inDate: '22/09/2022',
    inTime: '11:31 PM',
    outDate: '22/09/2022',
    outTime: '11:32 PM'
  },
  {
    id: 5,
    vehicleNumber: 'GJ02G7398',
    category: 'Workshop',
    staffName: '',
    inDate: '22/09/2022',
    inTime: '11:32 PM',
    outDate: '',
    outTime: ''
  },
  {
    id: 6,
    vehicleNumber: 'RJ02G7403',
    category: 'Leased',
    staffName: '',
    inDate: '22/09/2022',
    inTime: '11:32 PM',
    outDate: '',
    outTime: ''
  },
  {
    id: 7,
    vehicleNumber: 'DL03Q4756',
    category: 'Warehouse',
    staffName: '',
    inDate: '22/09/2022',
    inTime: '11:32 PM',
    outDate: '23/02/2023',
    outTime: '10:45 AM'
  },
  {
    id: 8,
    vehicleNumber: 'MH 41 PQ 7861',
    category: 'Owned',
    staffName: '',
    inDate: '22/09/2022',
    inTime: '11:32 PM',
    outDate: '29/02/2024',
    outTime: '5:47 PM'
  },
  {
    id: 9,
    vehicleNumber: 'MH 02 ET 7179',
    category: 'Staff',
    staffName: 'Abdul G',
    inDate: '22/09/2022',
    inTime: '11:32 PM',
    outDate: '23/02/2023',
    outTime: '10:45 AM'
  }
];

export const RVehiclesHistoryDashboard = () => {
  const [activeTab, setActiveTab] = useState('All Vehicles');
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
                style={{ backgroundColor: '#C72030' }}
                className="hover:bg-[#C72030]/90 text-white px-6 py-2 rounded"
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
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{vehicle.staffName}</td>
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
