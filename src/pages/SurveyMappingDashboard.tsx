import React, { useState, useEffect, useCallback } from 'react';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Plus, Filter, Edit, Copy, Eye, Share2, ChevronDown, Loader2, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EnhancedTable } from '../components/enhanced-table/EnhancedTable';
import { useToast } from "@/hooks/use-toast";
import { apiClient } from '@/utils/apiClient';
import { Switch } from "@/components/ui/switch";
import { ColumnVisibilityDropdown } from '@/components/ColumnVisibilityDropdown';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Individual mapping item from the API
interface SurveyMappingItem {
  id: number;
  survey_id: number;
  created_by_id: number;
  site_id: number;
  building_id: number;
  wing_id: number | null;
  floor_id: number | null;
  area_id: number | null;
  room_id: number | null;
  qr_code: {
    id: number;
    document_file_name: string;
    document_content_type: string;
    document_file_size: number;
    document_updated_at: string;
    relation: string;
    relation_id: number;
    active: boolean | null;
    created_at: string;
    updated_at: string;
    changed_by: string | null;
    added_from: string | null;
    comments: string | null;
  };
  active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
  survey_title: string;
  site_name: string;
  building_name: string;
  wing_name: string | null;
  floor_name: string | null;
  area_name: string | null;
  room_name: string | null;
  qr_code_url: string;
}

// Survey group from the API
interface SurveyGroup {
  id: number;
  name: string;
  check_type: string;
  active: number;
  no_of_associations: number;
  questions_count: number;
  mappings: SurveyMappingItem[];
}

// API Response structure
interface SurveyMappingApiResponse {
  survey_mappings: SurveyGroup[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
  };
}

// Flattened mapping for display in table (combines survey info with mapping)
interface SurveyMapping extends SurveyMappingItem {
  // Add survey-level fields for easy access
  survey_name: string;
  survey_check_type: string;
  survey_questions_count: number;
  survey_no_of_associations: number;
  survey_active: number;
}

export const SurveyMappingDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  
  const [mappings, setMappings] = useState<SurveyMapping[]>([]);
  const [allMappingsData, setAllMappingsData] = useState<SurveyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [perPage] = useState(10);

  // Column visibility state - using the same structure as parking page
  const [columns, setColumns] = useState([
    { key: 'actions', label: 'Actions', visible: true },
    { key: 'survey_title', label: 'Survey Title', visible: true },
    { key: 'building_name', label: 'Building', visible: true },
    { key: 'wing_name', label: 'Wing', visible: true },
    { key: 'floor_name', label: 'Floor', visible: true },
    { key: 'room_name', label: 'Room', visible: true },
    // { key: 'check_type', label: 'Check Type', visible: true },
    { key: 'questions_count', label: 'Questions', visible: true },
    { key: 'associations_count', label: 'Associations', visible: true },
    { key: 'ticket_category', label: 'Ticket Category', visible: true },
    { key: 'assigned_to', label: 'Assigned To', visible: true },
    { key: 'created_by', label: 'Created By', visible: true },
    { key: 'status', label: 'Status', visible: true },
    { key: 'created_at', label: 'Created On', visible: true },
    { key: 'qr_code', label: 'QR Code', visible: true }
  ]);

  // Initial load
  useEffect(() => {
    const fetchSurveyMappingsData = async (page: number) => {
      try {
        setLoading(true);
        
        // Use the new mappings_list endpoint with pagination
        const response = await apiClient.get(`/survey_mappings/mappings_list.json?per_page=${perPage}&page=${page}`);
        console.log('Survey mapping API response:', response.data);
        
        const responseData: SurveyMappingApiResponse = response.data;
        
        // Flatten the nested survey mappings into individual rows for the table
        // But group by survey to avoid duplicates - show one row per survey
        const flattenedMappings: SurveyMapping[] = [];
        
        if (responseData.survey_mappings && responseData.survey_mappings.length > 0) {
          responseData.survey_mappings.forEach((surveyGroup: SurveyGroup) => {
            if (surveyGroup.mappings && surveyGroup.mappings.length > 0) {
              // Take the first mapping as the representative for the survey
              const firstMapping = surveyGroup.mappings[0];
              
              // Create a representative mapping that combines survey info with first mapping info
              const representativeMapping: SurveyMapping = {
                ...firstMapping,
                // Add survey-level fields for easy access
                survey_name: surveyGroup.name,
                survey_check_type: surveyGroup.check_type,
                survey_questions_count: surveyGroup.questions_count,
                survey_no_of_associations: surveyGroup.no_of_associations,
                survey_active: surveyGroup.active,
              };
              flattenedMappings.push(representativeMapping);
            }
          });
        }
        
        console.log('Flattened mappings:', flattenedMappings);
        setMappings(flattenedMappings);
        setAllMappingsData(responseData.survey_mappings);
        
        // Update pagination state
        if (responseData.pagination) {
          setCurrentPage(responseData.pagination.current_page);
          setTotalPages(responseData.pagination.total_pages);
          setTotalCount(responseData.pagination.total_count);
        }
        
      } catch (error: unknown) {
        console.error('Error fetching survey mappings:', error);
        toast({
          title: "Error",
          description: "Failed to fetch survey mappings",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSurveyMappingsData(1);
  }, [perPage, toast]);

  const handleStatusToggle = (item: SurveyMapping) => {
    setMappings(prev => prev.map(mapping => 
      mapping.id === item.id 
        ? { ...mapping, active: !mapping.active }
        : mapping
    ));
    toast({
      title: "Status Updated",
      description: `Survey mapping status ${item.active ? 'deactivated' : 'activated'}`
    });
  };

  // Column visibility handlers - matching parking page implementation
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

  const handleQRClick = (mapping: SurveyMapping) => {
    if (mapping.qr_code_url) {
      window.open(mapping.qr_code_url, '_blank');
    }
  };

  const handleViewClick = (item: SurveyMapping) => {
    console.log('View clicked for item:', item.id);
    navigate(`/maintenance/survey/mapping/details/${item.id}`);
  };

  const handleEditClick = (item: SurveyMapping) => {
    console.log('Edit clicked for item:', item.id, 'survey_id:', item.survey_id);
    // Navigate to edit page with survey_id since EditSurveyMapping expects survey_id
    navigate(`/maintenance/survey/mapping/edit/${item.survey_id}`);
  };

  const handleAddMapping = () => {
    navigate('/maintenance/survey/mapping/add');
  };

  const handleExport = async () => {
    try {
      const response = await apiClient.get('/survey_mappings/mappings_list.xlsx', {
        params: {
          export: true
        },
        responseType: 'blob'
      });

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Set filename with current date
      const currentDate = new Date().toISOString().split('T')[0];
      link.setAttribute('download', `survey-mappings-${currentDate}.xlsx`);
      
      // Append to html link element page
      document.body.appendChild(link);
      
      // Start download
      link.click();
      
      // Clean up and remove the link
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: "Survey mappings exported successfully",
      });
    } catch (error: unknown) {
      console.error('Error exporting survey mappings:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export survey mappings",
        variant: "destructive"
      });
    }
  };

  // Handle page change for server-side pagination
  const handlePageChange = async (page: number) => {
    try {
      setLoading(true);
      
      // Use the new mappings_list endpoint with pagination
      const response = await apiClient.get(`/survey_mappings/mappings_list.json?per_page=${perPage}&page=${page}`);
      console.log('Survey mapping API response:', response.data);
      
      const responseData: SurveyMappingApiResponse = response.data;
      
      // Flatten the nested survey mappings into individual rows for the table
      // But group by survey to avoid duplicates - show one row per survey
      const flattenedMappings: SurveyMapping[] = [];
      
      if (responseData.survey_mappings && responseData.survey_mappings.length > 0) {
        responseData.survey_mappings.forEach((surveyGroup: SurveyGroup) => {
          if (surveyGroup.mappings && surveyGroup.mappings.length > 0) {
            // Take the first mapping as the representative for the survey
            const firstMapping = surveyGroup.mappings[0];
            
            // Create a representative mapping that combines survey info with first mapping info
            const representativeMapping: SurveyMapping = {
              ...firstMapping,
              // Add survey-level fields for easy access
              survey_name: surveyGroup.name,
              survey_check_type: surveyGroup.check_type,
              survey_questions_count: surveyGroup.questions_count,
              survey_no_of_associations: surveyGroup.no_of_associations,
              survey_active: surveyGroup.active,
            };
            flattenedMappings.push(representativeMapping);
          }
        });
      }
      
      console.log('Flattened mappings:', flattenedMappings);
      setMappings(flattenedMappings);
      setAllMappingsData(responseData.survey_mappings);
      
      // Update pagination state
      if (responseData.pagination) {
        setCurrentPage(responseData.pagination.current_page);
        setTotalPages(responseData.pagination.total_pages);
        setTotalCount(responseData.pagination.total_count);
      }
      
    } catch (error: unknown) {
      console.error('Error fetching survey mappings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch survey mappings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Enhanced table columns for EnhancedTable component
  const enhancedTableColumns = React.useMemo(() => {
    const allColumns = [
      { key: 'actions', label: 'Actions', sortable: false, draggable: false, defaultVisible: true, visible: isColumnVisible('actions'), hideable: false },
      { key: 'survey_title', label: 'Survey Title', sortable: true, draggable: true, defaultVisible: true, visible: isColumnVisible('survey_title'), hideable: true },
      { key: 'building_name', label: 'Building', sortable: true, draggable: true, defaultVisible: true, visible: isColumnVisible('building_name'), hideable: true },
      { key: 'wing_name', label: 'Wing', sortable: true, draggable: true, defaultVisible: true, visible: isColumnVisible('wing_name'), hideable: true },
      { key: 'floor_name', label: 'Floor', sortable: true, draggable: true, defaultVisible: true, visible: isColumnVisible('floor_name'), hideable: true },
      { key: 'room_name', label: 'Room', sortable: true, draggable: true, defaultVisible: true, visible: isColumnVisible('room_name'), hideable: true },
      // { key: 'check_type', label: 'Check Type', sortable: true, draggable: true, defaultVisible: true, visible: isColumnVisible('check_type'), hideable: true },
      { key: 'questions_count', label: 'Questions', sortable: true, draggable: true, defaultVisible: true, visible: isColumnVisible('questions_count'), hideable: true },
      { key: 'associations_count', label: 'Associations', sortable: true, draggable: true, defaultVisible: true, visible: isColumnVisible('associations_count'), hideable: true },
      { key: 'ticket_category', label: 'Ticket Category', sortable: true, draggable: true, defaultVisible: true, visible: isColumnVisible('ticket_category'), hideable: true },
      { key: 'assigned_to', label: 'Assigned To', sortable: true, draggable: true, defaultVisible: true, visible: isColumnVisible('assigned_to'), hideable: true },
      { key: 'created_by', label: 'Created By', sortable: true, draggable: true, defaultVisible: true, visible: isColumnVisible('created_by'), hideable: true },
      { key: 'status', label: 'Status', sortable: true, draggable: true, defaultVisible: true, visible: isColumnVisible('status'), hideable: true },
      { key: 'created_at', label: 'Created On', sortable: true, draggable: true, defaultVisible: true, visible: isColumnVisible('created_at'), hideable: true },
      { key: 'qr_code', label: 'QR Code', sortable: false, draggable: true, defaultVisible: true, visible: isColumnVisible('qr_code'), hideable: true }
    ];
    
    // Filter to only show visible columns
    return allColumns.filter(col => col.visible);
  }, [isColumnVisible]);

  // Transform columns for the dropdown (only hideable columns with simplified structure)
  const dropdownColumns = React.useMemo(() => 
    columns.filter(col => col.key !== 'actions'), // Exclude actions column from dropdown
    [columns]
  );

  const renderCell = (item: SurveyMapping, columnKey: string) => {
    switch (columnKey) {
      case 'actions':
        return (
          <div className="flex justify-center items-center gap-2">
            <button 
              onClick={() => handleViewClick(item)}
              className="p-1 text-blue-600 hover:text-blue-800"
              title="View"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button 
              onClick={() => handleEditClick(item)}
              className="p-1 text-green-600 hover:text-green-800"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </button>
          </div>
        );
      case 'survey_title':
        return <span className="font-medium">{item.survey_title || item.survey_name}</span>;
      case 'site_name':
        return <span>{item.site_name}</span>;
      case 'building_name': {
        // Get all buildings for this survey from the complete data
        const surveyData = allMappingsData.find(s => s.id === item.survey_id);
        const allBuildings = surveyData ? [...new Set(surveyData.mappings.map(m => m.building_name).filter(Boolean))] : [item.building_name];
        
        if (allBuildings.length <= 1) {
          return <span>{item.building_name}</span>;
        }
        
        return (
          <div className="relative group">
            <span className="cursor-pointer">
              {item.building_name}
              {allBuildings.length > 1 && <span className="text-blue-600 ml-1">...</span>}
            </span>
            <div className="absolute z-10 invisible group-hover:visible bg-black text-white text-xs rounded py-2 px-3 left-0 top-full mt-1 min-w-max max-w-xs shadow-lg">
              <div className="font-semibold mb-1">All Buildings ({allBuildings.length}):</div>
              {allBuildings.map((building, index) => (
                <div key={index} className="py-0.5">{building}</div>
              ))}
            </div>
          </div>
        );
      }
      case 'wing_name': {
        // Get all wings for this survey from the complete data
        const surveyData = allMappingsData.find(s => s.id === item.survey_id);
        const allWings = surveyData ? [...new Set(surveyData.mappings.map(m => m.wing_name).filter(Boolean))] : [item.wing_name].filter(Boolean);
        
        if (allWings.length <= 1) {
          return <span>{item.wing_name || '-'}</span>;
        }
        
        return (
          <div className="relative group">
            <span className="cursor-pointer">
              {item.wing_name || '-'}
              {allWings.length > 1 && <span className="text-blue-600 ml-1">...</span>}
            </span>
            <div className="absolute z-10 invisible group-hover:visible bg-black text-white text-xs rounded py-2 px-3 left-0 top-full mt-1 min-w-max max-w-xs shadow-lg">
              <div className="font-semibold mb-1">All Wings ({allWings.length}):</div>
              {allWings.map((wing, index) => (
                <div key={index} className="py-0.5">{wing}</div>
              ))}
            </div>
          </div>
        );
      }
      case 'floor_name': {
        // Get all floors for this survey from the complete data
        const surveyData = allMappingsData.find(s => s.id === item.survey_id);
        const allFloors = surveyData ? [...new Set(surveyData.mappings.map(m => m.floor_name).filter(Boolean))] : [item.floor_name].filter(Boolean);
        
        if (allFloors.length <= 1) {
          return <span>{item.floor_name || '-'}</span>;
        }
        
        return (
          <div className="relative group">
            <span className="cursor-pointer">
              {item.floor_name || '-'}
              {allFloors.length > 1 && <span className="text-blue-600 ml-1">...</span>}
            </span>
            <div className="absolute z-10 invisible group-hover:visible bg-black text-white text-xs rounded py-2 px-3 left-0 top-full mt-1 min-w-max max-w-xs shadow-lg">
              <div className="font-semibold mb-1">All Floors ({allFloors.length}):</div>
              {allFloors.map((floor, index) => (
                <div key={index} className="py-0.5">{floor}</div>
              ))}
            </div>
          </div>
        );
      }
      case 'room_name': {
        // Get all rooms for this survey from the complete data
        const surveyData = allMappingsData.find(s => s.id === item.survey_id);
        const allRooms = surveyData ? [...new Set(surveyData.mappings.map(m => m.room_name).filter(Boolean))] : [item.room_name].filter(Boolean);
        
        if (allRooms.length <= 1) {
          return <span>{item.room_name || '-'}</span>;
        }
        
        return (
          <div className="relative group">
            <span className="cursor-pointer">
              {item.room_name || '-'}
              {allRooms.length > 1 && <span className="text-blue-600 ml-1">...</span>}
            </span>
            <div className="absolute z-10 invisible group-hover:visible bg-black text-white text-xs rounded py-2 px-3 left-0 top-full mt-1 min-w-max max-w-xs shadow-lg">
              <div className="font-semibold mb-1">All Rooms ({allRooms.length}):</div>
              {allRooms.map((room, index) => (
                <div key={index} className="py-0.5">{room}</div>
              ))}
            </div>
          </div>
        );
      }
      case 'check_type':
        return <span className="capitalize">{item.survey_check_type || '-'}</span>;
      case 'questions_count':
        return <div className="text-center">{item.survey_questions_count || 0}</div>;
      case 'associations_count':
        return (
          <div className="text-center">
            {item.survey_no_of_associations || 0}
          </div>
        );
      case 'ticket_category':
        return (
          <span>-</span> // This info is not available in the new API structure
        );
      case 'assigned_to':
        return (
          <span>-</span> // This info is not available in the new API structure
        );
      case 'created_by':
        return <span>{item.created_by}</span>;
      case 'status':
        return (
          <div className="flex items-center justify-center">
            <button
              onClick={() => handleStatusToggle(item)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                item.active ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                item.active ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        );
      case 'created_at':
        return item.created_at ? new Date(item.created_at).toLocaleDateString() : '-';
      case 'qr_code':
        return (
          <div className="flex justify-center">
            {item.qr_code_url ? (
              <button 
                onClick={() => handleQRClick(item)}
                className="p-1 text-blue-600 hover:text-blue-800"
                title="View QR Code"
              >
                <img 
                  src={item.qr_code_url} 
                  alt="QR Code" 
                  className="w-8 h-8 object-contain cursor-pointer hover:opacity-80"
                />
              </button>
            ) : (
              <span>-</span>
            )}
          </div>
        );
      default: {
        // Fallback for any other columns
        const value = item[columnKey as keyof SurveyMapping];
        return <span>{value !== null && value !== undefined ? String(value) : '-'}</span>;
      }
    }
  };


  // Filter mappings based on search term
  const filteredMappings = mappings.filter(mapping =>
    mapping.survey_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mapping.survey_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mapping.site_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mapping.building_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (mapping.wing_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (mapping.area_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (mapping.floor_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (mapping.room_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    mapping.created_by?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Debug logs
  console.log('Filtered mappings:', filteredMappings);
  console.log('Columns state:', columns);
  console.log('Enhanced table columns:', enhancedTableColumns);
  console.log('Dropdown columns:', dropdownColumns);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <Heading level="h1" variant="default">Survey Mapping</Heading>
        </div>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading survey mappings...</span>
        </div>
      ) : (
        /* Enhanced Survey Mapping Table */
        <div>
          <EnhancedTable
            data={filteredMappings}
            columns={enhancedTableColumns}
            selectable={false}
            renderCell={renderCell}
            storageKey="survey-mapping-table"
            enableExport={true}
            handleExport={handleExport}
            exportFileName="survey-mapping-data"
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search survey mappings..."
            pagination={false} // Disable client-side pagination since we're doing server-side
            pageSize={perPage}
            hideColumnsButton={true}
            leftActions={
              <div className="flex flex-wrap items-center gap-2 md:gap-4">
                <Button 
                  onClick={handleAddMapping}
                  className="flex items-center gap-2 bg-[#F2EEE9] text-[#BF213E] border-0 hover:bg-[#F2EEE9]/80"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </Button>
              </div>
            }
            rightActions={
              <div className="flex items-center gap-2">
                <ColumnVisibilityDropdown
                  columns={dropdownColumns}
                  onColumnToggle={handleColumnToggle}
                />
              </div>
            }
          />
          
          {/* Server-side Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => {
                        if (currentPage > 1) handlePageChange(currentPage - 1);
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  {Array.from(
                    { length: Math.min(totalPages, 10) },
                    (_, i) => i + 1
                  ).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  {totalPages > 10 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => {
                        if (currentPage < totalPages) handlePageChange(currentPage + 1);
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
              <div className="text-center mt-2 text-sm text-gray-600">
                Showing page {currentPage} of {totalPages} ({totalCount} total survey mappings)
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
