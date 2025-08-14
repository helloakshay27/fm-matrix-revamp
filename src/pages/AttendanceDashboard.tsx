  // Export Attendance Matrix chart as Excel

  // Export Department-wise Attendance chart as Excel

  // Export Regular vs Overtime chart as Excel

  // Export Attendance Status chart summary as Excel

import { useDebounce } from '@/hooks/useDebounce';
import React, { useState, useEffect, useMemo } from 'react';
import { AMCAnalyticsFilterDialog } from '@/components/AMCAnalyticsFilterDialog';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Trash2, BarChart3, Download } from 'lucide-react';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AttendanceSelector } from '@/components/AttendanceSelector';
import { RecentAttendanceSidebar } from '@/components/RecentAttendanceSidebar';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAttendanceData, AttendanceRecord } from '@/store/slices/attendanceSlice';
import { AttendanceExportModal } from '@/components/AttendanceExportModal';
import { toast } from 'sonner';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

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

const columns: ColumnConfig[] = [
  {
    key: 'actions',
    label: 'Actions',
    sortable: false,
    defaultVisible: true
  },
  {
    key: 'name',
    label: 'Name',
    sortable: true,
    defaultVisible: true
  },
  {
    key: 'department',
    label: 'Department',
    sortable: true,
    defaultVisible: true
  },
  {
    key: 'source_of_attendance',
    label: 'Attendance Method',
    sortable: true,
    defaultVisible: true
  }
];

export const AttendanceDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Redux state
  const { data: attendance, loading, error } = useAppSelector(state => state.attendance);

  // Local state
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [visibleSections, setVisibleSections] = useState<string[]>([
    'statusChart', 'departmentChart', 'trendsChart', 'matrixChart'
  ]);
  const [chartOrder, setChartOrder] = useState<string[]>(['statusChart', 'departmentChart', 'trendsChart', 'matrixChart']);
  const [activeTab, setActiveTab] = useState<string>("attendancelist");
  // Filter modal state
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState('');
   const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 600);

  const pageSize = 10;

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch attendance on mount and when filters/search change
  useEffect(() => {
    let paramString = '';
    if (debouncedSearchQuery && debouncedSearchQuery.trim()) {
      // Only encode the value, not the param name
      paramString = `${encodeURIComponent(debouncedSearchQuery.trim())}`;
    } else if (departmentFilter && departmentFilter.trim()) {
      paramString = `${encodeURIComponent(departmentFilter.trim())}`;
    }
    dispatch(fetchAttendanceData(paramString));
  }, [dispatch, debouncedSearchQuery, departmentFilter]);
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };


  // Memoized filtered data (no longer needed since filtering is done via API)
  const filteredAttendance = useMemo(() => attendance, [attendance]);

  // Memoized pagination
  const totalPages = useMemo(() => Math.ceil(filteredAttendance.length / pageSize), [filteredAttendance.length, pageSize]);
  const startIndex = useMemo(() => (currentPage - 1) * pageSize, [currentPage, pageSize]);
  const paginatedData = useMemo(() => filteredAttendance.slice(startIndex, startIndex + pageSize), [filteredAttendance, startIndex, pageSize]);

  const handleViewDetails = (row: any) => {
    const id = row.user_id;
    if (id) {
      navigate(`/maintenance/attendance/details/${id}`);
    }
  };

  const handleExport = async () => {
    const baseUrl = localStorage.getItem('baseUrl');
    const token = localStorage.getItem('token');
    const siteId = localStorage.getItem('selectedSiteId');

    try {
      if (!baseUrl || !token || !siteId) {
        toast.error('Missing base URL, token, or site ID');
        return;
      }

      let url = `https://${baseUrl}/pms/attendances/export.xlsx`;
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
      link.download = 'attendance_export.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
      toast.success('Attendance data exported successfully');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export attendance data');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(attendance.map(item => String(item.id)));
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

  const handleBulkDelete = (selectedItems: AttendanceRecord[]) => {
    setSelectedItems([]);
  };

  const handleSelectionChange = (selectedSections: string[]) => {
    setVisibleSections(selectedSections);
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


// Utility: Format date for API
function formatDateForApi(dateStr: string) {
  if (!dateStr) return '';
  if (/\d{4}-\d{2}-\d{2}/.test(dateStr)) return dateStr;
  const [day, month, year] = dateStr.split('/');
  return `${year}-${month}-${day}`;
}

// Utility: Generic export function for all chart exports
async function handleChartExport({ endpoint, filename, successMsg, errorMsg, fromDate, toDate }: {
  endpoint: string,
  filename: string,
  successMsg: string,
  errorMsg: string,
  fromDate: string,
  toDate: string
}) {
  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');
  const siteId = localStorage.getItem('selectedSiteId');
  try {
    if (!baseUrl || !token || !siteId) {
      toast.error('Missing base URL, token, or site ID');
      return;
    }
    const url = `https://${baseUrl}/pms/attendances/${endpoint}?site_id=${siteId}&from_date=${formatDateForApi(fromDate)}&to_date=${formatDateForApi(toDate)}&export=true`;
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) {
      toast.error(errorMsg);
      return;
    }
    const blob = await response.blob();
    if (!blob || blob.size === 0) {
      toast.error('Empty file received from server');
      return;
    }
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);
    toast.success(successMsg);
  } catch (error) {
    console.error('Export failed:', error);
    toast.error(errorMsg);
  }
}

  const defaultFrom = '2010-01-01';
  const defaultTo = '2025-01-02';
  const [fromDate, setFromDate] = useState(defaultFrom);
  const [toDate, setToDate] = useState(defaultTo);
  const [statusChartData, setStatusChartData] = useState<{ present_count: number; absent_count: number; late_count: number } | null>(null);
  const [trendsChartData, setTrendsChartData] = useState<{ regular_count: number; overtime_count: number } | null>(null);
  const [chartsLoading, setChartsLoading] = useState(false);
  const [isChartFilterOpen, setIsChartFilterOpen] = useState(false);

  const fetchChartsData = async (from: string, to: string) => {
    setChartsLoading(true);
    try {
      const baseUrl = localStorage.getItem('baseUrl');
      const token = localStorage.getItem('token');
      const siteId = localStorage.getItem('selectedSiteId');
      if (!baseUrl || !token || !siteId) return;
      const statusUrl = `https://${baseUrl}/pms/attendances/attendance_summary.json?site_id=${siteId}&from_date=${formatDateForApi(from)}&to_date=${formatDateForApi(to)}`;
      const statusRes = await fetch(statusUrl, { headers: { 'Authorization': `Bearer ${token}` } });
      if (statusRes.ok) {
        setStatusChartData(await statusRes.json());
      } else {
        setStatusChartData(null);
      }
      const trendsUrl = `https://${baseUrl}/pms/attendances/attendance_shifts.json?site_id=${siteId}&from_date=${formatDateForApi(from)}&to_date=${formatDateForApi(to)}`;
      const trendsRes = await fetch(trendsUrl, { headers: { 'Authorization': `Bearer ${token}` } });
      if (trendsRes.ok) {
        setTrendsChartData(await trendsRes.json());
      } else {
        setTrendsChartData(null);
      }
    } catch (e) {
      setStatusChartData(null);
      setTrendsChartData(null);
    } finally {
      setChartsLoading(false);
    }
  };

  useEffect(() => {
    fetchChartsData(fromDate, toDate);
  }, [fromDate, toDate]);

  const statusData = useMemo(() =>
    statusChartData
      ? [
        { name: 'Present', value: statusChartData.present_count, color: '#c6b692' },
        { name: 'Absent', value: statusChartData.absent_count, color: '#d8dcdd' },
        { name: 'Late', value: statusChartData.late_count, color: '#e5e7eb' }
      ]
      : [
        { name: 'Present', value: 0, color: '#c6b692' },
        { name: 'Absent', value: 0, color: '#d8dcdd' },
        { name: 'Late', value: 0, color: '#e5e7eb' }
      ]
  , [statusChartData]);

  const [departmentChartData, setDepartmentChartData] = useState<{ name: string; value: number }[]>([]);

  const fetchDepartmentChartData = async (from: string, to: string) => {
    try {
      const baseUrl = localStorage.getItem('baseUrl');
      const token = localStorage.getItem('token');
      const siteId = localStorage.getItem('selectedSiteId');
      if (!baseUrl || !token || !siteId) return;
      const url = `https://${baseUrl}/pms/attendances/department_wise_attendance.json?site_id=${siteId}&from_date=${formatDateForApi(from)}&to_date=${formatDateForApi(to)}`;
      const res = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.department_counts)) {
          setDepartmentChartData(
            data.department_counts.map((item: any) => ({
              name: item.department_name || 'Unknown',
              value: item.present_count || 0
            }))
          );
        } else {
          setDepartmentChartData([]);
        }
      } else {
        setDepartmentChartData([]);
      }
    } catch (e) {
      setDepartmentChartData([]);
    }
  };

  useEffect(() => {
    fetchDepartmentChartData(fromDate, toDate);
  }, [fromDate, toDate]);

  const [matrixData, setMatrixData] = useState<{ shift: string; present: number; late: number; absent: number; leave: number }[]>([]);

  const fetchMatrixData = async (from: string, to: string) => {
    try {
      const baseUrl = localStorage.getItem('baseUrl');
      const token = localStorage.getItem('token');
      const siteId = localStorage.getItem('selectedSiteId');
      if (!baseUrl || !token || !siteId) return;
      const url = `https://${baseUrl}/pms/attendances/attendance_matrix.json?site_id=${siteId}&from_date=${formatDateForApi(from)}&to_date=${formatDateForApi(to)}`;
      const res = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.matrix)) {
          setMatrixData(data.matrix);
        } else {
          setMatrixData([]);
        }
      } else {
        setMatrixData([]);
      }
    } catch (e) {
      setMatrixData([]);
    }
  };

  useEffect(() => {
    fetchMatrixData(fromDate, toDate);
  }, [fromDate, toDate]);

  const trendsData = useMemo(() =>
    trendsChartData
      ? [
        { name: 'Regular Hours', value: trendsChartData.regular_count, color: '#c6b692' },
        { name: 'Overtime', value: trendsChartData.overtime_count, color: '#d8dcdd' }
      ]
      : [
        { name: 'Regular Hours', value: 0, color: '#c6b692' },
        { name: 'Overtime', value: 0, color: '#d8dcdd' }
      ]
  , [trendsChartData]);

  const renderCell = (item: AttendanceRecord, columnKey: string) => {
    switch (columnKey) {
      case 'actions':
        return (
          <>
            <Button variant="ghost" size="sm" onClick={() => handleViewDetails(item)} className="hover:bg-gray-100">
              <Eye className="w-4 h-4" />
            </Button>
          </>
        );
      case 'name':
        return <span className="font-medium text-center block">{item.name}</span>;
      case 'department':
        return <span className="text-center block">{item.department || '-'}</span>;
      case 'source_of_attendance': {
        const anyItem = item as any;
        const source = anyItem.source_of_attendance || anyItem.source || anyItem.attendance_source || '-';
        return <span className="text-center block">{source}</span>;
      }
      default:
        return '-';
    }
  };

  const bulkActions = [{
    label: 'Delete Selected',
    icon: Trash2,
    variant: 'destructive' as const,
    onClick: handleBulkDelete
  }];

  const renderPaginationItems = () => {
    const items = [];
    const showEllipsis = totalPages > 7;
    if (showEllipsis) {
      items.push(<PaginationItem key={1}>
        <PaginationLink onClick={() => setCurrentPage(1)} isActive={currentPage === 1}>
          1
        </PaginationLink>
      </PaginationItem>);

      if (currentPage > 4) {
        items.push(<PaginationItem key="ellipsis1">
          <PaginationEllipsis />
        </PaginationItem>);
      } else {
        for (let i = 2; i <= Math.min(3, totalPages - 1); i++) {
          items.push(<PaginationItem key={i}>
            <PaginationLink onClick={() => setCurrentPage(i)} isActive={currentPage === i}>
              {i}
            </PaginationLink>
          </PaginationItem>);
        }
      }

      if (currentPage > 3 && currentPage < totalPages - 2) {
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          items.push(<PaginationItem key={i}>
            <PaginationLink onClick={() => setCurrentPage(i)} isActive={currentPage === i}>
              {i}
            </PaginationLink>
          </PaginationItem>);
        }
      }

      if (currentPage < totalPages - 3) {
        items.push(<PaginationItem key="ellipsis2">
          <PaginationEllipsis />
        </PaginationItem>);
      } else {
        for (let i = Math.max(totalPages - 2, 2); i < totalPages; i++) {
          if (!items.find(item => item.key === i)) {
            items.push(<PaginationItem key={i}>
              <PaginationLink onClick={() => setCurrentPage(i)} isActive={currentPage === i}>
                {i}
              </PaginationLink>
            </PaginationItem>);
          }
        }
      }

      if (totalPages > 1) {
        items.push(<PaginationItem key={totalPages}>
          <PaginationLink onClick={() => setCurrentPage(totalPages)} isActive={currentPage === totalPages}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>);
      }
    } else {
      for (let i = 1; i <= totalPages; i++) {
        items.push(<PaginationItem key={i}>
          <PaginationLink onClick={() => setCurrentPage(i)} isActive={currentPage === i}>
            {i}
          </PaginationLink>
        </PaginationItem>);
      }
    }
    return items;
  };

  const handleFilterClick = () => {
    setFilterModalOpen(true);
  };

  const handleApplyFilter = () => {
    setFilterModalOpen(false);
    setCurrentPage(1);
    // No need to dispatch here, useEffect will handle it
  };

  const handleResetFilter = () => {
    setDepartmentFilter('');
    setFilterModalOpen(false);
    setCurrentPage(1);
    // No need to dispatch here, useEffect will handle it
  };

  const departmentList = useMemo(
    () => Array.from(new Set(attendance.map(item => item.department).filter(Boolean))),
    [attendance]
  );

  const handleAttendanceStatusExport = () =>
    handleChartExport({
      endpoint: 'attendance_summary.json',
      filename: 'attendance_summary.xlsx',
      successMsg: 'Attendance summary exported successfully',
      errorMsg: 'Failed to export attendance summary',
      fromDate,
      toDate,
    });

  const handleRegularOvertimeExport = () =>
    handleChartExport({
      endpoint: 'attendance_shifts.json',
      filename: 'regular_vs_overtime.xlsx',
      successMsg: 'Regular vs Overtime exported successfully',
      errorMsg: 'Failed to export regular vs overtime',
      fromDate,
      toDate,
    });

  const handleDepartmentWiseExport = () =>
    handleChartExport({
      endpoint: 'department_wise_attendance.json',
      filename: 'department_wise_attendance.xlsx',
      successMsg: 'Department-wise attendance exported successfully',
      errorMsg: 'Failed to export department-wise attendance',
      fromDate,
      toDate,
    });

  const handleAttendanceMatrixExport = () =>
    handleChartExport({
      endpoint: 'attendance_matrix.json',
      filename: 'attendance_matrix.xlsx',
      successMsg: 'Attendance matrix exported successfully',
      errorMsg: 'Failed to export attendance matrix',
      fromDate,
      toDate,
    });
  return (
    <div className="p-2 sm:p-4 lg:p-6 max-w-full overflow-x-hidden">
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-600">Loading Attendance data...</div>
        </div>
      )}
      {error && (
        <div className="flex justify-center items-center py-8">
          <div className="text-red-600">Error: {error}</div>
        </div>
      )}

      <Dialog open={filterModalOpen} onClose={() => setFilterModalOpen(false)}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px 0 24px' }}>
          <DialogTitle sx={{ p: 0, fontSize: 20, flex: 1 }}>Filter</DialogTitle>
          <IconButton aria-label="close" onClick={() => setFilterModalOpen(false)} sx={{ ml: 2 }}>
            <CloseIcon />
          </IconButton>
        </div>
        <DialogContent sx={{ minWidth: 400, maxWidth: 500, width: 1 }}>
          <TextField
            fullWidth
            label="Department"
            variant="outlined"
            value={departmentFilter}
            onChange={e => setDepartmentFilter(e.target.value)}
            sx={{ mt: 2 }}
            placeholder="Enter department name"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="outline" onClick={handleResetFilter}>
            Reset
          </Button>
          <Button onClick={handleApplyFilter} className="bg-[#C72030] hover:bg-[#C72030]/90 text-white">
            Apply
          </Button>
        </DialogActions>
      </Dialog>

      {!loading && (
        <>
          <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="attendancelist" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200">
              <TabsTrigger
                value="attendancelist"
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
                Attendance List
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
                <AttendanceSelector onSelectionChange={handleSelectionChange} />
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
                        <div className="flex justify-end mb-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
                            onClick={() => setIsChartFilterOpen(true)}
                          >
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="inline-block mr-1"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A1 1 0 0013 13.414V19a1 1 0 01-1.447.894l-2-1A1 1 0 019 18v-4.586a1 1 0 00-.293-.707L2.293 6.707A1 1 0 012 6V4z" /></svg>
                            Filter
                          </Button>
                          <AMCAnalyticsFilterDialog
                            isOpen={isChartFilterOpen}
                            onClose={() => setIsChartFilterOpen(false)}
                            onApplyFilters={({ startDate, endDate }) => {
                              setFromDate(startDate);
                              setToDate(endDate);
                              setIsChartFilterOpen(false);
                            }}
                          />
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                          {chartOrder.filter(id => ['statusChart', 'trendsChart'].includes(id)).map((chartId) => {
                            if (chartId === 'statusChart' && visibleSections.includes('statusChart')) {
                              return (
                                <SortableChartItem key={chartId} id={chartId}>
                                  <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-6 shadow-sm min-h-[340px] h-[340px] flex flex-col">
                                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                                      <h3 className="text-base sm:text-lg font-bold text-[#C72030]">Attendance Status</h3>
                                      <Download className="w-4 h-4 sm:w-5 sm:h-5 text-[#C72030] cursor-pointer" onClick={handleAttendanceStatusExport} />
                                    </div>
                                    <div className="relative flex items-center justify-center min-h-[220px]">
                                      {chartsLoading ? (
                                        <div className="text-gray-400">Loading...</div>
                                      ) : (
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
                                              label={({ value }) => value}
                                              labelLine={false}
                                              startAngle={90}
                                              endAngle={-270}
                                            >
                                              {statusData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                              ))}
                                            </Pie>
                                            <Tooltip />
                                          </PieChart>
                                        </ResponsiveContainer>
                                      )}
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                          <div className="text-sm sm:text-lg font-semibold text-gray-700">
                                            Total: {statusData.reduce((sum, item) => sum + item.value, 0)}
                                          </div>
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

                            if (chartId === 'trendsChart' && visibleSections.includes('trendsChart')) {
                              return (
                                <SortableChartItem key={chartId} id={chartId}>
                                  <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-6 shadow-sm min-h-[340px] h-[340px] flex flex-col">
                                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                                      <h3 className="text-sm sm:text-lg font-bold text-[#C72030] leading-tight">Regular vs Overtime</h3>
                                      <Download className="w-4 h-4 sm:w-5 sm:h-5 text-[#C72030] cursor-pointer" onClick={handleRegularOvertimeExport} />
                                    </div>
                                    <div className="relative flex items-center justify-center">
                                      <ResponsiveContainer width="100%" height={200} className="sm:h-[250px]">
                                        <PieChart>
                                          <Pie
                                            data={trendsData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={40}
                                            outerRadius={80}
                                            paddingAngle={2}
                                            dataKey="value"
                                            label={({ value }) => value}
                                            labelLine={false}
                                            startAngle={90}
                                            endAngle={-270}
                                          >
                                            {trendsData.map((entry, index) => (
                                              <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                          </Pie>
                                          <Tooltip />
                                        </PieChart>
                                      </ResponsiveContainer>
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                          <div className="text-sm sm:text-lg font-semibold text-gray-700">Total: {trendsData.reduce((sum, item) => sum + item.value, 0)}</div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex justify-center gap-3 sm:gap-6 mt-4 flex-wrap">
                                      {trendsData.map((item, index) => (
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

                        {chartOrder.filter(id => ['departmentChart', 'matrixChart'].includes(id)).map((chartId) => {
                          if (chartId === 'departmentChart' && visibleSections.includes('departmentChart')) {
                            return (
                              <SortableChartItem key={chartId} id={chartId}>
                                <div className="bg-white border border-gray-200 p-3 sm:p-6 rounded-lg">
                                  <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-base sm:text-lg font-bold" style={{ color: '#C72030' }}>Department-wise Attendance</h3>
                                    <Download className="w-4 h-4 sm:w-4 sm:h-4 cursor-pointer" style={{ color: '#C72030' }} onClick={handleDepartmentWiseExport} />
                                  </div>
                                  <div className="w-full overflow-x-auto">
                                    <ResponsiveContainer width="100%" height={200} className="sm:h-[250px] min-w-[400px]">
                                      <BarChart data={departmentChartData}>
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

                          if (chartId === 'matrixChart' && visibleSections.includes('matrixChart')) {
                            return (
                              <SortableChartItem key={chartId} id={chartId}>
                                <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-6">
                                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                                    <h3 className="text-base sm:text-lg font-bold" style={{ color: '#C72030' }}>Attendance Matrix</h3>
                                    <Download className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer" style={{ color: '#C72030' }} onClick={handleAttendanceMatrixExport} />
                                  </div>
                                  <div className="space-y-4 sm:space-y-6">
                                    <div className="overflow-x-auto -mx-3 sm:mx-0">
                                      <div className="min-w-[500px] px-3 sm:px-0">
                                        <table className="w-full border-collapse border border-gray-300">
                                          <thead>
                                            <tr style={{ backgroundColor: '#EDE4D8' }}>
                                              <th className="border border-gray-300 p-2 sm:p-3 text-left text-xs sm:text-sm font-medium text-black">Shift</th>
                                              <th colSpan={4} className="border border-gray-300 p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-black">Attendance Status</th>
                                            </tr>
                                            <tr style={{ backgroundColor: '#EDE4D8' }}>
                                              <th className="border border-gray-300 p-2 sm:p-3"></th>
                                              <th className="border border-gray-300 p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-black">Present</th>
                                              <th className="border border-gray-300 p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-black">Late</th>
                                              <th className="border border-gray-300 p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-black">Absent</th>
                                              <th className="border border-gray-300 p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-black">Leave</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {matrixData.map((row, index) => (
                                              <tr key={index} className="bg-white">
                                                <td className="border border-gray-300 p-2 sm:p-3 font-medium text-black text-xs sm:text-sm">{row.shift}</td>
                                                <td className="border border-gray-300 p-2 sm:p-3 text-center text-black text-xs sm:text-sm">{row.present}</td>
                                                <td className="border border-gray-300 p-2 sm:p-3 text-center text-black text-xs sm:text-sm">{row.late}</td>
                                                <td className="border border-gray-300 p-2 sm:p-3 text-center text-black text-xs sm:text-sm">{row.absent}</td>
                                                <td className="border border-gray-300 p-2 sm:p-3 text-center text-black text-xs sm:text-sm">{row.leave}</td>
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
                  <RecentAttendanceSidebar />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="attendancelist" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
              <EnhancedTable
                data={paginatedData}
                columns={columns}
                renderCell={renderCell}
                onRowClick={item => handleViewDetails(item)}
                selectable={true}
                selectedItems={selectedItems}
                onSelectAll={handleSelectAll}
                onSelectItem={handleSelectItem}
                getItemId={item => String(item.id || item.user_id)}
                storageKey="attendance-dashboard-table"
                emptyMessage="No attendance records found"
                searchPlaceholder="Search..."
                onSearchChange={handleSearch}
                searchTerm={searchQuery}
                enableSearch={true}
                enableExport={true}
                exportFileName="attendance-records"
                bulkActions={bulkActions}
                showBulkActions={true}
                pagination={false}
                loading={loading}
                handleExport={handleExport}
                onFilterClick={handleFilterClick}
              />

              {totalPages > 1 && (
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
              )}
            </TabsContent>
          </Tabs>
          <AttendanceExportModal
            open={exportModalOpen}
            onClose={() => setExportModalOpen(false)}
          />
        </>
      )}
    </div>
  );
};