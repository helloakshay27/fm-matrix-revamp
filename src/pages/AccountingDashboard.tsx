
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Plus, Download, Filter, Receipt } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { useDebounce } from '@/hooks/useDebounce';
import { Badge } from "@/components/ui/badge";

interface AccountingData {
  id: number;
  transactionId: string;
  orderId: string;
  type: string;
  bookedBy: string;
  flat: string;
  facilityName: string;
  scheduledOn: string;
  totalAmount: number;
  amountPaid: number;
  paymentStatus: string;
  refundedAmount: number;
  paidOn: string;
}

export const AccountingDashboard = () => {
  const navigate = useNavigate();
  
  // State management
  const [accountingRecords, setAccountingRecords] = useState<AccountingData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const isSearchingRef = useRef(false);
  const [selectedRecords, setSelectedRecords] = useState<number[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    paymentStatus: '',
    dateRange: ''
  });
  
  const perPage = 20;

  // Fetch accounting records data
  const fetchAccountingRecords = useCallback(async (page: number = 1) => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await apiClient.get('/club-management/accounting', {
      //   params: {
      //     page,
      //     per_page: perPage,
      //     search: searchQuery,
      //     ...filters
      //   }
      // });
      
      // Mock data for now
      const mockData: AccountingData[] = [
        {
          id: 1,
          transactionId: '1hol7707878',
          orderId: '3848-Society_facility_payment-19745',
          type: 'FacilityBooking',
          bookedBy: 'Karishma Shrivastava',
          flat: 'T6-Magnolia - T6-3801',
          facilityName: 'Badminton Court 1',
          scheduledOn: '5 November 2025 08:00 PM To 08:00 PM, 08:00 PM To 09:00 PM',
          totalAmount: 1436.2,
          amountPaid: 1436.2,
          paymentStatus: 'SUCCESS',
          refundedAmount: 0,
          paidOn: '05/11/2025'
        },
        {
          id: 2,
          transactionId: '3848-Society_facility_payment-19745',
          orderId: '',
          type: 'FacilityBooking',
          bookedBy: 'Pratik Patil',
          flat: 'PINE - T3-3900',
          facilityName: 'Personal Coach',
          scheduledOn: '6 November 2025 08:00 AM To 10:00 AM',
          totalAmount: 354.0,
          amountPaid: 0.0,
          paymentStatus: 'PENDING',
          refundedAmount: 0,
          paidOn: '05/11/2025'
        },
        {
          id: 3,
          transactionId: '1hol7701030',
          orderId: '3848-Society_facility_payment-19745',
          type: 'FacilityBooking',
          bookedBy: 'Pratik Patil',
          flat: 'PINE - T3-3900',
          facilityName: 'Personal Coach',
          scheduledOn: '6 November 2025 08:00 AM To 10:00 AM',
          totalAmount: 2435.7,
          amountPaid: 2360.0,
          paymentStatus: 'SUCCESS',
          refundedAmount: 0,
          paidOn: '05/11/2025'
        },
        {
          id: 4,
          transactionId: '3848-Society_facility_payment-19745',
          orderId: '',
          type: 'FacilityBooking',
          bookedBy: 'Pratik Patil',
          flat: 'PINE - T3-3900',
          facilityName: 'Personal Coach',
          scheduledOn: '6 November 2025 08:00 AM To 10:00 AM',
          totalAmount: 2360.0,
          amountPaid: 0.0,
          paymentStatus: 'PENDING',
          refundedAmount: 0,
          paidOn: '05/11/2025'
        },
        {
          id: 5,
          transactionId: '3848-Society_facility_payment-19745',
          orderId: '',
          type: 'FacilityBooking',
          bookedBy: 'Pratik Patil',
          flat: 'PINE - T3-3900',
          facilityName: 'Personal Coach',
          scheduledOn: '6 November 2025 08:00 AM To 10:00 AM',
          totalAmount: 2360.0,
          amountPaid: 0.0,
          paymentStatus: 'PENDING',
          refundedAmount: 0,
          paidOn: '05/11/2025'
        },
        {
          id: 6,
          transactionId: '3848-Society_facility_payment-19745',
          orderId: '',
          type: 'FacilityBooking',
          bookedBy: 'Pratik Patil',
          flat: 'PINE - T3-3900',
          facilityName: 'Personal Coach',
          scheduledOn: '6 November 2025 08:00 AM To 10:00 AM',
          totalAmount: 3040.0,
          amountPaid: 0.0,
          paymentStatus: 'PENDING',
          refundedAmount: 0,
          paidOn: '05/11/2025'
        },
        {
          id: 7,
          transactionId: '3848-Society_facility_payment-19745',
          orderId: '',
          type: 'FacilityBooking',
          bookedBy: 'Pratik Patil',
          flat: 'PINE - T3-3900',
          facilityName: 'Personal Coach',
          scheduledOn: '6 November 2025 08:00 AM To 10:00 AM',
          totalAmount: 15380.0,
          amountPaid: 0.0,
          paymentStatus: 'PENDING',
          refundedAmount: 0,
          paidOn: '05/11/2025'
        },
        {
          id: 8,
          transactionId: '3848-Society_facility_payment-19745',
          orderId: '',
          type: 'FacilityBooking',
          bookedBy: 'Pratik Patil',
          flat: 'PINE - T3-3900',
          facilityName: 'Personal Coach',
          scheduledOn: '6 November 2025 08:00 AM To 10:00 AM',
          totalAmount: 177.0,
          amountPaid: 0.0,
          paymentStatus: 'PENDING',
          refundedAmount: 0,
          paidOn: '05/11/2025'
        }
      ];
      
      setAccountingRecords(mockData);
      setTotalRecords(mockData.length);
      setTotalPages(Math.ceil(mockData.length / perPage));
      
    } catch (error) {
      console.error('Error fetching accounting records:', error);
      toast.error('Failed to fetch accounting data');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters, perPage]);

  // Handle search input change
  const handleSearch = useCallback((query: string) => {
    isSearchingRef.current = true;
    setSearchQuery(query);
  }, []);

  // Effect to handle debounced search
  useEffect(() => {
    const currentSearch = filters.type || '';
    const newSearch = debouncedSearchQuery.trim();

    if (currentSearch === newSearch) {
      return;
    }

    setFilters(prevFilters => ({
      ...prevFilters,
      type: newSearch
    }));

    if (isSearchingRef.current || (newSearch && !currentSearch)) {
      setCurrentPage(1);
      isSearchingRef.current = false;
    }
  }, [debouncedSearchQuery]);

  useEffect(() => {
    fetchAccountingRecords(currentPage);
  }, [currentPage, filters, fetchAccountingRecords]);

  // Handle export
  const handleExport = async () => {
    try {
      toast.loading('Preparing export file...');
      
      // TODO: Replace with actual API call
      // const response = await apiClient.get('/club-management/accounting/export', {
      //   responseType: 'blob'
      // });
      
      // Mock export
      setTimeout(() => {
        toast.success('Export completed successfully');
      }, 1000);
      
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data');
    }
  };

  // Handle filter apply
  const handleFilterApply = () => {
    setCurrentPage(1);
    fetchAccountingRecords(1);
    setIsFilterOpen(false);
  };

  // Handle record selection
  const handleRecordSelection = (recordIdString: string, isSelected: boolean) => {
    const recordId = parseInt(recordIdString);
    setSelectedRecords(prev => 
      isSelected 
        ? [...prev, recordId]
        : prev.filter(id => id !== recordId)
    );
  };

  // Handle select all
  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      const allRecordIds = accountingRecords.map(r => r.id);
      setSelectedRecords(allRecordIds);
    } else {
      setSelectedRecords([]);
    }
  };

  // Handle clear selection
  const handleClearSelection = () => {
    setSelectedRecords([]);
  };

  // Render payment status badge
  const renderStatusBadge = (status: string) => {
    const statusConfig = {
      'SUCCESS': { color: 'bg-green-100 text-green-800', icon: '✓' },
      'PENDING': { color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
      'FAILED': { color: 'bg-red-100 text-red-800', icon: '✗' },
      'REFUNDED': { color: 'bg-blue-100 text-blue-800', icon: '↩' }
    };

    const config = statusConfig[status] || statusConfig['PENDING'];
    
    return (
      <Badge className={`${config.color} border-0`}>
        {status}
      </Badge>
    );
  };

  // Define columns for EnhancedTable
  const columns = [
    { key: 'actions', label: 'Actions', sortable: false },
    { key: 'orderId', label: 'Order ID', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'bookedBy', label: 'Booked By', sortable: true },
    { key: 'flat', label: 'Flat', sortable: true },
    { key: 'facilityName', label: 'Facility Name', sortable: true },
    { key: 'scheduledOn', label: 'Scheduled On', sortable: true },
    { key: 'totalAmount', label: 'Total Amount', sortable: true },
    { key: 'amountPaid', label: 'Amount Paid', sortable: true },
    { key: 'paymentStatus', label: 'Payment Status', sortable: true },
    { key: 'transactionId', label: 'Transaction ID', sortable: true },
    { key: 'refundedAmount', label: 'Refunded Amount', sortable: true },
    { key: 'paidOn', label: 'Paid On', sortable: true }
  ];

  // Render cell content
  const renderCell = (item: AccountingData, columnKey: string) => {
    if (columnKey === 'actions') {
      return (
        <div className="flex ">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate(`/club-management/accounting/${item.id}`)}
            title="View Details"
            className="h-8 w-8 p-0"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate(`/club-management/accounting/${item.id}/receipt`)}
            title="Download Receipt"
            className="h-8 w-8 p-0"
          >
            <Receipt className="w-4 h-4" />
          </Button>
        </div>
      );
    }

    if (columnKey === 'paymentStatus') {
      return renderStatusBadge(item.paymentStatus);
    }

    if (columnKey === 'type') {
      return <Badge variant="outline">{item.type}</Badge>;
    }

    if (columnKey === 'totalAmount') {
      return <span className="font-medium">₹{item.totalAmount.toFixed(1)}</span>;
    }

    if (columnKey === 'amountPaid') {
      return <span className="font-medium">₹{item.amountPaid.toFixed(1)}</span>;
    }

    if (columnKey === 'refundedAmount') {
      return item.refundedAmount > 0 
        ? <span className="font-medium text-blue-600">₹{item.refundedAmount.toFixed(1)}</span>
        : <span className="text-gray-400">₹0.0</span>;
    }

    if (columnKey === 'orderId' && !item.orderId) return '-';
    
    if (!item[columnKey] || item[columnKey] === null || item[columnKey] === '') {
      return '--';
    }
    
    return item[columnKey];
  };

  // Custom left actions
  const renderCustomActions = () => (
    <div className="flex gap-3">
      {/* Add button can be added if needed */}
    </div>
  );

  // Custom right actions
  const renderRightActions = () => (
    <div className="flex gap-2">
      {/* Additional actions can be added if needed */}
    </div>
  );

  return (
    <div className="p-2 sm:p-4 lg:p-6 max-w-full overflow-x-hidden">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#1a1a1a]">Accounting</h1>
        <p className="text-sm text-gray-500 mt-1">
          Total Records: {totalRecords.toLocaleString()}
        </p>
      </div>

      {/* Accounting Table */}
      <div className="overflow-x-auto animate-fade-in">
        {searchLoading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex items-center justify-center">
            <div className="flex items-center gap-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm">Searching records...</span>
            </div>
          </div>
        )}
        <EnhancedTable
          data={accountingRecords || []}
          columns={columns}
          renderCell={renderCell}
          selectable={true}
          pagination={false}
          enableExport={true}
          exportFileName="accounting-records"
          handleExport={handleExport}
          storageKey="accounting-records-table"
          enableSelection={true}
          selectedItems={selectedRecords.map(id => id.toString())}
          onSelectItem={handleRecordSelection}
          onSelectAll={handleSelectAll}
          getItemId={(record) => record.id.toString()}
          leftActions={
            <div className="flex gap-3">
              {renderCustomActions()}
            </div>
          }
          onFilterClick={() => setIsFilterOpen(true)}
          rightActions={renderRightActions()}
          searchPlaceholder="Search Accounting Records"
          onSearchChange={handleSearch}
          hideTableExport={false}
          hideColumnsButton={false}
          className="transition-all duration-500 ease-in-out"
          loading={loading}
          loadingMessage="Loading accounting records..."
        />

        {/* Custom Pagination */}
        <div className="flex items-center justify-center mt-6 px-4 py-3 bg-white border-t border-gray-200 animate-fade-in">
          <div className="flex items-center space-x-1">
            {/* Previous Button */}
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || loading || searchLoading}
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {/* First page */}
              {currentPage > 3 && (
                <>
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={loading || searchLoading}
                    className="w-8 h-8 flex items-center justify-center text-sm text-gray-700 hover:bg-gray-100 rounded disabled:opacity-50"
                  >
                    1
                  </button>
                  {currentPage > 4 && (
                    <span className="px-2 text-gray-500">...</span>
                  )}
                </>
              )}

              {/* Previous pages */}
              {currentPage > 2 && (
                <button
                  onClick={() => setCurrentPage(currentPage - 2)}
                  disabled={loading || searchLoading}
                  className="w-8 h-8 flex items-center justify-center text-sm text-gray-700 hover:bg-gray-100 rounded disabled:opacity-50"
                >
                  {currentPage - 2}
                </button>
              )}

              {currentPage > 1 && (
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={loading || searchLoading}
                  className="w-8 h-8 flex items-center justify-center text-sm text-gray-700 hover:bg-gray-100 rounded disabled:opacity-50"
                >
                  {currentPage - 1}
                </button>
              )}

              {/* Current page */}
              <button
                disabled
                className="w-8 h-8 flex items-center justify-center text-sm font-medium bg-[#C72030] text-white rounded"
              >
                {currentPage}
              </button>

              {/* Next pages */}
              {currentPage < totalPages && (
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={loading || searchLoading}
                  className="w-8 h-8 flex items-center justify-center text-sm text-gray-700 hover:bg-gray-100 rounded disabled:opacity-50"
                >
                  {currentPage + 1}
                </button>
              )}

              {currentPage < totalPages - 1 && (
                <button
                  onClick={() => setCurrentPage(currentPage + 2)}
                  disabled={loading || searchLoading}
                  className="w-8 h-8 flex items-center justify-center text-sm text-gray-700 hover:bg-gray-100 rounded disabled:opacity-50"
                >
                  {currentPage + 2}
                </button>
              )}

              {/* Last page */}
              {currentPage < totalPages - 2 && (
                <>
                  {currentPage < totalPages - 3 && (
                    <span className="px-2 text-gray-500">...</span>
                  )}
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={loading || searchLoading}
                    className="w-8 h-8 flex items-center justify-center text-sm text-gray-700 hover:bg-gray-100 rounded disabled:opacity-50"
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>

            {/* Next Button */}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || loading || searchLoading}
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Page Info */}
          <div className="ml-4 text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      </div>
    </div>
  );
};
