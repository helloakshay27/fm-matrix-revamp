import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Eye, Trash2, BarChart3, Download, Settings, Flag, Filter } from 'lucide-react';
import { AMCAnalyticsFilterDialog } from '@/components/AMCAnalyticsFilterDialog';
import { amcAnalyticsAPI, AMCStatusData, AMCStatusSummary, AMCTypeDistribution, AMCExpiryAnalysis, AMCServiceTracking, AMCVendorPerformance, AMCComplianceReport } from '@/services/amcAnalyticsAPI';
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
import { AMCComplianceReportCard } from '@/components/AMCComplianceReportCard';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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

  // Handle pointer down to prevent drag on button/icon clicks
  const handlePointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    // Check if the click is on a button, icon, or download element
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
    // For other elements, proceed with drag
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
      {/* Drag indicator */}
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
  active: boolean;
  is_flagged?: boolean;
  contract_name?: string;
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
  { key: 'created_at', label: 'Created On', sortable: true, defaultVisible: true },
  { key: 'active', label: 'Status', sortable: true, defaultVisible: true },
];

export const AMCDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');
  const siteId = localStorage.getItem('selectedSiteId');
  const { data: apiData, loading: reduxLoading, error } = useAppSelector((state) => state.amc);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleSections, setVisibleSections] = useState<string[]>([
    'statusChart', 'typeChart', 'resourceChart', 'agingMatrix'
  ]);
  const [chartOrder, setChartOrder] = useState<string[]>(['statusChart', 'typeChart', 'resourceChart', 'agingMatrix']);
  const [filter, setFilter] = useState<string | null>(null); // For active/inactive/flagged
  const [amcTypeFilter, setAmcTypeFilter] = useState<string | null>(null); // For AMC Type filter
  const [startDateFilter, setStartDateFilter] = useState<string | null>(null); // For Start Date filter
  const [endDateFilter, setEndDateFilter] = useState<string | null>(null); // For End Date filter
  const [tempAmcTypeFilter, setTempAmcTypeFilter] = useState<string | null>(null); // Temporary state for modal
  const [tempStartDateFilter, setTempStartDateFilter] = useState<string | null>(null); // Temporary state for modal
  const [tempEndDateFilter, setTempEndDateFilter] = useState<string | null>(null); // Temporary state for modal
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false); // For filter modal
  const [loading, setLoading] = useState(false); // Local loading state
  const [activeTab, setActiveTab] = useState<string>("amclist");
  const [showActionPanel, setShowActionPanel] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);


  // Analytics states
  const [isAnalyticsFilterOpen, setIsAnalyticsFilterOpen] = useState(false);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [amcAnalyticsData, setAmcAnalyticsData] = useState<AMCStatusData | null>(null);
  const [amcStatusSummary, setAmcStatusSummary] = useState<AMCStatusSummary | null>(null);
  const [amcTypeDistribution, setAmcTypeDistribution] = useState<AMCTypeDistribution[] | null>(null);
  const [amcExpiryAnalysis, setAmcExpiryAnalysis] = useState<AMCExpiryAnalysis[] | null>(null);
  const [amcServiceTracking, setAmcServiceTracking] = useState<AMCServiceTracking[] | null>(null);
  const [amcVendorPerformance, setAmcVendorPerformance] = useState<AMCVendorPerformance[] | null>(null);
  const [amcComplianceReport, setAmcComplianceReport] = useState<AMCComplianceReport | null>(null);
  const [selectedAnalyticsOptions, setSelectedAnalyticsOptions] = useState<string[]>(['status_overview', 'type_distribution', 'expiry_analysis', 'service_tracking', 'vendor_performance']);
  const [analyticsChartOrder, setAnalyticsChartOrder] = useState<string[]>(['status_overview', 'type_distribution', 'expiry_analysis', 'service_tracking', 'vendor_performance']);

  // Set default dates: last year to today for analytics
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

  // Convert date string from DD/MM/YYYY to Date object
  const convertDateStringToDate = (dateString: string): Date => {
    const [day, month, year] = dateString.split('/');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  };

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Initialize temporary filters when modal opens
  useEffect(() => {
    if (isFilterModalOpen) {
      setTempAmcTypeFilter(amcTypeFilter);
      setTempStartDateFilter(startDateFilter);
      setTempEndDateFilter(endDateFilter);
    }
  }, [isFilterModalOpen, amcTypeFilter, startDateFilter, endDateFilter]);

  // Fetch AMC analytics data
  const fetchAMCAnalyticsData = async (startDate: Date, endDate: Date) => {
    setAnalyticsLoading(true);
    try {
      // Fetch all analytics data in parallel
      const [
        statusData,
        statusSummary,
        typeDistribution,
        expiryAnalysis,
        serviceTracking,
        vendorPerformance,
        complianceReport
      ] = await Promise.all([
        amcAnalyticsAPI.getAMCStatusData(startDate, endDate),
        amcAnalyticsAPI.getAMCStatusSummary(startDate, endDate),
        amcAnalyticsAPI.getAMCTypeDistribution(startDate, endDate),
        amcAnalyticsAPI.getAMCExpiryAnalysis(startDate, endDate),
        amcAnalyticsAPI.getAMCServiceTracking(startDate, endDate),
        amcAnalyticsAPI.getAMCVendorPerformance(startDate, endDate),
        amcAnalyticsAPI.getAMCComplianceReport(startDate, endDate)
      ]);

      setAmcAnalyticsData(statusData);
      setAmcStatusSummary(statusSummary);
      setAmcTypeDistribution(typeDistribution);
      setAmcExpiryAnalysis(expiryAnalysis);
      setAmcServiceTracking(serviceTracking);
      setAmcVendorPerformance(vendorPerformance);
      setAmcComplianceReport(complianceReport);
    } catch (error) {
      console.error('Error fetching AMC analytics data:', error);
      toast.error('Failed to fetch AMC analytics data');
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // Handle analytics filter apply
  const handleAnalyticsFilterApply = (filters: { startDate: string; endDate: string }) => {
    setAnalyticsDateRange(filters);

    // Convert date strings to Date objects
    const startDate = convertDateStringToDate(filters.startDate);
    const endDate = convertDateStringToDate(filters.endDate);

    fetchAMCAnalyticsData(startDate, endDate);
  };

  // Use API data if available, otherwise fallback to initial data
  const amcData = apiData && typeof apiData === 'object' && 'asset_amcs' in apiData && Array.isArray((apiData as any).asset_amcs) ? (apiData as any).asset_amcs : initialAmcData;
  const pagination = (apiData && typeof apiData === 'object' && 'pagination' in apiData) ? (apiData as any).pagination : { current_page: 1, total_count: 0, total_pages: 1 };

  // Extract counts from API response - use analytics data if available
  const totalAMCs = amcAnalyticsData ? (amcAnalyticsData.active_amc + amcAnalyticsData.inactive_amc) :
    ((apiData && typeof apiData === 'object' && 'total_amcs_count' in apiData) ? (apiData as any).total_amcs_count : pagination.total_count || 0);
  const activeAMCs = amcAnalyticsData?.active_amc ||
    ((apiData && typeof apiData === 'object' && 'active_amcs_count' in apiData) ? (apiData as any).active_amcs_count : 0);
  const inactiveAMCs = amcAnalyticsData?.inactive_amc ||
    ((apiData && typeof apiData === 'object' && 'inactive_amcs_count' in apiData) ? (apiData as any).inactive_amcs_count : 0);
  const flaggedAMCs = (apiData && typeof apiData === 'object' && 'flagged_amcs_count' in apiData) ? (apiData as any).flagged_amcs_count : 0;

  // Service and Asset totals from analytics
  const serviceTotalAMCs = amcAnalyticsData?.service_total || 0;
  const assetTotalAMCs = amcAnalyticsData?.assets_total || 0;

  // Filter function to fetch AMC data based on filters
  // Inside AMCDashboard component

  const fetchFilteredAMCs = async (filterValue: string | null, page: number = 1) => {
    if (!baseUrl || !token || !siteId) {
      toast.error('Missing base URL, token, or site ID');
      return;
    }

    setLoading(true);
    let url = `https://${baseUrl}/pms/asset_amcs.json?site_id=${siteId}&page=${page}`;
    const queryParams: string[] = [];

    // Add filter for active/inactive/flagged
    if (filterValue === 'active') {
      queryParams.push('q[active_eq]=true');
    } else if (filterValue === 'inactive') {
      queryParams.push('q[active_eq]=false');
    } else if (filterValue === 'flagged') {
      queryParams.push('q[is_flagged_eq]=true');
    }

    // Add other filters (AMC Type, Start Date, End Date)
    if (amcTypeFilter) {
      queryParams.push(`q[amc_type_eq]=${encodeURIComponent(amcTypeFilter)}`);
    }

    if (startDateFilter) {
      queryParams.push(`q[amc_start_date_eq]=${startDateFilter}`);
    }

    if (endDateFilter) {
      queryParams.push(`q[amc_end_date_eq]=${endDateFilter}`);
    }

    if (queryParams.length > 0) {
      url += `&${queryParams.join('&')}`;
    }

    console.log('Request URL:', url); // Debug the URL
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const fetchedData = response.data;
      // Dispatch to Redux store
      dispatch(fetchAMCData.fulfilled(fetchedData, 'fetchAMCData', undefined));
      setCurrentPage(fetchedData.pagination.current_page);
    } catch (error) {
      console.error('Error fetching AMC data:', error);
      dispatch(fetchAMCData.rejected(error as any, 'fetchAMCData', undefined));
      toast.error('Failed to fetch AMC data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on mount and when dependencies change
  useEffect(() => {
    if (baseUrl && token && siteId) {
      fetchFilteredAMCs(filter, currentPage);
    }
  }, [baseUrl, token, siteId, filter, amcTypeFilter, startDateFilter, endDateFilter, currentPage]);

  // Load analytics data with default date range on component mount
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

  const handleStatusToggle = async (id: number) => {
    try {
      if (!baseUrl || !token || !siteId) {
        toast.error('Missing base URL, token, or site ID');
        return;
      }

      const amcRecord = amcData.find((item) => item.id === id);
      if (!amcRecord) {
        toast.error('AMC record not found');
        return;
      }

      const updatedStatus = !amcRecord.active;
      const url = `https://${baseUrl}/pms/asset_amcs/${id}.json`;
      const response = await axios.put(
        url,
        {
          pms_asset_amc: {
            active: updatedStatus,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Refresh table data
        await fetchFilteredAMCs(filter, currentPage);

        // Refresh analytics data
        const { startDate, endDate } = analyticsDateRange;
        const startDateObj = convertDateStringToDate(startDate);
        const endDateObj = convertDateStringToDate(endDate);
        await fetchAMCAnalyticsData(startDateObj, endDateObj);

        toast.success(`AMC ID ${id} status updated`);
      } else {
        toast.error('Failed to update AMC status');
      }
    } catch (error) {
      console.error('Error updating AMC status:', error);
      toast.error('Failed to update AMC status');
    }
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
    fetchFilteredAMCs(filter, currentPage);
  };

  const handleSelectionChange = (selectedSections: string[]) => {
    setVisibleSections(selectedSections);
  };

  const handleExport = async () => {
    try {
      if (!baseUrl || !token || !siteId) {
        toast.error('Missing base URL, token, or site ID');
        return;
      }

      let url = `https://${baseUrl}/pms/asset_amcs/export.xlsx?site_id=${siteId}`;
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

  // Handle drag end for analytics charts
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

  // Handle analytics selection change and update chart order
  const handleAnalyticsSelectionChange = (options: string[]) => {
    setSelectedAnalyticsOptions(options);
    // Update chart order to only include selected options in the existing order
    setAnalyticsChartOrder(prevOrder => {
      const newOrder = prevOrder.filter(chartType => options.includes(chartType));
      // Add any new selections that weren't in the previous order
      const newCharts = options.filter(chartType => !prevOrder.includes(chartType));
      return [...newOrder, ...newCharts];
    });
  };

  const renderCell = (item: AMCRecord, columnKey: string) => {
    switch (columnKey) {
      case 'actions':
        return (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleViewDetails(item.id)}
            >
              <Eye className="w-4 h-4" />
            </Button>
            <div title="Flag AMC">
              <Flag
                className={`w-4 h-4 cursor-pointer hover:text-[#C72030] ${item.is_flagged ? 'text-red-500 fill-red-500' : 'text-gray-600'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSingleAmcFlag(item);
                }}
              />
            </div>
          </div>
        );
      case 'id':
        return <span className="font-medium">{item.id}</span>;
      case 'asset_name':
        return item.asset_name || '-';
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
      case 'active':
        return (
          <div className="flex items-center">
            <div
              className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${item.active ? 'bg-green-500' : 'bg-gray-300'}`}
              onClick={() => handleStatusToggle(item.id)}
            >
              <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${item.active ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </div>
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
        dispatch(fetchAMCData())
        toast.success(`AMC ID ${amcItem.id} flag updated`);
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
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => handlePageChange(1)}
            isActive={currentPage === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (currentPage > 4) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      } else {
        for (let i = 2; i <= Math.min(3, totalPages - 1); i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => handlePageChange(i)}
                isActive={currentPage === i}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }

      if (currentPage > 3 && currentPage < totalPages - 2) {
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => handlePageChange(i)}
                isActive={currentPage === i}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }

      if (currentPage < totalPages - 3) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      } else {
        for (let i = Math.max(totalPages - 2, 2); i < totalPages; i++) {
          if (!items.find(item => item.key === i.toString())) {
            items.push(
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => handlePageChange(i)}
                  isActive={currentPage === i}
                >
                  {i}
                </PaginationLink>
              </PaginationItem>
            );
          }
        }
      }

      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
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
    fetchFilteredAMCs(filter, page);
  };

  // Analytics data calculations
  const statusData = [
    { name: 'Active', value: activeAMCs, color: '#c6b692' },
    { name: 'Inactive', value: inactiveAMCs, color: '#d8dcdd' }
  ];

  // Resource type data using analytics API data
  const resourceTypeData = [
    { name: 'Services', value: serviceTotalAMCs, color: '#c6b692' },
    { name: 'Assets', value: assetTotalAMCs, color: '#d8dcdd' }
  ];

  // AMC Type data for unit resource-wise chart
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
    // fetchFilteredAMCs(filter, 1);
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
    setIsFilterModalOpen(false);
    fetchFilteredAMCs(null, 1);
    toast.success('Filters reset');
  };

  const handleTotalAMCClick = () => {
    setFilter(null);
    setAmcTypeFilter(null);
    setStartDateFilter(null);
    setEndDateFilter(null);
    setCurrentPage(1);
    fetchFilteredAMCs(null, 1);
  };

  const handleActiveAMCClick = () => {
    setFilter('active');
    setCurrentPage(1);
    fetchFilteredAMCs('active', 1);
  };

  const handleInactiveAMCClick = () => {
    setFilter('inactive');
    setCurrentPage(1);
    fetchFilteredAMCs('inactive', 1);
  };

  const handleFlaggedAMCClick = () => {
    setFilter('flagged');
    setCurrentPage(1);
    fetchFilteredAMCs('flagged', 1);
  };

  const uniqueAmcTypes = Array.from(new Set(amcData.map(amc => amc.amc_type).filter(type => type))).sort();

  return (
    <div className="p-2 sm:p-4 lg:p-6 max-w-full overflow-x-hidden">
      {(loading || reduxLoading) && (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-600">Loading AMC data...</div>
        </div>
      )}
      {error && (
        <div className="flex justify-center items-center py-8">
          <div className="text-red-600">Error: {error}</div>
        </div>
      )}
      {!(loading || reduxLoading) && (
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
              {/* Header Section with Filter and Selector */}
              <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4">
                {/* Drag info indicator */}


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
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleAnalyticsDragEnd}>
                  <SortableContext items={analyticsChartOrder} strategy={rectSortingStrategy}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {analyticsChartOrder.map(chartType => {
                        if (!selectedAnalyticsOptions?.includes(chartType)) return null;

                        switch (chartType) {
                          case 'status_overview':
                            return (
                              <SortableChartItem key="status_overview" id="status_overview">
                                <AMCStatusCard
                                  data={amcStatusSummary}
                                  onDownload={async () => {
                                    const startDate = convertDateStringToDate(analyticsDateRange.startDate);
                                    const endDate = convertDateStringToDate(analyticsDateRange.endDate);
                                    await amcAnalyticsDownloadAPI.downloadAMCStatusData(startDate, endDate);
                                  }}
                                />
                              </SortableChartItem>
                            );
                          case 'type_distribution':
                            return (
                              <SortableChartItem key="type_distribution" id="type_distribution">
                                <AMCTypeDistributionCard
                                  data={amcTypeDistribution}
                                  onDownload={async () => {
                                    const startDate = convertDateStringToDate(analyticsDateRange.startDate);
                                    const endDate = convertDateStringToDate(analyticsDateRange.endDate);
                                    await amcAnalyticsDownloadAPI.downloadAMCTypeDistribution(startDate, endDate);
                                  }}
                                />
                              </SortableChartItem>
                            );
                          case 'expiry_analysis':
                            return (
                              <SortableChartItem key="expiry_analysis" id="expiry_analysis">
                                <AMCExpiryAnalysisCard
                                  data={amcExpiryAnalysis}
                                  onDownload={async () => {
                                    const startDate = convertDateStringToDate(analyticsDateRange.startDate);
                                    const endDate = convertDateStringToDate(analyticsDateRange.endDate);
                                    await amcAnalyticsDownloadAPI.downloadAMCExpiryAnalysis(startDate, endDate);
                                  }}
                                />
                              </SortableChartItem>
                            );
                          case 'service_tracking':
                            return (
                              <SortableChartItem key="service_tracking" id="service_tracking">
                                <AMCServiceTrackingCard
                                  data={amcServiceTracking}
                                  onDownload={async () => {
                                    const startDate = convertDateStringToDate(analyticsDateRange.startDate);
                                    const endDate = convertDateStringToDate(analyticsDateRange.endDate);
                                    await amcAnalyticsDownloadAPI.downloadAMCServiceTracking(startDate, endDate);
                                  }}
                                />
                              </SortableChartItem>
                            );
                          case 'vendor_performance':
                            return (
                              <SortableChartItem key="vendor_performance" id="vendor_performance">
                                <AMCVendorPerformanceCard
                                  data={amcVendorPerformance}
                                  onDownload={async () => {
                                    const startDate = convertDateStringToDate(analyticsDateRange.startDate);
                                    const endDate = convertDateStringToDate(analyticsDateRange.endDate);
                                    await amcAnalyticsDownloadAPI.downloadAMCVendorPerformance(startDate, endDate);
                                  }}
                                />
                              </SortableChartItem>
                            );
                          default:
                            return null;
                        }
                      })}

                      {/* No selection message */}
                      {selectedAnalyticsOptions?.length === 0 && (
                        <div className="col-span-2 flex items-center justify-center py-12">
                          <div className="text-center">
                            <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">No analytics selected. Please select at least one report to view.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </TabsContent>

            <TabsContent value="amclist" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                <div
                  className="p-3 sm:p-4 rounded-lg shadow-sm h-[100px] sm:h-[132px] flex items-center gap-2 sm:gap-4 bg-[#f6f4ee] cursor-pointer hover:bg-[#edeae3]"
                  onClick={handleTotalAMCClick}
                >
                  <div className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0 bg-[#C4B89D54]">
                    <Settings className="w-4 h-4 sm:w-6 sm:h-6" style={{ color: '#C72030' }} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="text-lg sm:text-2xl font-bold leading-tight truncate">
                      {(apiData as any)?.total_amcs_count || 0}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground font-medium leading-tight">Total AMC</div>
                  </div>
                </div>

                <div
                  className="p-3 sm:p-4 rounded-lg shadow-sm h-[100px] sm:h-[132px] flex items-center gap-2 sm:gap-4 bg-[#f6f4ee] cursor-pointer hover:bg-[#edeae3]"
                  onClick={handleActiveAMCClick}
                >
                  <div className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0 bg-[#C4B89D54]">
                    <Settings className="w-4 h-4 sm:w-6 sm:h-6" style={{ color: '#C72030' }} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="text-lg sm:text-2xl font-bold leading-tight truncate">
                      {(apiData as any)?.active_amcs_count || 0}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground font-medium leading-tight">Active AMC</div>
                  </div>
                </div>

                <div
                  className="p-3 sm:p-4 rounded-lg shadow-sm h-[100px] sm:h-[132px] flex items-center gap-2 sm:gap-4 bg-[#f6f4ee] cursor-pointer hover:bg-[#edeae3]"
                  onClick={handleInactiveAMCClick}
                >
                  <div className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0 bg-[#C4B89D54]">
                    <Settings className="w-4 h-4 sm:w-6 sm:h-6" style={{ color: '#C72030' }} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="text-lg sm:text-2xl font-bold leading-tight truncate">
                      {(apiData as any)?.inactive_amcs_count || 0}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground font-medium leading-tight">Inactive AMC</div>
                  </div>
                </div>

                <div
                  className="p-3 sm:p-4 rounded-lg shadow-sm h-[100px] sm:h-[132px] flex items-center gap-2 sm:gap-4 bg-[#f6f4ee] cursor-pointer hover:bg-[#edeae3]"
                  onClick={handleFlaggedAMCClick}
                >
                  <div className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0 bg-[#C4B89D54]">
                    <Settings className="w-4 h-4 sm:w-6 sm:h-6" style={{ color: '#C72030' }} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="text-lg sm:text-2xl font-bold leading-tight truncate">
                      {(apiData as any)?.flagged_amcs_count || 0}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground font-medium leading-tight">Flagged AMC</div>
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

              {!(loading || reduxLoading) && (
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
                />
              )}

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
            <DialogContent className="sm:max-w-[425px]">
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

          {/* AMC Analytics Filter Dialog */}
          <AMCAnalyticsFilterDialog
            isOpen={isAnalyticsFilterOpen}
            onClose={() => setIsAnalyticsFilterOpen(false)}
            onApplyFilters={handleAnalyticsFilterApply}
          />
        </>
      )}
    </div>
  );
};