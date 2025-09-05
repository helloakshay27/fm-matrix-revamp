import React, { useState, useEffect, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Eye, Trash2, BarChart3, Download, Settings, Flag, Filter, Pencil } from 'lucide-react';
import { AMCAnalyticsFilterDialog } from '@/components/AMCAnalyticsFilterDialog';
import { amcAnalyticsAPI, AMCStatusData, AMCStatusSummary, AMCTypeDistribution, AMCExpiryAnalysis, AMCServiceTrackingLog, AMCVendorPerformance, AMCComplianceReport, AMCUnitResourceData, AMCServiceStatsData, AMCLocationCoverageNode } from '@/services/amcAnalyticsAPI';
import { amcAnalyticsDownloadAPI } from '@/services/amcAnalyticsDownloadAPI';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAMCData } from '@/store/slices/amcSlice';
import { AMCAnalyticsSelector } from '@/components/AMCAnalyticsSelector';
import { AMCStatusCard } from '@/components/AMCStatusCard';
import { AMCTypeDistributionCard } from '@/components/AMCTypeDistributionCard';
import { AMCExpiryAnalysisCard } from '@/components/AMCExpiryAnalysisCard';
import { AMCServiceTrackingCard } from '@/components/AMCServiceTrackingCard';
import { AMCVendorPerformanceCard } from '@/components/AMCVendorPerformanceCard';
import { AMCUnitResourceCard } from '@/components/AMCUnitResourceCard';
import { AMCServiceStatsCard } from '@/components/AMCServiceStatsCard';
import { AMCCoverageByLocationCard } from '@/components/AMCCoverageByLocationCard';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Pagination,
  PaginationEllipsis,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import axios from 'axios';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SelectionPanel } from '@/components/water-asset-details/PannelTab';
import { AmcBulkUploadModal } from '@/components/water-asset-details/AmcBulkUploadModal';
import { useDebounce } from '@/hooks/useDebounce';

// Sortable Chart Item Component
const SortableChartItem = ({ id, children }: { id: string; children: React.ReactNode }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('[data-download]') ||
      target.closest('svg') ||
      target.tagName === 'BUTTON' ||
      target.tagName === 'SVG' ||
      target.closest('.download-btn') ||
      target.closest('[data-download-button]')
    ) {
      e.stopPropagation();
      return;
    }
    if (listeners?.onPointerDown) {
      listeners.onPointerDown(e);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      onPointerDown={handlePointerDown}
      className="cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-md group relative"
    >
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-50 transition-opacity duration-200 z-10">
        <div className="w-1 h-6 bg-gray-400 rounded-full"></div>
      </div>
      {children}
    </div>
  );
};

interface AMCRecord {
  id: number;
  asset_name: string;
  amc_type: string;
  vendor_name: string;
  amc_start_date: string;
  amc_end_date: string;
  amc_first_service: string;
  created_at: string;
  active: string;
  is_flagged?: boolean;
  contract_name?: string;
  total_days_remaining?: number;
  service_name?: string;
  status: string;
}

const initialAmcData: AMCRecord[] = [];

const columns: ColumnConfig[] = [
  { key: 'actions', label: 'Actions', sortable: false, defaultVisible: true },
  { key: 'id', label: 'ID', sortable: true, defaultVisible: true },
  { key: 'asset_name', label: 'Asset Name', sortable: true, defaultVisible: true },
  { key: 'amc_type', label: 'AMC Type', sortable: true, defaultVisible: true },
  { key: 'vendor_name', label: 'Vendor Name', sortable: true, defaultVisible: true },
  { key: 'contract_name', label: 'Contract Name', sortable: true, defaultVisible: true },
  { key: 'amc_start_date', label: 'Start Date', sortable: true, defaultVisible: true },
  { key: 'amc_end_date', label: 'End Date', sortable: true, defaultVisible: true },
  { key: 'amc_first_service', label: 'First Service', sortable: true, defaultVisible: true },
  { key: 'total_days_remaining', label: 'Days Remaining', sortable: true, defaultVisible: true },
  { key: 'created_at', label: 'Created On', sortable: true, defaultVisible: true },
  { key: 'active', label: 'Status', sortable: true, defaultVisible: true },
];

export const AMCDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');
  const { data: apiData, loading: reduxLoading, error } = useAppSelector((state) => state.amc);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleSections, setVisibleSections] = useState<string[]>([
    'statusChart', 'typeChart', 'resourceChart', 'agingMatrix'
  ]);
  const [chartOrder, setChartOrder] = useState<string[]>(['statusChart', 'typeChart', 'resourceChart', 'agingMatrix']);
  const [filter, setFilter] = useState<string | null>(null);
  const [amcTypeFilter, setAmcTypeFilter] = useState<string | null>(null);
  const [startDateFilter, setStartDateFilter] = useState<string | null>(null);
  const [endDateFilter, setEndDateFilter] = useState<string | null>(null);
  const [tempAmcTypeFilter, setTempAmcTypeFilter] = useState<string | null>(null);
  const [tempStartDateFilter, setTempStartDateFilter] = useState<string | null>(null);
  const [tempEndDateFilter, setTempEndDateFilter] = useState<string | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("amclist");
  const [showActionPanel, setShowActionPanel] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [isExpiringFilterActive, setIsExpiringFilterActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 600);
  const [isAnalyticsFilterOpen, setIsAnalyticsFilterOpen] = useState(false);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [amcAnalyticsData, setAmcAnalyticsData] = useState<AMCStatusData | null>(null);
  const [amcStatusSummary, setAmcStatusSummary] = useState<AMCStatusSummary | null>(null);
  const [amcTypeDistribution, setAmcTypeDistribution] = useState<AMCTypeDistribution[] | null>(null);
  const [amcExpiryAnalysis, setAmcExpiryAnalysis] = useState<AMCExpiryAnalysis[] | null>(null);
  const [amcServiceTracking, setAmcServiceTracking] = useState<AMCServiceTrackingLog[] | null>(null);
  const [amcVendorPerformance, setAmcVendorPerformance] = useState<AMCVendorPerformance[] | null>(null);
  const [amcComplianceReport, setAmcComplianceReport] = useState<AMCComplianceReport | null>(null);
  const [amcUnitResourceData, setAmcUnitResourceData] = useState<AMCUnitResourceData[] | null>(null);
  const [amcServiceStatsData, setAmcServiceStatsData] = useState<AMCServiceStatsData[] | null>(null);
  const [amcCoverageData, setAmcCoverageData] = useState<AMCLocationCoverageNode[] | null>(null);
  // const [selectedAnalyticsOptions, setSelectedAnalyticsOptions] = useState<string[]>(['status_overview', 'type_distribution', 'unit_resource_wise', 'service_stats', 'expiry_analysis', 'service_tracking', 'coverage_by_location']);
    const [selectedAnalyticsOptions, setSelectedAnalyticsOptions] = useState<string[]>(['status_overview', 'type_distribution', 'unit_resource_wise', 'service_stats', 'expiry_analysis', 'coverage_by_location']);

  const [analyticsChartOrder, setAnalyticsChartOrder] = useState<string[]>(['status_overview', 'type_distribution', 'unit_resource_wise', 'service_stats', 'expiry_analysis', 'coverage_by_location']);
  const [togglingIds, setTogglingIds] = useState<Set<number>>(new Set());
  // Track which summary tile is selected; null means none selected on initial load
  const [selectedSummary, setSelectedSummary] = useState<null | 'total' | 'active' | 'inactive' | 'underObservation' | 'expiring'>(null);

  const getDefaultDateRange = () => {
    const today = new Date();
    const lastYear = new Date();
    lastYear.setFullYear(today.getFullYear() - 1);

    const formatDate = (date: Date) => {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    return {
      startDate: formatDate(lastYear),
      endDate: formatDate(today)
    };
  };

  const [analyticsDateRange, setAnalyticsDateRange] = useState<{ startDate: string; endDate: string }>(getDefaultDateRange());

  const convertDateStringToDate = (dateString: string): Date => {
    const [day, month, year] = dateString.split('/');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  };

  const formatDateForAPI = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (isFilterModalOpen) {
      setTempAmcTypeFilter(amcTypeFilter);
      setTempStartDateFilter(startDateFilter);
      setTempEndDateFilter(endDateFilter);
    }
  }, [isFilterModalOpen, amcTypeFilter, startDateFilter, endDateFilter]);

  const fetchAMCAnalyticsData = async (startDate: Date, endDate: Date) => {
    setAnalyticsLoading(true);
    try {
      const [
        statusData,
        statusSummary,
        typeDistribution,
        unitResourceData,
        expiryAnalysis,
        serviceTracking,
        serviceStatsData,
        vendorPerformance,
        complianceReport,
        coverageData
      ] = await Promise.all([
        amcAnalyticsAPI.getAMCStatusData(startDate, endDate),
        amcAnalyticsAPI.getAMCStatusSummary(startDate, endDate),
        amcAnalyticsAPI.getAMCTypeDistribution(startDate, endDate),
        amcAnalyticsAPI.getAMCUnitResourceWise(startDate, endDate),
        amcAnalyticsAPI.getAMCExpiryAnalysis(startDate, endDate),
        amcAnalyticsAPI.getAMCServiceTracking(startDate, endDate),
        amcAnalyticsAPI.getAMCServiceStats(startDate, endDate),
        amcAnalyticsAPI.getAMCVendorPerformance(startDate, endDate),
        amcAnalyticsAPI.getAMCComplianceReport(startDate, endDate),
        amcAnalyticsAPI.getAMCCoverageByLocation(startDate, endDate)
      ]);

      setAmcAnalyticsData(statusData);
      setAmcStatusSummary(statusSummary);
      setAmcTypeDistribution(typeDistribution);
      setAmcUnitResourceData(unitResourceData);
      setAmcExpiryAnalysis(expiryAnalysis);
      setAmcServiceTracking(serviceTracking);
      setAmcServiceStatsData(serviceStatsData);
      setAmcVendorPerformance(vendorPerformance);
      setAmcComplianceReport(complianceReport);
      setAmcCoverageData(coverageData);
    } catch (error) {
      console.error('Error fetching AMC analytics data:', error);
      toast.error('Failed to fetch AMC analytics data');
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const handleAnalyticsFilterApply = (filters: { startDate: string; endDate: string }) => {
    setAnalyticsDateRange(filters);
    const startDate = convertDateStringToDate(filters.startDate);
    const endDate = convertDateStringToDate(filters.endDate);
    fetchAMCAnalyticsData(startDate, endDate);
  };

  const amcData = apiData && typeof apiData === 'object' && 'asset_amcs' in apiData && Array.isArray((apiData as any).asset_amcs) ? (apiData as any).asset_amcs : initialAmcData;
  const pagination = (apiData && typeof apiData === 'object' && 'pagination' in apiData) ? (apiData as any).pagination : { current_page: 1, total_count: 0, total_pages: 1 };

  const totalAMCs = amcAnalyticsData ? (amcAnalyticsData.active_amcs + amcAnalyticsData.inactive_amcs) :
    ((apiData && typeof apiData === 'object' && 'total_amcs_count' in apiData) ? (apiData as any).total_amcs_count : pagination.total_count || 0);
  const activeAMCs = amcAnalyticsData?.active_amcs ||
    ((apiData && typeof apiData === 'object' && 'active_amcs_count' in apiData) ? (apiData as any).active_amcs_count : 0);
  const inactiveAMCs = amcAnalyticsData?.inactive_amcs ||
    ((apiData && typeof apiData === 'object' && 'inactive_amcs_count' in apiData) ? (apiData as any).inactive_amcs_count : 0);
  const flaggedAMCs = (apiData && typeof apiData === 'object' && 'flagged_amcs_count' in apiData) ? (apiData as any).flagged_amcs_count : 0;
  const expiringIn90Days = (apiData && typeof apiData === 'object' && 'expiring_in_fifteen_days' in apiData) ? (apiData as any).expiring_in_fifteen_days : 0;
  const serviceTotalAMCs = amcUnitResourceData?.find(item => item.type === 'Services')?.count || 0;
  const assetTotalAMCs = amcUnitResourceData?.find(item => item.type === 'Assets')?.count || 0;

  const fetchFilteredAMCs = async (filterValue: string | null, page: number = 1, expiryFilter?: string, searchTerm: string = '') => {
    if (!baseUrl || !token) {
      toast.error('Missing base URL, token, or site ID');
      return;
    }

    setLoading(true);
    let url = `https://${baseUrl}/pms/asset_amcs.json?page=${page}`;
    const queryParams: string[] = [];

    if (filterValue === 'active') {
      queryParams.push('q[status_eq]=active');
    } else if (filterValue === 'inactive') {
      queryParams.push('q[status_eq]=inactive');
    } else if (filterValue === 'UnderObservation') {
      queryParams.push('q[status_eq]=under_observation');
    }

    if (expiryFilter === 'expiring_in_15_days') {
      queryParams.push('q[expire_in_15_days_eq]=true');
    } else if (expiryFilter) {
      queryParams.push(`q[amc_end_date_lteq]=${expiryFilter}`);
    }

    if (amcTypeFilter) {
      queryParams.push(`q[amc_type_eq]=${encodeURIComponent(amcTypeFilter)}`);
    }
    if (startDateFilter) {
      queryParams.push(`q[amc_start_date_eq]=${startDateFilter}`);
    }
    if (endDateFilter) {
      queryParams.push(`q[amc_end_date_eq]=${endDateFilter}`);
    }

    if (searchTerm && searchTerm.trim()) {
      if (!isNaN(Number(searchTerm))) {
        queryParams.push(`q[id_eq]=${encodeURIComponent(searchTerm.trim())}`);
      }
      queryParams.push(`q[search_all_fields_cont]=${encodeURIComponent(searchTerm.trim())}`);
    }

    if (queryParams.length > 0) {
      url += `&${queryParams.join('&')}`;
    }

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const fetchedData = response.data;
      // Map API response to AMCRecord, prioritizing `status` over `active`
      const mappedData = {
        ...fetchedData,
        asset_amcs: fetchedData.asset_amcs.map((item: any) => ({
          ...item,
          active: item.status, // Map status to active for backward compatibility, if needed
        })),
      };
      dispatch(fetchAMCData.fulfilled(mappedData, 'fetchAMCData', undefined));
      setCurrentPage(fetchedData.pagination.current_page);
    } catch (error) {
      console.error('Error fetching AMC data:', error);
      dispatch(fetchAMCData.rejected(error as any, 'fetchAMCData', undefined));
      toast.error('Failed to fetch AMC data');
    } finally {
      setLoading(false);
    }
  };

  const handleExpiringIn90DaysClick = () => {
    setFilter(null);
    setAmcTypeFilter(null);
    setStartDateFilter(null);
    setEndDateFilter(null);
    setCurrentPage(1);
    setIsExpiringFilterActive(true);
    fetchFilteredAMCs(null, 1, 'expiring_in_15_days', debouncedSearchQuery);
  };

  useEffect(() => {
    if (baseUrl && token) {
      fetchFilteredAMCs(
        filter,
        currentPage,
        isExpiringFilterActive ? formatDateForAPI(new Date(new Date().setDate(new Date().getDate() + 90))) : undefined,
        debouncedSearchQuery
      );
    }
  }, [baseUrl, token, currentPage, filter, amcTypeFilter, debouncedSearchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  setSelectedSummary(null);
  };

  useEffect(() => {
    const defaultRange = getDefaultDateRange();
    const startDate = convertDateStringToDate(defaultRange.startDate);
    const endDate = convertDateStringToDate(defaultRange.endDate);
    fetchAMCAnalyticsData(startDate, endDate);
  }, []);

  const handleAddClick = () => {
    navigate('/maintenance/amc/add');
  };

  const handleViewDetails = (id: number) => {
    navigate(`/maintenance/amc/details/${id}`);
  };

  const handleImportClick = () => {
    setShowBulkUploadModal(true);
    setShowActionPanel(false);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(amcData.map(item => item.id.toString()));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, itemId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    }
  };

  const handleBulkDelete = (selectedItems: AMCRecord[]) => {
    const selectedIds = selectedItems.map(item => item.id);
    setSelectedItems([]);
    toast.success(`Selected AMCs (${selectedIds.length}) deleted`);
    fetchFilteredAMCs(filter, currentPage, isExpiringFilterActive ? formatDateForAPI(new Date(new Date().setDate(new Date().getDate() + 90))) : undefined, debouncedSearchQuery);
  };

  const handleSelectionChange = (selectedSections: string[]) => {
    setVisibleSections(selectedSections);
  };

  const handleExport = async () => {
    try {
      if (!baseUrl || !token) {
        toast.error('Missing base URL, token, or site ID');
        return;
      }

      let url = `https://${baseUrl}/pms/asset_amcs/export.xlsx`;
      if (selectedItems.length > 0) {
        const ids = selectedItems.join(',');
        url += `&ids=${ids}`;
      }

      const response = await axios.get(url, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data || response.data.size === 0) {
        toast.error('Empty file received from server');
        return;
      }

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'amc_export.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
      toast.success('AMC data exported successfully');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export AMC data');
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setChartOrder((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleAnalyticsDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setAnalyticsChartOrder((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleAnalyticsSelectionChange = (options: string[]) => {
    setSelectedAnalyticsOptions(options);
    setAnalyticsChartOrder(prevOrder => {
      const newOrder = prevOrder.filter(chartType => options.includes(chartType));
      const newCharts = options.filter(chartType => !prevOrder.includes(chartType));
      return [...newOrder, ...newCharts];
    });
  };

  const renderCell = (item: AMCRecord, columnKey: string) => {
    switch (columnKey) {
      case 'actions':
        return (
          <div className="flex items-center justify-center gap-1">
            <div
              onClick={() => handleViewDetails(item.id)}
              className="p-1 cursor-pointer hover:text-gray-700"
              title="View"
            >
              <Eye className="w-4 h-4" />
            </div>
            <div
              title="Flag AMC"
              onClick={(e) => {
                e.stopPropagation();
                handleSingleAmcFlag(item);
              }}
              className="p-1 cursor-pointer hover:text-[#C72030]"
            >
              <Flag
                className={`w-4 h-4 ${item.is_flagged ? 'text-red-500 fill-red-500' : 'text-gray-600'}`}
              />
            </div>
            <Link
              to={`/maintenance/amc/edit/${item.id}`}
              className="p-1 text-gray-600"
              title="Edit AMC"
            >
              <Pencil className="w-4 h-4" />
            </Link>
          </div>
        );
      case 'id':
        return <span className="font-medium">{item.id}</span>;
      case 'asset_name':
        if (item.amc_type === 'Asset') {
          return item.asset_name || '-';
        } else if (item.amc_type === 'Service') {
          return item.service_name || '-';
        } else {
          return '-';
        }
      case 'amc_type':
        return item.amc_type || '-';
      case 'vendor_name':
        return item.vendor_name || '-';
      case 'contract_name':
        return item.contract_name || '-';
      case 'amc_start_date':
        return item.amc_start_date ? new Date(item.amc_start_date).toLocaleDateString() : '-';
      case 'amc_end_date':
        return item.amc_end_date ? new Date(item.amc_end_date).toLocaleDateString() : '-';
      case 'amc_first_service':
        return item.amc_first_service ? new Date(item.amc_first_service).toLocaleDateString() : '-';
      case 'total_days_remaining':
        return item.total_days_remaining || '-';
      case 'active':

        const statusColors = {
          active: '#d5dbdb',
          inactive: '#c4b89d',
          under_observation: '#dbc2a9',
          expired: '#ef4444',
        };

        const statusLabels: Record<string, string> = {
          active: 'Active',
          inactive: 'Inactive',
          under_observation: 'Under Observation',
          expired: 'Expired',
          '': '',
        };

        const selectedValue = (item.status ?? '').toLowerCase(); // Normalize to lowercase
        const isExpired = selectedValue === 'expired';
        const triggerBackgroundColor = statusColors[selectedValue] || '#d3d3d3';
        return (
          <div className="relative group">
            <Select
              value={selectedValue}
              onValueChange={async (value) => {
                if (isExpired || togglingIds.has(item.id)) return; // Prevent changes if expired or toggling

                setTogglingIds((prev) => new Set(prev).add(item.id));

                const newStatus = value; // "active", "inactive", or "under_observation"
                if (!baseUrl || !token) {
                  toast.error('Missing base URL, token, or site ID');
                  return;
                }
                try {
                  // Optimistic update
                  const updatedAmcData = amcData.map((record) =>
                    record.id === item.id ? { ...record, status: value } : record
                  );
                  const updatedApiData = {
                    ...((apiData as any) || {}),
                    asset_amcs: updatedAmcData,
                    active_amcs_count:
                      value === 'active'
                        ? (apiData as any).active_amcs_count + 1
                        : (apiData as any).active_amcs_count - (item.status === 'active' ? 1 : 0),
                    inactive_amcs_count:
                      value === 'inactive'
                        ? (apiData as any).inactive_amcs_count + 1
                        : (apiData as any).inactive_amcs_count - (item.status === 'inactive' ? 1 : 0),
                    under_observation:
                      value === 'under_observation'
                        ? ((apiData as any).under_observation || 0) + 1
                        : (apiData as any).under_observation - (item.status === 'under_observation' ? 1 : 0),
                    total_amcs_count: (apiData as any).total_amcs_count,
                  };

                  dispatch(fetchAMCData.fulfilled(updatedApiData, 'fetchAMCData', undefined));

                  const response = await axios.put(
                    `https://${baseUrl}/pms/asset_amcs/${item.id}.json`,
                    {
                      pms_asset_amc: {
                        status: newStatus,
                      },
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );
                  if (response.status === 200) {
                    toast.success(`Status updated to ${value}`);
                    const { startDate, endDate } = analyticsDateRange;
                    const startDateObj = convertDateStringToDate(startDate);
                    const endDateObj = convertDateStringToDate(endDate);
                    await fetchAMCAnalyticsData(startDateObj, endDateObj);
                  } else {
                    dispatch(fetchAMCData.fulfilled(apiData, 'fetchAMCData', undefined));
                    toast.error('Failed to update AMC status');
                  }
                } catch (error) {
                  console.error('Error updating AMC status:', error);
                  dispatch(fetchAMCData.fulfilled(apiData, 'fetchAMCData', undefined));
                  toast.error('Failed to update AMC status');
                } finally {
                  setTogglingIds((prev) => {
                    const newSet = new Set(prev);
                    newSet.delete(item.id);
                    return newSet;
                  });
                }
              }}
              disabled={isExpired || togglingIds.has(item.id)} // Disable if expired or toggling
            >
              <SelectTrigger
                className="w-[140px] text-center"
                style={{
                  backgroundColor: triggerBackgroundColor,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0 8px',
                }}
              >
                <SelectValue
                  placeholder="Select Status"
                  className="text-center"
                  style={{ textAlign: 'center', marginRight: '8px', color: '#000' }}
                >
                  {statusLabels[selectedValue] || 'Select Status'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="text-center">
                <SelectItem value="active" className="text-center" style={{ backgroundColor: '#d5dbdb', color: '#fff' }}>
                  Active
                </SelectItem>
                <SelectItem value="inactive" className="text-center" style={{ backgroundColor: '#c4b89d', color: '#fff' }}>
                  Inactive
                </SelectItem>
                <SelectItem value="under_observation" className="text-center" style={{ backgroundColor: '#dbc2a9', color: '#fff' }}>
                  Under Observation
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      case 'created_at':
        return item.created_at
          ? new Date(item.created_at).toLocaleString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          })
          : '-';
      default:
        return '-';
    }
  };

  const bulkActions = [
    {
      label: 'Delete Selected',
      icon: Trash2,
      variant: 'destructive' as const,
      onClick: handleBulkDelete,
    },
  ];

  const handleSingleAmcFlag = async (amcItem: AMCRecord) => {
    try {
      if (!baseUrl || !token) {
        toast.error('Missing base URL or token');
        return;
      }

      const updatedFlag = !amcItem.is_flagged;
      const response = await axios.put(
        `https://${baseUrl}/pms/asset_amcs/${amcItem.id}.json`,
        {
          pms_asset_amc: {
            is_flagged: updatedFlag,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        dispatch(fetchAMCData());
        toast.dismiss();
        toast.success(`Flag ${updatedFlag ? 'Activated' : 'Deactivated'}`);
      } else {
        toast.error('Failed to update AMC flag');
      }
    } catch (error) {
      console.error('Flag update error:', error);
      toast.error('Failed to update AMC flag');
    }
  };

  const renderPaginationItems = () => {
    const items = [];
    const totalPages = pagination.total_pages;
    const currentPage = pagination.current_page;
    const showEllipsis = totalPages > 7;

    if (showEllipsis) {
      // Always show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            className='cursor-pointer'
            onClick={() => handlePageChange(1)}
            isActive={currentPage === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Show pages 2, 3, 4 if currentPage is 1, 2, or 3
      if (currentPage <= 3) {
        for (let i = 2; i <= 4 && i < totalPages; i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink
                className='cursor-pointer'
                onClick={() => handlePageChange(i)}
                isActive={currentPage === i}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
        if (totalPages > 5) {
          items.push(
            <PaginationItem key="ellipsis1">
              <PaginationEllipsis />
            </PaginationItem>
          );
        }
      } else if (currentPage >= totalPages - 2) {
        // Show ellipsis before last 4 pages
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
        for (let i = totalPages - 3; i < totalPages; i++) {
          if (i > 1) {
            items.push(
              <PaginationItem key={i}>
                <PaginationLink
                  className='cursor-pointer'
                  onClick={() => handlePageChange(i)}
                  isActive={currentPage === i}
                >
                  {i}
                </PaginationLink>
              </PaginationItem>
            );
          }
        }
      } else {
        // Show ellipsis, currentPage-1, currentPage, currentPage+1, ellipsis
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink
                className='cursor-pointer'
                onClick={() => handlePageChange(i)}
                isActive={currentPage === i}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Always show last page if more than 1 page
      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              className='cursor-pointer'
              onClick={() => handlePageChange(totalPages)}
              isActive={currentPage === totalPages}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              className='cursor-pointer'
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchFilteredAMCs(filter, page, isExpiringFilterActive ? formatDateForAPI(new Date(new Date().setDate(new Date().getDate() + 90))) : undefined, debouncedSearchQuery);
  };

  const statusData = [
    { name: 'Active', value: activeAMCs, color: '#c6b692' },
    { name: 'Inactive', value: inactiveAMCs, color: '#d8dcdd' }
  ];

  const resourceTypeData = [
    { name: 'Services', value: serviceTotalAMCs, color: '#c6b692' },
    { name: 'Assets', value: assetTotalAMCs, color: '#d8dcdd' }
  ];

  const amcTypeData = amcData.reduce((acc, amc) => {
    const type = amc.amc_type || 'Unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const resourceChartData = Object.entries(amcTypeData).map(([name, value]) => ({ name, value }));

  const agingMatrixData = [
    { priority: 'P1', '0-30': 5, '31-60': 2, '61-90': 3, '91-180': 1, '180+': 8 },
    { priority: 'P2', '0-30': 3, '31-60': 1, '61-90': 2, '91-180': 0, '180+': 2 },
    { priority: 'P3', '0-30': 2, '31-60': 0, '61-90': 1, '91-180': 1, '180+': 4 },
    { priority: 'P4', '0-30': 1, '31-60': 0, '61-90': 0, '91-180': 0, '180+': 3 }
  ];

  const today = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);

  const upcomingExpiries = amcData.filter(amc => {
    if (!amc.amc_end_date) return false;
    const endDate = new Date(amc.amc_end_date);
    return endDate >= today && endDate <= thirtyDaysFromNow;
  }).length;

  const expiredAMCs = amcData.filter(amc => {
    if (!amc.amc_end_date) return false;
    const endDate = new Date(amc.amc_end_date);
    return endDate < today;
  }).length;

  const validAMCs = totalAMCs - upcomingExpiries - expiredAMCs;

  const expiryData = [
    { name: 'Valid', value: validAMCs, color: '#4ade80' },
    { name: 'Expiring Soon', value: upcomingExpiries, color: '#fb923c' },
    { name: 'Expired', value: expiredAMCs, color: '#ef4444' }
  ];

  const handleActionClick = () => {
    setShowActionPanel(true);
  };

  const handleFiltersClick = () => {
    setIsFilterModalOpen(true);
  };

  const handleApplyFilters = () => {
    setAmcTypeFilter(tempAmcTypeFilter);
    setStartDateFilter(tempStartDateFilter);
    setEndDateFilter(tempEndDateFilter);
    setIsFilterModalOpen(false);
    setCurrentPage(1);
    setIsExpiringFilterActive(false);
  setSelectedSummary(null);
    toast.success('Filters applied');
  };

  const handleResetFilters = () => {
    setTempAmcTypeFilter(null);
    setTempStartDateFilter(null);
    setTempEndDateFilter(null);
    setAmcTypeFilter(null);
    setStartDateFilter(null);
    setEndDateFilter(null);
    setFilter(null);
    setCurrentPage(1);
    setIsExpiringFilterActive(false);
  setSelectedSummary(null);
    fetchFilteredAMCs(null, 1, undefined, debouncedSearchQuery);
    toast.success('Filters reset');
  };

  const handleTotalAMCClick = () => {
    setFilter(null);
    setAmcTypeFilter(null);
    setStartDateFilter(null);
    setEndDateFilter(null);
    setCurrentPage(1);
    setIsExpiringFilterActive(false);
    fetchFilteredAMCs(null, 1, undefined, debouncedSearchQuery);
  };

  const handleActiveAMCClick = () => {
    setFilter('active');
    setAmcTypeFilter(null);
    setStartDateFilter(null);
    setEndDateFilter(null);
    setCurrentPage(1);
    setIsExpiringFilterActive(false);
    fetchFilteredAMCs('active', 1, undefined, debouncedSearchQuery);
  };

  const handleInactiveAMCClick = () => {
    setFilter('inactive');
    setAmcTypeFilter(null);
    setStartDateFilter(null);
    setEndDateFilter(null);
    setCurrentPage(1);
    setIsExpiringFilterActive(false);
    fetchFilteredAMCs('inactive', 1, undefined, debouncedSearchQuery);
  };

  const handleFlaggedAMCClick = () => {
    setFilter('UnderObservation');
    setAmcTypeFilter(null);
    setStartDateFilter(null);
    setEndDateFilter(null);
    setCurrentPage(1);
    setIsExpiringFilterActive(false);
    fetchFilteredAMCs('UnderObservation', 1, undefined, debouncedSearchQuery);
  };

  const uniqueAmcTypes = Array.from(new Set(amcData.map(amc => amc.amc_type).filter(type => type))).sort();

  return (
    <div className="p-2 sm:p-4 lg:p-6 max-w-full overflow-x-hidden">
      {error && (
        <div className="flex justify-center items-center py-8">
          <div className="text-red-600">Error: {error}</div>
        </div>
      )}
      <>
        <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="amclist" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200">
            <TabsTrigger
              value="amclist"
              className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
            >
              <svg
                width="18"
                height="19"
                viewBox="0 0 18 19"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current"
              >
                <path
                  d="M1.875 4.25L3 5.375L5.25 3.125M1.875 9.5L3 10.625L5.25 8.375M1.875 14.75L3 15.875L5.25 13.625M7.875 9.5H16.125M7.875 14.75H16.125M7.875 4.25H16.125"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              AMC List
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
            <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsAnalyticsFilterOpen(true)}
                  className="flex items-center gap-2 bg-white border-gray-300 hover:bg-gray-50"
                  disabled={analyticsLoading}
                >
                  <Filter className="w-4 h-4" />
                </Button>
                <AMCAnalyticsSelector onSelectionChange={handleAnalyticsSelectionChange} />
              </div>
            </div>

            {analyticsLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-gray-600">Loading analytics data...</div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-120">
                  {selectedAnalyticsOptions?.includes('status_overview') && (
                    <div className="h-full">
                      <AMCStatusCard
                        data={amcStatusSummary}
                        onDownload={async () => {
                          const startDate = convertDateStringToDate(analyticsDateRange.startDate);
                          const endDate = convertDateStringToDate(analyticsDateRange.endDate);
                          await amcAnalyticsDownloadAPI.downloadAMCStatusData(startDate, endDate);
                        }}
                      />
                    </div>
                  )}
                  {selectedAnalyticsOptions?.includes('type_distribution') && (
                    <div className="h-full">
                      <AMCTypeDistributionCard
                        data={amcTypeDistribution}
                        onDownload={async () => {
                          const startDate = convertDateStringToDate(analyticsDateRange.startDate);
                          const endDate = convertDateStringToDate(analyticsDateRange.endDate);
                          await amcAnalyticsDownloadAPI.downloadAMCTypeDistribution(startDate, endDate);
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                  {selectedAnalyticsOptions?.includes('unit_resource_wise') && (
                    <div className="h-full">
                      <AMCUnitResourceCard
                        data={amcUnitResourceData}
                        onDownload={async () => {
                          const startDate = convertDateStringToDate(analyticsDateRange.startDate);
                          const endDate = convertDateStringToDate(analyticsDateRange.endDate);
                          await amcAnalyticsDownloadAPI.downloadAMCUnitResourceWise(startDate, endDate);
                        }}
                      />
                    </div>
                  )}
                  {selectedAnalyticsOptions?.includes('service_stats') && (
                    <div className="h-full">
                      <AMCServiceStatsCard
                        data={amcServiceStatsData}
                        onDownload={async () => {
                          const startDate = convertDateStringToDate(analyticsDateRange.startDate);
                          const endDate = convertDateStringToDate(analyticsDateRange.endDate);
                          await amcAnalyticsDownloadAPI.downloadAMCServiceStats(startDate, endDate);
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* {selectedAnalyticsOptions?.includes('service_tracking') && (
                  <div className="h-96">
                    <AMCServiceTrackingCard
                      data={amcServiceTracking}
                      onDownload={async () => {
                        const startDate = convertDateStringToDate(analyticsDateRange.startDate);
                        const endDate = convertDateStringToDate(analyticsDateRange.endDate);
                        await amcAnalyticsDownloadAPI.downloadAMCServiceTracking(startDate, endDate);
                      }}
                    />
                  </div>
                )} */}

                {selectedAnalyticsOptions?.includes('coverage_by_location') && (
                  <div className="h-full">
                    <AMCCoverageByLocationCard
                      data={amcCoverageData}
                      onDownload={async () => {
                        const startDate = convertDateStringToDate(analyticsDateRange.startDate);
                        const endDate = convertDateStringToDate(analyticsDateRange.endDate);
                        await amcAnalyticsDownloadAPI.downloadAMCCoverageByLocation(startDate, endDate);
                      }}
                    />
                  </div>
                )}

                {selectedAnalyticsOptions?.includes('expiry_analysis') && (
                  <div className="w-full lg:w-3/5 h-full">
                    <AMCExpiryAnalysisCard
                      data={amcExpiryAnalysis}
                      onDownload={async () => {
                        const startDate = convertDateStringToDate(analyticsDateRange.startDate);
                        const endDate = convertDateStringToDate(analyticsDateRange.endDate);
                        await amcAnalyticsDownloadAPI.downloadAMCExpiryAnalysis(startDate, endDate);
                      }}
                    />
                  </div>
                )}

                {selectedAnalyticsOptions?.length === 0 && (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No analytics selected. Please select at least one report to view.</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="amclist" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4">
              <div
                className={`p-3 sm:p-4 rounded-lg shadow-sm h-[100px] sm:h-[132px] flex items-center gap-2 sm:gap-4 cursor-pointer hover:bg-[#edeae3] ${selectedSummary === 'total' ? 'bg-[#e6e2da]' : 'bg-[#f6f4ee]'}`}
                onClick={() => { setSelectedSummary('total'); handleTotalAMCClick(); }}
              >
                <div className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0 bg-[#C4B89D54]">
                  <Settings className="w-4 h-4 sm:w-6 sm:h-6" style={{ color: '#C72030' }} />
                </div>
                <div className="flex flex-col min-w-0 justify-start">
                  <div className="text-lg sm:text-2xl font-bold leading-tight truncate">
                    {(apiData as any)?.total_amcs_count || 0}
                  </div>
                  <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                    {`${localStorage.getItem("currency") ?? ''} ${(apiData as any)?.total_amc_cost?.toLocaleString() || 0}`}
                  </span>
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium leading-tight">
                    Total AMC
                  </div>
                </div>
              </div>

              <div
                className={`p-3 sm:p-4 rounded-lg shadow-sm h-[100px] sm:h-[132px] flex items-center gap-2 sm:gap-4 cursor-pointer hover:bg-[#edeae3] ${selectedSummary === 'active' ? 'bg-[#e6e2da]' : 'bg-[#f6f4ee]'}`}
                onClick={() => { setSelectedSummary('active'); handleActiveAMCClick(); }}
              >
                <div className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0 bg-[#C4B89D54]">
                  <Settings className="w-4 h-4 sm:w-6 sm:h-6" style={{ color: '#C72030' }} />
                </div>
                <div className="flex flex-col min-w-0 justify-start">
                  <div className="text-lg sm:text-2xl font-bold leading-tight truncate">
                    {(apiData as any)?.active_amcs_count || 0}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium leading-tight">Active AMC</div>
                </div>
              </div>

              <div
                className={`p-3 sm:p-4 rounded-lg shadow-sm h-[100px] sm:h-[132px] flex items-center gap-2 sm:gap-4 cursor-pointer hover:bg-[#edeae3] ${selectedSummary === 'inactive' ? 'bg-[#e6e2da]' : 'bg-[#f6f4ee]'}`}
                onClick={() => { setSelectedSummary('inactive'); handleInactiveAMCClick(); }}
              >
                <div className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0 bg-[#C4B89D54]">
                  <Settings className="w-4 h-4 sm:w-6 sm:h-6" style={{ color: '#C72030' }} />
                </div>
                <div className="flex flex-col min-w-0 justify-start">
                  <div className="text-lg sm:text-2xl font-bold leading-tight truncate">
                    {(apiData as any)?.inactive_amcs_count || 0}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium leading-tight">Inactive AMC</div>
                </div>
              </div>

              <div
                className={`p-3 sm:p-4 rounded-lg shadow-sm h-[100px] sm:h-[132px] flex items-center gap-2 sm:gap-4 cursor-pointer hover:bg-[#edeae3] ${selectedSummary === 'underObservation' ? 'bg-[#e6e2da]' : 'bg-[#f6f4ee]'}`}
                onClick={() => { setSelectedSummary('underObservation'); handleFlaggedAMCClick(); }}
              >
                <div className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0 bg-[#C4B89D54]">
                  <Settings className="w-4 h-4 sm:w-6 sm:h-6" style={{ color: '#C72030' }} />
                </div>
                <div className="flex flex-col min-w-0 justify-start">
                  <div className="text-lg sm:text-2xl font-bold leading-tight truncate">
                    {(apiData as any)?.under_observation || 0}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium leading-tight">Under Observation</div>
                </div>
              </div>

              <div
                className={`p-3 sm:p-4 rounded-lg shadow-sm h-[100px] sm:h-[132px] flex items-center gap-2 sm:gap-4 cursor-pointer hover:bg-[#edeae3] ${selectedSummary === 'expiring' ? 'bg-[#e6e2da]' : 'bg-[#f6f4ee]'}`}
                onClick={() => { setSelectedSummary('expiring'); handleExpiringIn90DaysClick(); }}
              >
                <div className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0 bg-[#C4B89D54]">
                  <Settings className="w-4 h-4 sm:w-6 sm:h-6" style={{ color: '#C72030' }} />
                </div>
                <div className="flex flex-col min-w-0 justify-start">
                  <div className="text-lg sm:text-2xl font-bold leading-tight truncate">
                    {(apiData as any)?.expiring_in_fifteen_days || 0}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium leading-tight">Expiring in 15 Days</div>
                </div>
              </div>
            </div>

            <AmcBulkUploadModal isOpen={showBulkUploadModal} onClose={() => setShowBulkUploadModal(false)} />

            {showActionPanel && (
              <SelectionPanel
                actions={[
                  {
                    label: 'Add Schedule',
                    icon: Plus,
                    onClick: () => navigate('/maintenance/schedule/add?type=AMC'),
                  }]}
                onAdd={handleAddClick}
                onClearSelection={() => setShowActionPanel(false)}
                onImport={handleImportClick}
              />
            )}

            <EnhancedTable
              handleExport={handleExport}
              data={amcData}
              columns={columns}
              renderCell={renderCell}
              selectable={true}
              selectedItems={selectedItems}
              onSelectAll={handleSelectAll}
              onSelectItem={handleSelectItem}
              getItemId={(item) => item.id.toString()}
              storageKey="amc-dashboard-table"
              emptyMessage="No AMC records found"
              searchPlaceholder="Search..."
              enableExport={true}
              exportFileName="amc-records"
              bulkActions={bulkActions}
              showBulkActions={true}
              pagination={false}
              onFilterClick={handleFiltersClick}
              leftActions={
                <Button
                  onClick={handleActionClick}
                  className="text-white bg-[#C72030] hover:bg-[#C72030]/90"
                >
                  <Plus className="w-4 h-4" />
                  Action
                </Button>
              }
              enableSearch={true}
              searchTerm={searchQuery}
              onSearchChange={handleSearch}
              loading={loading || reduxLoading}
            />

            <div className="flex justify-center mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(Math.max(1, pagination.current_page - 1))}
                      className={pagination.current_page === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  {renderPaginationItems()}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(Math.min(pagination.total_pages, pagination.current_page + 1))}
                      className={pagination.current_page === pagination.total_pages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </TabsContent>
        </Tabs>

        <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Filter AMCs</DialogTitle>
              <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </DialogClose>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <Label htmlFor="amc-type" className="text-left">
                AMC Type
              </Label>
              <div className="grid grid-cols-4 items-center gap-4 w-full">
                <Select
                  value={tempAmcTypeFilter || 'all'}
                  onValueChange={(value) => setTempAmcTypeFilter(value === 'all' ? null : value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select AMC Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {["Asset", "Service"].map((type) => (
                      <SelectItem key={String(type)} value={String(type)}>
                        {String(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={tempStartDateFilter || ''}
                    onChange={(e) => setTempStartDateFilter(e.target.value || null)}
                  />
                </div>
                <div>
                  <Label htmlFor="end-date">End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={tempEndDateFilter || ''}
                    onChange={(e) => setTempEndDateFilter(e.target.value || null)}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleResetFilters}>
                Reset
              </Button>
              <Button
                onClick={handleApplyFilters}
                className="bg-[#C72030] hover:bg-[#C72030]/90"
              >
                Apply
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AMCAnalyticsFilterDialog
          isOpen={isAnalyticsFilterOpen}
          onClose={() => setIsAnalyticsFilterOpen(false)}
          onApplyFilters={handleAnalyticsFilterApply}
        />
      </>
    </div>
  );
};