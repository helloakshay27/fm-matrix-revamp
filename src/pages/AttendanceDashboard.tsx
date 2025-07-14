import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
interface AttendanceRecord {
  id: number;
  name: string;
  department: string;
}
const attendanceData: AttendanceRecord[] = [{
  id: 1,
  name: 'Mahendra Lungare',
  department: 'Tech'
}, {
  id: 2,
  name: 'Irfan Shaikh',
  department: 'Operations'
}, {
  id: 3,
  name: 'Atrayee Talapatra',
  department: 'HR'
}, {
  id: 4,
  name: 'Mukesh Dabhi',
  department: 'Office boy'
}, {
  id: 5,
  name: 'Sunny Vishwakarma',
  department: ''
}, {
  id: 6,
  name: 'Mr. Bhaushali',
  department: ''
}, {
  id: 7,
  name: 'Mr.Kailash Jadhav',
  department: ''
}, {
  id: 8,
  name: 'Deepak Gupta',
  department: 'Function 2'
}, {
  id: 9,
  name: 'Kalyanasundaram Jayaraman',
  department: ''
}, {
  id: 10,
  name: 'Nupura Warangkar',
  department: ''
}, {
  id: 11,
  name: 'Surinderpal Singh Chadha',
  department: ''
}, {
  id: 12,
  name: 'Chetan Bafna',
  department: ''
}, {
  id: 13,
  name: 'Aniket Parkar',
  department: ''
}, {
  id: 14,
  name: 'Security 12',
  department: ''
}, {
  id: 15,
  name: 'Devesh Jain',
  department: ''
}, {
  id: 16,
  name: 'Sumitra Patil',
  department: 'Admin'
}, {
  id: 17,
  name: 'HQ Occupant 1',
  department: ''
}, {
  id: 18,
  name: 'Sagar Singh',
  department: ''
}, {
  id: 19,
  name: 'Amit Dwivh',
  department: 'Electrical dept'
}, {
  id: 20,
  name: 'Anushree D',
  department: ''
}];
const columns: ColumnConfig[] = [{
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
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(attendanceData);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Calculate pagination
  const totalPages = Math.ceil(attendance.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = attendance.slice(startIndex, startIndex + pageSize);
  const handleViewDetails = (id: number) => {
    navigate(`/maintenance/attendance/details/${id}`);
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
  const renderActions = (item: AttendanceRecord) => <Button variant="ghost" size="sm" onClick={() => handleViewDetails(item.id)} className="hover:bg-gray-100">
      <Eye className="w-4 h-4" />
    </Button>;
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
  return <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <p className="text-[#1a1a1a] opacity-70 mb-2">Attendance &gt; Attendance List</p>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">ATTENDANCE LIST</h1>
      </div>

      {/* Enhanced Table */}
      <EnhancedTable data={paginatedData} columns={columns} renderCell={renderCell} renderActions={renderActions} onRowClick={item => handleViewDetails(item.id)} selectable={true} selectedItems={selectedItems} onSelectAll={handleSelectAll} onSelectItem={handleSelectItem} getItemId={item => String(item.id)} storageKey="attendance-dashboard-table" emptyMessage="No attendance records found" searchPlaceholder="Search attendance records..." enableExport={true} exportFileName="attendance-records" bulkActions={bulkActions} showBulkActions={true} pagination={false} />

      {/* Custom Pagination */}
      {totalPages > 1 && <div className="flex justify-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''} />
              </PaginationItem>
              
              {renderPaginationItems()}
              
              <PaginationItem>
                <PaginationNext onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>}

      {/* Footer */}
      <div className="mt-8 text-center">
        
      </div>
    </div>;
};