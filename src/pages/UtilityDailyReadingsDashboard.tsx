import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Download, Upload, Filter, Edit, RefreshCw, X } from 'lucide-react';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { toast } from '@/hooks/use-toast';
import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';
import { BulkUploadDialog } from '@/components/BulkUploadDialog';

// Interface definitions for API response
interface CustomerName {
  name: string | null;
  id: number | null;
}

interface Customer {
  id: number;
  name: string;
}

interface Measurement {
  id: number;
  asset_name: string;
  parameter_name: string;
  opening: number;
  reading: number | null;
  consumption: number | null;
  total_consumption: number | null;
  customer_name: CustomerName;
}

interface DailyReadingItem {
  id: string;
  assetName: string;
  parameterName: string;
  opening: string;
  reading: string;
  consumption: string;
  totalConsumption: string;
  customerName: string;
  date: string;
}

// Filter interface
interface FilterData {
  asset: string;
  dateRange: string; // Changed back to string for q[date_range] parameter
  customerName: string;
  parameterName: string;
}

// Transform API response to match the table structure
const transformMeasurement = (measurement: Measurement): DailyReadingItem => {
  return {
    id: measurement.id.toString(),
    assetName: measurement.asset_name.trim(),
    parameterName: measurement.parameter_name,
    opening: measurement.opening?.toString() || '0.0',
    reading: measurement.reading?.toString() || '',
    consumption: measurement.consumption?.toString() || '',
    totalConsumption: measurement.total_consumption?.toString() || '',
    customerName: measurement.customer_name?.name || '',
    date: new Date().toISOString().split('T')[0] // Use current date since API doesn't provide date
  };
};

// Column configuration for enhanced table
const columns: ColumnConfig[] = [
  { key: 'actions', label: 'Actions', sortable: false, defaultVisible: true },
  { key: 'id', label: 'ID', sortable: true, defaultVisible: true },
  { key: 'assetName', label: 'Asset Name', sortable: true, defaultVisible: true },
  { key: 'parameterName', label: 'Parameter Name', sortable: true, defaultVisible: true },
  { key: 'opening', label: 'Opening', sortable: true, defaultVisible: true },
  { key: 'reading', label: 'Reading', sortable: true, defaultVisible: true },
  { key: 'consumption', label: 'Consumption', sortable: true, defaultVisible: true },
  { key: 'totalConsumption', label: 'Total Consumption', sortable: true, defaultVisible: true },
  { key: 'customerName', label: 'Customer Name', sortable: true, defaultVisible: true },
  { key: 'date', label: 'Date', sortable: true, defaultVisible: true },
];

export default function UtilityDailyReadingsDashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // API state management
  const [dailyReadingsData, setDailyReadingsData] = useState<DailyReadingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [perPage, setPerPage] = useState(20);

  // Customer data state
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customersLoading, setCustomersLoading] = useState(false);

  // Bulk upload state
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);

  // Filter modal state
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterData>({
    asset: '',
    dateRange: '',
    customerName: '',
    parameterName: ''
  });

  // Filter form state
  const [filterFormData, setFilterFormData] = useState<FilterData>({
    asset: '',
    dateRange: '',
    customerName: '',
    parameterName: ''
  });

  // API fetch function
  const fetchMeasurements = useCallback(async (page: number = currentPage, filters?: any) => {
    try {
      setLoading(true);
      setError(null);

      // Build URL with pagination parameters
      const url = new URL(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MEASUREMENTS}`);
      url.searchParams.append('page', page.toString());
      url.searchParams.append('per_page', perPage.toString());

      // Add filters if provided
      if (filters) {
        Object.keys(filters).forEach(key => {
          if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
            url.searchParams.append(key, filters[key]);
          }
        });
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched measurements data:', data);

      // Extract pagination data from API response
      const paginationData = {
        totalCount: data.total_count || 0,
        currentPage: data.current_page || 1,
        totalPages: data.total_pages || 1,
        perPage: data.per_page || 20,
        nextPage: data.next_page,
        previousPage: data.previous_page
      };

      // Update pagination state
      setCurrentPage(paginationData.currentPage);
      setTotalPages(paginationData.totalPages);
      setTotalCount(paginationData.totalCount);
      setPerPage(paginationData.perPage);

      // Support both array and object API responses
      const measurementsArray = Array.isArray(data.measurements)
        ? data.measurements
        : [];

      const transformedData = measurementsArray.map(transformMeasurement);
      setDailyReadingsData(transformedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching measurements';
      setError(errorMessage);
      console.error('Failed to fetch measurements:', err);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, perPage]);

  // Fetch customers function
  const fetchCustomers = useCallback(async () => {
    try {
      setCustomersLoading(true);

      // Build URL with the parameter q[pms_asset_entity_id_in][]
      // Using placeholder endpoint - replace with actual customer endpoint
      const url = new URL(`${API_CONFIG.BASE_URL}/customers`);
      // Add the parameter - you can modify this based on actual API endpoint
      // url.searchParams.append('q[pms_asset_entity_id_in][]', 'value');

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched customers data:', data);

      // Support both array and object API responses
      const customersArray = Array.isArray(data)
        ? data
        : Array.isArray(data.customers)
          ? data.customers
          : [];

      setCustomers(customersArray);
    } catch (err) {
      console.error('Failed to fetch customers:', err);
      // Don't show error toast for customers as it's not critical
    } finally {
      setCustomersLoading(false);
    }
  }, []);

  // Fetch data on component mount
  useEffect(() => {
    fetchMeasurements(1);
    // Temporarily disabled until actual API endpoints are provided
    // fetchCustomers();
    // fetchParameters();
  }, []); // Remove fetchMeasurements dependency to avoid infinite loops

  // Handle page changes separately
  useEffect(() => {
    if (currentPage >= 1) {
      const searchFilters = {
        ...activeFilters,
        ...(searchTerm && { 'q[asset_name_or_parameter_name_cont]': searchTerm })
      };
      fetchMeasurements(currentPage, searchFilters);
    }
  }, [currentPage, activeFilters, searchTerm]);

  // For server-side pagination, we use the data as-is from the API
  // Filtering is handled on the server side
  const filteredData = dailyReadingsData;

  // Handle search with server-side filtering
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching

    // Build search filters
    const searchFilters = {
      ...activeFilters,
      // Add search term to the filters (adjust parameter name according to your API)
      'q[asset_name_or_parameter_name_cont]': term
    };

    fetchMeasurements(1, searchFilters);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(filteredData.map(item => item.id));
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

  const handleEdit = (item: any) => {
    navigate(`/utility/daily-readings/edit/${item.id}`);
  };

  const handleRefresh = async () => {
    try {
      await fetchMeasurements(currentPage, activeFilters);
      toast({
        title: "Success",
        description: "Data refreshed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh data",
        variant: "destructive",
      });
    }
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // fetchMeasurements will be called by useEffect when currentPage changes
  };

  const handleExport = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ASSET_MEASUREMENT_EXPORT}`, {
        method: 'GET',
        headers: {
          'Authorization': getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get the blob from the response
      const blob = await response.blob();

      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary anchor element and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = 'asset_measurement_list.xlsx'; // Set the filename
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "File exported successfully",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while exporting';
      console.error('Export failed:', error);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleImport = () => {
    setIsBulkUploadOpen(true);
  };

  const handleImportComplete = (file: File) => {
    // Refresh the data after successful import
    fetchMeasurements(1); // Reset to first page after import
    setCurrentPage(1);
    toast({
      title: "Success",
      description: "Data imported successfully",
    });
  };

  const handleFilterApply = (filters: FilterData) => {
    setActiveFilters(filters);
    setCurrentPage(1); // Reset to first page when applying filters
    setShowFilterModal(false);

    // Fetch data with new filters
    fetchMeasurements(1, filters);

    toast({
      title: "Filters Applied",
      description: "Data filtered successfully",
    });
  };

  const handleFilterOpen = () => {
    setFilterFormData(activeFilters);
    setShowFilterModal(true);
  };

  const handleFilterReset = () => {
    const resetFilters = {
      asset: '',
      dateRange: '',
      customerName: '',
      parameterName: ''
    };
    setFilterFormData(resetFilters);
  };

  const handleFilterChange = (key: keyof FilterData, value: string | Date | undefined) => {
    setFilterFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case 'actions':
        return (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(item)}
              className="h-8 w-8 p-0"
            >
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        );
      case 'id':
        return <span className="font-mono text-sm">{item.id}</span>;
      case 'assetName':
        return <span className="font-medium">{item.assetName}</span>;
      case 'parameterName':
        return item.parameterName || '-';
      case 'opening':
        return item.opening || '-';
      case 'reading':
        return <span className="font-medium">{item.reading || '-'}</span>;
      case 'consumption':
        return <span className="font-medium">{item.consumption || '-'}</span>;
      case 'totalConsumption':
        return item.totalConsumption || '-';
      case 'customerName':
        return item.customerName || '-';
      case 'date':
        return item.date || '-';
      default:
        return item[columnKey] || '-';
    }
  };
  const leftActions = (
    <Button
      onClick={handleImport}
      className="bg-[#C72030] text-white hover:bg-[#A01B29] transition-colors duration-200 rounded-none px-4 py-2 h-9 text-sm font-medium flex items-center gap-2 border-0"
    >
      <Upload className="w-4 h-4" />
      Import
    </Button>

  )

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600">
        Utility &gt; Daily Readings
      </div>

      {/* Page Title */}
      <h1 className="font-work-sans font-semibold text-base sm:text-2xl lg:text-[26px] leading-auto tracking-normal text-gray-900">DAILY READINGS</h1>

      {/* Action Buttons */}


      {/* Search */}
      {/* <div className="flex justify-between items-center">
        <div></div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search readings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64 h-10 bg-white border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] text-sm"
            />
          </div>
          <Button 
            className="bg-[#C72030] text-white hover:bg-[#A01B29] transition-colors duration-200 rounded-none px-6 py-2 h-10 text-sm font-medium border-0"
          >
            Go!
          </Button>
        </div>
      </div> */}

      {/* Enhanced Data Table */}
      <div>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-6 h-6 animate-spin mr-2" />
            <span>Loading daily readings...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={handleRefresh} variant="outline">
              Try Again
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <EnhancedTable
              data={filteredData}
              columns={columns}
              renderCell={renderCell}
              // onSelectAll={handleSelectAll}
              // onSelectItem={handleSelectItem}
              // selectedItems={selectedItems}
              searchTerm={searchTerm}
              onSearchChange={handleSearch}
              enableSearch={true}
              handleExport={handleExport}
              onFilterClick={handleFilterOpen}
              enableExport={true}
              hideColumnsButton={false}
              pagination={false} // Disable built-in pagination
              emptyMessage="No daily readings found"
              // selectable={true}
              storageKey="daily-readings-table"
              leftActions={leftActions}
            />

            {/* Custom Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {Math.min((currentPage - 1) * perPage + 1, totalCount)} to{' '}
                  {Math.min(currentPage * perPage, totalCount)} of {totalCount} entries
                </div>

                <Pagination>
                  <PaginationContent>
                    {/* Previous Button */}
                    <PaginationItem>
                      <PaginationPrevious
                        className={`cursor-pointer ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''}`}
                        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                      />
                    </PaginationItem>

                    {/* First Page */}
                    {currentPage > 3 && (
                      <>
                        <PaginationItem>
                          <PaginationLink
                            className="cursor-pointer"
                            onClick={() => handlePageChange(1)}
                            isActive={currentPage === 1}
                          >
                            1
                          </PaginationLink>
                        </PaginationItem>
                        {currentPage > 4 && (
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                        )}
                      </>
                    )}

                    {/* Page Numbers around current page */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNumber = Math.max(1, currentPage - 2) + i;
                      if (pageNumber > totalPages) return null;

                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            className="cursor-pointer"
                            onClick={() => handlePageChange(pageNumber)}
                            isActive={currentPage === pageNumber}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }).filter(Boolean)}

                    {/* Last Page */}
                    {currentPage < totalPages - 2 && (
                      <>
                        {currentPage < totalPages - 3 && (
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                        )}
                        <PaginationItem>
                          <PaginationLink
                            className="cursor-pointer"
                            onClick={() => handlePageChange(totalPages)}
                            isActive={currentPage === totalPages}
                          >
                            {totalPages}
                          </PaginationLink>
                        </PaginationItem>
                      </>
                    )}

                    {/* Next Button */}
                    <PaginationItem>
                      <PaginationNext
                        className={`cursor-pointer ${currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}`}
                        onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filter Modal */}
      <Dialog open={showFilterModal} onOpenChange={setShowFilterModal}>
        <DialogContent className="max-w-2xl bg-white [&>button]:hidden">
          <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
            <DialogTitle className="text-lg font-semibold">FILTER BY</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowFilterModal(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          <DialogDescription className="sr-only">
            Filter the daily readings data by asset, date range, customer name, and parameter name.
          </DialogDescription>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Asset */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Asset
                </label>
                <Select
                  value={filterFormData.asset}
                  onValueChange={(value) => handleFilterChange('asset', value)}
                >
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Select Asset" className="text-gray-400" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asset1">Asset 1</SelectItem>
                    <SelectItem value="asset2">Asset 2</SelectItem>
                    <SelectItem value="asset3">Asset 3</SelectItem>
                    <SelectItem value="asset4">Asset 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Date Range <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  name="q[date_range]"
                  value={filterFormData.dateRange}
                  onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                  placeholder="Select Date Range"
                  className="border-gray-300"
                />
              </div>

              {/* Customer Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Customer Name
                </label>
                <Select
                  value={filterFormData.customerName}
                  onValueChange={(value) => handleFilterChange('customerName', value)}
                  disabled={customersLoading}
                >
                  <SelectTrigger className="border-gray-300">
                    <SelectValue
                      placeholder={customersLoading ? "Loading customers..." : "Select Customer Name"}
                      className="text-gray-400"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id.toString()}>
                        {customer.name}
                      </SelectItem>
                    ))}
                    {customers.length === 0 && !customersLoading && (
                      <SelectItem value="api-pending" disabled>
                        API will provide customer data
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Parameter Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Parameter Name
                </label>
                <Input
                  type="text"
                  name="q[pms_asset_measure_name_cont]"
                  value={filterFormData.parameterName}
                  onChange={(e) => handleFilterChange('parameterName', e.target.value)}
                  placeholder="Enter Parameter Name"
                  className="border-gray-300"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                onClick={handleFilterReset}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-2"
              >
                Reset
              </Button>
              <Button
                onClick={() => handleFilterApply(filterFormData)}
                style={{ backgroundColor: '#C72030' }}
                className="hover:bg-[#C72030]/90 text-white px-8 py-2"
              >
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Upload Dialog */}
      <BulkUploadDialog
        open={isBulkUploadOpen}
        onOpenChange={setIsBulkUploadOpen}
        title="Bulk Upload"
        uploadType="upload"
        context="measurements"
        onImport={handleImportComplete}
      />

      {/* Results Count removed as EnhancedTable handles this */}
    </div>
  );
}
