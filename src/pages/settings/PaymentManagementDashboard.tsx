import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Plus, Download, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { useDebounce } from '@/hooks/useDebounce';
import { Badge } from "@/components/ui/badge";
import { API_CONFIG } from '@/config/apiConfig';

interface LockPayment {
  id: number;
  order_number: string;
  payment_of: string;
  payment_of_id: number;
  payment_mode: string | null;
  sub_total: string | null;
  gst: string | null;
  discount: string | null;
  total_amount: string;
  paid_amount: string | null;
  payment_status: string | null;
  pg_state: string | null;
  pg_response_code: string | null;
  pg_response_msg: string | null;
  pg_transaction_id: string | null;
  created_at: string;
  updated_at: string;
  payment_method: string | null;
  card_type: string | null;
  cheque_number: string | null;
  cheque_date: string | null;
  bank_name: string | null;
  ifsc: string | null;
  branch: string | null;
  neft_reference: string | null;
  notes: string | null;
  payment_gateway: string | null;
  user_id: number | null;
  redirect: string;
  payment_type: string | null;
  convenience_charge: string | null;
  refunded_amount: string | null;
  refund_mode: string | null;
  refund_transaction_no: string | null;
  refund_note: string | null;
  refunded_by: string | null;
  refunded_on: string | null;
  receipt_number: string | null;
  created_by_id: number | null;
  updt_balance: string | null;
  recon_status: string | null;
  reconciled_by: string | null;
  reconciled_on: string | null;
  resource_id: number;
  resource_type: string;
  sgst: string | null;
}

interface ApiResponse {
  pagination: {
    current_page: number;
    total_count: number;
    total_pages: number;
  };
  lock_payments: LockPayment[];
}

export const PaymentManagementDashboard = () => {
  const navigate = useNavigate();
  
  // State management
  const [payments, setPayments] = useState<LockPayment[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const isSearchingRef = useRef(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const perPage = 20;

  // Fetch payments data
  const fetchPayments = useCallback(async (page: number = 1) => {
    setLoading(true);
    try {
      const baseUrl = API_CONFIG.BASE_URL;
      const token = API_CONFIG.TOKEN;
      
      console.log('Fetching lock payments...', { baseUrl, hasToken: !!token, page });
      
      const url = new URL(`${baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`}/lock_payments.json`);
      url.searchParams.append('access_token', token || '');
      url.searchParams.append('page', page.toString());
      
      console.log('API URL:', url.toString());
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch lock payments: ${response.status} ${response.statusText}`);
      }
      
      const data: ApiResponse = await response.json();
      console.log('Received data:', data);
      
      if (data.lock_payments && Array.isArray(data.lock_payments)) {
        setPayments(data.lock_payments);
        setTotalCount(data.pagination.total_count);
        setTotalPages(data.pagination.total_pages);
        setCurrentPage(data.pagination.current_page);
        toast.success(`Loaded ${data.lock_payments.length} payments`);
      } else {
        setPayments([]);
        setTotalCount(0);
        setTotalPages(1);
      }
      
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Failed to fetch payment data');
      setPayments([]);
      setTotalCount(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle search input change
  const handleSearch = useCallback((query: string) => {
    isSearchingRef.current = true;
    setSearchQuery(query);
  }, []);

  // Fetch on mount
  useEffect(() => {
    console.log('Effect triggered - fetching payments', { currentPage });
    fetchPayments(currentPage);
  }, [currentPage, fetchPayments]);

  // Handle export
  const handleExport = async () => {
    try {
      toast.loading('Preparing export file...');
      
      // TODO: Replace with actual API call
      setTimeout(() => {
        toast.success('Export completed successfully');
      }, 1000);
      
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data');
    }
  };

  // Render payment status badge
  const renderPaymentStatusBadge = (status: string | null) => {
    if (!status) {
      return (
        <Badge className="bg-gray-100 text-gray-800 border-0">
          Pending
        </Badge>
      );
    }
    
    const statusLower = status.toLowerCase();
    
    if (statusLower === 'success' || statusLower === 'paid') {
      return (
        <Badge className="bg-green-100 text-green-800 border-0">
          {status}
        </Badge>
      );
    }
    
    if (statusLower === 'failed' || statusLower === 'rejected') {
      return (
        <Badge className="bg-red-100 text-red-800 border-0">
          {status}
        </Badge>
      );
    }
    
    if (statusLower === 'processing') {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-0">
          {status}
        </Badge>
      );
    }
    
    return (
      <Badge className="bg-gray-100 text-gray-800 border-0">
        {status}
      </Badge>
    );
  };

  // Render payment type badge
  const renderPaymentTypeBadge = (paymentOf: string) => {
    const colors: Record<string, string> = {
      'FacilityBooking': 'bg-grey-100 text-black-800',
      'LockAccountBill': 'bg-lightgrey-100 text-black-800',
      'Maintenance': 'bg-lightgrey-100 text-black-800',
    };
    
    const color = colors[paymentOf] || colors['Other'];
    
    return (
      <Badge className={`${color} border-0`}>
        {paymentOf}
      </Badge>
    );
  };

  // Format amount
  const formatAmount = (amount: string | null) => {
    if (!amount) return '-';
    const num = parseFloat(amount);
    return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Define columns for EnhancedTable
  const columns = [
    { key: 'actions', label: 'Actions', sortable: false },
    { key: 'order_number', label: 'Order Number', sortable: true },
    { key: 'payment_of', label: 'Payment Type', sortable: true },
    { key: 'total_amount', label: 'Total Amount', sortable: true },
    { key: 'paid_amount', label: 'Paid Amount', sortable: true },
    { key: 'payment_status', label: 'Payment Status', sortable: true },
    { key: 'payment_method', label: 'Payment Method', sortable: true },
    { key: 'payment_gateway', label: 'Gateway', sortable: true },
    { key: 'pg_transaction_id', label: 'Transaction ID', sortable: true },
    { key: 'receipt_number', label: 'Receipt Number', sortable: true },
    // { key: 'resource_type', label: 'Resource Type', sortable: true },
    // { key: 'resource_id', label: 'Resource ID', sortable: true },
        { key: 'recon_status', label: 'Reconciliation', sortable: true },

    { key: 'created_at', label: 'Created On', sortable: true },
  ];

  // Render cell content
  const renderCell = (item: LockPayment, columnKey: string) => {
    if (columnKey === 'actions') {
      return (
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate(`/club-management/accounting/details/${item.id}`)}
            title="View Details"
            className="h-8 w-8 p-0"
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      );
    }

    if (columnKey === 'payment_of') {
      return renderPaymentTypeBadge(item.payment_of);
    }

    if (columnKey === 'payment_status') {
      return renderPaymentStatusBadge(item.payment_status);
    }

    if (columnKey === 'total_amount' || columnKey === 'paid_amount') {
      return formatAmount(item[columnKey]);
    }

    if (columnKey === 'created_at' || columnKey === 'updated_at') {
      return formatDate(item[columnKey]);
    }

    if (columnKey === 'recon_status') {
      return item.recon_status ? (
        <Badge className="bg-green-100 text-green-800 border-0">
          {item.recon_status}
        </Badge>
      ) : (
        <span className="text-gray-400">-</span>
      );
    }

    if (columnKey === 'order_number') {
      return (
        <span className="font-medium text-gray-900">{item.order_number}</span>
      );
    }
    
    if (!item[columnKey] || item[columnKey] === null || item[columnKey] === '') {
      return <span className="text-gray-400">-</span>;
    }
    
    return item[columnKey];
  };

  // Custom left actions
  const renderCustomActions = () => (
    <div className="flex gap-3">
      <Button
        className="bg-[#C72030] hover:bg-[#A01020] text-white"
        onClick={() => navigate('/settings/payment-management/add')}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Payment
      </Button>
    </div>
  );

  // Custom right actions
  const renderRightActions = () => (
    <div className="flex gap-2">
      <Button
        variant="outline"
        onClick={handleExport}
        className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white"
      >
        <Download className="w-4 h-4 mr-2" />
        Export
      </Button>
    </div>
  );

  return (
    <div className="p-2 sm:p-4 lg:p-6 max-w-full overflow-x-hidden">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#1a1a1a]">Payment Management</h1>
        
      </div>

      {/* Payments Table */}
      <div className="overflow-x-auto animate-fade-in">
        {searchLoading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex items-center justify-center">
            <div className="flex items-center gap-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm">Searching payments...</span>
            </div>
          </div>
        )}
        <EnhancedTable
          data={payments || []}
          columns={columns}
          renderCell={renderCell}
          selectable={false}
          pagination={false}
          enableExport={false}
          exportFileName="lock-payments"
          handleExport={handleExport}
          storageKey="lock-payments-table"
          enableSelection={false}
          onFilterClick={() => setIsFilterOpen(true)}
          searchPlaceholder="Search Payments"
          onSearchChange={handleSearch}
          hideTableExport={false}
          hideColumnsButton={false}
          className="transition-all duration-500 ease-in-out"
          loading={loading}
          loadingMessage="Loading payments..."
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

export default PaymentManagementDashboard;
