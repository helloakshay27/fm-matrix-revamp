import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { RVehiclesHistoryFilterModal } from '@/components/RVehiclesHistoryFilterModal';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { useNavigate } from 'react-router-dom';

interface VehicleHistoryItem {
  id: number;
  vehicleNumber: string;
  category: string;
  staffName: string;
  inDate: string;
  inTime: string;
  outDate: string;
  outTime: string;
}

const vehicleHistoryData: VehicleHistoryItem[] = [
  {
    id: 1,
    vehicleNumber: 'DD55GG5555',
    category: '',
    staffName: '',
    inDate: '13/04/2020',
    inTime: '12:08 PM',
    outDate: '05/10/2020',
    outTime: '1:16 PM',
  },
  {
    id: 2,
    vehicleNumber: 'DD55GG5555',
    category: '',
    staffName: '',
    inDate: '13/04/2020',
    inTime: '',
    outDate: '05/10/2020',
    outTime: '1:16 PM',
  },
  {
    id: 3,
    vehicleNumber: 'DD55GG5555',
    category: '',
    staffName: '',
    inDate: '13/04/2020',
    inTime: '12:38 PM',
    outDate: '',
    outTime: '',
  },
  {
    id: 4,
    vehicleNumber: 'GG55GG5555',
    category: '',
    staffName: '',
    inDate: '13/04/2020',
    inTime: '12:45 PM',
    outDate: '',
    outTime: '',
  },
  {
    id: 5,
    vehicleNumber: 'GG55GG5555',
    category: '',
    staffName: '',
    inDate: '13/04/2020',
    inTime: '12:45 PM',
    outDate: '',
    outTime: '',
  },
  {
    id: 6,
    vehicleNumber: 'GG55GG5555',
    category: '',
    staffName: '',
    inDate: '13/04/2020',
    inTime: '12:45 PM',
    outDate: '',
    outTime: '',
  },
  {
    id: 7,
    vehicleNumber: '123456',
    category: 'Owned',
    staffName: '',
    inDate: '05/10/2020',
    inTime: '4:25 PM',
    outDate: '05/10/2020',
    outTime: '5:14 PM',
  },
  {
    id: 8,
    vehicleNumber: '8888',
    category: 'Owned',
    staffName: '',
    inDate: '05/10/2020',
    inTime: '4:57 PM',
    outDate: '05/10/2020',
    outTime: '5:14 PM',
  },
  {
    id: 9,
    vehicleNumber: '9999',
    category: 'Owned',
    staffName: '',
    inDate: '05/10/2020',
    inTime: '5:18 PM',
    outDate: '05/10/2020',
    outTime: '5:19 PM',
  },
  {
    id: 10,
    vehicleNumber: '7878',
    category: 'Staff',
    staffName: 'Nupuraa Admin',
    inDate: '05/10/2020',
    inTime: '6:51 PM',
    outDate: '05/10/2020',
    outTime: '6:52 PM',
  },
  {
    id: 11,
    vehicleNumber: '9999',
    category: 'Owned',
    staffName: '',
    inDate: '05/10/2020',
    inTime: '6:59 PM',
    outDate: '05/10/2020',
    outTime: '6:59 PM',
  },
  {
    id: 12,
    vehicleNumber: 'RJ02G7356',
    category: 'Staff',
    staffName: 'Akash G',
    inDate: '05/10/2020',
    inTime: '6:59 PM',
    outDate: '05/10/2020',
    outTime: '7:01 PM',
  },
  {
    id: 13,
    vehicleNumber: '9999',
    category: 'Owned',
    staffName: '',
    inDate: '05/10/2020',
    inTime: '7:00 PM',
    outDate: '06/10/2020',
    outTime: '5:11 PM',
  },
  {
    id: 14,
    vehicleNumber: '123456',
    category: 'Owned',
    staffName: '',
    inDate: '06/10/2020',
    inTime: '10:39 AM',
    outDate: '06/10/2020',
    outTime: '5:11 PM',
  },
];

const historyColumns: ColumnConfig[] = [
  { key: 'vehicleNumber', label: 'Vehicle Number', sortable: true, hideable: true, draggable: true, defaultVisible: true },
  { key: 'category', label: 'Category', sortable: true, hideable: true, draggable: true, defaultVisible: true },
  { key: 'staffName', label: 'Staff Name', sortable: true, hideable: true, draggable: true, defaultVisible: true },
  { key: 'inDate', label: 'In Date', sortable: true, hideable: true, draggable: true, defaultVisible: true },
  { key: 'inTime', label: 'In Time', sortable: true, hideable: true, draggable: true, defaultVisible: true },
  { key: 'outDate', label: 'Out Date', sortable: true, hideable: true, draggable: true, defaultVisible: true },
  { key: 'outTime', label: 'Out Time', sortable: true, hideable: true, draggable: true, defaultVisible: true },
];

export const RVehiclesHistoryDashboard = () => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [historyData, setHistoryData] = useState<VehicleHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    const fetchHistory = async () => {
      setLoading(true);
      try {
        await new Promise((res) => setTimeout(res, 800));
        if (active) setHistoryData(vehicleHistoryData);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchHistory();
    return () => {
      active = false;
    };
  }, []);

  const filteredData = useMemo(() => {
    if (!searchTerm) return historyData;
    const q = searchTerm.toLowerCase();
    return historyData.filter((item) =>
      Object.values(item).some((value) =>
        String(value ?? '').toLowerCase().includes(q)
      )
    );
  }, [historyData, searchTerm]);

  const handleAllVehiclesClick = () => {
    navigate('/security/vehicle/r-vehicles');
  };

  const renderCell = (vehicle: VehicleHistoryItem, columnKey: string) => {
    switch (columnKey) {
      case 'vehicleNumber':
        return <span className="font-medium text-gray-900">{vehicle.vehicleNumber}</span>;
      case 'category':
        return vehicle.category || '--';
      case 'staffName':
        return vehicle.staffName ? (
          <span className="text-gray-900 font-medium">{vehicle.staffName}</span>
        ) : (
          '--'
        );
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
        return vehicle[columnKey as keyof VehicleHistoryItem] ?? '--';
    }
  };

  return (
    <div className="flex-1 p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">
        Vehicle History
      </h1>

      <EnhancedTable
        data={filteredData}
        columns={historyColumns}
        renderCell={renderCell}
        enableSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        enableExport
        storageKey="r-vehicles-history-table"
        emptyMessage="No vehicle history available"
        exportFileName="r-vehicles-history"
        searchPlaceholder="Search by vehicle number, category, or staff name"
        hideTableExport={false}
        hideColumnsButton={false}
        loading={loading}
        pagination
        pageSize={10}
        onFilterClick={() => setIsFilterModalOpen(true)}
        leftActions={
          <div className="flex items-center gap-2">
            <Button
              onClick={handleAllVehiclesClick}
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white h-9 px-4 text-sm font-medium whitespace-nowrap"
            >
              All Vehicles
            </Button>
          </div>
        }
      />

      <RVehiclesHistoryFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      />
    </div>
  );
};
