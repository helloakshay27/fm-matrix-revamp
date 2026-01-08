
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Filter, Loader2 } from 'lucide-react';
import { UtilityEVConsumptionFilterDialog } from '../components/UtilityEVConsumptionFilterDialog';
import { EnhancedTable } from '../components/enhanced-table/EnhancedTable';
import { ColumnVisibilityDropdown } from '@/components/ColumnVisibilityDropdown';
import { useToast } from "@/hooks/use-toast";
import { API_CONFIG, getFullUrl, getAuthenticatedFetchOptions } from '@/config/apiConfig';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';

interface EVConsumptionData {
  id: number;
  transaction_date: string;
  transaction_id: string | null;
  name: string;
  site_name: string;
  units_consumed: string;
  tariff_rate: string;
  sale_of_energy: string;
  tax_percentage: number;
  tax_amount: string;
  total_amount: string;
  created_by_name: string;
}

interface FilterData {
  dateRange?: DateRange | string;
  transactionId?: string;
}

const UtilityEVConsumptionDashboard = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [evConsumptionData, setEvConsumptionData] = useState<EVConsumptionData[]>([]);
  const [appliedFilters, setAppliedFilters] = useState<FilterData>({});
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  // Column visibility state - updated to match API response
  const [columns, setColumns] = useState([
    // { key: 'id', label: 'ID', visible: true },
    { key: 'transaction_date', label: 'Transaction Date', visible: true },
    { key: 'transaction_id', label: 'Transaction Id', visible: true },
    { key: 'name', label: 'Name', visible: true },
    { key: 'site_name', label: 'Site', visible: true },
    { key: 'units_consumed', label: 'Units Consumed', visible: true },
    { key: 'tariff_rate', label: 'Tariff Rate', visible: true },
    { key: 'sale_of_energy', label: 'Sale of Energy', visible: true },
    { key: 'tax_percentage', label: 'Tax Percentage', visible: true },
    { key: 'tax_amount', label: 'Tax Amount', visible: true },
    { key: 'total_amount', label: 'Total Amount', visible: true },
    { key: 'created_by_name', label: 'Created By', visible: true }
  ]);

  // Column visibility handlers
  const handleColumnToggle = (columnKey: string, visible: boolean) => {
    console.log('Column toggle called:', { columnKey, visible });
    setColumns(prev => {
      const updated = prev.map(col => 
        col.key === columnKey ? { ...col, visible } : col
      );
      console.log('Updated columns:', updated);
      return updated;
    });
  };

  const isColumnVisible = React.useCallback((columnKey: string) => {
    return columns.find(col => col.key === columnKey)?.visible ?? true;
  }, [columns]);

  const handleResetColumns = () => {
    setColumns(prev => 
      prev.map(col => ({ ...col, visible: true }))
    );
    toast({
      title: "Columns Reset",
      description: "All columns have been restored to default visibility"
    });
  };

  // Enhanced table columns for EnhancedTable component
  const enhancedTableColumns = React.useMemo(() => {
    const allColumns = [
      { key: 'id', label: 'ID', sortable: true, draggable: true, defaultVisible: true, visible: isColumnVisible('id'), hideable: true },
      { key: 'transaction_date', label: 'Transaction Date', sortable: true, draggable: true, defaultVisible: true, visible: isColumnVisible('transaction_date'), hideable: true },
      { key: 'transaction_id', label: 'Transaction Id', sortable: true, draggable: true, defaultVisible: true, visible: isColumnVisible('transaction_id'), hideable: true },
      { key: 'name', label: 'Name', sortable: true, draggable: true, defaultVisible: true, visible: isColumnVisible('name'), hideable: true },
      { key: 'site_name', label: 'Site', sortable: true, draggable: true, defaultVisible: true, visible: isColumnVisible('site_name'), hideable: true },
      { key: 'units_consumed', label: 'Units Consumed', sortable: true, draggable: true, defaultVisible: true, visible: isColumnVisible('units_consumed'), hideable: true },
      { key: 'tariff_rate', label: 'Tariff Rate', sortable: true, draggable: true, defaultVisible: true, visible: isColumnVisible('tariff_rate'), hideable: true },
      { key: 'sale_of_energy', label: 'Sale of Energy', sortable: true, draggable: true, defaultVisible: true, visible: isColumnVisible('sale_of_energy'), hideable: true },
      { key: 'tax_percentage', label: 'Tax Percentage', sortable: true, draggable: true, defaultVisible: true, visible: isColumnVisible('tax_percentage'), hideable: true },
      { key: 'tax_amount', label: 'Tax Amount', sortable: true, draggable: true, defaultVisible: true, visible: isColumnVisible('tax_amount'), hideable: true },
      { key: 'total_amount', label: 'Total Amount', sortable: true, draggable: true, defaultVisible: true, visible: isColumnVisible('total_amount'), hideable: true },
      { key: 'created_by_name', label: 'Created By', sortable: true, draggable: true, defaultVisible: true, visible: isColumnVisible('created_by_name'), hideable: true }
    ];
    
    // Filter to only show visible columns
    return allColumns.filter(col => col.visible);
  }, [isColumnVisible]);

  // Transform columns for the dropdown (simplified structure)
  const dropdownColumns = React.useMemo(() => 
    columns,
    [columns]
  );

  const renderCell = (item: EVConsumptionData, columnKey: string) => {
    switch (columnKey) {
      case 'id':
        return <span>{item.id}</span>;
      case 'transaction_date':
        return <span>{item.transaction_date}</span>;
      case 'transaction_id':
        return <span>{item.transaction_id || 'N/A'}</span>;
      case 'name':
        return <span>{item.name}</span>;
      case 'site_name':
        return <span>{item.site_name}</span>;
      case 'units_consumed':
        return <span>{item.units_consumed}</span>;
      case 'tariff_rate':
        return <span>₹{item.tariff_rate}</span>;
      case 'sale_of_energy':
        return <span>₹{item.sale_of_energy}</span>;
      case 'tax_percentage':
        return <span>{item.tax_percentage}%</span>;
      case 'tax_amount':
        return <span>₹{item.tax_amount}</span>;
      case 'total_amount':
        return <span>₹{item.total_amount}</span>;
      case 'created_by_name':
        return <span>{item.created_by_name}</span>;
      default: {
        // Fallback for any other columns
        const value = item[columnKey as keyof EVConsumptionData];
        return <span>{value !== null && value !== undefined ? String(value) : '-'}</span>;
      }
    }
  };

  // Fetch EV consumption data from API
  const fetchEVConsumptionData = useCallback(async (filters?: FilterData, search?: string, page: number = 1, size: number = 15) => {
    try {
      // Use different loading states based on whether it's a search operation
      const isSearch = search !== undefined && search.trim() !== '';
      if (isSearch) {
        setSearchLoading(true);
      } else {
        setIsLoading(true);
      }
      console.log('🚀 Fetching EV consumption data from API with filters:', filters, 'search:', search, 'Page:', page, 'Size:', size);
      
      const url = getFullUrl('/ev_consumptions.json');
      const urlWithParams = new URL(url);
      const options = getAuthenticatedFetchOptions();
      
      // Add access_token parameter if available
      if (API_CONFIG.TOKEN) {
        urlWithParams.searchParams.append('access_token', API_CONFIG.TOKEN);
      }
      
      // Add pagination parameters
      urlWithParams.searchParams.append('page', page.toString());
      urlWithParams.searchParams.append('per_page', size.toString());
      
      // Add search parameter for transaction_id if provided
      if (search && search.trim()) {
        urlWithParams.searchParams.append('q[transaction_id_cont]', search.trim());
        console.log('🔍 Adding search query for transaction_id:', search.trim());
      }
      
      // Add date range filter if provided
      if (filters?.dateRange) {
        if (typeof filters.dateRange === 'string') {
          // String format: DD/MM/YYYY - DD/MM/YYYY, convert to MM/DD/YYYY - MM/DD/YYYY
          const [fromDateStr, toDateStr] = filters.dateRange.split(' - ');
          if (fromDateStr && toDateStr) {
            const [fromDay, fromMonth, fromYear] = fromDateStr.trim().split('/');
            const [toDay, toMonth, toYear] = toDateStr.trim().split('/');
            const dateRangeQuery = `${fromMonth}/${fromDay}/${fromYear} - ${toMonth}/${toDay}/${toYear}`;
            urlWithParams.searchParams.append('q[date_range]', dateRangeQuery);
            console.log('📅 Adding date range filter:', dateRangeQuery);
          }
        } else if (filters.dateRange.from && filters.dateRange.to) {
          // DateRange object format
          const fromDate = format(filters.dateRange.from, 'MM/dd/yyyy');
          const toDate = format(filters.dateRange.to, 'MM/dd/yyyy');
          const dateRangeQuery = `${fromDate} - ${toDate}`;
          urlWithParams.searchParams.append('q[date_range]', dateRangeQuery);
          console.log('📅 Adding date range filter:', dateRangeQuery);
        } else if (filters.dateRange.from) {
          // Single date selected
          const singleDate = format(filters.dateRange.from, 'MM/dd/yyyy');
          urlWithParams.searchParams.append('q[date_range]', singleDate);
          console.log('📅 Adding single date filter:', singleDate);
        }
      }
      
      // Add transaction ID filter if provided
      if (filters?.transactionId) {
        urlWithParams.searchParams.append('q[transaction_id_eq]', filters.transactionId);
        console.log('🔍 Adding transaction ID filter:', filters.transactionId);
      }
      
      console.log('�📡 API URL with params:', urlWithParams.toString());
      console.log('🔑 Using token:', API_CONFIG.TOKEN ? 'Present' : 'Missing');
      
      const response = await fetch(urlWithParams.toString(), options);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('EV Consumption API Error Response:', errorText);
        throw new Error(`Failed to fetch EV consumption data: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ EV consumption data fetched successfully:', data);
      
      // Extract ev_consumptions array from the response
      if (data.ev_consumptions && Array.isArray(data.ev_consumptions)) {
        setEvConsumptionData(data.ev_consumptions);
        console.log('📊 Set EV consumption data:', data.ev_consumptions.length, 'records');
        
        // Extract pagination info from the response
        if (data.pagination) {
          setTotalRecords(data.pagination.total_entries);
          setTotalPages(data.pagination.total_pages);
          console.log('📄 Pagination info:', data.pagination);
        } else if (data.total_count !== undefined) {
          setTotalRecords(data.total_count);
          setTotalPages(Math.ceil(data.total_count / size));
        } else if (data.meta?.total !== undefined) {
          setTotalRecords(data.meta.total);
          setTotalPages(Math.ceil(data.meta.total / size));
        } else {
          // Fallback: use current page data length
          setTotalRecords(data.ev_consumptions.length);
          setTotalPages(1);
        }
      } else {
        console.warn('⚠️ No ev_consumptions array found in response');
        setEvConsumptionData([]);
        setTotalRecords(0);
        setTotalPages(1);
      }
      
    } catch (error) {
      console.error('❌ Error fetching EV consumption data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch EV consumption data",
        variant: "destructive"
      });
      setEvConsumptionData([]);
      setTotalRecords(0);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
      setSearchLoading(false);
    }
  }, [appliedFilters, toast]);

  // Fetch data on component mount and when page/pageSize changes
  useEffect(() => {
    fetchEVConsumptionData(appliedFilters, searchTerm, currentPage, pageSize);
  }, [currentPage, pageSize]);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1); // Reset to first page on search
      if (searchTerm) {
        fetchEVConsumptionData(appliedFilters, searchTerm, 1, pageSize);
      } else {
        fetchEVConsumptionData(appliedFilters, undefined, 1, pageSize);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filter handler functions
  const handleApplyFilters = (filters: FilterData) => {
    console.log('Applying filters:', filters);
    setAppliedFilters(filters);
    setCurrentPage(1); // Reset to first page when filters change
    fetchEVConsumptionData(filters, searchTerm, 1, pageSize);
  };

  const handleResetFilters = () => {
    console.log('Resetting filters');
    setAppliedFilters({});
    setCurrentPage(1); // Reset to first page when filters reset
    fetchEVConsumptionData({}, searchTerm, 1, pageSize);
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when page size changes
  };

  const handleExport = async () => {
    try {
      console.log('📤 Exporting EV consumption data with filters:', appliedFilters);
      
      const url = getFullUrl('/ev_consumptions.json');
      const urlWithParams = new URL(url);
      
      // Add export parameter if the API supports it
      urlWithParams.searchParams.append('export', 'true');
      
      // Add access_token parameter if available
      if (API_CONFIG.TOKEN) {
        urlWithParams.searchParams.append('access_token', API_CONFIG.TOKEN);
      }
      
      // Add current filters to export
      if (appliedFilters?.dateRange) {
        if (typeof appliedFilters.dateRange === 'string') {
          // String format: DD/MM/YYYY - DD/MM/YYYY, convert to MM/DD/YYYY - MM/DD/YYYY
          const [fromDateStr, toDateStr] = appliedFilters.dateRange.split(' - ');
          if (fromDateStr && toDateStr) {
            const [fromDay, fromMonth, fromYear] = fromDateStr.trim().split('/');
            const [toDay, toMonth, toYear] = toDateStr.trim().split('/');
            const dateRangeQuery = `${fromMonth}/${fromDay}/${fromYear} - ${toMonth}/${toDay}/${toYear}`;
            urlWithParams.searchParams.append('q[date_range]', dateRangeQuery);
            console.log('📅 Adding date range filter to export:', dateRangeQuery);
          }
        } else if (appliedFilters.dateRange.from && appliedFilters.dateRange.to) {
          // DateRange object format
          const fromDate = format(appliedFilters.dateRange.from, 'MM/dd/yyyy');
          const toDate = format(appliedFilters.dateRange.to, 'MM/dd/yyyy');
          const dateRangeQuery = `${fromDate} - ${toDate}`;
          urlWithParams.searchParams.append('q[date_range]', dateRangeQuery);
          console.log('📅 Adding date range filter to export:', dateRangeQuery);
        } else if (appliedFilters.dateRange.from) {
          // Single date
          const singleDate = format(appliedFilters.dateRange.from, 'MM/dd/yyyy');
          urlWithParams.searchParams.append('q[date_range]', singleDate);
          console.log('📅 Adding single date filter to export:', singleDate);
        }
      }
      
      // Add transaction ID filter to export if provided
      if (appliedFilters?.transactionId) {
        urlWithParams.searchParams.append('q[transaction_id_eq]', appliedFilters.transactionId);
        console.log('🔍 Adding transaction ID filter to export:', appliedFilters.transactionId);
      }
      
      const options = getAuthenticatedFetchOptions();
      const response = await fetch(urlWithParams.toString(), options);
      
      if (!response.ok) {
        throw new Error(`Export failed: ${response.status} ${response.statusText}`);
      }
      
      // Check if response is a file or JSON
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        // If it's JSON, convert to CSV or show success message
        toast({
          title: "Export Successful",
          description: "EV consumption data exported successfully"
        });
      } else {
        // If it's a file, download it
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        
        // Generate filename with timestamp and filter info
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const filterSuffix = appliedFilters?.dateRange ? '-filtered' : '';
        link.download = `ev-consumption-export${filterSuffix}-${timestamp}.xlsx`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
        
        toast({
          title: "Export Successful",
          description: "EV consumption data exported successfully"
        });
      }
      
    } catch (error) {
      console.error('❌ Export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export EV consumption data",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <h1 className="font-work-sans font-semibold text-base sm:text-2xl lg:text-[26px] leading-auto tracking-normal text-[#1a1a1a]">EV CONSUMPTION LIST</h1>
      </div>

      {/* Loading State */}
      {isLoading && !searchLoading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading EV consumption data...</span>
        </div>
      ) : (
        /* Enhanced EV Consumption Table */
        <div>
          <EnhancedTable
            data={evConsumptionData}
            columns={enhancedTableColumns}
            selectable={false}
            renderCell={renderCell}
            storageKey="utility-ev-consumption-table"
            // enableExport={true}
            handleExport={handleExport}
            exportFileName="ev-consumption-data"
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search by Transaction ID..."
            pagination={false}
            hideColumnsButton={false}
            onFilterClick={() => setIsFilterOpen(true)}
          />

          {/* Custom Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center mt-6 px-4 py-3 bg-white border-t border-gray-200 animate-fade-in">
              <div className="flex items-center space-x-1">
                {/* Previous Button */}
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1 || isLoading}
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
                        disabled={isLoading}
                        className="w-8 h-8 flex items-center justify-center text-sm text-gray-700 hover:bg-gray-100 rounded disabled:opacity-50"
                      >
                        1
                      </button>
                      {currentPage > 4 && (
                        <span className="px-2 text-gray-500">...</span>
                      )}
                    </>
                  )}

                  {/* Current page and surrounding pages */}
                  {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                    let pageNum;
                    if (currentPage <= 2) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 1) {
                      pageNum = totalPages - 2 + i;
                    } else {
                      pageNum = currentPage - 1 + i;
                    }

                    if (pageNum < 1 || pageNum > totalPages) return null;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        disabled={isLoading}
                        className={`w-8 h-8 flex items-center justify-center text-sm rounded disabled:opacity-50 ${
                          currentPage === pageNum
                            ? 'bg-[#C72030] text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  {/* Last page */}
                  {currentPage < totalPages - 2 && (
                    <>
                      {currentPage < totalPages - 3 && (
                        <span className="px-2 text-gray-500">...</span>
                      )}
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={isLoading}
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
                  disabled={currentPage === totalPages || isLoading}
                  className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filter Dialog */}
      <UtilityEVConsumptionFilterDialog 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
};

export default UtilityEVConsumptionDashboard;
