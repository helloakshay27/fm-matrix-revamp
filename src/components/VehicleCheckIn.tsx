import React, { useMemo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import type { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Button } from '@/components/ui/button';
import { Filter, Pencil } from 'lucide-react';
import { API_CONFIG } from '@/config/apiConfig';
import apiClient from '@/utils/apiClient';

type LtmRecord = {
  id: string | number;
  vehicle: string; // Combined: "2 Wheeler / HR20AT6860 / Bike"
  user_name: string;
  user_email: string;
  circle: string;
  odometer_start: number;
  check_in_time: string;
  start_location: string;
  destination_location: string[]; // Array of destinations
  visit_purpose: string;
  odometer_end: number | null;
  check_out_time: string | null;
  total_distance: number | null;
  reimbursable_kms: number | null;
  fuel_amount: number | null;
  toll_amount: number | null;
  total_amount: number | null;
  vehicle_photos?: string[];
  check_in_photos?: string[];
  check_out_photos?: string[];
  parking_photos?: string[];
};

interface ApiResponse {
  vehicle_histories: LtmRecord[];
  pagination: {
    current_page: number;
    total_count: number;
    total_pages: number;
  };
}

interface VehicleCheckInProps {
  onFilterClick?: () => void;
}

const VehicleCheckIn: React.FC<VehicleCheckInProps> = ({ onFilterClick }) => {
  const navigate = useNavigate();
  const [apiData, setApiData] = useState<LtmRecord[]>([]);
  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_count: 0,
    total_pages: 0,
  });

  const columns: ColumnConfig[] = useMemo(() => ([
    // { key: 'action', label: 'Action', sortable: false },
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

  // Fetch LTM list from API
  useEffect(() => {
    const fetchLtmList = async (page: number = 1) => {
      setApiLoading(true);
      try {
        const url = `${API_CONFIG.ENDPOINTS.LTM_LIST}?page=${page}`;
        const response = await apiClient.get<ApiResponse>(url);
        
        if (response.data && response.data.vehicle_histories) {
          setApiData(response.data.vehicle_histories);
          setPagination(response.data.pagination);
        }
      } catch (error) {
        console.error('Error fetching LTM list:', error);
        setApiData([]);
      } finally {
        setApiLoading(false);
      }
    };

    fetchLtmList(currentPage);
  }, [currentPage]);

  const tableData = useMemo(() => {
    return apiData.length > 0 ? apiData : [];
  }, [apiData]);

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
          <span className="whitespace-nowrap">{item.vehicle}</span>
        );
      case 'user':
        return item.user_name;
      case 'email':
        return item.user_email;
      case 'circle':
        return item.circle;
      case 'odo_start':
        return item.odometer_start?.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
      case 'odo_end':
        return item.odometer_end?.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) || '-';
      case 'check_out_time':
        return item.check_out_time || '-';
      case 'total_distance':
        return item.total_distance?.toLocaleString() || '-';
      case 'reimbursable_kms':
        return item.reimbursable_kms?.toLocaleString() || '-';
      case 'fuel_amount':
        return item.fuel_amount?.toLocaleString() || '-';
      case 'toll_amount':
        return item.toll_amount?.toLocaleString() || '-';
      case 'total_amount':
        return item.total_amount?.toLocaleString() || '-';
      case 'vehicle_photo':
      case 'check_in_photo':
      case 'check_out_photo':
      case 'parking_photo': {
        // Map the column key to the correct photo array property
        const photoMap: Record<string, keyof Pick<LtmRecord, 'vehicle_photos' | 'check_in_photos' | 'check_out_photos' | 'parking_photos'>> = {
          'vehicle_photo': 'vehicle_photos',
          'check_in_photo': 'check_in_photos',
          'check_out_photo': 'check_out_photos',
          'parking_photo': 'parking_photos'
        };
        const photoArrayKey = photoMap[columnKey];
        const photos = item[photoArrayKey];
        const src = (photos && photos.length > 0) ? photos[0] : '/placeholder.svg';
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
        loading={apiLoading}
        storageKey="vehicle-checkin-table"
        searchPlaceholder="Search..."
        enableSearch={true}
        hideColumnsButton={false}
      />
    </div>
  );
};

export default VehicleCheckIn;