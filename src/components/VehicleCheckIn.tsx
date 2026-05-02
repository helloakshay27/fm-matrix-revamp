import React, { useMemo, useEffect, useState, useCallback } from 'react';
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
import { addMonths, format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/sonner';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';

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
  circleId: string;
}

type CircleOption = {
  id: string | number;
  name: string;
};

const LTM_EXPORT_JSON_ENDPOINT = '/vehicle_histories/ltm_export.json';
const LTM_EXPORT_XLSX_ENDPOINT = '/vehicle_histories/ltm_export.xlsx';
const LTM_PER_PAGE = 20;

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
    circleId: '',
  });

  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    dateFrom: undefined,
    dateTo: undefined,
    email: '',
    circleId: '',
  });

  const [circles, setCircles] = useState<CircleOption[]>([]);

  const hasAppliedFilters = useMemo(() => {
    return Boolean(
      appliedFilters.email?.trim() ||
      appliedFilters.circleId ||
      (appliedFilters.dateFrom && appliedFilters.dateTo)
    );
  }, [appliedFilters]);

  const paginationItems = useMemo(() => {
    const items: Array<number | 'ellipsis'> = [];
    const totalPages = pagination.total_pages || 1;
    const current = currentPage;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) items.push(i);
      return items;
    }

    items.push(1);

    const start = Math.max(2, current - 1);
    const end = Math.min(totalPages - 1, current + 1);

    if (start > 2) items.push('ellipsis');
    for (let i = start; i <= end; i++) items.push(i);
    if (end < totalPages - 1) items.push('ellipsis');

    items.push(totalPages);
    return items;
  }, [pagination.total_pages, currentPage]);

  const handlePageChange = (page: number) => {
    if (page < 1) return;
    const totalPages = pagination.total_pages || 1;
    if (page > totalPages) return;
    setCurrentPage(page);
  };

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

  const buildLtmExportParams = useCallback((state: FilterState, page?: number) => {
    const params: Record<string, string | number> = {};

    if (state.email?.trim()) {
      params['q[user_email_cont]'] = state.email.trim();
    }

    if (state.circleId) {
      params['circle_id'] = state.circleId;
    }

    if (state.dateFrom && state.dateTo) {
      const from = format(state.dateFrom, 'MM/dd/yyyy');
      const to = format(state.dateTo, 'MM/dd/yyyy');
      params['q[date_range]'] = `${from} - ${to}`;
    }

    if (page) {
      params.page = page;
    }

    return params;
  }, []);

  const fetchLtmList = useCallback(async (page: number = 1, state: FilterState = appliedFilters) => {
    setApiLoading(true);
    try {
      const hasAnyFilter = Boolean(
        state.email?.trim() ||
        state.circleId ||
        (state.dateFrom && state.dateTo)
      );

      if (hasAnyFilter) {
        const response = await apiClient.get<ApiResponse>(LTM_EXPORT_JSON_ENDPOINT, {
          params: buildLtmExportParams(state),
        });

        if (response.data && response.data.vehicle_histories) {
          setApiData(response.data.vehicle_histories);
          if (response.data.pagination) {
            setPagination(response.data.pagination);
          } else {
            setPagination({
              current_page: 1,
              total_count: response.data.vehicle_histories.length,
              total_pages: 1,
            });
          }
        } else {
          setApiData([]);
        }
      } else {
        const url = `${API_CONFIG.ENDPOINTS.LTM_LIST}?page=${page}&per_page=${LTM_PER_PAGE}`;
        const response = await apiClient.get<ApiResponse>(url);

        if (response.data && response.data.vehicle_histories) {
          setApiData(response.data.vehicle_histories);
          setPagination(response.data.pagination);
        } else {
          setApiData([]);
        }
      }
    } catch (error) {
      console.error('Error fetching LTM list:', error);
      setApiData([]);
    } finally {
      setApiLoading(false);
    }
  }, [appliedFilters, buildLtmExportParams]);

  // Fetch LTM list from API (with applied filters)
  useEffect(() => {
    fetchLtmList(currentPage, appliedFilters);
  }, [currentPage, appliedFilters, fetchLtmList]);

  useEffect(() => {
    const fetchCircles = async () => {
      try {
        const response = await apiClient.get<unknown>('/circles.json');
        const data = response.data;
        let list: unknown[] = [];

        if (Array.isArray(data)) {
          list = data;
        } else if (data && typeof data === 'object') {
          const obj = data as Record<string, unknown>;
          const raw = obj.data ?? obj.circles;
          if (Array.isArray(raw)) {
            list = raw;
          }
        }

        const normalized: CircleOption[] = list
          .map((c: unknown) => {
            if (!c || typeof c !== 'object') return { id: '', name: '' };
            const obj = c as Record<string, unknown>;
            const id = obj.id as string | number | undefined;
            const name = (obj.name ?? obj.circle_name ?? obj.title) as string | undefined;
            return {
              id: id ?? '',
              name: name ?? '',
            };
          })
          .filter((c: CircleOption) => c.id != null && Boolean(c.name));

        setCircles(normalized);
      } catch (error) {
        console.error('Error fetching circles:', error);
        setCircles([]);
      }
    };

    fetchCircles();
  }, []);

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
    if (!filters.email?.trim()) {
      toast.error('Email is required.');
      return;
    }

    if (!filters.dateFrom || !filters.dateTo) {
      toast.error('Date range is required.');
      return;
    }

    if (filters.dateFrom && filters.dateTo) {
      const maxTo = addMonths(filters.dateFrom, 3);
      if (filters.dateTo.getTime() > maxTo.getTime()) {
        toast.error('Date range can be maximum 3 months.');
        return;
      }
      if (filters.dateTo.getTime() < filters.dateFrom.getTime()) {
        toast.error('End date cannot be before start date.');
        return;
      }
    }
    setAppliedFilters(filters);
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  const handleFilterReset = () => {
    const cleared: FilterState = {
      dateFrom: undefined,
      dateTo: undefined,
      email: '',
      circleId: '',
    };
    setFilters(cleared);
    setAppliedFilters(cleared);
    setCurrentPage(1);
  };

  const handleFilterExport = async () => {
    try {
      if (!filters.email?.trim()) {
        toast.error('Email is required.');
        return;
      }

      if (!filters.dateFrom || !filters.dateTo) {
        toast.error('Date range is required.');
        return;
      }

      const params = buildLtmExportParams(filters);
      const response = await apiClient.get(LTM_EXPORT_XLSX_ENDPOINT, {
        params,
        responseType: 'blob',
      });

      const blob = new Blob([response.data], {
        type: response.headers?.['content-type'] || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'ltm_export.xlsx';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting LTM XLSX:', error);
    }
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
        data={tableData}
        columns={columns}
        renderCell={renderCell}
        leftActions={leftActions}
        enableExport={false}
        pagination={false}
        loading={apiLoading}
        storageKey="vehicle-checkin-table"
        searchPlaceholder="Search..."
        enableSearch={true}
        hideColumnsButton={false}
      />

      {!hasAppliedFilters && (pagination.total_pages || 1) > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>

            {paginationItems.map((p, idx) => (
              <PaginationItem key={`${p}-${idx}`}>
                {p === 'ellipsis' ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    className="cursor-pointer"
                    isActive={currentPage === p}
                    onClick={() => handlePageChange(p)}
                  >
                    {p}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
                className={currentPage === (pagination.total_pages || 1) ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

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
                      onSelect={(date) => {
                        if (!date) {
                          setFilters({ ...filters, dateFrom: undefined });
                          return;
                        }

                        const next: FilterState = { ...filters, dateFrom: date };
                        if (next.dateTo) {
                          if (next.dateTo.getTime() < date.getTime()) {
                            next.dateTo = undefined;
                          } else {
                            const maxTo = addMonths(date, 3);
                            if (next.dateTo.getTime() > maxTo.getTime()) {
                              next.dateTo = undefined;
                              toast.error('Date range can be maximum 3 months.');
                            }
                          }
                        }
                        setFilters(next);
                      }}
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
                      onSelect={(date) => {
                        if (!date) {
                          setFilters({ ...filters, dateTo: undefined });
                          return;
                        }

                        if (!filters.dateFrom) {
                          toast.error('Please select start date first.');
                          return;
                        }

                        if (date.getTime() < filters.dateFrom.getTime()) {
                          toast.error('End date cannot be before start date.');
                          return;
                        }

                        const maxTo = addMonths(filters.dateFrom, 3);
                        if (date.getTime() > maxTo.getTime()) {
                          toast.error('Date range can be maximum 3 months.');
                          return;
                        }

                        setFilters({ ...filters, dateTo: date });
                      }}
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
            {/* <div className="space-y-2">
              <Label htmlFor="circle">Circle</Label>
              <Select
                value={filters.circleId}
                onValueChange={(value) => setFilters({ ...filters, circleId: value })}
              >
                <SelectTrigger id="circle">
                  <SelectValue placeholder="Select Circle" />
                </SelectTrigger>
                <SelectContent>
                  {circles.map((c) => (
                    <SelectItem key={String(c.id)} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div> */}
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