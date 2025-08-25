import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import type { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Button } from '@/components/ui/button';
import { Filter, Pencil } from 'lucide-react';

type LtmRecord = {
  id: string | number;
  vehicle_type: string; // e.g., "2 Wheeler"
  vehicle_number: string; // e.g., HR20AT6860
  vehicle_name: string; // e.g., Bike / Activa
  user: string;
  email: string;
  circle: string;
  odo_start: number;
  odo_end: number;
  check_in_time: string; // DD/MM/YYYY hh:mm A
  check_out_time: string; // DD/MM/YYYY hh:mm A
  total_distance: number;
  reimbursable_kms: number;
  fuel_amount: number;
  toll_amount: number;
  total_amount: number;
  vehicle_photo?: string;
  check_in_photo?: string;
  check_out_photo?: string;
  parking_photo?: string;
};

interface VehicleCheckInProps {
  data?: LtmRecord[];
  loading?: boolean;
  onFilterClick?: () => void;
}

const VehicleCheckIn: React.FC<VehicleCheckInProps> = ({ data = [], loading = false, onFilterClick }) => {
  const navigate = useNavigate();
  const columns: ColumnConfig[] = useMemo(() => ([
    { key: 'action', label: 'Action', sortable: false },
    { key: 'vehicle', label: 'Vehicle', sortable: true },
    { key: 'user', label: 'User', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'circle', label: 'Circle', sortable: true },
    { key: 'odo_start', label: 'Odometer Start Reading', sortable: true },
    { key: 'odo_end', label: 'Odometer End Reading', sortable: true },
    { key: 'check_out_time', label: 'Check Out Time', sortable: true },
    { key: 'total_distance', label: 'Total Distance', sortable: true },
    { key: 'reimbursable_kms', label: 'Reimbursable kms', sortable: true },
    { key: 'fuel_amount', label: 'Fuel Amount', sortable: true },
    { key: 'toll_amount', label: 'Toll Amount', sortable: true },
    { key: 'total_amount', label: 'Total Amount', sortable: true },
    { key: 'vehicle_photo', label: 'Vehicle Photo', sortable: false },
    { key: 'check_in_photo', label: 'Check In Photo', sortable: false },
    { key: 'check_out_photo', label: 'Check Out Photo', sortable: false },
    { key: 'parking_photo', label: 'Parking Photo', sortable: false },
  ]), []);

  const dummyData: LtmRecord[] = useMemo(() => ([
    {
      id: 1,
      vehicle_type: '2 Wheeler',
      vehicle_number: 'HR20AT6860',
      vehicle_name: 'Bike',
      user: 'Dayavir .',
      email: 'dayavir.d@vodafoneidea.com',
      circle: 'VIMSL – Haryana',
      odo_start: 6000.0,
      odo_end: 6230.0,
      check_in_time: '23/08/2025 9:00 AM',
      check_out_time: '23/08/2025 6:12 PM',
      total_distance: 230.0,
      reimbursable_kms: 200.0,
      fuel_amount: 0,
      toll_amount: 0,
      total_amount: 0,
      vehicle_photo: '/placeholder.svg',
      check_in_photo: '/placeholder.svg',
      check_out_photo: '/placeholder.svg',
      parking_photo: '/placeholder.svg',
    },
    {
      id: 2,
      vehicle_type: '2 Wheeler',
      vehicle_number: 'MP47MJ3941',
      vehicle_name: 'Activa',
      user: 'Lokesh Gupta',
      email: 'lokesh.gupta@vodafoneidea.com',
      circle: 'VIL-MPC–MP & Chhattisgarh',
      odo_start: 36447.0,
      odo_end: 36547.0,
      check_in_time: '23/08/2025 9:15 AM',
      check_out_time: '23/08/2025 6:00 PM',
      total_distance: 100.0,
      reimbursable_kms: 90.0,
      fuel_amount: 0,
      toll_amount: 0,
      total_amount: 0,
      vehicle_photo: '/placeholder.svg',
      check_in_photo: '/placeholder.svg',
      check_out_photo: '/placeholder.svg',
      parking_photo: '/placeholder.svg',
    },
    {
      id: 3,
      vehicle_type: '4 Wheeler',
      vehicle_number: 'AP40CX0073',
      vehicle_name: 'TATA PUNCH',
      user: 'Sreeramulu Narla',
      email: 'narla.sreeramulu@vodafoneidea.com',
      circle: 'VIL–APT–Andhra Pradesh',
      odo_start: 30313.0,
      odo_end: 30413.0,
      check_in_time: '23/08/2025 10:00 AM',
      check_out_time: '23/08/2025 5:34 PM',
      total_distance: 100.0,
      reimbursable_kms: 90.0,
      fuel_amount: 0,
      toll_amount: 0,
      total_amount: 0,
      vehicle_photo: '/placeholder.svg',
      check_in_photo: '/placeholder.svg',
      check_out_photo: '/placeholder.svg',
      parking_photo: '/placeholder.svg',
    },
    {
      id: 4,
      vehicle_type: '4 Wheeler',
      vehicle_number: 'HR36AH2362',
      vehicle_name: 'XUV 300',
      user: 'Yogesh Kumar',
      email: 'yogesh.kumar3@vodafoneidea.com',
      circle: 'VIL–PUH–Haryana',
      odo_start: 112765.0,
      odo_end: 112865.0,
      check_in_time: '23/08/2025 9:45 AM',
      check_out_time: '23/08/2025 5:33 PM',
      total_distance: 100.0,
      reimbursable_kms: 90.0,
      fuel_amount: 0,
      toll_amount: 0,
      total_amount: 0,
      vehicle_photo: '/placeholder.svg',
      check_in_photo: '/placeholder.svg',
      check_out_photo: '/placeholder.svg',
      parking_photo: '/placeholder.svg',
    },
    {
      id: 5,
      vehicle_type: '2 Wheeler',
      vehicle_number: 'KA11EN1371',
      vehicle_name: 'Honda activa',
      user: 'Sushma V',
      email: 'sushma.h@vodafoneidea.com',
      circle: 'VIMSL – Karnataka',
      odo_start: 68678.0,
      odo_end: 68728.0,
      check_in_time: '23/08/2025 9:30 AM',
      check_out_time: '23/08/2025 5:32 PM',
      total_distance: 50.0,
      reimbursable_kms: 45.0,
      fuel_amount: 0,
      toll_amount: 0,
      total_amount: 0,
      vehicle_photo: '/placeholder.svg',
      check_in_photo: '/placeholder.svg',
      check_out_photo: '/placeholder.svg',
      parking_photo: '/placeholder.svg',
    },
  ]), []);

  const tableData = data.length > 0 ? data : dummyData;

  const leftActions = (
    <Button
      variant="outline"
      size="sm"
      className="border-[#5B2D66] text-[#5B2D66] hover:bg-[#5B2D66]/10 flex items-center gap-2"
      onClick={onFilterClick}
      title="Filters"
    >
      <Filter className="w-4 h-4" />
      Filters
    </Button>
  );

  const renderCell = (item: LtmRecord, columnKey: string) => {
    switch (columnKey) {
      case 'action':
        return (
          <button
            className="p-1 rounded hover:bg-gray-100"
            title="Edit"
            onClick={() => navigate('/vehicle-history/update', { state: { record: item } })}
          >
            <Pencil className="w-4 h-4 text-gray-600" />
          </button>
        );
      case 'vehicle':
        return (
          <span className="whitespace-nowrap">{`${item.vehicle_type} / ${item.vehicle_number} / ${item.vehicle_name}`}</span>
        );
      case 'user':
        return item.user;
      case 'email':
        return item.email;
      case 'circle':
        return item.circle;
      case 'odo_start':
        return item.odo_start?.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
      case 'odo_end':
        return item.odo_end?.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
      case 'check_out_time':
        return item.check_out_time;
      case 'total_distance':
        return item.total_distance?.toLocaleString();
      case 'reimbursable_kms':
        return item.reimbursable_kms?.toLocaleString();
      case 'fuel_amount':
        return item.fuel_amount?.toLocaleString();
      case 'toll_amount':
        return item.toll_amount?.toLocaleString();
      case 'total_amount':
        return item.total_amount?.toLocaleString();
      case 'vehicle_photo':
      case 'check_in_photo':
      case 'check_out_photo':
      case 'parking_photo': {
        const src = (item as any)[columnKey] || '/placeholder.svg';
        return (
          <img
            src={src}
            alt={columnKey}
            className="w-16 h-16 object-cover rounded"
          />
        );
      }
      default:
        return '-';
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl font-bold mb-4">LTM LIST</h2>
      <EnhancedTable
        data={tableData as any[]}
        columns={columns}
        renderCell={renderCell as any}
        leftActions={leftActions}
        enableExport={false}
        pagination={false}
        loading={loading}
        storageKey="vehicle-checkin-table"
        searchPlaceholder="Search..."
        enableSearch={true}
        hideColumnsButton={false}
      />
    </div>
  );
};

export default VehicleCheckIn;