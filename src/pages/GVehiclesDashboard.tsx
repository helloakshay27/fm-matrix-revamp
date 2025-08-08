
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, Plus, Filter } from 'lucide-react';
import { AddGVehicleModal } from '@/components/AddGVehicleModal';
import { GVehicleFilterModal } from '@/components/GVehicleFilterModal';
import { GVehicleOutDashboard } from './GVehicleOutDashboard';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';

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

// Column configuration for the enhanced table
const columns: ColumnConfig[] = [
  { key: 'type', label: 'Type', sortable: true, hideable: true, draggable: true },
  { key: 'name', label: 'Name', sortable: true, hideable: true, draggable: true },
  { key: 'vehicleNumber', label: 'Vehicle Number', sortable: true, hideable: true, draggable: true },
  { key: 'mobileNumber', label: 'Mobile Number', sortable: true, hideable: true, draggable: true },
  { key: 'purpose', label: 'Purpose', sortable: true, hideable: true, draggable: true },
  { key: 'inDate', label: 'In Date', sortable: true, hideable: true, draggable: true },
  { key: 'inTime', label: 'In Time', sortable: true, hideable: true, draggable: true },
  { key: 'outDate', label: 'Out Date', sortable: true, hideable: true, draggable: true },
  { key: 'outTime', label: 'Out Time', sortable: true, hideable: true, draggable: true }
];

export const GVehiclesDashboard = () => {
  const [activeTab, setActiveTab] = useState('History');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState('history'); // 'history' or 'vehicle-out'

  // Render row function for enhanced table
  const renderRow = (vehicle: any) => ({
    type: vehicle.type,
    name: vehicle.name,
    vehicleNumber: <span className="text-blue-600 font-medium">{vehicle.vehicleNumber}</span>,
    mobileNumber: <span className="text-blue-600">{vehicle.mobileNumber}</span>,
    purpose: vehicle.purpose || '--',
    inDate: vehicle.inDate || '--',
    inTime: vehicle.inTime ? <span className="text-blue-600">{vehicle.inTime}</span> : '--',
    outDate: vehicle.outDate || '--',
    outTime: vehicle.outTime ? <span className="text-blue-600">{vehicle.outTime}</span> : '--'
  });

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
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="font-work-sans font-semibold text-base sm:text-2xl lg:text-[26px] leading-auto tracking-normal text-gray-900 mb-6 uppercase">G VEHICLES LIST</h1>
      
      {/* Tab Navigation */}
      <div className="flex gap-3 mb-6">
        <Button 
          onClick={handleHistoryClick}
          className={`px-6 py-2 rounded ${
            activeTab === 'History' 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-primary text-primary-foreground'
          }`}
        >
          History
        </Button>
        <Button 
          onClick={handleVehicleOutClick}
          className={`px-6 py-2 rounded ${
            activeTab === 'Vehicle Out' 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-primary text-primary-foreground'
          }`}
        >
          Vehicle Out
        </Button>
      </div>

      {/* Enhanced Table */}
      <EnhancedTable
        data={gVehicleData}
        columns={columns}
        renderRow={renderRow}
        enableSearch={true}
        enableSelection={false}
        enableExport={true}
        storageKey="g-vehicles-table"
        emptyMessage="No vehicles available"
        exportFileName="g-vehicles"
        searchPlaceholder="Search by name, vehicle number, or mobile number"
        hideTableExport={false}
        hideColumnsButton={false}
        leftActions={
          <div className="flex gap-3">
            <Button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
        }
        onFilterClick={() => setIsFilterModalOpen(true)}
      />

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
