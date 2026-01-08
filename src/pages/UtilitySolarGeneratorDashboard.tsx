
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Filter, Download, Loader2 } from "lucide-react";
import { UtilitySolarGeneratorFilterDialog } from '../components/UtilitySolarGeneratorFilterDialog';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { solarGeneratorAPI, SolarGenerator, SolarGeneratorFilters, SolarGeneratorResponse } from '@/services/solarGeneratorAPI';
import { useToast } from "@/hooks/use-toast";
import { ColumnVisibilityDropdown } from '@/components/ColumnVisibilityDropdown';

const UtilitySolarGeneratorDashboard = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [solarGeneratorData, setSolarGeneratorData] = useState<SolarGenerator[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [filters, setFilters] = useState<SolarGeneratorFilters>({});
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  // Column visibility state
  const [columns, setColumns] = useState([
    { key: 'id', label: 'ID', visible: true },
    { key: 'transaction_date', label: 'Date', visible: true },
    { key: 'unit_consumed', label: 'Total Units', visible: true },
    { key: 'plant_day_generation', label: 'Plant Day Generation', visible: true },
    { key: 'tower_name', label: 'Tower', visible: true }
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

  const isColumnVisible = useCallback((columnKey: string) => {
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
      { key: 'transaction_date', label: 'Date', sortable: true, draggable: true, defaultVisible: true, visible: isColumnVisible('transaction_date'), hideable: true },
      { key: 'unit_consumed', label: 'Total Units', sortable: true, draggable: true, defaultVisible: true, visible: isColumnVisible('unit_consumed'), hideable: true },
      { key: 'plant_day_generation', label: 'Plant Day Generation', sortable: true, draggable: true, defaultVisible: true, visible: isColumnVisible('plant_day_generation'), hideable: true },
      { key: 'tower_name', label: 'Tower', sortable: true, draggable: true, defaultVisible: true, visible: isColumnVisible('tower_name'), hideable: true }
    ];
    
    // Filter to only show visible columns
    return allColumns.filter(col => col.visible);
  }, [isColumnVisible]);

  // Transform columns for the dropdown (simplified structure)
  const dropdownColumns = React.useMemo(() => 
    columns,
    [columns]
  );

  // Fetch solar generator data
  const fetchSolarGenerators = useCallback(async (appliedFilters?: SolarGeneratorFilters, search?: string, page: number = 1, size: number = 15) => {
    try {
      // Use different loading states based on whether it's a search operation
      const isSearch = search !== undefined && search.trim() !== '';
      if (isSearch) {
        setSearchLoading(true);
      } else {
        setLoading(true);
      }
      console.log('🚀 Fetching solar generator data from API with filters:', appliedFilters, 'search:', search, 'Page:', page, 'Size:', size);
      
      const filtersWithSearch = {
        ...(appliedFilters || filters),
        tower_name: search || undefined,
        page: page,
        per_page: size
      };
      
      const response: SolarGeneratorResponse = await solarGeneratorAPI.getSolarGenerators(filtersWithSearch);
      console.log('✅ Solar generator data fetched successfully:', response);
      
      // Extract solar_generators array from the response
      const solarGenerators = response.solar_generators || [];
      setSolarGeneratorData(solarGenerators);
      console.log('📊 Set solar generator data:', solarGenerators.length, 'records');
      
      // Extract pagination info from the response
      if (response.pagination) {
        setTotalRecords(response.pagination.total_entries);
        setTotalPages(response.pagination.total_pages);
        console.log('📄 Pagination info:', response.pagination);
      } else {
        // Fallback if pagination is not available
        setTotalRecords(solarGenerators.length);
        setTotalPages(1);
      }
      
    } catch (error) {
      console.error('❌ Error fetching solar generators:', error);
      toast({
        title: "Error",
        description: "Failed to fetch solar generator data",
        variant: "destructive"
      });
      setSolarGeneratorData([]);
      setTotalRecords(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  }, [filters, toast]);

  // Fetch data on component mount and when page/pageSize changes
  useEffect(() => {
    fetchSolarGenerators(filters, searchTerm, currentPage, pageSize);
  }, [currentPage, pageSize]);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1); // Reset to first page on search
      if (searchTerm) {
        fetchSolarGenerators(filters, searchTerm, 1, pageSize);
      } else {
        fetchSolarGenerators(filters, undefined, 1, pageSize);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filter handler functions
  const handleApplyFilters = (appliedFilters: SolarGeneratorFilters) => {
    console.log('Applying filters:', appliedFilters);
    setFilters(appliedFilters);
    setCurrentPage(1); // Reset to first page when filters change
    fetchSolarGenerators(appliedFilters, searchTerm, 1, pageSize);
  };

  const handleResetFilters = () => {
    console.log('Resetting filters');
    setFilters({});
    setCurrentPage(1); // Reset to first page when filters reset
    fetchSolarGenerators({}, searchTerm, 1, pageSize);
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when page size changes
  };

  // Handle export
  const handleExport = async () => {
    try {
      console.log('📤 Exporting solar generator data with filters:', filters);
      
      await solarGeneratorAPI.downloadSolarGenerators(filters);
      
      toast({
        title: "Export Successful",
        description: "Solar generator data exported successfully"
      });
      
    } catch (error) {
      console.error('❌ Export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export solar generator data",
        variant: "destructive"
      });
    }
  };

  const renderCell = (item: SolarGenerator, columnKey: string) => {
    switch (columnKey) {
      case 'id':
        return <span>{item.id}</span>;
      case 'transaction_date': {
        if (!item.transaction_date) return <span>-</span>;
        // Convert date to DD/MM/YYYY format
        const date = new Date(item.transaction_date);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return <span>{`${day}/${month}/${year}`}</span>;
      }
      case 'unit_consumed':
        return <span>{item.unit_consumed?.toLocaleString() || '-'}</span>;
      case 'plant_day_generation':
        return <span>{item.plant_day_generation?.toLocaleString() || '-'}</span>;
      case 'tower_name':
        return <span>{item.tower_name}</span>;
      default: {
        // Fallback for any other columns
        const value = item[columnKey as keyof SolarGenerator];
        return <span>{value !== null && value !== undefined ? String(value) : '-'}</span>;
      }
    }
  };



  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <h1 className="font-work-sans font-semibold text-base sm:text-2xl lg:text-[26px] leading-auto tracking-normal text-[#1a1a1a]">
          SOLAR GENERATORS LIST
        </h1>
      </div>

      {/* Loading State */}
      {loading && !searchLoading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading solar generator data...</span>
        </div>
      ) : (
        /* Enhanced Solar Generator Table */
        <div>
          <EnhancedTable
            data={solarGeneratorData}
            columns={enhancedTableColumns}
            selectable={false}
            renderCell={renderCell}
            storageKey="utility-solar-generator-table"
            handleExport={handleExport}
            exportFileName="solar-generator-data"
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search solar generator records..."
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
                  disabled={currentPage === 1 || loading}
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
                        disabled={loading}
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
                        disabled={loading}
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
                        disabled={loading}
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
                  disabled={currentPage === totalPages || loading}
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
      <UtilitySolarGeneratorFilterDialog 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
};

export default UtilitySolarGeneratorDashboard;
