import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { History, List, LogIn, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { RVehicleInDialog } from '@/components/RVehicleInDialog';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const vehicleColumns: ColumnConfig[] = [
  { key: 'vehicleNumber', label: 'Vehicle Number', sortable: true, hideable: true, draggable: true, defaultVisible: true },
  { key: 'category', label: 'Category', sortable: true, hideable: true, draggable: true, defaultVisible: true },
  { key: 'parkingSlot', label: 'Parking Slot', sortable: true, hideable: true, draggable: true, defaultVisible: true },
  { key: 'checkin', label: 'Check In', sortable: false, hideable: true, draggable: true, defaultVisible: true },
];

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const navigate = useNavigate();

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

  const handleInButtonClick = (vehicleNumber: string) => {
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
            ) : columnKey === 'parkingSlot' ? (vehicle.parkingSlot || '--') : columnKey === 'checkin' ? (
              <Button
                onClick={() => handleInButtonClick(vehicle.vehicleNumber)}
                className="bg-[#1A1A1A] hover:bg-[#333333] text-white px-3 py-1 text-sm"
              >
                Check In
              </Button>
            ) : (vehicle.category || '--')}
            enableSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search using Vehicle number"
            storageKey="r-vehicles-in-table"
            emptyMessage="No vehicles available for entry"
            enableExport
            hideTableExport={false}
            pagination
            pageSize={10}
            disableMobileCardView
          />
      </div>

      <RVehicleInDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        vehicleNumber={selectedVehicle}
      />
    </div>
  );
};
