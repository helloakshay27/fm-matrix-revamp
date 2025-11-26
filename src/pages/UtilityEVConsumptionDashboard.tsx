
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
}

const UtilityEVConsumptionDashboard = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [evConsumptionData, setEvConsumptionData] = useState<EVConsumptionData[]>([]);
  const [appliedFilters, setAppliedFilters] = useState<FilterData>({});
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

  // Filter data based on search term
  const filteredData = evConsumptionData.filter(item =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.site_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.created_by_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fetch EV consumption data from API
  const fetchEVConsumptionData = useCallback(async (filters?: FilterData) => {
    try {
      setIsLoading(true);
      console.log('🚀 Fetching EV consumption data from API with filters:', filters);
      
      const url = getFullUrl('/ev_consumptions.json');
      const urlWithParams = new URL(url);
      const options = getAuthenticatedFetchOptions();
      
      // Add access_token parameter if available
      if (API_CONFIG.TOKEN) {
        urlWithParams.searchParams.append('access_token', API_CONFIG.TOKEN);
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
      
      if (data.ev_consumptions && Array.isArray(data.ev_consumptions)) {
        setEvConsumptionData(data.ev_consumptions);
        console.log('📊 Set EV consumption data:', data.ev_consumptions.length, 'records');
      } else {
        console.warn('⚠️ No ev_consumptions array found in response');
        setEvConsumptionData([]);
      }
      
    } catch (error) {
      console.error('❌ Error fetching EV consumption data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch EV consumption data",
        variant: "destructive"
      });
      setEvConsumptionData([]);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Fetch data on component mount
  useEffect(() => {
    fetchEVConsumptionData();
  }, [fetchEVConsumptionData]);

  // Filter handler functions
  const handleApplyFilters = (filters: FilterData) => {
    console.log('Applying filters:', filters);
    setAppliedFilters(filters);
    fetchEVConsumptionData(filters);
  };

  const handleResetFilters = () => {
    console.log('Resetting filters');
    setAppliedFilters({});
    fetchEVConsumptionData({});
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
      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading EV consumption data...</span>
        </div>
      ) : (
        /* Enhanced EV Consumption Table */
        <div>
          <EnhancedTable
            data={filteredData}
            columns={enhancedTableColumns}
            selectable={false}
            renderCell={renderCell}
            storageKey="utility-ev-consumption-table"
            // enableExport={true}
            handleExport={handleExport}
            exportFileName="ev-consumption-data"
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search EV consumption records..."
            pagination={true}
            pageSize={10}
            hideColumnsButton={true}
            leftActions={
              <div className="flex flex-wrap items-center gap-2 md:gap-4">
                {/* Left actions can be used for other buttons if needed */}
              </div>
            }
            rightActions={
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
                  onClick={() => setIsFilterOpen(true)}
                >
                  <Filter className="w-4 h-4" />
                </Button>
                <ColumnVisibilityDropdown
                  columns={dropdownColumns}
                  onColumnToggle={handleColumnToggle}
                />
              </div>
            }
          />
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
