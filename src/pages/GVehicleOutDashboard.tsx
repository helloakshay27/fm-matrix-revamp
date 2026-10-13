import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';

const vehicleOutColumns: ColumnConfig[] = [
  { key: 'vehicleNumber', label: 'Vehicle Number', sortable: true, hideable: true, draggable: true, defaultVisible: true },
  { key: 'name', label: 'Name', sortable: true, hideable: true, draggable: true, defaultVisible: true },
  { key: 'status', label: 'Status', sortable: true, hideable: true, draggable: true, defaultVisible: true },
  { key: 'checkout', label: 'Checkout', sortable: false, hideable: true, draggable: true, defaultVisible: true },
];

const vehicleOutData = [
  {
    id: 1,
    vehicleNumber: '3253',
    name: 'Kshitij Rasal',
    status: 'G',
  },
  {
    id: 2,
    vehicleNumber: '233223',
    name: 'dinesh',
    status: 'G',
  },
  {
    id: 3,
    vehicleNumber: '',
    name: 'Pune Sam',
    status: 'G',
  },
  {
    id: 4,
    vehicleNumber: '3452',
    name: 'Sahil',
    status: 'G',
  },
];

interface GVehicleOutDashboardProps {
  onHistoryClick?: () => void;
}

const brandButtonClass =
  'bg-[#C72030] hover:bg-[#C72030]/90 text-white h-9 px-4 text-sm font-medium whitespace-nowrap shadow-none';

export const GVehicleOutDashboard = ({ onHistoryClick }: GVehicleOutDashboardProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleHistoryClick = () => {
    onHistoryClick?.();
  };

  const handleOut = (vehicleId: number) => {
    console.log('Vehicle out:', vehicleId);
  };

  return (
    <div className="flex-1 p-6 bg-white min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>Visitor</span>
          <span>&gt;</span>
          <span>Visitor Vehicle Out</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">
          Visitor Vehicle Out
        </h1>

        <EnhancedTable
          data={vehicleOutData}
          columns={vehicleOutColumns}
          renderCell={(vehicle, columnKey) => {
            if (columnKey === 'vehicleNumber') return vehicle.vehicleNumber || '--';
            if (columnKey === 'name') return vehicle.name || '--';
            if (columnKey === 'status') return vehicle.status || '--';
            if (columnKey === 'checkout') {
              return (
                <Button onClick={() => handleOut(vehicle.id)} className={brandButtonClass}>
                  Out
                </Button>
              );
            }
            return '--';
          }}
          enableSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search using Vehicle number"
          storageKey="g-vehicle-out-table"
          emptyMessage="No vehicles available to check out"
          enableExport
          pagination
          pageSize={10}
          disableMobileCardView
          leftActions={
            <div className="flex items-center gap-2">
              <Button onClick={handleHistoryClick} className={brandButtonClass}>History</Button>
              <Button className={brandButtonClass}>Vehicle Out</Button>
            </div>
          }
        />
      </div>
    </div>
  );
};
