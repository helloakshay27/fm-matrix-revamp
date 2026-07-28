import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AddGVehicleModal } from '@/components/AddGVehicleModal';
import { GVehicleFilterModal } from '@/components/GVehicleFilterModal';
import { GVehicleOutDashboard } from './GVehicleOutDashboard';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { useDynamicPermissions } from '@/hooks/useDynamicPermissions';

interface GVehicle {
  id: number;
  type: string;
  name: string;
  vehicleNumber: string;
  mobileNumber: string;
  purpose: string;
  inDate: string;
  inTime: string;
  outDate: string;
  outTime: string;
}

const gVehicleData: GVehicle[] = [
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
    outTime: '12:21 PM',
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
    outTime: '12:21 PM',
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
    outTime: '12:21 PM',
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
    outTime: '12:19 PM',
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
    outTime: '11:09 AM',
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
    outTime: '04:10 PM',
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
    outTime: '12:20 PM',
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
    outTime: '12:20 PM',
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
    outTime: '12:20 PM',
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
    outTime: '12:20 PM',
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
    outTime: '12:20 PM',
  },
];

const columns: ColumnConfig[] = [
  { key: 'type', label: 'Type', sortable: true, hideable: true, draggable: true, defaultVisible: true },
  { key: 'name', label: 'Name', sortable: true, hideable: true, draggable: true, defaultVisible: true },
  { key: 'vehicleNumber', label: 'Vehicle Number', sortable: true, hideable: true, draggable: true, defaultVisible: true },
  { key: 'mobileNumber', label: 'Mobile Number', sortable: true, hideable: true, draggable: true, defaultVisible: true },
  { key: 'purpose', label: 'Purpose', sortable: true, hideable: true, draggable: true, defaultVisible: true },
  { key: 'inDate', label: 'In Date', sortable: true, hideable: true, draggable: true, defaultVisible: true },
  { key: 'inTime', label: 'In Time', sortable: true, hideable: true, draggable: true, defaultVisible: true },
  { key: 'outDate', label: 'Out Date', sortable: true, hideable: true, draggable: true, defaultVisible: true },
  { key: 'outTime', label: 'Out Time', sortable: true, hideable: true, draggable: true, defaultVisible: true },
];

const brandButtonClass =
  'bg-[#C72030] hover:bg-[#C72030]/90 text-white h-9 px-4 text-sm font-medium whitespace-nowrap';

export const GVehiclesDashboard = () => {
  const { shouldShow } = useDynamicPermissions();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'history' | 'vehicle-out'>('history');
  const [vehicleData, setVehicleData] = useState<GVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let active = true;
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        await new Promise((res) => setTimeout(res, 800));
        if (active) setVehicleData(gVehicleData);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchVehicles();
    return () => {
      active = false;
    };
  }, []);

  const filteredData = useMemo(() => {
    if (!searchTerm) return vehicleData;
    const q = searchTerm.toLowerCase();
    return vehicleData.filter((item) =>
      Object.values(item).some((value) =>
        String(value ?? '').toLowerCase().includes(q)
      )
    );
  }, [vehicleData, searchTerm]);

  const handleHistoryClick = () => {
    setCurrentView('history');
  };

  const handleVehicleOutClick = () => {
    setCurrentView('vehicle-out');
  };

  const renderCell = (vehicle: GVehicle, columnKey: string) => {
    switch (columnKey) {
      case 'type':
        return vehicle.type || '--';
      case 'name':
        return <span className="font-medium text-gray-900">{vehicle.name}</span>;
      case 'vehicleNumber':
        return <span className="font-medium text-gray-900">{vehicle.vehicleNumber}</span>;
      case 'mobileNumber':
        return <span className="text-gray-900">{vehicle.mobileNumber}</span>;
      case 'purpose':
        return vehicle.purpose || '--';
      case 'inDate':
        return vehicle.inDate || '--';
      case 'inTime':
        return vehicle.inTime ? (
          <span className="text-gray-900">{vehicle.inTime}</span>
        ) : (
          '--'
        );
      case 'outDate':
        return vehicle.outDate || '--';
      case 'outTime':
        return vehicle.outTime ? (
          <span className="text-gray-900">{vehicle.outTime}</span>
        ) : (
          '--'
        );
      default:
        return vehicle[columnKey as keyof GVehicle] ?? '--';
    }
  };

  if (currentView === 'vehicle-out') {
    return <GVehicleOutDashboard onHistoryClick={handleHistoryClick} />;
  }

  return (
    <div className="flex-1 p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">
        G Vehicles List
      </h1>

      <EnhancedTable
        data={filteredData}
        columns={columns}
        renderCell={renderCell}
        enableSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        enableExport
        storageKey="g-vehicles-table"
        emptyMessage="No vehicles available"
        exportFileName="g-vehicles"
        searchPlaceholder="Search by name, vehicle number, or mobile number"
        hideTableExport={false}
        hideColumnsButton={false}
        loading={loading}
        pagination
        pageSize={10}
        onFilterClick={() => setIsFilterModalOpen(true)}
        leftActions={
          <div className="flex items-center gap-2">
            <Button onClick={handleHistoryClick} className={brandButtonClass}>
              History
            </Button>
            <Button onClick={handleVehicleOutClick} className={brandButtonClass}>
              Vehicle Out
            </Button>
            {shouldShow('G Vehicles', 'create') && (
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className={brandButtonClass}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            )}
          </div>
        }
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
