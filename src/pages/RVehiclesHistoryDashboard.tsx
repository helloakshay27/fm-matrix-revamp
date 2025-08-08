
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';
import { RVehiclesHistoryFilterModal } from '@/components/RVehiclesHistoryFilterModal';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
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

// Column configuration for the enhanced table
const historyColumns: ColumnConfig[] = [
  { key: 'vehicleNumber', label: 'Vehicle Number', sortable: true, hideable: true, draggable: true },
  { key: 'category', label: 'Category', sortable: true, hideable: true, draggable: true },
  { key: 'staffName', label: 'Staff Name', sortable: true, hideable: true, draggable: true },
  { key: 'inDate', label: 'In Date', sortable: true, hideable: true, draggable: true },
  { key: 'inTime', label: 'In Time', sortable: true, hideable: true, draggable: true },
  { key: 'outDate', label: 'Out Date', sortable: true, hideable: true, draggable: true },
  { key: 'outTime', label: 'Out Time', sortable: true, hideable: true, draggable: true }
];

export const RVehiclesHistoryDashboard = () => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleAllVehiclesClick = () => {
    navigate('/security/vehicle/r-vehicles');
  };

  // Render row function for enhanced table
  const renderHistoryRow = (vehicle: any) => ({
    vehicleNumber: <span className="font-medium text-gray-900">{vehicle.vehicleNumber}</span>,
    category: vehicle.category || '--',
    staffName: vehicle.staffName ? <span className="text-blue-600">{vehicle.staffName}</span> : '--',
    inDate: vehicle.inDate,
    inTime: vehicle.inTime ? <span className="text-blue-600">{vehicle.inTime}</span> : '--',
    outDate: vehicle.outDate || '--',
    outTime: vehicle.outTime ? <span className="text-blue-600">{vehicle.outTime}</span> : '--'
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Vehicle History</h1>
      
      {/* Action Buttons */}
      <div className="flex items-center gap-3 mb-6">
        <Button 
          onClick={() => setIsFilterModalOpen(true)}
          style={{ backgroundColor: '#C72030' }}
          className="hover:opacity-90 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </Button>
        <Button 
          onClick={handleAllVehiclesClick}
          style={{ backgroundColor: '#C72030' }}
          className="hover:opacity-90 text-white px-6 py-2 rounded"
        >
          All Vehicles
        </Button>
      </div>
      {/* Enhanced Table */}
      <EnhancedTable
        data={vehicleHistoryData}
        columns={historyColumns}
        renderRow={renderHistoryRow}
        enableSearch={true}
        enableSelection={false}
        enableExport={true}
        storageKey="r-vehicles-history-table"
        emptyMessage="No vehicle history available"
        exportFileName="r-vehicles-history"
        searchPlaceholder="Search by vehicle number, category, or staff name"
        hideTableExport={false}
        hideColumnsButton={false}
        leftActions={
          <div className="flex gap-3">
            <Button 
              onClick={handleAllVehiclesClick}
              style={{ backgroundColor: '#C72030' }}
              className="hover:opacity-90 text-white px-4 py-2"
            >
              All Vehicles
            </Button>
          </div>
        }
        onFilterClick={() => setIsFilterModalOpen(true)}
      />

      <RVehiclesHistoryFilterModal 
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      />
    </div>
  );
};
