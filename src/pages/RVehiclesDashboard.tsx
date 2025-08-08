import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Download, SlidersHorizontal, Edit, Search } from 'lucide-react';
import { AddVehicleParkingModal } from '@/components/AddVehicleParkingModal';
import { RVehicleImportModal } from '@/components/RVehicleImportModal';
import { RVehicleFilterModal } from '@/components/RVehicleFilterModal';
import { EditVehicleDialog } from '@/components/EditVehicleDialog';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { useNavigate } from 'react-router-dom';

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

export const RVehiclesDashboard = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [vehicleData, setVehicleData] = useState(initialVehicleData);
  const navigate = useNavigate();

  // Column configuration for the enhanced table
  const columns: ColumnConfig[] = [
    { key: 'sNo', label: 'S No.', sortable: false, hideable: false, draggable: false },
    { key: 'actions', label: 'Actions', sortable: false, hideable: false, draggable: false },
    { key: 'vehicleNumber', label: 'Vehicle Number', sortable: true, hideable: true, draggable: true },
    { key: 'parkingSlot', label: 'Parking Slot', sortable: true, hideable: true, draggable: true },
    { key: 'vehicleCategory', label: 'Vehicle Category', sortable: true, hideable: true, draggable: true },
    { key: 'vehicleType', label: 'Vehicle Type', sortable: true, hideable: true, draggable: true },
    { key: 'stickerNumber', label: 'Sticker Number', sortable: true, hideable: true, draggable: true },
    { key: 'category', label: 'Category', sortable: true, hideable: true, draggable: true },
    { key: 'registrationNumber', label: 'Registration Number', sortable: true, hideable: true, draggable: true },
    { key: 'activeInactive', label: 'Active/Inactive', sortable: true, hideable: true, draggable: true },
    { key: 'insuranceNumber', label: 'Insurance Number', sortable: true, hideable: true, draggable: true },
    { key: 'insuranceValidTill', label: 'Insurance Valid Till', sortable: true, hideable: true, draggable: true },
    { key: 'staffName', label: 'Staff Name', sortable: true, hideable: true, draggable: true },
    { key: 'status', label: 'Status', sortable: true, hideable: true, draggable: true },
    { key: 'qrCode', label: 'QR Code', sortable: false, hideable: true, draggable: true }
  ];

  const handleHistoryClick = () => {
    navigate('/security/vehicle/r-vehicles/history');
  };

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
    setVehicleData(prevData => 
      prevData.map(vehicle => 
        vehicle.id === updatedVehicle.id ? updatedVehicle : vehicle
      )
    );
    console.log('Vehicle updated:', updatedVehicle);
  };

  const handleStatusToggle = (vehicleId: number) => {
    console.log(`Toggling status for Vehicle ${vehicleId}`);
    
    setVehicleData(prev => 
      prev.map(vehicle => 
        vehicle.id === vehicleId 
          ? { ...vehicle, statusCode: vehicle.statusCode === 'Active' ? 'Inactive' : 'Active' }
          : vehicle
      )
    );
  };

  // Add index to data for S No.
  const dataWithIndex = vehicleData.map((vehicle, index) => ({
    ...vehicle,
    sNo: index + 1
  }));

  // Render row function for enhanced table
  const renderRow = (vehicle: any) => ({
    sNo: vehicle.sNo,
    actions: (
      <button 
        onClick={() => handleEditClick(vehicle)}
        className="text-gray-400 hover:text-[#C72030] transition-colors"
      >
        <Edit className="w-4 h-4" />
      </button>
    ),
    vehicleNumber: (
      <span className="text-[#C72030] font-medium">
        {vehicle.vehicleNumber}
      </span>
    ),
    parkingSlot: vehicle.parkingSlot || '--',
    vehicleCategory: vehicle.vehicleCategory,
    vehicleType: vehicle.vehicleType || '--',
    stickerNumber: vehicle.stickerNumber || '--',
    category: vehicle.category,
    registrationNumber: vehicle.registrationNumber || '--',
    activeInactive: (
      <input 
        type="checkbox" 
        checked={vehicle.activeInactive} 
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" 
        readOnly
      />
    ),
    insuranceNumber: vehicle.insuranceNumber || '--',
    insuranceValidTill: vehicle.insuranceValidTill,
    staffName: vehicle.staffName || '--',
    status: (
      <div className="flex items-center">
        <div
          className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${
            vehicle.statusCode === 'Active' ? 'bg-green-500' : 'bg-gray-300'
          }`}
          onClick={() => handleStatusToggle(vehicle.id)}
        >
          <span
            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
              vehicle.statusCode === 'Active' ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </div>
      </div>
    ),
    qrCode: vehicle.qrCode
  });

  return (
    <div className="p-6 bg-[#f6f4ee] min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>vehicle parkings</span>
          <span>&gt;</span>
          <span>Vehicle Parkings</span>
        </div>
        
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-6">VEHICLE PARKINGS</h1>
        
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex bg-white p-1 rounded-lg">
            {['History', 'All', 'In', 'Out'].map((tab) => (
              <Button
                key={tab}
                onClick={() => handleTabClick(tab)}
                className={`px-6 py-2 text-sm font-medium transition-colors rounded-md border-none ${
                  activeTab === tab
                    ? 'bg-[#EDEAE3] text-[#C72030] shadow-sm'
                    : 'bg-transparent text-gray-600 hover:bg-white/50'
                }`}
                variant="ghost"
              >
                {tab}
              </Button>
            ))}
          </div>

          {/* Data Table */}
          <div className="border rounded-lg overflow-hidden">
            <EnhancedTable
              data={dataWithIndex}
              columns={columns}
              renderRow={renderRow}
              enableSearch={true}
              enableSelection={false}
              enableExport={true}
              storageKey="r-vehicles-table"
              emptyMessage="No vehicles available"
              exportFileName="r-vehicles"
              searchPlaceholder="Search by vehicle number, category, or staff name"
              hideTableExport={false}
              hideColumnsButton={false}
              leftActions={
                <div className="flex gap-3">
                  <Button 
                    onClick={() => setIsAddModalOpen(true)}
                    style={{ backgroundColor: '#C72030' }}
                    className="text-white hover:bg-[#C72030]/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                  <Button 
                    onClick={() => setIsImportModalOpen(true)}
                    style={{ backgroundColor: '#C72030' }}
                    className="text-white hover:bg-[#C72030]/90"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Import
                  </Button>
                </div>
              }
              onFilterClick={() => setIsFilterModalOpen(true)}
            />
          </div>
        </div>
      </div>

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