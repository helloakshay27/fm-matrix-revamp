import React, { useMemo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import type { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Button } from '@/components/ui/button';
import { Filter, Pencil, X } from 'lucide-react';
import { API_CONFIG } from '@/config/apiConfig';
import apiClient from '@/utils/apiClient';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

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

interface FilterState {
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
  email: string;
  circle: string;
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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    dateFrom: undefined,
    dateTo: undefined,
    email: '',
    circle: '',
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
      onClick={() => setIsFilterOpen(true)}
      title="Filters"
    >
      <Filter className="w-4 h-4" />
      Filters
    </Button>
  );

  const handleFilterSubmit = () => {
    // TODO: Apply filters to API call
    console.log('Applying filters:', filters);
    setIsFilterOpen(false);
    // Refetch data with filters
    // fetchLtmList(1, filters);
  };

  const handleFilterReset = () => {
    setFilters({
      dateFrom: undefined,
      dateTo: undefined,
      email: '',
      circle: '',
    });
  };

  const handleFilterExport = () => {
    // TODO: Implement export with filters
    console.log('Exporting with filters:', filters);
  };

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

      {/* Filter Modal */}
      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
            <DialogTitle className="text-lg font-semibold">FILTER BY</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setIsFilterOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateFrom">Date Range*</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="dateFrom"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !filters.dateFrom && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateFrom ? format(filters.dateFrom, "PPP") : "Select Date Range"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.dateFrom}
                      onSelect={(date) => setFilters({ ...filters, dateFrom: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateTo" className="invisible">To</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="dateTo"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !filters.dateTo && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateTo ? format(filters.dateTo, "PPP") : "Select Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.dateTo}
                      onSelect={(date) => setFilters({ ...filters, dateTo: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email*</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter Email"
                value={filters.email}
                onChange={(e) => setFilters({ ...filters, email: e.target.value })}
              />
            </div>

            {/* Circle */}
            <div className="space-y-2">
              <Label htmlFor="circle">Circle</Label>
              <Select
                value={filters.circle}
                onValueChange={(value) => setFilters({ ...filters, circle: value })}
              >
                <SelectTrigger id="circle">
                  <SelectValue placeholder="Select Circle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="circle1">Circle 1</SelectItem>
                  <SelectItem value="circle2">Circle 2</SelectItem>
                  <SelectItem value="circle3">Circle 3</SelectItem>
                  {/* Add more circles as needed */}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-3 pt-4 border-t">
            <Button
              className="bg-[#5B2D66] hover:bg-[#5B2D66]/90 text-white px-8"
              onClick={handleFilterSubmit}
            >
              Submit
            </Button>
            <Button
              className="bg-[#5B2D66] hover:bg-[#5B2D66]/90 text-white px-8"
              onClick={handleFilterExport}
            >
              Export
            </Button>
            <Button
              variant="outline"
              className="px-8"
              onClick={handleFilterReset}
            >
              Reset
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VehicleCheckIn;