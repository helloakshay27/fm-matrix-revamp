import React, { useMemo, useEffect, useState } from 'react';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { apiClient } from '@/utils/apiClient';
import { API_CONFIG } from '@/config/apiConfig';
import { toast } from '@/hooks/use-toast';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

export interface VehicleRecord {
  name: string;
  circle: string;
  email: string;
  id: string | number;
  vehicle_type: string;
  ownership_type: string;
  vehicle_number: string;
  vehicle_name: string;
}

interface VehicleDetailsApiResponse {
  vehicle_details: VehicleRecord[];
  pagination: {
    current_page: number;
    total_count: number;
    total_pages: number;
  };
}

interface VehicleDetailsProps {
  data?: VehicleRecord[];
  loading?: boolean;
}

// Simple CSV export for vehicles
const exportVehiclesCsv = (rows: VehicleRecord[]) => {
  if (!rows || rows.length === 0) {
    alert('No data to export');
    return;
  }
  const headers = ['Name', 'Circle', 'Email', 'ID', 'Vehicle Type', 'Ownership Type', 'Vehicle Number', 'Vehicle Name'];
  const csvLines = [
    headers.join(','),
    ...rows.map(r => [
      r.name,
      r.circle,
      r.email,
      String(r.id),
      r.vehicle_type,
      r.ownership_type,
      r.vehicle_number,
      r.vehicle_name,
    ].map(v => {
      const s = String(v ?? '').replace(/"/g, '""');
      return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s}"` : s;
    }).join(','))
  ].join('\n');

  const blob = new Blob([csvLines], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'vehicle-details.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};



const VehicleDetails: React.FC<VehicleDetailsProps> = ({ data = [], loading: externalLoading = false }) => {
  const [apiData, setApiData] = useState<VehicleRecord[]>([]);
  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const [hasFetched, setHasFetched] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_count: 0,
    total_pages: 0,
  });

  // Fetch vehicle details from API
  const fetchVehicleDetails = async (page: number = 1, search: string = '') => {
    try {
      setApiLoading(true);
      let url = `${API_CONFIG.ENDPOINTS.VEHICLE_DETAILS}?page=${page}`;
      
      // Add search query parameter if search is provided
      if (search.trim()) {
        url += `&q[user_email_cont]=${encodeURIComponent(search.trim())}`;
      }
      
      const response = await apiClient.get<VehicleDetailsApiResponse>(url);
      
      if (response.data && response.data.vehicle_details) {
        setApiData(response.data.vehicle_details);
        setPagination(response.data.pagination);
        setHasFetched(true);
      }
    } catch (error) {
      console.error('Error fetching vehicle details:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch vehicle details',
        variant: 'destructive',
      });
      setHasFetched(true);
    } finally {
      setApiLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    // Only fetch from API once if no external data is provided
    if (!hasFetched && (!data || data.length === 0)) {
      fetchVehicleDetails(currentPage, searchQuery);
    }
  }, [data, hasFetched]);

  // Handle page change
  useEffect(() => {
    if (hasFetched && (!data || data.length === 0)) {
      fetchVehicleDetails(currentPage, searchQuery);
    }
  }, [currentPage]);

  // Handle search with debounce
  useEffect(() => {
    if (!hasFetched || (data && data.length > 0)) return;
    
    const debounceTimer = setTimeout(() => {
      setCurrentPage(1); // Reset to first page on search
      fetchVehicleDetails(1, searchQuery);
    }, 300); // 300ms debounce for faster response

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Use API data if available, otherwise use provided data, no dummy data
  const tableData = useMemo(() => {
    if (data && data.length > 0) return data;
    if (apiData && apiData.length > 0) return apiData;
    return [];
  }, [data, apiData]);

  // Determine loading state
  const isLoading = externalLoading || apiLoading;

  // Handle search change from EnhancedTable
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const columns: ColumnConfig[] = useMemo(() => ([
    { key: 'name', label: 'Name', sortable: true },
    { key: 'circle', label: 'Circle', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'id', label: 'ID', sortable: true },
    { key: 'vehicle_type', label: 'Vehicle Type', sortable: true },
    { key: 'ownership_type', label: 'Ownership Type', sortable: true },
    { key: 'vehicle_number', label: 'Vehicle Number', sortable: true },
    { key: 'vehicle_name', label: 'Vehicle Name', sortable: true },
  ]), []);

  // const leftActions = (
  //   <Button
  //     className="bg-[#5B2D66] text-white hover:bg-[#5B2D66]/90"
  //     onClick={() => exportVehiclesCsv(tableData)}
  //   >
  //     <Download className="w-4 h-4 mr-2" />
  //     Export
  //   </Button>
  // );

  const renderCell = (item: VehicleRecord, columnKey: string) => {
    switch (columnKey) {
      case 'name':
        return item.name || '-';
      case 'circle':
        return item.circle || '-';
      case 'email':
        return item.email || '-';
      case 'id':
        return String(item.id ?? '-');
      case 'vehicle_type':
        return item.vehicle_type || '-';
      case 'ownership_type':
        return item.ownership_type || '-';
      case 'vehicle_number':
        return item.vehicle_number || '-';
      case 'vehicle_name':
        return item.vehicle_name || '-';
      default:
        return '-';
    }
  };

  // Pagination rendering (same style as TrainingDashboard)
  const renderPaginationItems = () => {
    const items = [];
    const showEllipsis = pagination.total_pages > 7;
    
    if (showEllipsis) {
      // Show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink 
            onClick={() => setCurrentPage(1)} 
            isActive={currentPage === 1} 
            className="cursor-pointer"
          >
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
        for (let i = 2; i <= Math.min(3, pagination.total_pages - 1); i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink 
                onClick={() => setCurrentPage(i)} 
                isActive={currentPage === i} 
                className="cursor-pointer"
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }
      
      // Show current page area
      if (currentPage > 3 && currentPage < pagination.total_pages - 2) {
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink 
                onClick={() => setCurrentPage(i)} 
                isActive={currentPage === i} 
                className="cursor-pointer"
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }
      
      // Show ellipsis or pages before last
      if (currentPage < pagination.total_pages - 3) {
        items.push(
          <PaginationItem key="ellipsis2">
            <span className="px-2">...</span>
          </PaginationItem>
        );
      } else {
        for (let i = Math.max(pagination.total_pages - 2, 2); i < pagination.total_pages; i++) {
          if (!items.find(item => item.key === i)) {
            items.push(
              <PaginationItem key={i}>
                <PaginationLink 
                  onClick={() => setCurrentPage(i)} 
                  isActive={currentPage === i} 
                  className="cursor-pointer"
                >
                  {i}
                </PaginationLink>
              </PaginationItem>
            );
          }
        }
      }
      
      // Show last page
      if (pagination.total_pages > 1) {
        items.push(
          <PaginationItem key={pagination.total_pages}>
            <PaginationLink 
              onClick={() => setCurrentPage(pagination.total_pages)} 
              isActive={currentPage === pagination.total_pages} 
              className="cursor-pointer"
            >
              {pagination.total_pages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Show all pages if total is 7 or less
      for (let i = 1; i <= pagination.total_pages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink 
              onClick={() => setCurrentPage(i)} 
              isActive={currentPage === i} 
              className="cursor-pointer"
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
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">VEHICLE DETAILS</h2>
        {pagination.total_count > 0 && (
          <div className="text-sm text-gray-600">
            Total Vehicles: <span className="font-semibold">{pagination.total_count.toLocaleString()}</span>
          </div>
        )}
      </div>
      <EnhancedTable
        data={tableData}
        columns={columns}
        renderCell={renderCell}
        // leftActions={leftActions}
        // enableExport={false}
        pagination={false}
        loading={isLoading}
        storageKey="vehicle-details-table"
        searchPlaceholder="Search by email..."
        enableSearch={true}
        hideColumnsButton={false}
        emptyMessage="No vehicle details available"
        onSearchChange={handleSearchChange}
        disableClientSearch={true}
      />
      
      {/* Pagination (same as TrainingDashboard) */}
      {pagination.total_pages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              {renderPaginationItems()}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(Math.min(pagination.total_pages, currentPage + 1))}
                  className={currentPage === pagination.total_pages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
      
      {pagination.total_pages === 1 && !isLoading && (
        <div className="text-xs text-gray-500 mt-4">Showing {tableData.length} record(s)</div>
      )}
    </div>
  );
};

export default VehicleDetails;