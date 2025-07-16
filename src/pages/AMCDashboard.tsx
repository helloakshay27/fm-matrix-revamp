import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAMCData } from '@/store/slices/amcSlice';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface AMCRecord {
  id: string;
  assetName: string;
  type: string;
  vendor: string;
  startDate: string;
  endDate: string;
  firstService: string;
  status: boolean;
  createdOn: string;
}

const initialAmcData: AMCRecord[] = [{
  id: '51016',
  assetName: '',
  type: 'Asset',
  vendor: 'MODWIN NETWORKS PVT.LTD',
  startDate: '04/04/2025',
  endDate: '02/05/2025',
  firstService: '04/04/2025',
  status: true,
  createdOn: '04/04/2025, 03:25PM'
}, {
  id: '51015',
  assetName: '',
  type: 'Asset',
  vendor: 'TBS ELECTRICAL',
  startDate: '01/04/2025',
  endDate: '10/05/2025',
  firstService: '09/04/2025',
  status: true,
  createdOn: '04/04/2025, 03:24PM'
}, {
  id: '49130',
  assetName: '',
  type: 'Asset',
  vendor: 'Mohan Khopade',
  startDate: '04/02/2025',
  endDate: '04/02/2025',
  firstService: '04/02/2025',
  status: true,
  createdOn: '04/02/2025, 04:29PM'
}, {
  id: '49120',
  assetName: '',
  type: 'Asset',
  vendor: 'MODWIN NETWORKS PVT.LTD',
  startDate: '04/02/2025',
  endDate: '04/02/2025',
  firstService: '04/02/2025',
  status: true,
  createdOn: '04/02/2025, 12:43AM'
}, {
  id: '49119',
  assetName: '',
  type: 'Asset',
  vendor: 'Mohammad Sageer',
  startDate: '04/02/2025',
  endDate: '04/02/2025',
  firstService: '04/02/2025',
  status: true,
  createdOn: '04/02/2025, 12:31AM'
}];

const columns: ColumnConfig[] = [
  { key: 'id', label: 'ID', sortable: true, defaultVisible: true },
  { key: 'assetName', label: 'Asset Name', sortable: true, defaultVisible: true },
  { key: 'type', label: 'Type', sortable: true, defaultVisible: true },
  { key: 'vendor', label: 'Vendor', sortable: true, defaultVisible: true },
  { key: 'startDate', label: 'Start Date', sortable: true, defaultVisible: true },
  { key: 'endDate', label: 'End Date', sortable: true, defaultVisible: true },
  { key: 'firstService', label: 'First Service', sortable: true, defaultVisible: true },
  { key: 'status', label: 'Status', sortable: true, defaultVisible: true },
  { key: 'createdOn', label: 'Created On', sortable: true, defaultVisible: true },
];

export const AMCDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: apiData, loading, error } = useAppSelector((state) => state.amc);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 2;

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

  const handleViewDetails = (id: string) => {
    navigate(`/maintenance/amc/details/${id}`);
  };

  const handleStatusToggle = (id: string) => {
    // For now, just log the status toggle since we're using API data
    console.log('Status toggle for AMC ID:', id);
    // In a real implementation, you would make an API call to update the status
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(amcData.map(item => item.id));
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

  const renderCell = (item: AMCRecord, columnKey: string) => {
    switch (columnKey) {
      case 'id':
        return <span className="font-medium">{item.id}</span>;
      case 'assetName':
        return item.assetName || '-';
      case 'type':
        return item.type;
      case 'vendor':
        return item.vendor;
      case 'startDate':
        return item.startDate;
      case 'endDate':
        return item.endDate;
      case 'firstService':
        return item.firstService;
      case 'status':
        return (
          <div className="flex items-center">
            <div 
              className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${
                item.status ? 'bg-green-500' : 'bg-gray-300'
              }`} 
              onClick={() => handleStatusToggle(item.id)}
            >
              <span 
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                  item.status ? 'translate-x-6' : 'translate-x-1'
                }`} 
              />
            </div>
          </div>
        );
      case 'createdOn':
        return item.createdOn;
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

  return (
    <div className="p-6">
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
          storageKey="amc-dashboard-table"
          emptyMessage="No AMC records found"
          searchPlaceholder="Search AMC records..."
          enableExport={true}
          exportFileName="amc-records"
          bulkActions={bulkActions}
          showBulkActions={true}
          pagination={false}
        />
      )}

      {/* Custom Pagination - Always show for debugging */}
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
    </div>
  );
};
