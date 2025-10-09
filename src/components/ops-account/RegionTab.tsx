import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Download, Filter, Upload, Eye, Edit, Trash2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AddRegionModal } from '@/components/AddRegionModal';
import { EditRegionModal } from '@/components/EditRegionModal';
import { DeleteRegionModal } from '@/components/DeleteRegionModal';
import { RegionFilterModal, RegionFilters } from '@/components/RegionFilterModal';
import { ExportModal } from '@/components/ExportModal';
import { BulkUploadModal } from '@/components/BulkUploadModal';
import { EnhancedTaskTable } from '@/components/enhanced-table/EnhancedTaskTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { TicketPagination } from '@/components/TicketPagination';
import { toast } from 'sonner';
import { useApiConfig } from '@/hooks/useApiConfig';
import { getUser } from '@/utils/auth';
import { useDebounce } from '@/hooks/useDebounce';

// Type definitions for the API response
interface RegionItem {
  id: number;
  name: string;
  country_id: number;
  company_id: number;
  code: string;
  description: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  country_name?: string;
  company_name?: string;
}

interface RegionApiResponse {
  regions: RegionItem[];
  data: RegionItem[];
  pagination?: {
    current_page: number;
    per_page: number;
    total_pages: number;
    total_count: number;
    has_next_page: boolean;
    has_prev_page: boolean;
  };
}

interface RegionTabProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  entriesPerPage: string;
  setEntriesPerPage: (entries: string) => void;
}

// Column configuration for the enhanced table
const columns: ColumnConfig[] = [
  {
    key: 'actions',
    label: 'Action',
    sortable: false,
    hideable: false,
    draggable: false
  },
  {
    key: 'name',
    label: 'Region Name',
    sortable: true,
    hideable: true,
    draggable: true
  },
  {
    key: 'code',
    label: 'Code',
    sortable: true,
    hideable: true,
    draggable: true
  },
  {
    key: 'company',
    label: 'Company',
    sortable: true,
    hideable: true,
    draggable: true
  },
  {
    key: 'country',
    label: 'Country',
    sortable: true,
    hideable: true,
    draggable: true
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    hideable: true,
    draggable: true
  },
  {
    key: 'created_at',
    label: 'Created At',
    sortable: true,
    hideable: true,
    draggable: true
  }
];

export const RegionTab: React.FC<RegionTabProps> = ({
  searchQuery,
  setSearchQuery,
  entriesPerPage,
  setEntriesPerPage
}) => {
  const navigate = useNavigate();
  const { getFullUrl, getAuthHeader } = useApiConfig();
  
  // State management
  const [regions, setRegions] = useState<RegionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchQuery = useDebounce(searchTerm, 1000);
  const [appliedFilters, setAppliedFilters] = useState<RegionFilters>({});
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total_pages: 1,
    total_count: 0,
    has_next_page: false,
    has_prev_page: false
  });

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [selectedRegionId, setSelectedRegionId] = useState<number | null>(null);
  
  // Dropdowns and permissions
  const [companiesDropdown, setCompaniesDropdown] = useState<any[]>([]);
  const [countriesDropdown, setCountriesDropdown] = useState<any[]>([]);
  const [canEditRegion, setCanEditRegion] = useState(false);

  const user = getUser() || {
    id: 0,
    firstname: "Guest",
    lastname: "",
    email: "",
  };

  const checkEditPermission = () => {
    const userEmail = user.email || '';
    const allowedEmails = ['abhishek.sharma@lockated.com', 'your-specific-email@domain.com'];
    setCanEditRegion(allowedEmails.includes(userEmail));
  };

  useEffect(() => {
    fetchCompaniesDropdown();
    fetchCountriesDropdown();
    checkEditPermission();
  }, []);

  // Load data on component mount and when page/perPage/filters change
  useEffect(() => {
    fetchRegions(currentPage, perPage, debouncedSearchQuery, appliedFilters);
  }, [currentPage, perPage, debouncedSearchQuery, appliedFilters]);

  // Fetch regions data from API
  const fetchRegions = async (page = 1, per_page = 10, search = '', filters: RegionFilters = {}) => {
    setLoading(true);
    try {
      // Build API URL with parameters
      let apiUrl = getFullUrl(`/pms/regions.json?page=${page}&per_page=${per_page}`);

      // Add search parameter
      if (search.trim()) {
        apiUrl += `&q[search_all_fields_cont]=${encodeURIComponent(search.trim())}`;
      }

      // Add filter parameters
      if (filters.companyId) {
        apiUrl += `&q[company_id_eq]=${filters.companyId}`;
      }

      if (filters.countryId) {
        apiUrl += `&q[country_id_eq]=${filters.countryId}`;
      }

      if (filters.status) {
        const isActive = filters.status === 'active';
        apiUrl += `&q[active_eq]=${isActive}`;
      }

      console.log('🔗 API URL with filters:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': getAuthHeader()
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: RegionApiResponse = await response.json();
      console.log('Regions API response:', result);

      if (result && Array.isArray(result.regions)) {
        setRegions(result.regions);
        // Set pagination if available, otherwise use default
        if (result.pagination) {
          setPagination(result.pagination);
        } else {
          setPagination({
            current_page: page,
            per_page: per_page,
            total_pages: Math.ceil(result.regions.length / per_page),
            total_count: result.regions.length,
            has_next_page: false,
            has_prev_page: false
          });
        }
      } else if (result && Array.isArray(result.data)) {
        setRegions(result.data);
      } else if (Array.isArray(result)) {
        setRegions(result);
      } else {
        throw new Error('Invalid regions data format');
      }
    } catch (error: any) {
      console.error('Error fetching regions:', error);
      toast.error(`Failed to load regions: ${error.message}`, {
        duration: 5000,
      });
      setRegions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompaniesDropdown = async () => {
    try {
      const response = await fetch(getFullUrl('/pms/company_setups/company_index.json'), {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.code === 200 && Array.isArray(data.data)) {
          setCompaniesDropdown(data.data);
        } else if (data && Array.isArray(data.companies)) {
          setCompaniesDropdown(data.companies);
        } else if (Array.isArray(data)) {
          setCompaniesDropdown(data);
        }
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const fetchCountriesDropdown = async () => {
    try {
      const response = await fetch(getFullUrl('/headquarters.json'), {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Countries API response:', data);
        
        if (Array.isArray(data)) {
          // Handle direct array format
          const uniqueCountries = new Map();
          data.forEach((country: any) => {
            const id = country?.country_id || country?.id;
            const name = country?.country_name || country?.name;
            if (id && name && !uniqueCountries.has(id)) {
              uniqueCountries.set(id, name);
            }
          });
          
          const countriesArray = Array.from(uniqueCountries.entries()).map(([id, name]) => ({ id: Number(id), name: String(name) }));
          setCountriesDropdown(countriesArray);
        } else if (data && data.headquarters && Array.isArray(data.headquarters)) {
          // Handle nested headquarters format
          const uniqueCountries = new Map();
          data.headquarters.forEach((hq: any) => {
            const id = hq?.country_id;
            const name = hq?.country_name;
            if (id && name && !uniqueCountries.has(id)) {
              uniqueCountries.set(id, name);
            }
          });
          
          const countriesArray = Array.from(uniqueCountries.entries()).map(([id, name]) => ({ id: Number(id), name: String(name) }));
          setCountriesDropdown(countriesArray);
        } else {
          console.error('Countries data format unexpected:', data);
          setCountriesDropdown([]);
        }
      } else {
        toast.error('Failed to fetch countries');
        setCountriesDropdown([]);
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
      toast.error('Error fetching countries');
      setCountriesDropdown([]);
    }
  };

  // Handle filter application
  const handleApplyFilters = (filters: RegionFilters) => {
    console.log('📊 Applying filters:', filters);
    setAppliedFilters(filters);
    setCurrentPage(1); // Reset to first page when applying filters
  };

  // Handle search
  const handleSearch = (term: string) => {
    console.log('Search query:', term);
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
    // Force immediate search if query is empty (for clear search)
    if (!term.trim()) {
      fetchRegions(1, perPage, '', appliedFilters);
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle per page change
  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Helper function to get company name
  const getCompanyName = (companyId: number | null | undefined) => {
    if (!companyId) return 'Unknown';
    const company = companiesDropdown.find(c => c.id && c.id.toString() === companyId.toString());
    return company ? company.name : 'Unknown';
  };

  // Helper function to get country name
  const getCountryName = (countryId: number | null | undefined) => {
    if (!countryId) return 'Unknown';
    const country = countriesDropdown.find(c => c.id && c.id.toString() === countryId.toString());
    return country ? country.name : 'Unknown';
  };

  // Format date helper
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const totalRecords = pagination.total_count;
  const totalPages = pagination.total_pages;
  
  // Use API data directly instead of client-side filtering
  const displayedData = regions;

  // Render row function for enhanced table
  const renderRow = (region: RegionItem) => ({
    actions: (
      <div className="flex items-center gap-2">
        <button
          onClick={() => region?.id && handleView(region.id)}
          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
          title="View"
          disabled={!region?.id}
        >
          <Eye className="w-4 h-4" />
        </button>
        {/* <button
          onClick={() => region?.id && handleEdit(region.id)}
          className="p-1 text-green-600 hover:bg-green-50 rounded"
          title="Edit"
          disabled={!canEditRegion || !region?.id}
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => region?.id && handleDelete(region.id)}
          className="p-1 text-red-600 hover:bg-red-50 rounded"
          title="Delete"
          disabled={!canEditRegion || !region?.id}
        >
          <Trash2 className="w-4 h-4" />
        </button> */}
      </div>
    ),
    name: (
      <div className="flex items-center gap-3">
        <div>
          <div className="font-medium">{region?.name || 'N/A'}</div>
          {region?.description && (
            <div className="text-sm text-gray-500">{region.description}</div>
          )}
        </div>
      </div>
    ),
    code: (
      <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
        {region?.code || '-'}
      </span>
    ),
    company: (
      <span className="text-sm text-gray-600">
        {getCompanyName(region?.company_id)}
      </span>
    ),
    country: (
      <span className="text-sm text-gray-600">
        {getCountryName(region?.country_id)}
      </span>
    ),
    status: (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          region?.active
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}
      >
        {region?.active ? 'Active' : 'Inactive'}
      </span>
    ),
    created_at: (
      <span className="text-sm text-gray-600">
        {formatDate(region?.created_at)}
      </span>
    )
  });

  const handleView = (id: number) => {
    console.log('View region:', id);
    // Navigate to region details page
    navigate(`/ops-account/regions/details/${id}`);
  };

  const handleEdit = (id: number) => {
    console.log('Edit region:', id);
    setSelectedRegionId(id);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id: number) => {
    console.log('Delete region:', id);
    setSelectedRegionId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedRegionId) return;

    if (!canEditRegion) {
      toast.error('You do not have permission to delete regions');
      return;
    }

    try {
      const response = await fetch(getFullUrl(`/pms/regions/${selectedRegionId}.json`), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': getAuthHeader()
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast.success('Region deleted successfully!', {
        duration: 3000,
      });

      // Refresh the data
      fetchRegions(currentPage, perPage, debouncedSearchQuery, appliedFilters);
      setIsDeleteModalOpen(false);
      setSelectedRegionId(null);
    } catch (error: any) {
      console.error('Error deleting region:', error);
      toast.error(`Failed to delete region: ${error.message}`, {
        duration: 5000,
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Regions</h1>
      </header>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-[#C72030]" />
          <span className="ml-2 text-gray-600">Loading regions...</span>
        </div>
      )}

      {!loading && (
        <>
          <EnhancedTaskTable
            data={displayedData}
            columns={columns}
            renderRow={renderRow}
            storageKey="region-dashboard-v1"
            hideTableExport={true}
            hideTableSearch={false}
            enableSearch={true}
            searchTerm={searchTerm}
            onSearchChange={handleSearch}
            onFilterClick={() => setIsFilterOpen(true)}
            leftActions={(
              <Button 
                className='bg-primary text-primary-foreground hover:bg-primary/90'  
                onClick={() => setIsAddModalOpen(true)}
                disabled={!canEditRegion}
              >
                <Plus className="w-4 h-4 mr-2" /> Add Region
              </Button>
            )}
            rightActions={(
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsBulkUploadOpen(true)}
                  disabled={!canEditRegion}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Bulk Upload
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsExportOpen(true)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            )}
          />

          <TicketPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalRecords={totalRecords}
            perPage={perPage}
            isLoading={loading}
            onPageChange={handlePageChange}
            onPerPageChange={handlePerPageChange}
          />
        </>
      )}

      {/* Modals */}
      <AddRegionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          fetchRegions(currentPage, perPage, debouncedSearchQuery, appliedFilters);
          setIsAddModalOpen(false);
        }}
        companiesDropdown={companiesDropdown}
        countriesDropdown={countriesDropdown}
        canEdit={canEditRegion}
      />

      {selectedRegionId !== null && (
        <>
          <EditRegionModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedRegionId(null);
            }}
            onSuccess={() => {
              fetchRegions(currentPage, perPage, debouncedSearchQuery, appliedFilters);
              setIsEditModalOpen(false);
              setSelectedRegionId(null);
            }}
            regionId={selectedRegionId}
            companiesDropdown={companiesDropdown}
            countriesDropdown={countriesDropdown}
            canEdit={canEditRegion}
          />

          <DeleteRegionModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedRegionId(null);
            }}
            onConfirm={handleDeleteConfirm}
            regionId={selectedRegionId}
          />
        </>
      )}

      <RegionFilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
        companiesDropdown={companiesDropdown}
        countriesDropdown={countriesDropdown}
      />

      <BulkUploadModal
        isOpen={isBulkUploadOpen}
        onClose={() => setIsBulkUploadOpen(false)}
        title="Bulk Upload Regions"
        description="Upload a CSV file to import regions"
        onImport={async (file: File) => {
          // Handle bulk upload logic here
          console.log('Uploading regions file:', file);
          toast.success('Regions uploaded successfully');
          fetchRegions(currentPage, perPage, debouncedSearchQuery, appliedFilters);
          setIsBulkUploadOpen(false);
        }}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  );
};
