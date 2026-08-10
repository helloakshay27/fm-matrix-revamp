import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Download, Edit } from 'lucide-react';
import { AddVehicleParkingModal } from '@/components/AddVehicleParkingModal';
import { RVehicleImportModal } from '@/components/RVehicleImportModal';
import { RVehicleFilterModal } from '@/components/RVehicleFilterModal';
import { EditVehicleDialog } from '@/components/EditVehicleDialog';
import { Switch } from '@/components/ui/switch';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { useNavigate } from 'react-router-dom';
import { useDynamicPermissions } from '@/hooks/useDynamicPermissions';
import { useVehicleEvents } from '@/components/PostHogSecurityEvents';

interface Vehicle {
  id: number;
  vehicleNumber: string;
  parkingSlot: string;
  vehicleCategory: string;
  vehicleType: string;
  stickerNumber: string;
  category: string;
  registrationNumber: string;
  activeInactive: boolean;
  insuranceNumber: string;
  insuranceValidTill: string;
  staffName: string;
  statusCode: string;
  qrCode: string;
}

const initialVehicleData: Vehicle[] = [
  {
    id: 1,
    vehicleNumber: '5000',
    parkingSlot: '',
    vehicleCategory: '4 Wheeler',
    vehicleType: 'Hatchback',
    stickerNumber: '',
    category: 'Owned',
    registrationNumber: '',
    activeInactive: true,
    insuranceNumber: '',
    insuranceValidTill: '22/02/2023',
    staffName: '',
    statusCode: 'Active',
    qrCode: '🔲'
  },
  {
    id: 2,
    vehicleNumber: '2341',
    parkingSlot: '12',
    vehicleCategory: '2 Wheeler',
    vehicleType: '',
    stickerNumber: '11',
    category: 'Staff',
    registrationNumber: '',
    activeInactive: true,
    insuranceNumber: '55555555',
    insuranceValidTill: '20/02/2023',
    staffName: 'demo demo',
    statusCode: 'Active',
    qrCode: '🔲'
  },
  {
    id: 3,
    vehicleNumber: '4321',
    parkingSlot: '',
    vehicleCategory: '4 Wheeler',
    vehicleType: 'SUV',
    stickerNumber: '',
    category: 'Owned',
    registrationNumber: '',
    activeInactive: false,
    insuranceNumber: '',
    insuranceValidTill: '19/02/2023',
    staffName: '',
    statusCode: 'Inactive',
    qrCode: '🔲'
  },
  {
    id: 4,
    vehicleNumber: '4564',
    parkingSlot: '',
    vehicleCategory: '4 Wheeler',
    vehicleType: 'Sedan',
    stickerNumber: '65464',
    category: 'Staff',
    registrationNumber: '5646456',
    activeInactive: true,
    insuranceNumber: '64565464',
    insuranceValidTill: '30/10/2020',
    staffName: 'clone stage',
    statusCode: 'Active',
    qrCode: '🔲'
  },
  {
    id: 5,
    vehicleNumber: '464564645',
    parkingSlot: '903',
    vehicleCategory: '4 Wheeler',
    vehicleType: 'Hatchback',
    stickerNumber: '4466',
    category: 'Staff',
    registrationNumber: '456464',
    activeInactive: true,
    insuranceNumber: '464564',
    insuranceValidTill: '31/10/2020',
    staffName: 'check Major',
    statusCode: 'Active',
    qrCode: '🔲'
  },
  {
    id: 6,
    vehicleNumber: '7777',
    parkingSlot: '902',
    vehicleCategory: '4 Wheeler',
    vehicleType: 'Scooter',
    stickerNumber: '454',
    category: 'Owned',
    registrationNumber: '354353gdd',
    activeInactive: true,
    insuranceNumber: '34543543fg',
    insuranceValidTill: '31/10/2020',
    staffName: '',
    statusCode: 'Active',
    qrCode: '🔲'
  },
  {
    id: 7,
    vehicleNumber: '7890',
    parkingSlot: '901',
    vehicleCategory: '4 Wheeler',
    vehicleType: 'Truck',
    stickerNumber: '9001',
    category: 'Workshop',
    registrationNumber: '12345',
    activeInactive: true,
    insuranceNumber: '34567',
    insuranceValidTill: '31/10/2020',
    staffName: 'V O',
    statusCode: 'Active',
    qrCode: '🔲'
  }
];

const columns: ColumnConfig[] = [
  { key: 'vehicleNumber', label: 'Vehicle Number', sortable: true, hideable: true, draggable: true, defaultVisible: true },
  { key: 'parkingSlot', label: 'Parking Slot', sortable: true, hideable: true, draggable: true, defaultVisible: true },
  { key: 'vehicleCategory', label: 'Vehicle Category', sortable: true, hideable: true, draggable: true, defaultVisible: true },
  { key: 'vehicleType', label: 'Vehicle Type', sortable: true, hideable: true, draggable: true, defaultVisible: true },
  { key: 'stickerNumber', label: 'Sticker Number', sortable: true, hideable: true, draggable: true, defaultVisible: true },
  { key: 'category', label: 'Category', sortable: true, hideable: true, draggable: true, defaultVisible: true },
  { key: 'registrationNumber', label: 'Registration Number', sortable: true, hideable: true, draggable: true, defaultVisible: true },
  { key: 'activeInactive', label: 'Active/Inactive', sortable: true, hideable: true, draggable: true, defaultVisible: true },
  { key: 'insuranceNumber', label: 'Insurance Number', sortable: true, hideable: true, draggable: true, defaultVisible: true },
  { key: 'insuranceValidTill', label: 'Insurance Valid Till', sortable: true, hideable: true, draggable: true, defaultVisible: true },
  { key: 'staffName', label: 'Staff Name', sortable: true, hideable: true, draggable: true, defaultVisible: true },
  { key: 'status', label: 'Status', sortable: false, hideable: true, draggable: true, defaultVisible: true },
  { key: 'qrCode', label: 'QR Code', sortable: false, hideable: true, draggable: true, defaultVisible: true },
];

export const RVehiclesDashboard = () => {
  const { shouldShow } = useDynamicPermissions();
  const [activeTab, setActiveTab] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [vehicleData, setVehicleData] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { onVehicleStatusToggled } = useVehicleEvents();

  useEffect(() => {
    let active = true;
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        await new Promise((res) => setTimeout(res, 800));
        if (active) setVehicleData(initialVehicleData);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchVehicles();
    return () => {
      active = false;
    };
  }, []);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'History') {
      navigate('/security/vehicle/r-vehicles/history');
    } else if (tab === 'In') {
      navigate('/security/vehicle/r-vehicles/in');
    } else if (tab === 'Out') {
      navigate('/security/vehicle/r-vehicles/out');
    }
  };

  const handleEditClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsEditModalOpen(true);
  };

  const handleSaveVehicle = (updatedVehicle: Vehicle) => {
    setVehicleData((prevData) =>
      prevData.map((vehicle) =>
        vehicle.id === updatedVehicle.id ? updatedVehicle : vehicle
      )
    );
  };

  const handleStatusToggle = (vehicleId: number) => {
    const vehicle = vehicleData.find((v) => v.id === vehicleId);
    if (vehicle) {
      onVehicleStatusToggled({
        vehicle_id: vehicleId.toString(),
        to_status: vehicle.statusCode === 'Active' ? 'Inactive' : 'Active',
      });
    }

    setVehicleData((prev) =>
      prev.map((item) =>
        item.id === vehicleId
          ? { ...item, statusCode: item.statusCode === 'Active' ? 'Inactive' : 'Active' }
          : item
      )
    );
  };

  const filteredData = searchTerm
    ? vehicleData.filter((vehicle) =>
      Object.values(vehicle).some((value) =>
        String(value ?? '').toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    : vehicleData;

  const renderCell = (vehicle: Vehicle, columnKey: string) => {
    switch (columnKey) {
      case 'vehicleNumber':
        return <span className="text-gray-900 font-medium">{vehicle.vehicleNumber}</span>;
      case 'parkingSlot':
        return vehicle.parkingSlot || '--';
      case 'vehicleType':
        return vehicle.vehicleType || '--';
      case 'stickerNumber':
        return vehicle.stickerNumber || '--';
      case 'registrationNumber':
        return vehicle.registrationNumber || '--';
      case 'activeInactive':
        return (
          <input
            type="checkbox"
            checked={vehicle.activeInactive}
            className="w-4 h-4 accent-[#C72030] rounded border-gray-300"
            readOnly
          />
        );
      case 'insuranceNumber':
        return vehicle.insuranceNumber || '--';
      case 'staffName':
        return vehicle.staffName || '--';
      case 'status':
        return (
          <div className="flex items-center">
            <Switch
              checked={vehicle.statusCode === 'Active'}
              onCheckedChange={() => handleStatusToggle(vehicle.id)}
              className="data-[state=checked]:bg-[#C72030]"
            />
          </div>
        );
      case 'qrCode':
        return vehicle.qrCode;
      default:
        return vehicle[columnKey as keyof Vehicle] ?? '--';
    }
  };

  const renderActions = (vehicle: Vehicle) =>
    shouldShow('R Vehicles', 'update') ? (
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-black hover:bg-black/10 hover:text-black"
        title="Edit vehicle"
        onClick={(e) => {
          e.stopPropagation();
          handleEditClick(vehicle);
        }}
      >
        <Edit className="w-4 h-4" />
      </Button>
    ) : null;

  return (
    <div className="flex-1 p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">
        Vehicle Parkings
      </h1>

      <div className="flex w-full border-b border-[#e4ddd4] rounded-t-lg overflow-hidden mb-4">
        {['History', 'All', 'In', 'Out'].map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === tab
                ? 'bg-[#DA7756] text-white'
                : 'bg-[#F2EEE9] text-[#8a7e72] hover:bg-[#ece4db]'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <EnhancedTable
        data={filteredData}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        enableSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        enableExport
        storageKey="r-vehicles-table"
        emptyMessage="No vehicles available"
        exportFileName="r-vehicles"
        searchPlaceholder="Search by vehicle number"
        hideTableExport={false}
        hideColumnsButton={false}
        loading={loading}
        pagination
        pageSize={10}
        onFilterClick={() => setIsFilterModalOpen(true)}
        leftActions={
          shouldShow('R Vehicles', 'create') ? (
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-[#C72030] hover:bg-[#C72030]/90 text-white h-9 px-4 text-sm font-medium whitespace-nowrap"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
          ) : undefined
        }
        filterAdjacentActions={
          <Button
            onClick={() => setIsImportModalOpen(true)}
            title="Import"
            variant="outline"
            size="sm"
            className="h-9 w-9 p-0 rounded-lg border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
          >
            <Download className="w-4 h-4" />
          </Button>
        }
      />

      <AddVehicleParkingModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <RVehicleImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />

      <RVehicleFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      />

      <EditVehicleDialog
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        vehicle={selectedVehicle}
        onSave={handleSaveVehicle}
      />
    </div>
  );
};
