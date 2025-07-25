import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Eye, Trash2, BarChart3, Download, Settings, Flag, Filter } from 'lucide-react';
import { AMCAnalyticsFilterDialog } from '@/components/AMCAnalyticsFilterDialog';
import { amcAnalyticsAPI, AMCStatusData } from '@/services/amcAnalyticsAPI';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAMCData } from '@/store/slices/amcSlice';
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-move"
    >
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
}

const initialAmcData: AMCRecord[] = [];

const columns: ColumnConfig[] = [
  { key: 'actions', label: 'Actions', sortable: false, defaultVisible: true },
  { key: 'id', label: 'ID', sortable: true, defaultVisible: true },
  { key: 'asset_name', label: 'Asset Name', sortable: true, defaultVisible: true },
  { key: 'amc_type', label: 'AMC Type', sortable: true, defaultVisible: true },
  { key: 'vendor_name', label: 'Vendor Name', sortable: true, defaultVisible: true },
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
  
  const [analyticsDateRange, setAnalyticsDateRange] = useState<{startDate: string; endDate: string}>(getDefaultDateRange());

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
      const analyticsData = await amcAnalyticsAPI.getAMCStatusData(startDate, endDate);
      setAmcAnalyticsData(analyticsData);
      toast.success('AMC analytics data updated successfully');
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
    const startDate = new Date(filters.startDate.split('/').reverse().join('-')); // Convert DD/MM/YYYY to YYYY-MM-DD
    const endDate = new Date(filters.endDate.split('/').reverse().join('-'));
    
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
  const fetchFilteredAMCs = async (filterValue: string | null, page: number = 1) => {
    if (!baseUrl || !token || !siteId) {
      toast.error('Missing base URL, token, or site ID');
      return;
    }

    setLoading(true);
    let url = `https://${baseUrl}/pms/asset_amcs.json?site_id=${siteId}&page=${page}`;
    const queryParams: string[] = [];

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
    const startDate = new Date(defaultRange.startDate.split('/').reverse().join('-'));
    const endDate = new Date(defaultRange.endDate.split('/').reverse().join('-'));
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
            active: updatedStatus
          }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        fetchFilteredAMCs(filter, currentPage);
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
        fetchFilteredAMCs(filter, currentPage);
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
    fetchFilteredAMCs(filter, 1);
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
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Analytics Data Range: {analyticsDateRange.startDate} to {analyticsDateRange.endDate}
                </div>
                <Button
                  variant="outline"
                  onClick={() => setIsAnalyticsFilterOpen(true)}
                  className="flex items-center gap-2"
                  disabled={analyticsLoading}
                >
                  <Filter className="w-4 h-4" />
                  Filter Analytics
                </Button>
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6 min-h-[calc(100vh-200px)]">
                <div className="xl:col-span-8 space-y-4 sm:space-y-6">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext items={chartOrder} strategy={rectSortingStrategy}>
                      <div className="space-y-4 sm:space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                          {chartOrder.filter(id => ['statusChart', 'typeChart'].includes(id)).map((chartId) => {
                            if (chartId === 'statusChart' && visibleSections.includes('statusChart')) {
                              return (
                                <SortableChartItem key={chartId} id={chartId}>
                                  <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-6 shadow-sm">
                                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                                      <h3 className="text-base sm:text-lg font-bold text-[#C72030]">AMCs</h3>
                                      <Download className="w-4 h-4 sm:w-5 sm:h-5 text-black cursor-pointer" />
                                    </div>
                                    <div className="relative flex items-center justify-center">
                                      <ResponsiveContainer width="100%" height={200} className="sm:h-[200px]">
                                        <PieChart>
                                          <Pie
                                            data={statusData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={40}
                                            outerRadius={80}
                                            paddingAngle={2}
                                            dataKey="value"
                                            label={({ value, name, cx, cy, midAngle, innerRadius, outerRadius }) => {
                                              return (
                                                <text
                                                  x={cx + (innerRadius + outerRadius) / 2 * Math.cos(-midAngle * Math.PI / 180)}
                                                  y={cy + (innerRadius + outerRadius) / 2 * Math.sin(-midAngle * Math.PI / 180)}
                                                  fill="black"
                                                  textAnchor="middle"
                                                  dominantBaseline="middle"
                                                  fontSize="14"
                                                  fontWeight="bold"
                                                >
                                                  {value}
                                                </text>
                                              );
                                            }}
                                            labelLine={false}
                                          >
                                            {statusData.map((entry, index) => (
                                              <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                          </Pie>
                                          <Tooltip />
                                        </PieChart>
                                      </ResponsiveContainer>
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                          <div className="text-sm sm:text-lg font-semibold text-gray-700">Total: {totalAMCs}</div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex justify-center gap-3 sm:gap-6 mt-4 flex-wrap">
                                      {statusData.map((item, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm" style={{ backgroundColor: item.color }}></div>
                                          <span className="text-xs sm:text-sm font-medium text-gray-700">{item.name}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </SortableChartItem>
                              );
                            }

                            if (chartId === 'typeChart' && visibleSections.includes('typeChart')) {
                              return (
                                <SortableChartItem key={chartId} id={chartId}>
                                  <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-6 shadow-sm">
                                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                                      <h3 className="text-sm sm:text-lg font-bold text-[#C72030] leading-tight">Services & Assets AMCs</h3>
                                      <Download className="w-4 h-4 sm:w-5 sm:h-5 text-black cursor-pointer" />
                                    </div>
                                    <div className="relative flex items-center justify-center">
                                      <ResponsiveContainer width="100%" height={200} className="sm:h-[200px]">
                                        <PieChart>
                                           <Pie
                                             data={resourceTypeData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={40}
                                            outerRadius={80}
                                            paddingAngle={2}
                                            dataKey="value"
                                            label={({ value, name, cx, cy, midAngle, innerRadius, outerRadius }) => {
                                              return (
                                                <text
                                                  x={cx + (innerRadius + outerRadius) / 2 * Math.cos(-midAngle * Math.PI / 180)}
                                                  y={cy + (innerRadius + outerRadius) / 2 * Math.sin(-midAngle * Math.PI / 180)}
                                                  fill="black"
                                                  textAnchor="middle"
                                                  dominantBaseline="middle"
                                                  fontSize="14"
                                                  fontWeight="bold"
                                                >
                                                  {value}
                                                </text>
                                              );
                                            }}
                                            labelLine={false}
                                          >
                                            {resourceTypeData.map((entry, index) => (
                                              <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                          </Pie>
                                          <Tooltip />
                                        </PieChart>
                                      </ResponsiveContainer>
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                          <div className="text-sm sm:text-lg font-semibold text-gray-700">Total: {totalAMCs}</div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex justify-center gap-3 sm:gap-6 mt-4 flex-wrap">
                                      {resourceTypeData.map((item, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm" style={{ backgroundColor: item.color }}></div>
                                          <span className="text-xs sm:text-sm font-medium text-gray-700">{item.name}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </SortableChartItem>
                              );
                            }

                            return null;
                          })}
                        </div>

                        {chartOrder.filter(id => ['resourceChart', 'agingMatrix'].includes(id)).map((chartId) => {
                          if (chartId === 'resourceChart' && visibleSections.includes('resourceChart')) {
                            return (
                              <SortableChartItem key={chartId} id={chartId}>
                                <div className="bg-white border border-gray-200 p-3 sm:p-6 rounded-lg">
                                  <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-base sm:text-lg font-bold" style={{ color: '#C72030' }}>Unit Resource-wise AMCs</h3>
                                    <Download className="w-4 h-4 sm:w-4 sm:h-4 cursor-pointer" style={{ color: '#C72030' }} />
                                  </div>
                                  <div className="w-full overflow-x-auto">
                                    <ResponsiveContainer width="100%" height={200} className="sm:h-[250px] min-w-[400px]">
                                      <BarChart data={resourceChartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis
                                          dataKey="name"
                                          angle={-45}
                                          textAnchor="end"
                                          height={80}
                                          tick={{ fill: '#6b7280', fontSize: 10 }}
                                          className="text-xs"
                                        />
                                        <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} />
                                        <Tooltip />
                                        <Bar dataKey="value" fill="#c6b692" />
                                      </BarChart>
                                    </ResponsiveContainer>
                                  </div>
                                </div>
                              </SortableChartItem>
                            );
                          }

                          if (chartId === 'agingMatrix' && visibleSections.includes('agingMatrix')) {
                            return (
                              <SortableChartItem key={chartId} id={chartId}>
                                <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-6">
                                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                                    <h3 className="text-base sm:text-lg font-bold" style={{ color: '#C72030' }}>AMCs Ageing Matrix</h3>
                                    <Download className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer" style={{ color: '#C72030' }} />
                                  </div>
                                  <div className="space-y-4 sm:space-y-6">
                                    <div className="overflow-x-auto -mx-3 sm:mx-0">
                                      <div className="min-w-[500px] px-3 sm:px-0">
                                        <table className="w-full border-collapse border border-gray-300">
                                          <thead>
                                            <tr style={{ backgroundColor: '#EDE4D8' }}>
                                              <th className="border border-gray-300 p-2 sm:p-3 text-left text-xs sm:text-sm font-medium text-black">Priority</th>
                                              <th colSpan={5} className="border border-gray-300 p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-black">No. of Days Since Last Service</th>
                                            </tr>
                                            <tr style={{ backgroundColor: '#EDE4D8' }}>
                                              <th className="border border-gray-300 p-2 sm:p-3"></th>
                                              <th className="border border-gray-300 p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-black">0-30</th>
                                              <th className="border border-gray-300 p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-black">31-60</th>
                                              <th className="border border-gray-300 p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-black">61-90</th>
                                              <th className="border border-gray-300 p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-black">91-180</th>
                                              <th className="border border-gray-300 p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-black">180+</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {agingMatrixData.map((row, index) => (
                                              <tr key={index} className="bg-white">
                                                <td className="border border-gray-300 p-2 sm:p-3 font-medium text-black text-xs sm:text-sm">{row.priority}</td>
                                                <td className="border border-gray-300 p-2 sm:p-3 text-center text-black text-xs sm:text-sm">{row['0-30']}</td>
                                                <td className="border border-gray-300 p-2 sm:p-3 text-center text-black text-xs sm:text-sm">{row['31-60']}</td>
                                                <td className="border border-gray-300 p-2 sm:p-3 text-center text-black text-xs sm:text-sm">{row['61-90']}</td>
                                                <td className="border border-gray-300 p-2 sm:p-3 text-center text-black text-xs sm:text-sm">{row['91-180']}</td>
                                                <td className="border border-gray-300 p-2 sm:p-3 text-center text-black text-xs sm:text-sm">{row['180+']}</td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </SortableChartItem>
                            );
                          }

                          return null;
                        })}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
                <div className="xl:col-span-4 order-first xl:order-last">
                  {/* <RecentAMCSidebar /> */}
                </div>
              </div>
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
                      {totalAMCs}
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
                      {activeAMCs}
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
                      {inactiveAMCs}
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
                      {flaggedAMCs}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground font-medium leading-tight">Flagged AMC</div>
                  </div>
                </div>
              </div>

                    <AmcBulkUploadModal isOpen={showBulkUploadModal} onClose={() => setShowBulkUploadModal(false)} />
              

              {showActionPanel && (
                <SelectionPanel
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
                      {uniqueAmcTypes.map((type) => (
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