import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Eye, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';

interface AttendanceRecord {
  id: number;
  name: string;
  department: string;
}

const attendanceData: AttendanceRecord[] = [
  { id: 1, name: 'Mahendra Lungare', department: 'Tech' },
  { id: 2, name: 'Irfan Shaikh', department: 'Operations' },
  { id: 3, name: 'Atrayee Talapatra', department: 'HR' },
  { id: 4, name: 'Mukesh Dabhi', department: 'Office boy' },
  { id: 5, name: 'Sunny Vishwakarma', department: '' },
  { id: 6, name: 'Mr. Bhaushali', department: '' },
  { id: 7, name: 'Mr.Kailash Jadhav', department: '' },
  { id: 8, name: 'Deepak Gupta', department: 'Function 2' },
  { id: 9, name: 'Kalyanasundaram Jayaraman', department: '' },
  { id: 10, name: 'Nupura Warangkar', department: '' },
  { id: 11, name: 'Surinderpal Singh Chadha', department: '' },
  { id: 12, name: 'Chetan Bafna', department: '' },
  { id: 13, name: 'Aniket Parkar', department: '' },
  { id: 14, name: 'Security 12', department: '' },
  { id: 15, name: 'Devesh Jain', department: '' },
  { id: 16, name: 'Sumitra Patil', department: 'Admin' },
  { id: 17, name: 'HQ Occupant 1', department: '' },
  { id: 18, name: 'Sagar Singh', department: '' },
  { id: 19, name: 'Amit Dwivh', department: 'Electrical dept' },
  { id: 20, name: 'Anushree D', department: '' }
];

const columns: ColumnConfig[] = [
  { key: 'name', label: 'Name', sortable: true, defaultVisible: true },
  { key: 'department', label: 'Department', sortable: true, defaultVisible: true },
];

export const AttendanceDashboard = () => {
  const navigate = useNavigate();
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(attendanceData);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleViewDetails = (id: number) => {
    navigate(`/maintenance/attendance/details/${id}`);
  };

  const handleExport = () => {
    const csvContent = [
      'Name,Department',
      ...attendance.map(person => `"${person.name}","${person.department}"`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'attendance_list.csv';
    link.click();
    window.URL.revokeObjectURL(url);
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
    const selectedIds = selectedItems.map(item => item.id);
    setAttendance(prev => prev.filter(item => !selectedIds.includes(item.id)));
    setSelectedItems([]);
  };

  const renderCell = (item: AttendanceRecord, columnKey: string) => {
    switch (columnKey) {
      case 'name':
        return <span className="font-medium">{item.name}</span>;
      case 'department':
        return item.department || '-';
      default:
        return '-';
    }
  };

  const renderActions = (item: AttendanceRecord) => (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={() => handleViewDetails(item.id)}
      className="hover:bg-gray-100"
    >
      <Eye className="w-4 h-4" />
    </Button>
  );

  const bulkActions = [
    {
      label: 'Delete Selected',
      icon: Trash2,
      variant: 'destructive' as const,
      onClick: handleBulkDelete,
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <p className="text-[#1a1a1a] opacity-70 mb-2">Attendance &gt; Attendance List</p>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">ATTENDANCE LIST</h1>
      </div>

      {/* Action Buttons */}
      <div className="mb-6">
        <Button 
          onClick={handleExport} 
          className="bg-[#C72030] text-white hover:bg-[#C72030]/90"
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Enhanced Table */}
      <EnhancedTable
        data={attendance}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        onRowClick={(item) => handleViewDetails(item.id)}
        selectable={true}
        selectedItems={selectedItems}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectItem}
        getItemId={(item) => String(item.id)}
        storageKey="attendance-dashboard-table"
        emptyMessage="No attendance records found"
        searchPlaceholder="Search attendance records..."
        enableExport={true}
        exportFileName="attendance-records"
        bulkActions={bulkActions}
        showBulkActions={true}
        pagination={true}
        pageSize={10}
      />

      {/* Footer */}
      <div className="mt-8 text-center">
        <div className="text-sm text-[#1a1a1a] opacity-70">
          Powered by <span className="font-semibold">go</span><span className="text-[#C72030]">Phygital</span><span className="font-semibold">.work</span>
        </div>
      </div>
    </div>
  );
};