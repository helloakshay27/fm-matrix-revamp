import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { History, List, LogIn, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { RVehicleOutDialog } from '@/components/RVehicleOutDialog';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const vehicleColumns: ColumnConfig[] = [
  { key: 'vehicleNumber', label: 'Vehicle Number', sortable: true, hideable: true, draggable: true, defaultVisible: true },
  { key: 'category', label: 'Category', sortable: true, hideable: true, draggable: true, defaultVisible: true },
  { key: 'parkingSlot', label: 'Parking Slot', sortable: true, hideable: true, draggable: true, defaultVisible: true },
  { key: 'checkout', label: 'Checkout', sortable: false, hideable: true, draggable: true, defaultVisible: true },
];

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
    <div className="flex-1 p-6 bg-white min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Vehicle Parkings</h1>
        
        <Tabs value={activeTab} onValueChange={handleTabClick} className="w-full mb-4">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200">
            <TabsTrigger value="History" className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"><History className="w-4 h-4" />History</TabsTrigger>
            <TabsTrigger value="All" className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"><List className="w-4 h-4" />All</TabsTrigger>
            <TabsTrigger value="In" className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"><LogIn className="w-4 h-4" />In</TabsTrigger>
            <TabsTrigger value="Out" className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"><LogOut className="w-4 h-4" />Out</TabsTrigger>
          </TabsList>
        </Tabs>

        <EnhancedTable
            data={vehicleData}
            columns={vehicleColumns}
            renderCell={(vehicle, columnKey) => columnKey === 'vehicleNumber' ? (
              <span className="inline-flex items-center gap-2"><span>{vehicle.vehicleIcon}</span>{vehicle.vehicleNumber || '--'}</span>
            ) : columnKey === 'parkingSlot' ? (vehicle.parkingSlot || '--') : columnKey === 'checkout' ? (
              <Button
                onClick={() => handleOutButtonClick(vehicle.vehicleNumber)}
                className="bg-[#1A1A1A] hover:bg-[#333333] text-white px-3 py-1 text-sm"
              >
                Checkout
              </Button>
            ) : (vehicle.category || '--')}
            enableSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search using Vehicle number"
            storageKey="r-vehicles-out-table"
            emptyMessage="No vehicles available for exit"
            enableExport
            hideTableExport={false}
            pagination
            pageSize={10}
            disableMobileCardView
          />
      </div>

      <RVehicleOutDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        vehicleNumber={selectedVehicle}
      />
    </div>
  );
};
