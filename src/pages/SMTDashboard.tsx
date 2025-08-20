import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { Eye, Users, UserCheck, ClipboardList, Building2 } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from '@/components/ui/pagination';
import { useNavigate } from 'react-router-dom';

const SMTDashboard = () => {

  // ...existing code...
  // SMT summary card data (must be after dummyData)
    const dummyData = [
    {
      id: 1,
      smt_done_by_name: 'John Doe',
      smt_done_by_function: 'Operations',
      smt_done_by_circle: 'Circle A',
      area_of_visit: 'Warehouse',
      type_of_facility: 'Storage',
      smt_done_date: '2025-08-01',
    },
    {
      id: 2,
      smt_done_by_name: 'Jane Smith',
      smt_done_by_function: 'Maintenance',
      smt_done_by_circle: 'Circle B',
      area_of_visit: 'Plant',
      type_of_facility: 'Manufacturing',
      smt_done_date: '2025-08-02',
    },
    {
      id: 3,
      smt_done_by_name: 'Alice Brown',
      smt_done_by_function: 'Safety',
      smt_done_by_circle: 'Circle C',
      area_of_visit: 'Office',
      type_of_facility: 'Admin',
      smt_done_date: '2025-08-03',
    },
    {
      id: 4,
      smt_done_by_name: 'Bob White',
      smt_done_by_function: 'Logistics',
      smt_done_by_circle: 'Circle D',
      area_of_visit: 'Dock',
      type_of_facility: 'Transport',
      smt_done_date: '2025-08-04',
    },
    {
      id: 5,
      smt_done_by_name: 'Charlie Green',
      smt_done_by_function: 'Security',
      smt_done_by_circle: 'Circle E',
      area_of_visit: 'Gate',
      type_of_facility: 'Entry',
      smt_done_date: '2025-08-05',
    },
    {
      id: 6,
      smt_done_by_name: 'Diana King',
      smt_done_by_function: 'Admin',
      smt_done_by_circle: 'Circle F',
      area_of_visit: 'Reception',
      type_of_facility: 'Admin',
      smt_done_date: '2025-08-06',
    },
    {
      id: 7,
      smt_done_by_name: 'Eve Black',
      smt_done_by_function: 'Operations',
      smt_done_by_circle: 'Circle G',
      area_of_visit: 'Yard',
      type_of_facility: 'Outdoor',
      smt_done_date: '2025-08-07',
    },
    {
      id: 8,
      smt_done_by_name: 'Frank Gray',
      smt_done_by_function: 'Maintenance',
      smt_done_by_circle: 'Circle H',
      area_of_visit: 'Workshop',
      type_of_facility: 'Repair',
      smt_done_date: '2025-08-08',
    },
    {
      id: 9,
      smt_done_by_name: 'Grace Hill',
      smt_done_by_function: 'Safety',
      smt_done_by_circle: 'Circle I',
      area_of_visit: 'Lab',
      type_of_facility: 'Testing',
      smt_done_date: '2025-08-09',
    },
    {
      id: 10,
      smt_done_by_name: 'Henry Stone',
      smt_done_by_function: 'Logistics',
      smt_done_by_circle: 'Circle J',
      area_of_visit: 'Parking',
      type_of_facility: 'Outdoor',
      smt_done_date: '2025-08-10',
    },
    {
      id: 11,
      smt_done_by_name: 'Iris Wilson',
      smt_done_by_function: 'Security',
      smt_done_by_circle: 'Circle K',
      area_of_visit: 'Server Room',
      type_of_facility: 'IT',
      smt_done_date: '2025-08-11',
    },
    {
      id: 12,
      smt_done_by_name: 'Jack Davis',
      smt_done_by_function: 'Admin',
      smt_done_by_circle: 'Circle L',
      area_of_visit: 'Cafeteria',
      type_of_facility: 'Food',
      smt_done_date: '2025-08-12',
    },
    {
      id: 13,
      smt_done_by_name: 'Kate Miller',
      smt_done_by_function: 'Operations',
      smt_done_by_circle: 'Circle M',
      area_of_visit: 'Control Room',
      type_of_facility: 'Monitoring',
      smt_done_date: '2025-08-13',
    },
    {
      id: 14,
      smt_done_by_name: 'Leo Garcia',
      smt_done_by_function: 'Maintenance',
      smt_done_by_circle: 'Circle N',
      area_of_visit: 'Generator Room',
      type_of_facility: 'Power',
      smt_done_date: '2025-08-14',
    },
    {
      id: 15,
      smt_done_by_name: 'Mia Rodriguez',
      smt_done_by_function: 'Safety',
      smt_done_by_circle: 'Circle O',
      area_of_visit: 'Fire Exit',
      type_of_facility: 'Safety',
      smt_done_date: '2025-08-15',
    },
  ];
  const cardData = [
    {
      title: 'Total SMTs',
      count: dummyData.length,
      icon: Users,
    },
    {
      title: 'Unique Circles',
      count: Array.from(new Set(dummyData.map(d => d.smt_done_by_circle))).length,
      icon: Building2,
    },
    {
      title: 'Distinct Functions',
      count: Array.from(new Set(dummyData.map(d => d.smt_done_by_function))).length,
      icon: ClipboardList,
    },
    {
      title: 'People Interacted',
      count: 4, // Placeholder, update if you have real data
      icon: UserCheck,
    },
  ];

  const columns = [
    { key: 'actions', label: 'Action', sortable: false, defaultVisible: true },
    { key: 'smt_done_by_name', label: 'SMT Done By Name', sortable: true, defaultVisible: true },
    { key: 'smt_done_by_function', label: 'SMT Done By Function', sortable: true, defaultVisible: true },
    { key: 'smt_done_by_circle', label: 'SMT Done By Circle', sortable: true, defaultVisible: true },
    { key: 'area_of_visit', label: 'Area Of Visit', sortable: true, defaultVisible: true },
    { key: 'type_of_facility', label: 'Type Of Facility', sortable: true, defaultVisible: true },
    { key: 'smt_done_date', label: 'SMT Done Date', sortable: true, defaultVisible: true },
  ];



  const pageSize = 5;

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const navigate = useNavigate();

  const paginatedData = dummyData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(dummyData.length / pageSize);

  const renderCell = (item, columnKey) => {
    switch (columnKey) {
      case 'actions':
        return (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => navigate(`/maintenance/smt/${item.id}`, { state: { row: item } })}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        );
      case 'smt_done_date':
        return new Date(item.smt_done_date).toLocaleDateString();
      default:
        return item[columnKey] || '';
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(dummyData.map(item => item.id.toString()));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId, checked) => {
    if (checked) {
      setSelectedItems(prev => [...prev, itemId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    }
  };

  // Pagination rendering (same style as MSafeDashboard)
  const renderPaginationItems = () => {
    const items = [];
    const showEllipsis = totalPages > 7;
    if (showEllipsis) {
      // Show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink onClick={() => setCurrentPage(1)} isActive={currentPage === 1} className="cursor-pointer">
            1
          </PaginationLink>
        </PaginationItem>
      );
      // Show ellipsis or pages 2-3
      if (currentPage > 4) {
        items.push(
          <PaginationItem key="ellipsis1">
            <span className="px-2">...</span>
          </PaginationItem>
        );
      } else {
        for (let i = 2; i <= Math.min(3, totalPages - 1); i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink onClick={() => setCurrentPage(i)} isActive={currentPage === i} className="cursor-pointer">
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
              <PaginationLink onClick={() => setCurrentPage(i)} isActive={currentPage === i}>
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
            <span className="px-2">...</span>
          </PaginationItem>
        );
      } else {
        for (let i = Math.max(totalPages - 2, 2); i < totalPages; i++) {
          if (!items.find(item => item.key === i)) {
            items.push(
              <PaginationItem key={i}>
                <PaginationLink onClick={() => setCurrentPage(i)} isActive={currentPage === i} className="cursor-pointer">
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
            <PaginationLink onClick={() => setCurrentPage(totalPages)} isActive={currentPage === totalPages} className="cursor-pointer">
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
            <PaginationLink onClick={() => setCurrentPage(i)} isActive={currentPage === i} className="cursor-pointer">
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }
    return items;
  };

  return (
    <div className="p-6">
      {/* SMT Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cardData.map((card, index) => (
          <div
            key={index}
            className="p-3 sm:p-4 rounded-lg shadow-sm h-[100px] sm:h-[132px] flex items-center gap-2 sm:gap-4 bg-[#f6f4ee]"
          >
            <div className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0 bg-[#C4B89D54] rounded-full">
              <card.icon className="w-4 h-4 sm:w-6 sm:h-6" style={{ color: '#C72030' }} />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="text-lg sm:text-2xl font-bold leading-tight truncate">
                {card.count}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground font-medium leading-tight">
                {card.title}
              </div>
            </div>
          </div>
        ))}
      </div>
      <EnhancedTable
        data={paginatedData}
        columns={columns}
        renderCell={renderCell}
        selectable={true}
        selectedItems={selectedItems}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectItem}
        getItemId={item => item.id.toString()}
        storageKey="smt-dashboard-table"
        emptyMessage="No SMT records found"
        searchPlaceholder="Search SMT records..."
        enableExport={false}
        showBulkActions={false}
        pagination={false}
        loading={false}
      />
      {/* Pagination (same as MSafeDashboard) */}
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
    </div>
  );
}

export default SMTDashboard;
