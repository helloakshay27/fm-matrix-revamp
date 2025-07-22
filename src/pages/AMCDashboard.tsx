import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Eye, Trash2, BarChart3, FileText, Download, Calendar, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAMCData } from '@/store/slices/amcSlice';
import { exportAMCData } from '@/store/slices/amcExportSlice';
import { useToast } from '@/hooks/use-toast';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AMCSelector } from '@/components/AMCSelector';
import { RecentAMCSidebar } from '@/components/RecentAMCSidebar';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
  resource_type: string;
  vendor_name: string;
  amc_start_date: string;
  amc_end_date: string;
  amc_first_service: string;
  created_at: string;
  active: boolean;
}

const initialAmcData: AMCRecord[] = [];

const columns: ColumnConfig[] = [
  { key: 'id', label: 'ID', sortable: true, defaultVisible: true },
  { key: 'asset_name', label: 'Asset Name', sortable: true, defaultVisible: true },
  { key: 'resource_type', label: 'Resource Type', sortable: true, defaultVisible: true },
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
  const { data: apiData, loading, error } = useAppSelector((state) => state.amc);
  const { toast } = useToast();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleSections, setVisibleSections] = useState<string[]>([
    'statusChart', 'typeChart', 'resourceChart', 'agingMatrix'
  ]);
  const [chartOrder, setChartOrder] = useState<string[]>(['statusChart', 'typeChart', 'resourceChart', 'agingMatrix']);
  const pageSize = 7;

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Use API data if available, otherwise fallback to initial data
  const amcData = apiData && Array.isArray(apiData) ? apiData : initialAmcData;

  useEffect(() => {
    dispatch(fetchAMCData());
  }, [dispatch]);

  // Calculate pagination - ensure we always have pagination visible for testing
  const totalPages = Math.ceil(Math.max(amcData.length, 6) / pageSize); // Ensure minimum pages for testing
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = amcData.slice(startIndex, startIndex + pageSize);

  console.log('AMC Pagination Debug:', {
    totalItems: amcData.length,
    pageSize,
    totalPages,
    currentPage,
    paginatedDataLength: paginatedData.length
  });

  const handleAddClick = () => {
    navigate('/maintenance/amc/add');
  };

  const handleViewDetails = (id: number) => {
    navigate(`/maintenance/amc/details/${id}`);
  };

  const handleStatusToggle = (id: number) => {
    // For now, just log the status toggle since we're using API data
    console.log('Status toggle for AMC ID:', id);
    // In a real implementation, you would make an API call to update the status
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
    console.log('Bulk delete for AMC IDs:', selectedIds);
    setSelectedItems([]);
    // In a real implementation, you would make an API call to delete the selected items
  };

  const handleBulkExport = async (selectedItems: AMCRecord[]) => {
    console.log('Export button clicked, selected items:', selectedItems);
    if (selectedItems.length === 0) {
      toast({
        title: "Selection Required",
        description: "Please select at least one AMC record to export",
        variant: "destructive",
      });
      return;
    }

    // Get data from localStorage
    const siteId = localStorage.getItem('site_id');
    const token = localStorage.getItem('access_token');

    if (!siteId || !token) {
      toast({
        title: "Missing Credentials",
        description: "Site ID or access token not found in localStorage",
        variant: "destructive",
      });
      return;
    }

    // Get date range from the selected AMC items
    const dates = selectedItems
      .map(item => ({
        start: item.amc_start_date,
        end: item.amc_end_date
      }))
      .filter(date => date.start && date.end);

    if (dates.length === 0) {
      toast({
        title: "Invalid Date Range",
        description: "No valid date range found in selected AMC records",
        variant: "destructive",
      });
      return;
    }

    // Find the earliest start date and latest end date
    const startDates = dates.map(d => new Date(d.start).getTime());
    const endDates = dates.map(d => new Date(d.end).getTime());
    const fromDate = new Date(Math.min(...startDates)).toISOString().split('T')[0];
    const toDate = new Date(Math.max(...endDates)).toISOString().split('T')[0];

    try {
      const response = await dispatch(exportAMCData({
        site_id: siteId,
        from_date: fromDate,
        to_date: toDate,
        access_token: token
      })).unwrap();

      const blob = new Blob([response], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'amc_export.xlsx'; // Desired file name
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: "AMC data exported successfully!",
      });

      setSelectedItems([]);
    } catch (error) {
      console.log(error);
      toast({
        title: "Export Failed",
        description: "Failed to export AMC data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSelectionChange = (selectedSections: string[]) => {
    setVisibleSections(selectedSections);
  };

  // Handle drag end for chart reordering
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
      case 'id':
        return <span className="font-medium">{item.id}</span>;
      case 'asset_name':
        return item.asset_name || '-';
      case 'resource_type':
        return item.resource_type || '-';
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
              className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${
                item.active ? 'bg-green-500' : 'bg-gray-300'
              }`} 
              onClick={() => handleStatusToggle(item.id)}
            >
              <span 
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                  item.active ? 'translate-x-6' : 'translate-x-1'
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

  const renderActions = (item: AMCRecord) => (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={() => handleViewDetails(item.id)}
    >
      <Eye className="w-4 h-4" />
    </Button>
  );

  const bulkActions = [
    {
      label: 'Export Selected',
      icon: Download,
      variant: 'default' as const,
      onClick: handleBulkExport,
    },
    {
      label: 'Delete Selected',
      icon: Trash2,
      variant: 'destructive' as const,
      onClick: handleBulkDelete,
    },
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPaginationItems = () => {
    const items = [];
    const showEllipsis = totalPages > 7;
    
    if (showEllipsis) {
      // Show first page
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

      // Show ellipsis or pages 2-3
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

      // Show current page area
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

      // Show ellipsis or pages before last
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

      // Show last page
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
      // Show all pages if total is 7 or less
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
  const activeAMCs = amcData.filter(amc => amc.active).length;
  const inactiveAMCs = amcData.length - activeAMCs;
  
  // Status data for pie chart
  const statusData = [
    { name: 'Active', value: activeAMCs, color: '#c6b692' },
    { name: 'Inactive', value: inactiveAMCs, color: '#d8dcdd' }
  ];

  // AMC Type data (Reactive vs Proactive equivalent)
  const reactiveAMCs = Math.floor(amcData.length * 0.7); // Assuming 70% are reactive
  const proactiveAMCs = amcData.length - reactiveAMCs;

  const typeData = [
    { name: 'Reactive', value: reactiveAMCs, color: '#c6b692' },
    { name: 'Proactive', value: proactiveAMCs, color: '#d8dcdd' }
  ];

  // AMC by resource type
  const resourceTypeData = amcData.reduce((acc, amc) => {
    const type = amc.resource_type || 'Unknown';
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

  // AMC expiry analysis (upcoming expiries in next 30 days)
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

  const validAMCs = amcData.length - upcomingExpiries - expiredAMCs;

  const expiryData = [
    { name: 'Valid', value: validAMCs, color: '#4ade80' },
    { name: 'Expiring Soon', value: upcomingExpiries, color: '#fb923c' },
    { name: 'Expired', value: expiredAMCs, color: '#ef4444' }
  ];

  // Stats for cards
  const totalAMCValue = amcData.length * 50000; // Assuming average AMC value
  const thisMonthAMCs = amcData.filter(amc => {
    if (!amc.created_at) return false;
    const createdDate = new Date(amc.created_at);
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
  }).length;

  return (
    <div className="p-2 sm:p-4 lg:p-6 max-w-full overflow-x-hidden">
      <Tabs defaultValue="amclist" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200">
          <TabsTrigger 
            value="analytics" 
            className="flex items-center gap-2 data-[state=active]:bg-[#C72030] data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-[#C72030] border-none"
          >
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger 
            value="amclist" 
            className="flex items-center gap-2 data-[state=active]:bg-[#C72030] data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-[#C72030] border-none"
          >
            <FileText className="w-4 h-4" />
            AMC List
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          {/* Header with AMC Selector */}
          <div className="flex justify-end">
            <AMCSelector onSelectionChange={handleSelectionChange} />
          </div>

          {/* Main Analytics Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6 min-h-[calc(100vh-200px)]">
            {/* Left Section - Charts */}
            <div className="xl:col-span-8 space-y-4 sm:space-y-6">
              {/* All Charts with Drag and Drop */}
              <DndContext 
                sensors={sensors} 
                collisionDetection={closestCenter} 
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={chartOrder} strategy={rectSortingStrategy}>
                  <div className="space-y-4 sm:space-y-6">
                    {/* Top Row - Two Donut Charts */}
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
                                      <div className="text-sm sm:text-lg font-semibold text-gray-700">Total: {amcData.length}</div>
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
                                      <div className="text-sm sm:text-lg font-semibold text-gray-700">Total: {amcData.length}</div>
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

                    {/* Bottom Charts - Resource Type and Aging Matrix */}
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
                                {/* Table - Horizontally scrollable on mobile */}
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

            {/* Right Sidebar - Recent AMCs */}
            <div className="xl:col-span-4 order-first xl:order-last">
              <RecentAMCSidebar />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="amclist" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          {/* Header */}
          <div className="mb-6">
            <p className="text-[#1a1a1a] opacity-70 mb-2">AMC &gt; AMC List</p>
            <h1 className="font-work-sans font-semibold text-base sm:text-2xl lg:text-[26px] leading-auto tracking-normal text-[#1a1a1a]">
              AMC LIST
            </h1>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mb-6">
            <Button 
              onClick={handleAddClick} 
              className="text-white bg-[#C72030] hover:bg-[#C72030]/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="text-gray-600">Loading AMC data...</div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex justify-center items-center py-8">
              <div className="text-red-600">Error: {error}</div>
            </div>
          )}

          {/* Enhanced Table */}
          {!loading && (
            <EnhancedTable
              data={paginatedData}
              columns={columns}
              renderCell={renderCell}
              renderActions={renderActions}
              onRowClick={(item) => handleViewDetails(item.id)}
              selectable={true}
              selectedItems={selectedItems}
              onSelectAll={handleSelectAll}
              onSelectItem={handleSelectItem}
              getItemId={(item) => item.id.toString()}
              storageKey="amc-dashboard-table"
              emptyMessage="No AMC records found"
              searchPlaceholder="Search AMC records..."
              enableExport={true}
              exportFileName="amc-records"
              onExport={() => handleBulkExport(paginatedData.filter(item => selectedItems.includes(item.id.toString())))}
              bulkActions={bulkActions}
              showBulkActions={true}
              pagination={false}
            />
          )}

          {/* Custom Pagination */}
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
    </div>
  );
};
