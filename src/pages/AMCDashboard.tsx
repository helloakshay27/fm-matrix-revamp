import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Eye, Trash2, BarChart3, FileText, Download, Calendar, AlertCircle, CheckCircle, Clock, Settings, Flag } from 'lucide-react';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAMCData } from '@/store/slices/amcSlice';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AMCSelector } from '@/components/AMCSelector';
import { RecentAMCSidebar } from '@/components/RecentAMCSidebar';
import {
  Pagination,
  PaginationEllipsis,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import axios from 'axios';
import { SelectionPanel } from '@/components/water-asset-details/PannelTab';
import { toast } from 'sonner';

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
  const { data: apiData, loading, error } = useAppSelector((state) => state.amc);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleSections, setVisibleSections] = useState<string[]>([
    'statusChart', 'typeChart', 'resourceChart', 'agingMatrix'
  ]);
  const [chartOrder, setChartOrder] = useState<string[]>(['statusChart', 'typeChart', 'resourceChart', 'agingMatrix']);
  const [filter, setFilter] = useState<string | null>(null); // New state for filter
  const pageSize = 7;
  const [activeTab, setActiveTab] = useState<string>("amclist");
  const [showActionPanel, setShowActionPanel] = useState(false);
  const [amcs, setAmcs] = useState<AMCRecord[]>([]);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Use API data if available, otherwise fallback to initial data
  const amcData = apiData && Array.isArray(apiData.asset_amcs) ? apiData.asset_amcs : initialAmcData;

  // Fetch data based on filter
  useEffect(() => {
    const fetchFilteredData = async () => {
      if (!baseUrl || !token || !siteId) {
        toast.error('Missing base URL, token, or site ID');
        return;
      }

      let url = `https://${baseUrl}/pms/asset_amcs.json?site_id=${siteId}`;
      if (filter === 'active') {
        url = `https://${baseUrl}/pms/asset_amcs.json?q[active_eq]=true`;
      } else if (filter === 'inactive') {
        url = `https://${baseUrl}/pms/asset_amcs.json?q[active_eq]=false`;
      } else if (filter === 'flagged') {
        url = `https://${baseUrl}/pms/asset_amcs.json?q[is_flagged_eq]=true`;
      }

      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAmcs(response.data.asset_amcs || []);
      } catch (error) {
        console.error('Error fetching AMC data:', error);
        toast.error('Failed to fetch AMC data');
      }
    };

    fetchFilteredData();
  }, [filter, baseUrl, token, siteId]);

  // Calculate pagination
  const totalPages = Math.ceil(Math.max(amcs.length, 6) / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = amcs.slice(startIndex, startIndex + pageSize);

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

      const amcRecord = amcs.find((item) => item.id === id);
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
        setAmcs((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, active: updatedStatus } : item
          )
        );
        toast.success(`AMC ID ${id} status updated`);
      } else {
        toast.error('Failed to update AMC status');
      }
    } catch (error) {
      console.error('Error updating AMC status:', error);
      toast.error('Failed to update AMC status');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(amcs.map(item => item.id.toString()));
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
    // In a real implementation, you would make an API call to delete the selected items
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
                className={`w-4 h-4 cursor-pointer hover:text-[#C72030] ${item.is_flagged ? 'text-red-500 fill-red-500' : 'text-gray-600'
                  }`}
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
              className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${item.active ? 'bg-green-500' : 'bg-gray-300'
                }`}
              onClick={() => handleStatusToggle(item.id)}
            >
              <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${item.active ? 'translate-x-6' : 'translate-x-1'
                  }`}
              />
            </div>
          </div>
        );
      case 'created_at':
        return item.created_at ? new Date(item.created_at).toLocaleDateString() : '-';
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
        // Refetch data based on current filter
        let url = `https://${baseUrl}/pms/asset_amcs.json?site_id=${siteId}`;
        if (filter === 'active') {
          url = `https://${baseUrl}/pms/asset_amcs.json?q[active_eq]=true`;
        } else if (filter === 'inactive') {
          url = `https://${baseUrl}/pms/asset_amcs.json?q[active_eq]=false`;
        } else if (filter === 'flagged') {
          url = `https://${baseUrl}/pms/asset_amcs.json?q[is_flagged_eq]=true`;
        }

        const fetchResponse = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAmcs(fetchResponse.data.asset_amcs || []);
        toast.success(`AMC ID ${amcItem.id} flag updated`);
      } else {
        toast.error('Failed to update AMC flag');
      }
    } catch (error) {
      console.error('Flag update error:', error);
      toast.error('Failed to update AMC flag');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPaginationItems = () => {
    const items = [];
    const showEllipsis = totalPages > 7;

    if (showEllipsis) {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => setCurrentPage(1)}
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
                onClick={() => setCurrentPage(i)}
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
                onClick={() => setCurrentPage(i)}
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
          if (!items.find(item => item.key === i)) {
            items.push(
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => setCurrentPage(i)}
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
              onClick={() => setCurrentPage(totalPages)}
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
              onClick={() => setCurrentPage(i)}
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

  // Analytics data calculations
  const activeAMCs = amcs.filter(amc => amc.active).length;
  const inactiveAMCs = amcs.length - activeAMCs;
  const flaggedAMCs = amcs.filter(amc => amc.is_flagged).length;

  // Status data for pie chart
  const statusData = [
    { name: 'Active', value: activeAMCs, color: '#c6b692' },
    { name: 'Inactive', value: inactiveAMCs, color: '#d8dcdd' }
  ];

  // AMC Type data (Reactive vs Proactive equivalent)
  const reactiveAMCs = Math.floor(amcs.length * 0.7);
  const proactiveAMCs = amcs.length - reactiveAMCs;

  const typeData = [
    { name: 'Reactive', value: reactiveAMCs, color: '#c6b692' },
    { name: 'Proactive', value: proactiveAMCs, color: '#d8dcdd' }
  ];

  // AMC by resource type
  const resourceTypeData = amcs.reduce((acc, amc) => {
    const type = amc.amc_type || 'Unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const resourceChartData = Object.entries(resourceTypeData).map(([name, value]) => ({ name, value }));

  // AMC Aging Matrix
  const agingMatrixData = [
    { priority: 'P1', '0-30': 5, '31-60': 2, '61-90': 3, '91-180': 1, '180+': 8 },
    { priority: 'P2', '0-30': 3, '31-60': 1, '61-90': 2, '91-180': 0, '180+': 2 },
    { priority: 'P3', '0-30': 2, '31-60': 0, '61-90': 1, '91-180': 1, '180+': 4 },
    { priority: 'P4', '0-30': 1, '31-60': 0, '61-90': 0, '91-180': 0, '180+': 3 }
  ];

  // AMC expiry analysis
  const today = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);

  const upcomingExpiries = amcs.filter(amc => {
    if (!amc.amc_end_date) return false;
    const endDate = new Date(amc.amc_end_date);
    return endDate >= today && endDate <= thirtyDaysFromNow;
  }).length;

  const expiredAMCs = amcs.filter(amc => {
    if (!amc.amc_end_date) return false;
    const endDate = new Date(amc.amc_end_date);
    return endDate < today;
  }).length;

  const validAMCs = amcs.length - upcomingExpiries - expiredAMCs;

  const expiryData = [
    { name: 'Valid', value: validAMCs, color: '#4ade80' },
    { name: 'Expiring Soon', value: upcomingExpiries, color: '#fb923c' },
    { name: 'Expired', value: expiredAMCs, color: '#ef4444' }
  ];

  const handleActionClick = () => {
    setShowActionPanel(true);
  };

  const handleFiltersClick = () => {
    console.log('Filters clicked');
  };

  const handleImportClick = () => {
    console.log('Import clicked');
  };

  // Handlers for card clicks
  const handleActiveAMCClick = () => {
    setFilter('active');
    setCurrentPage(1); // Reset to first page
  };

  const handleInactiveAMCClick = () => {
    setFilter('inactive');
    setCurrentPage(1); // Reset to first page
  };

  const handleFlaggedAMCClick = () => {
    setFilter('flagged');
    setCurrentPage(1); // Reset to first page
  };

  return (
    <div className="p-2 sm:p-4 lg:p-6 max-w-full overflow-x-hidden">
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-600">Loading AMC data...</div>
        </div>
      )}
      {error && (
        <div className="flex justify-center items-center py-8">
          <div className="text-red-600">Error: {error}</div>
        </div>
      )}
      {!loading && (
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
            <div className="flex justify-end">
              <AMCSelector onSelectionChange={handleSelectionChange} />
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
                                    <Download className="w-4 h-4 sm:w-5 sm:h-5 text-[#C72030] cursor-pointer" />
                                  </div>
                                  <div className="relative flex items-center justify-center">
                                    <ResponsiveContainer width="100%" height={200} className="sm:h-[250px]">
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
                                        <div className="text-sm sm:text-lg font-semibold text-gray-700">Total: {amcs.length}</div>
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
                                    <h3 className="text-sm sm:text-lg font-bold text-[#C72030] leading-tight">Reactive Proactive AMCs</h3>
                                    <Download className="w-4 h-4 sm:w-5 sm:h-5 text-[#C72030] cursor-pointer" />
                                  </div>
                                  <div className="relative flex items-center justify-center">
                                    <ResponsiveContainer width="100%" height={200} className="sm:h-[250px]">
                                      <PieChart>
                                        <Pie
                                          data={typeData}
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
                                          {typeData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                          ))}
                                        </Pie>
                                        <Tooltip />
                                      </PieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <div className="text-center">
                                        <div className="text-sm sm:text-lg font-semibold text-gray-700">Total: {amcs.length}</div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex justify-center gap-3 sm:gap-6 mt-4 flex-wrap">
                                    {typeData.map((item, index) => (
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
                <RecentAMCSidebar />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="amclist" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
              <div className="p-3 sm:p-4 rounded-lg shadow-sm h-[100px] sm:h-[132px] flex items-center gap-2 sm:gap-4 bg-[#f6f4ee]">
                <div className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0 bg-[#C4B89D54]">
                  <Settings className="w-4 h-4 sm:w-6 sm:h-6" style={{ color: '#C72030' }} />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="text-lg sm:text-2xl font-bold leading-tight truncate">
                    {amcs.length}
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

            {showActionPanel && (
              <SelectionPanel
                onAdd={handleAddClick}
                onClearSelection={() => setShowActionPanel(false)}
              />
            )}

            {!loading && (
              <EnhancedTable
                handleExport={handleExport}
                data={paginatedData}
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
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  {renderPaginationItems()}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};