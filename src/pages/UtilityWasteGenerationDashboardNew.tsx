import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Plus, Eye, Edit, Trash2, Loader2 } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { WasteGenerationFilterDialog } from '../components/WasteGenerationFilterDialog';
import { WasteGenerationBulkDialog } from '../components/WasteGenerationBulkDialog';
import { EnhancedTable } from '../components/enhanced-table/EnhancedTable';
import { fetchWasteGenerations, WasteGeneration } from '../services/wasteGenerationAPI';

const UtilityWasteGenerationDashboard = () => {
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // API state management
  const [wasteGenerations, setWasteGenerations] = useState<WasteGeneration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  // Load waste generations data
  useEffect(() => {
    const loadWasteGenerations = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Loading waste generations, page:', currentPage);
        const response = await fetchWasteGenerations(currentPage);
        
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

    loadWasteGenerations();
  }, [currentPage]);

  const handleAdd = () => navigate('/maintenance/waste/generation/add');
  const handleImport = () => setIsImportOpen(true);
  const handleUpdate = () => setIsUpdateOpen(true);
  const handleFilters = () => setIsFilterOpen(true);
  const handleView = (id: number) => console.log('View waste generation record:', id);
  const handleEdit = (id: number) => console.log('Edit waste generation record:', id);
  const handleDelete = (id: number) => console.log('Delete waste generation record:', id);

  const columns = [
    // { key: 'actions', label: 'Actions', sortable: false, draggable: false },
    // { key: 'id', label: 'ID', sortable: true, draggable: true },
    { key: 'location_details', label: 'Location', sortable: true, draggable: true },
    { key: 'vendor', label: 'Vendor', sortable: true, draggable: true },
    { key: 'commodity', label: 'Commodity/Source', sortable: true, draggable: true },
    { key: 'category', label: 'Category', sortable: true, draggable: true },
    { key: 'operational_landlord', label: 'Operational Name', sortable: true, draggable: true },
    { key: 'waste_unit', label: 'Generated', sortable: true, draggable: true },
    { key: 'recycled_unit', label: 'Recycled', sortable: true, draggable: true },
    { key: 'agency_name', label: 'Agency', sortable: true, draggable: true },
    { key: 'wg_date', label: 'Waste Date', sortable: true, draggable: true },
    { key: 'created_by', label: 'Created By', sortable: true, draggable: true },
    { key: 'created_at', label: 'Created On', sortable: true, draggable: true }
  ];

  const renderCell = (item: WasteGeneration, columnKey: string) => {
    if (columnKey === 'actions') {
      return (
        <div className="flex space-x-1">
          <Button variant="ghost" size="sm" onClick={() => handleView(item.id)} className="h-8 w-8 p-0">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleEdit(item.id)} className="h-8 w-8 p-0">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)} className="h-8 w-8 p-0 text-red-600 hover:text-red-800">
            <Trash2 className="h-4 w-4" />
          </Button>
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
        return item.wg_date || 'N/A';
      case 'created_at':
        return item.created_at ? new Date(item.created_at).toLocaleString() : 'N/A';
      default:
        return (item as any)[columnKey] || 'N/A';
    }
  };
  
  // Filter data based on search term
  const filteredData = wasteGenerations.filter(item => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      item.location_details?.toLowerCase().includes(searchTermLower) ||
      item.vendor?.company_name?.toLowerCase().includes(searchTermLower) ||
      item.commodity?.category_name?.toLowerCase().includes(searchTermLower) ||
      item.category?.category_name?.toLowerCase().includes(searchTermLower) ||
      item.agency_name?.toLowerCase().includes(searchTermLower)
    );
  });

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="flex flex-col items-center space-y-2">
          <Loader2 className="h-8 w-8 animate-spin text-[#C72030]" />
          <p className="text-sm text-muted-foreground">Loading waste generation data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="flex flex-col items-center space-y-2 text-center">
          <p className="text-sm text-red-600">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
            className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 space-y-4 p-4 sm:p-5 md:p-3 pt-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight ml-3">Waste Generation List</h2>
            {totalCount > 0 && (
              <p className="text-muted-foreground text-sm sm:text-base ml-3">
                Total: {totalCount} records
              </p>
            )}
          </div>
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
            searchPlaceholder="Search by location, vendor, etc..."
            onFilterClick={handleFilters}
            leftActions={
              <div className="flex flex-wrap items-center gap-2">
                <Button onClick={handleAdd} style={{ backgroundColor: '#C72030' }} className="hover:bg-[#A01B26] text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Add
                </Button>
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
        </CardContent>
      </div>

      {/* Dialogs */}
      <WasteGenerationFilterDialog isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
      <WasteGenerationBulkDialog isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} type="import" />
      <WasteGenerationBulkDialog isOpen={isUpdateOpen} onClose={() => setIsUpdateOpen(false)} type="update" />
    </>
  );
};

export default UtilityWasteGenerationDashboard;
