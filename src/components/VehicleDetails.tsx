import React, { useMemo } from 'react';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export interface VehicleRecord {
  name: string;
  circle: string;
  email: string;
  id: string | number;
  vehicle_type: string;
  ownership_type: string;
  vehicle_number: string;
  vehicle_name: string;
}

interface VehicleDetailsProps {
  data?: VehicleRecord[];
  loading?: boolean;
}

// Simple CSV export for vehicles
const exportVehiclesCsv = (rows: VehicleRecord[]) => {
  if (!rows || rows.length === 0) {
    alert('No data to export');
    return;
  }
  const headers = ['Name', 'Circle', 'Email', 'ID', 'Vehicle Type', 'Ownership Type', 'Vehicle Number', 'Vehicle Name'];
  const csvLines = [
    headers.join(','),
    ...rows.map(r => [
      r.name,
      r.circle,
      r.email,
      String(r.id),
      r.vehicle_type,
      r.ownership_type,
      r.vehicle_number,
      r.vehicle_name,
    ].map(v => {
      const s = String(v ?? '').replace(/"/g, '""');
      return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s}"` : s;
    }).join(','))
  ].join('\n');

  const blob = new Blob([csvLines], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'vehicle-details.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const VehicleDetails: React.FC<VehicleDetailsProps> = ({ data = [], loading = false }) => {
  // 5 dummy rows used as fallback when no data provided
  const dummyData: VehicleRecord[] = useMemo(() => ([
    {
      name: 'Aditya Saha',
      circle: 'VIL-GUJ-Gujarat',
      email: 'aditya.saha1@vodafoneidea.com',
      id: 237383,
      vehicle_type: '2 Wheeler',
      ownership_type: 'Self/Spouse',
      vehicle_number: 'MP44MS6584',
      vehicle_name: 'Bajaj pulser',
    },
    {
      name: 'Arindam Chattopadhyay',
      circle: 'VIL-WBKA-Rest of Bengal',
      email: 'arindam.chattopadhyay@vodafoneidea.com',
      id: 128428,
      vehicle_type: '4 Wheeler',
      ownership_type: 'Others',
      vehicle_number: 'WB06P6050',
      vehicle_name: 'Hyundai i 20',
    },
    {
      name: 'Vibhat Pandey',
      circle: 'VIMSL - Madhya Pradesh',
      email: 'vibhat.pandey@vodafoneidea.com',
      id: 135400,
      vehicle_type: '2 Wheeler',
      ownership_type: 'Self/Spouse',
      vehicle_number: 'MP53ZC0284',
      vehicle_name: '—',
    },
    {
      name: 'Jaymalbhai Barot',
      circle: 'VIL-GUJ-Gujarat',
      email: 'jaymalbhai.barot@vodafoneidea.com',
      id: 144554,
      vehicle_type: '4 Wheeler',
      ownership_type: 'Self/Spouse',
      vehicle_number: 'GJ03MR7427',
      vehicle_name: 'Venue',
    },
    {
      name: 'Gaurav Thakare',
      circle: 'VIL-MAH-Maharashtra & Goa',
      email: 'gaurav.thakare@vodafoneidea.com',
      id: 128664,
      vehicle_type: '4 Wheeler',
      ownership_type: 'Self/Spouse',
      vehicle_number: 'MH32AX4167',
      vehicle_name: 'Baleno',
    },
  ]), []);

  const tableData = data && data.length > 0 ? data : dummyData;
  const columns: ColumnConfig[] = useMemo(() => ([
    { key: 'name', label: 'Name', sortable: true },
    { key: 'circle', label: 'Circle', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'id', label: 'ID', sortable: true },
    { key: 'vehicle_type', label: 'Vehicle Type', sortable: true },
    { key: 'ownership_type', label: 'Ownership Type', sortable: true },
    { key: 'vehicle_number', label: 'Vehicle Number', sortable: true },
    { key: 'vehicle_name', label: 'Vehicle Name', sortable: true },
  ]), []);

  const leftActions = (
    <Button
      className="bg-[#5B2D66] text-white hover:bg-[#5B2D66]/90"
      onClick={() => exportVehiclesCsv(tableData)}
    >
      <Download className="w-4 h-4 mr-2" />
      Export
    </Button>
  );

  const renderCell = (item: VehicleRecord, columnKey: string) => {
    switch (columnKey) {
      case 'name':
        return item.name || '-';
      case 'circle':
        return item.circle || '-';
      case 'email':
        return item.email || '-';
      case 'id':
        return String(item.id ?? '-');
      case 'vehicle_type':
        return item.vehicle_type || '-';
      case 'ownership_type':
        return item.ownership_type || '-';
      case 'vehicle_number':
        return item.vehicle_number || '-';
      case 'vehicle_name':
        return item.vehicle_name || '-';
      default:
        return '-';
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl font-bold mb-4">VEHICLE DETAILS</h2>
      <EnhancedTable
        data={tableData}
        columns={columns}
        renderCell={renderCell}
        leftActions={leftActions}
        enableExport={false}
        pagination={false}
        loading={loading}
        storageKey="vehicle-details-table"
        searchPlaceholder="Search..."
        enableSearch={true}
        hideColumnsButton={false}
      />
    </div>
  );
};

export default VehicleDetails;