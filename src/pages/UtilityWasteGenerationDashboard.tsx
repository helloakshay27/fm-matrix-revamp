import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Download, Upload, Eye, Edit, Trash2, Loader2, X } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { WasteGenerationFilterDialog } from '../components/WasteGenerationFilterDialog';
import { WasteGenerationBulkDialog } from '../components/WasteGenerationBulkDialog';
import { EnhancedTable } from '../components/enhanced-table/EnhancedTable';
import { fetchWasteGenerations, WasteGeneration, WasteGenerationFilters } from '../services/wasteGenerationAPI';
import { useLayout } from '@/contexts/LayoutContext';
import { getFullUrl, getAuthHeader } from '@/config/apiConfig';
import { toast } from 'sonner';

const UtilityWasteGenerationDashboard = () => {
  const navigate = useNavigate();
  const { isSidebarCollapsed } = useLayout();
  const panelRef = useRef<HTMLDivElement>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showActionPanel, setShowActionPanel] = useState(false);
  
  // Selection state
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  // Filter state
  const [activeFilters, setActiveFilters] = useState<WasteGenerationFilters>({});
  
  // Check if any filters are active
  const hasActiveFilters = Object.values(activeFilters).some(value => 
    value !== undefined && value !== null && value !== '' && 
    (Array.isArray(value) ? value.length > 0 : true)
  );

  // Get a readable description of active filters
  const getActiveFiltersDescription = () => {
    const activeFiltersList = [];
    if (activeFilters.commodity_id_eq) activeFiltersList.push(`Commodity ID: ${activeFilters.commodity_id_eq}`);
    if (activeFilters.category_id_eq) activeFiltersList.push(`Category ID: ${activeFilters.category_id_eq}`);
    if (activeFilters.operational_landlord_id_in) activeFiltersList.push(`Landlord ID: ${activeFilters.operational_landlord_id_in}`);
    if (activeFilters.date_range) activeFiltersList.push(`Date Range: ${activeFilters.date_range}`);
    return activeFiltersList.length > 0 ? ` (${activeFiltersList.join(', ')})` : '';
  };
  
  // API state management
  const [wasteGenerations, setWasteGenerations] = useState<WasteGeneration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  // Load waste generations data
  const loadWasteGenerations = async (page: number = 1, filters?: WasteGenerationFilters) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Loading waste generations, page:', page, 'filters:', filters);
      const response = await fetchWasteGenerations(page, filters);
      
      console.log('Waste generations loaded:', response);
      setWasteGenerations(response.waste_generations || []);
      setTotalPages(response.pagination?.total_pages || 0);
      setTotalCount(response.pagination?.total_count || 0);
      
    } catch (err) {
      console.error('Error loading waste generations:', err);
      setError('Failed to load waste generation data. Please try again.');
      setWasteGenerations([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWasteGenerations(currentPage, activeFilters);
  }, [currentPage, activeFilters]);

  const handleAdd = () => {
    navigate('/maintenance/waste/generation/add');
    setShowActionPanel(false);
  };

  const handleImport = () => {
    setIsImportOpen(true);
    setShowActionPanel(false);
  };

  const handleUpdate = () => {
    setIsUpdateOpen(true);
  };

  const handleFilters = () => {
    setIsFilterOpen(true);
  };

  const handleActionClick = () => {
    setShowActionPanel(!showActionPanel);
  };

  const handleClearSelection = () => {
    setShowActionPanel(false);
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setShowActionPanel(false);
      }
    };
    
    if (showActionPanel) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showActionPanel]);

  const handleView = (id: number) => navigate(`/maintenance/waste/generation/${id}`);
  const handleEdit = (id: number) => console.log('Edit waste generation record:', id);
  const handleDelete = (id: number) => console.log('Delete waste generation record:', id);

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = filteredData.map(item => item.id.toString());
      setSelectedItems(allIds);
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

  const getItemId = (item: WasteGeneration) => item.id.toString();

  // Filter handlers
  const handleApplyFilters = (filters: WasteGenerationFilters) => {
    console.log('Applying filters in dashboard:', filters);
    setActiveFilters(filters);
    setCurrentPage(1); // Reset to first page when applying filters
  };

  const handleExportFiltered = async (filters: WasteGenerationFilters) => {
    try {
      console.log('Exporting with filters:', filters);
      
      // Build query parameters from filters
      const queryParams = new URLSearchParams();
      queryParams.append('format', 'xlsx');
      
      if (filters.commodity_id_eq) {
        queryParams.append('q[commodity_id_eq]', filters.commodity_id_eq.toString());
      }
      if (filters.category_id_eq) {
        queryParams.append('q[category_id_eq]', filters.category_id_eq.toString());
      }
      if (filters.operational_landlord_id_in) {
        queryParams.append('q[operational_landlord_id_in]', filters.operational_landlord_id_in.toString());
      }
      if (filters.date_range) {
        queryParams.append('q[date_range]', `"${filters.date_range}"`);
      }

      const exportUrl = getFullUrl(`/pms/waste_generations?${queryParams.toString()}`);
      
      const response = await fetch(exportUrl, {
        method: 'GET',
        headers: {
          'Authorization': getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`);
      }

      // Get the blob data
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      link.download = `waste-generation-export-${timestamp}.xlsx`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Export completed successfully!');
      
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data. Please try again.');
    }
  };

  const handleClearFilters = () => {
    setActiveFilters({});
    setCurrentPage(1);
  };

  // Custom export handler for waste generation data
  const handleTableExport = async () => {
    try {
      console.log('Exporting waste generation data with current filters:', activeFilters);
      
      // Build query parameters from active filters
      const queryParams = new URLSearchParams();
      queryParams.append('format', 'xlsx');
      
      if (activeFilters.commodity_id_eq) {
        queryParams.append('q[commodity_id_eq]', activeFilters.commodity_id_eq.toString());
      }
      if (activeFilters.category_id_eq) {
        queryParams.append('q[category_id_eq]', activeFilters.category_id_eq.toString());
      }
      if (activeFilters.operational_landlord_id_in) {
        queryParams.append('q[operational_landlord_id_in]', activeFilters.operational_landlord_id_in.toString());
      }
      if (activeFilters.date_range) {
        queryParams.append('q[date_range]', `"${activeFilters.date_range}"`);
      }

      const exportUrl = getFullUrl(`/pms/waste_generations?${queryParams.toString()}`);
      
      const response = await fetch(exportUrl, {
        method: 'GET',
        headers: {
          'Authorization': getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`);
      }

      // Get the blob data
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      link.download = `waste-generation-export-${timestamp}.xlsx`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Waste generation data exported successfully!');
      
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export waste generation data. Please try again.');
    }
  };

  const columns = [
    { key: 'actions', label: 'Actions', sortable: false, draggable: false },
    // { key: 'id', label: 'ID', sortable: true, draggable: true },
    { key: 'location_details', label: 'Location', sortable: true, draggable: true },
    { key: 'vendor', label: 'Vendor', sortable: true, draggable: true },
    { key: 'commodity', label: 'Commodity/Source', sortable: true, draggable: true },
    { key: 'category', label: 'Category', sortable: true, draggable: true },
    { key: 'operational_landlord', label: 'Operational Name of Landlord/ Tenant', sortable: true, draggable: true },
    { key: 'uom', label: 'UoM', sortable: true, draggable: true },
    { key: 'waste_unit', label: 'Generated Unit', sortable: true, draggable: true },
    { key: 'recycled_unit', label: 'Recycled Unit', sortable: true, draggable: true },
    { key: 'agency_name', label: 'Agency Name', sortable: true, draggable: true },
    { key: 'wg_date', label: 'Waste Date', sortable: true, draggable: true },
    { key: 'created_by', label: 'Created By', sortable: true, draggable: true },
    { key: 'created_at', label: 'Created On', sortable: true, draggable: true }
  ];

  const renderCell = (item: WasteGeneration, columnKey: string) => {
    if (columnKey === 'actions') {
      return (
        <div className="flex justify-center space-x-1">
          <Button variant="ghost" size="sm" onClick={() => handleView(item.id)} className="h-8 w-8 p-0">
            <Eye className="h-4 w-4" />
          </Button>
          {/* <Button variant="ghost" size="sm" onClick={() => handleEdit(item.id)} className="h-8 w-8 p-0">
            <Edit className="h-4 w-4" />
          </Button> */}
          {/* <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)} className="h-8 w-8 p-0 text-red-600 hover:text-red-800">
            <Trash2 className="h-4 w-4" />
          </Button> */}
        </div>
      );
    }
    
    // Handle nested object fields based on API structure
    switch (columnKey) {
      case 'vendor':
        return item.vendor?.company_name || 'N/A';
      case 'commodity':
        return item.commodity?.category_name || 'N/A';
      case 'category':
        return item.category?.category_name || 'N/A';
      case 'operational_landlord':
        return item.operational_landlord?.category_name || 'N/A';
      case 'created_by':
        return item.created_by?.full_name || 'N/A';
      case 'wg_date':
        return item.wg_date ? new Date(item.wg_date).toLocaleDateString() : 'N/A';
      case 'created_at':
        return item.created_at ? new Date(item.created_at).toLocaleString() : 'N/A';
      case 'uom':
        // Since API doesn't provide UoM, we'll use a default value
        // You can modify this logic based on your business requirements
        return 'KG';
      case 'waste_unit':
        return item.waste_unit ? item.waste_unit.toString() : '0';
      case 'recycled_unit':
        return item.recycled_unit ? item.recycled_unit.toString() : '0';
      default: {
        // Handle direct properties from WasteGeneration interface
        const value = item[columnKey as keyof WasteGeneration];
        return value !== undefined && value !== null ? String(value) : 'N/A';
      }
    }
  };
  
  // Filter data based on search term
  const filteredData = wasteGenerations.filter(item => {
    if (!searchTerm) return true;
    
    const searchTermLower = searchTerm.toLowerCase();
    return (
      item.location_details?.toLowerCase().includes(searchTermLower) ||
      item.vendor?.company_name?.toLowerCase().includes(searchTermLower) ||
      item.commodity?.category_name?.toLowerCase().includes(searchTermLower) ||
      item.category?.category_name?.toLowerCase().includes(searchTermLower) ||
      item.operational_landlord?.category_name?.toLowerCase().includes(searchTermLower) ||
      item.agency_name?.toLowerCase().includes(searchTermLower)
    );
  });

  // Debug logging for empty states
  console.log('Dashboard Debug:', {
    hasData: filteredData.length > 0,
    dataLength: filteredData.length,
    hasActiveFilters,
    activeFilters,
    isLoading,
    error
  });

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 sm:p-5 md:p-3 pt-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          {/* <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight ml-3">Waste Generation List</h2>
          </div> */}
        </div>
        
        <CardContent className="p-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading waste generation data...</p>
            </div>
          </div>
        </CardContent>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 space-y-4 p-4 sm:p-5 md:p-3 pt-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          {/* <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight ml-3">Waste Generation List</h2>
          </div> */}
        </div>
        
        <CardContent className="p-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              {hasActiveFilters && (
                <p className="text-gray-600 mb-4 text-sm">
                  Active filters{getActiveFiltersDescription()} may be causing this issue.
                </p>
              )}
              <div className="space-x-2">
                <Button onClick={() => setCurrentPage(1)} variant="outline">
                  Retry
                </Button>
                {hasActiveFilters && (
                  <Button onClick={handleClearFilters} variant="outline">
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 space-y-4 p-4 sm:p-5 md:p-3 pt-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          {/* <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight ml-3">Waste Generation List</h2>
            <p className="text-muted-foreground text-sm sm:text-base ml-3">
              {totalCount > 0 && `Total: ${totalCount} records`}
            </p>
          </div> */}
        </div>

        {/* Main Card */}
        <CardContent className="p-4">
          <EnhancedTable
            data={filteredData}
            columns={columns}
            // selectable={true}
            selectedItems={selectedItems}
            onSelectAll={handleSelectAll}
            onSelectItem={handleSelectItem}
            getItemId={getItemId}
            renderCell={renderCell}
            storageKey="waste-generation-table"
            enableExport={true}
            exportFileName="waste-generation-data"
            handleExport={handleTableExport}
            pagination={true}
            pageSize={10}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search by location, vendor, commodity, etc..."
            onFilterClick={handleFilters}
            emptyMessage={
              hasActiveFilters 
                ? `No waste generation records found with the current filters${getActiveFiltersDescription()}. Try adjusting your filter criteria or click 'Clear' to view all records.`
                : "No waste generation data available. Click 'Action' to create a new record."
            }
            leftActions={
              <div className="flex flex-wrap items-center gap-2">
                <Button 
                  className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-4 py-2 rounded-none border-none shadow-none" 
                  onClick={handleActionClick}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Action
                </Button>
                {hasActiveFilters && (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Filters Applied
                    </Badge>
                    <Button 
                      onClick={handleClearFilters} 
                      variant="outline" 
                      size="sm"
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <X className="mr-1 h-3 w-3" />
                      Clear
                    </Button>
                  </div>
                )}
              </div>
            }
          />
          
          {/* API Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1 || isLoading}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages || isLoading}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </div>

      {/* Action Panel */}
      {showActionPanel && (
        <div
          className={`fixed z-50 flex items-end justify-center pb-8 sm:pb-[16rem] pointer-events-none transition-all duration-300 ${
            isSidebarCollapsed ? 'left-16' : 'left-64'
          } right-0 bottom-0`}
        >
          {/* Main panel + right bar container */}
          <div className="flex max-w-full pointer-events-auto bg-white border border-gray-200 rounded-lg shadow-lg mx-4 overflow-hidden">
            {/* Right vertical bar */}
            <div className="hidden sm:flex w-8 bg-[#C4B89D54] items-center justify-center text-red-600 font-semibold text-sm">
            </div>

            {/* Main content */}
            <div ref={panelRef} className="p-4 sm:p-6 w-full sm:w-auto">
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-6 sm:gap-12">
                {/* Add Waste Generation */}
                <button
                  onClick={handleAdd}
                  className="flex flex-col items-center justify-center cursor-pointer text-[#374151] hover:text-black w-16 sm:w-auto"
                >
                  <Plus className="w-6 h-6 mb-1" />
                  <span className="text-sm font-medium text-center">Add</span>
                </button>

                {/* Import */}
                <button
                  onClick={handleImport}
                  className="flex flex-col items-center justify-center cursor-pointer text-[#374151] hover:text-black w-16 sm:w-auto"
                >
                  <Upload className="w-6 h-6 mb-1" />
                  <span className="text-sm font-medium text-center">Import</span>
                </button>

                {/* Vertical divider */}
                <div className="w-px h-8 bg-black opacity-20 mx-2 sm:mx-4" />

                {/* Close icon */}
                <div
                  onClick={handleClearSelection}
                  className="flex flex-col items-center justify-center cursor-pointer text-gray-400 hover:text-gray-600 w-16 sm:w-auto"
                >
                  <X className="w-6 h-6 mb-1" />
                  <span className="text-sm font-medium text-center">Close</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dialogs */}
      <WasteGenerationFilterDialog 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={handleApplyFilters}
        onExport={handleExportFiltered}
      />
      <WasteGenerationBulkDialog isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} type="import" />
      <WasteGenerationBulkDialog isOpen={isUpdateOpen} onClose={() => setIsUpdateOpen(false)} type="update" />
    </>
  );
};

export default UtilityWasteGenerationDashboard;
