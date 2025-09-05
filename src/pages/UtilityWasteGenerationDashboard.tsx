import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Download, Upload, Eye, Edit, Trash2, Loader2, X } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { WasteGenerationFilterDialog } from '../components/WasteGenerationFilterDialog';
import { WasteGenerationBulkDialog } from '../components/WasteGenerationBulkDialog';
import { EnhancedTable } from '../components/enhanced-table/EnhancedTable';
import { fetchWasteGenerations, WasteGeneration, WasteGenerationFilters } from '../services/wasteGenerationAPI';

const UtilityWasteGenerationDashboard = () => {
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
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

  const handleAdd = () => navigate('/maintenance/waste/generation/add');
  const handleImport = () => setIsImportOpen(true);
  const handleUpdate = () => setIsUpdateOpen(true);
  const handleFilters = () => setIsFilterOpen(true);
  const handleView = (id: number) => navigate(`/maintenance/waste/generation/${id}`);
  const handleEdit = (id: number) => console.log('Edit waste generation record:', id);
  const handleDelete = (id: number) => console.log('Delete waste generation record:', id);

  // Filter handlers
  const handleApplyFilters = (filters: WasteGenerationFilters) => {
    console.log('Applying filters in dashboard:', filters);
    setActiveFilters(filters);
    setCurrentPage(1); // Reset to first page when applying filters
  };

  const handleExportFiltered = (filters: WasteGenerationFilters) => {
    console.log('Exporting with filters:', filters);
    // Implement export logic here
    // You can use the same API endpoint with filters to get the data for export
  };

  const handleClearFilters = () => {
    setActiveFilters({});
    setCurrentPage(1);
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
            renderCell={renderCell}
            storageKey="waste-generation-table"
            enableExport={true}
            exportFileName="waste-generation-data"
            pagination={true}
            pageSize={10}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search by location, vendor, commodity, etc..."
            onFilterClick={handleFilters}
            emptyMessage={
              hasActiveFilters 
                ? `No waste generation records found with the current filters${getActiveFiltersDescription()}. Try adjusting your filter criteria or click 'Clear' to view all records.`
                : "No waste generation data available. Click 'Add' to create a new record."
            }
            leftActions={
              <div className="flex flex-wrap items-center gap-2">
                <Button onClick={handleAdd} style={{ backgroundColor: '#C72030' }} className="hover:bg-[#A01B26] text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Add
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
                {/* <Button onClick={handleImport} variant="outline" style={{ borderColor: '#C72030', color: '#C72030' }} className="hover:bg-[#C72030] hover:text-white">
                  <Download className="mr-2 h-4 w-4" />
                  Import
                </Button>
                <Button onClick={handleUpdate} variant="outline" style={{ borderColor: '#C72030', color: '#C72030' }} className="hover:bg-[#C72030] hover:text-white">
                  <Upload className="mr-2 h-4 w-4" />
                  Update
                </Button> */}
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
