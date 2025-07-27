import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Trash2, BarChart3, Users, Download, Calendar, AlertCircle, CheckCircle, Clock, UserCheck, Flag } from 'lucide-react';
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
const columns: ColumnConfig[] = [{
  key: 'actions',
  label: 'Actions',
  sortable: false,
  defaultVisible: true
}, {
  key: 'name',
  label: 'Name',
  sortable: true,
  defaultVisible: true
}, {
  key: 'department',
  label: 'Department',
  sortable: true,
  defaultVisible: true
}];
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

  const pageSize = 10;

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    dispatch(fetchAttendanceData());
  }, [dispatch]);

  // Calculate pagination
  const totalPages = Math.ceil(attendance.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = attendance.slice(startIndex, startIndex + pageSize);
  const handleViewDetails = (id: number) => {
    navigate(`/maintenance/attendance/details/${id}`);
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
  
        let url = `https://${baseUrl}/attendances/export.xlsx?site_id=${siteId}`;
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
        toast.error('Failed to export AMC data');
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
    // Note: This would need to be implemented as a Redux action
    // For now, we'll just clear the selection since we can't modify Redux state directly
    setSelectedItems([]);
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

  // Analytics data calculations
  const presentCount = Math.floor(attendance.length * 0.85); // 85% present
  const absentCount = Math.floor(attendance.length * 0.1);   // 10% absent  
  const lateCount = attendance.length - presentCount - absentCount; // remainder late

  // Attendance status data
  const statusData = [
    { name: 'Present', value: presentCount, color: '#c6b692' },
    { name: 'Absent', value: absentCount, color: '#d8dcdd' },
    { name: 'Late', value: lateCount, color: '#e5e7eb' }
  ];

  // Department-wise attendance data
  const departmentData = attendance.reduce((acc, record) => {
    const dept = record.department || 'Unknown';
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});

  const departmentChartData = Object.entries(departmentData).map(([name, value]) => ({ name, value }));

  // Attendance Matrix (by shift/time)
  const matrixData = [
    { shift: 'Morning', 'Present': 45, 'Late': 5, 'Absent': 2, 'Leave': 1 },
    { shift: 'Day', 'Present': 38, 'Late': 3, 'Absent': 1, 'Leave': 2 },
    { shift: 'Evening', 'Present': 32, 'Late': 4, 'Absent': 3, 'Leave': 1 },
    { shift: 'Night', 'Present': 28, 'Late': 2, 'Absent': 1, 'Leave': 0 }
  ];

  // Overtime vs Regular attendance
  const regularHours = Math.floor(attendance.length * 0.75);
  const overtimeHours = attendance.length - regularHours;

  const trendsData = [
    { name: 'Regular Hours', value: regularHours, color: '#c6b692' },
    { name: 'Overtime', value: overtimeHours, color: '#d8dcdd' }
  ];

  // Custom export handler for attendance page

  const renderCell = (item: AttendanceRecord, columnKey: string) => {
    switch (columnKey) {
      case 'actions':
        return (
          <>
          <Button variant="ghost" size="sm" onClick={() => handleViewDetails(item.user_id)} className="hover:bg-gray-100">
            <Eye className="w-4 h-4" />
          </Button>
          
         </>
        );

      case 'name':
        return <span className="font-medium text-center block">{item.name}</span>;
      case 'department':
        return <span className="text-center block">{item.department || '-'}</span>;
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
      // Show first page
      items.push(<PaginationItem key={1}>
        <PaginationLink onClick={() => setCurrentPage(1)} isActive={currentPage === 1}>
          1
        </PaginationLink>
      </PaginationItem>);

      // Show ellipsis or pages 2-3
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

      // Show current page area
      if (currentPage > 3 && currentPage < totalPages - 2) {
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          items.push(<PaginationItem key={i}>
            <PaginationLink onClick={() => setCurrentPage(i)} isActive={currentPage === i}>
              {i}
            </PaginationLink>
          </PaginationItem>);
        }
      }

      // Show ellipsis or pages before last
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

      // Show last page
      if (totalPages > 1) {
        items.push(<PaginationItem key={totalPages}>
          <PaginationLink onClick={() => setCurrentPage(totalPages)} isActive={currentPage === totalPages}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>);
      }
    } else {
      // Show all pages if total is 7 or less
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
    console.log('Filter clicked');
  }

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
              {/* Header with Attendance Selector */}
              <div className="flex justify-end">
                <AttendanceSelector onSelectionChange={handleSelectionChange} />
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
                          {chartOrder.filter(id => ['statusChart', 'trendsChart'].includes(id)).map((chartId) => {
                            if (chartId === 'statusChart' && visibleSections.includes('statusChart')) {
                              return (
                                <SortableChartItem key={chartId} id={chartId}>
                                  <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-6 shadow-sm">
                                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                                      <h3 className="text-base sm:text-lg font-bold text-[#C72030]">Attendance Status</h3>
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
                                            label={({ value }) => value}
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
                                          <div className="text-sm sm:text-lg font-semibold text-gray-700">Total: {attendance.length}</div>
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
                                  <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-6 shadow-sm">
                                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                                      <h3 className="text-sm sm:text-lg font-bold text-[#C72030] leading-tight">Regular vs Overtime</h3>
                                      <Download className="w-4 h-4 sm:w-5 sm:h-5 text-[#C72030] cursor-pointer" />
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
                                          <div className="text-sm sm:text-lg font-semibold text-gray-700">Total: {attendance.length}</div>
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

                        {/* Bottom Charts - Department and Matrix */}
                        {chartOrder.filter(id => ['departmentChart', 'matrixChart'].includes(id)).map((chartId) => {
                          if (chartId === 'departmentChart' && visibleSections.includes('departmentChart')) {
                            return (
                              <SortableChartItem key={chartId} id={chartId}>
                                <div className="bg-white border border-gray-200 p-3 sm:p-6 rounded-lg">
                                  <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-base sm:text-lg font-bold" style={{ color: '#C72030' }}>Department-wise Attendance</h3>
                                    <Download className="w-4 h-4 sm:w-4 sm:h-4 cursor-pointer" style={{ color: '#C72030' }} />
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
                                    <Download className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer" style={{ color: '#C72030' }} />
                                  </div>

                                  <div className="space-y-4 sm:space-y-6">
                                    {/* Table - Horizontally scrollable on mobile */}
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
                                                <td className="border border-gray-300 p-2 sm:p-3 text-center text-black text-xs sm:text-sm">{row.Present}</td>
                                                <td className="border border-gray-300 p-2 sm:p-3 text-center text-black text-xs sm:text-sm">{row.Late}</td>
                                                <td className="border border-gray-300 p-2 sm:p-3 text-center text-black text-xs sm:text-sm">{row.Absent}</td>
                                                <td className="border border-gray-300 p-2 sm:p-3 text-center text-black text-xs sm:text-sm">{row.Leave}</td>
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

                {/* Right Sidebar - Recent Attendance */}
                <div className="xl:col-span-4 order-first xl:order-last">
                  <RecentAttendanceSidebar />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="attendancelist" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
              {/* Enhanced Table */}
              <EnhancedTable
                data={paginatedData}
                columns={columns}
                renderCell={renderCell}
                onRowClick={item => handleViewDetails(item.id)}
                selectable={true}
                selectedItems={selectedItems}
                onSelectAll={handleSelectAll}
                onSelectItem={handleSelectItem}
                getItemId={item => String(item.id)}
                storageKey="attendance-dashboard-table"
                emptyMessage="No attendance records found"
                searchPlaceholder="Search attendance records..."
                enableExport={true}
                exportFileName="attendance-records"
                bulkActions={bulkActions}
                showBulkActions={true}
                pagination={false}
                loading={loading}
                // onExport={handleExport}
                handleExport={handleExport}
                onFilterClick={handleFilterClick}
              />

              {/* Custom Pagination */}
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