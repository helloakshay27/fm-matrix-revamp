import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Download, Filter, Upload, Printer, QrCode, Eye, Edit, Trash2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AddOrganizationModal } from '@/components/AddOrganizationModal';
import { EditOrganizationModal } from '@/components/EditOrganizationModal';
import { DeleteOrganizationModal } from '@/components/DeleteOrganizationModal';
import { OrganizationFilterModal, OrganizationFilters } from '@/components/OrganizationFilterModal';
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
interface OrganizationItem {
  id: number;
  name: string;
  active: boolean;
  created_by_id: number;
  domain: string;
  sub_domain: string;
  country_id: number | null;
  front_domain: string;
  front_subdomain: string;
  created_at: string;
  updated_at: string;
  url: string;
  attachfile?: {
    id: number;
    document_file_name: string;
    document_content_type: string;
    document_file_size: number;
    document_updated_at: string;
    relation: string;
    relation_id: number;
    active: number;
    changed_by: string | null;
    added_from: string | null;
    comments: string | null;
    url: string;
    document_url: string;
  };
  powered_by_attachfile?: {
    id: number;
    document_file_name: string;
    document_content_type: string;
    document_file_size: number;
    document_updated_at: string;
    relation: string;
    relation_id: number;
    active: number;
    changed_by: string | null;
    added_from: string | null;
    comments: string | null;
    url: string;
    document_url: string;
  };
}

interface OrganizationApiResponse {
  organizations: OrganizationItem[];
  pagination?: {
    current_page: number;
    per_page: number;
    total_pages: number;
    total_count: number;
    has_next_page: boolean;
    has_prev_page: boolean;
  };
}

interface OrganizationTabProps {
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
    label: 'Organization Name',
    sortable: true,
    hideable: true,
    draggable: true
  },
  {
    key: 'domain',
    label: 'Domain',
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

export const OrganizationTab: React.FC<OrganizationTabProps> = ({
  searchQuery,
  setSearchQuery,
  entriesPerPage,
  setEntriesPerPage
}) => {
  const navigate = useNavigate();
  const { getFullUrl, getAuthHeader } = useApiConfig();
  
  // State management
  const [organizations, setOrganizations] = useState<OrganizationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchQuery = useDebounce(searchTerm, 1000);
  const [appliedFilters, setAppliedFilters] = useState<OrganizationFilters>({});
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
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<number | null>(null);
  
  // Countries dropdown and permissions
  const [countriesDropdown, setCountriesDropdown] = useState<any[]>([]);
  const [canEditOrganization, setCanEditOrganization] = useState(false);

  const user = getUser() || {
    id: 0,
    firstname: "Guest",
    lastname: "",
    email: "",
  };

  const checkEditPermission = () => {
    const userEmail = user.email || '';
    const allowedEmails = ['abhishek.sharma@lockated.com', 'your-specific-email@domain.com'];
    setCanEditOrganization(allowedEmails.includes(userEmail));
  };

  useEffect(() => {
    fetchCountriesDropdown();
    checkEditPermission();
  }, []);

  // Load data on component mount and when page/perPage/filters change
  useEffect(() => {
    fetchOrganizations(currentPage, perPage, debouncedSearchQuery, appliedFilters);
  }, [currentPage, perPage, debouncedSearchQuery, appliedFilters]);

  // Fetch organizations data from API
  const fetchOrganizations = async (page = 1, per_page = 10, search = '', filters: OrganizationFilters = {}) => {
    setLoading(true);
    try {
      // Build API URL with parameters
      let apiUrl = getFullUrl(`/organizations.json?page=${page}&per_page=${per_page}`);

      // Add search parameter
      if (search.trim()) {
        apiUrl += `&q[search_all_fields_cont]=${encodeURIComponent(search.trim())}`;
      }

      // Add filter parameters
      if (filters.countryId) {
        apiUrl += `&q[country_id_eq]=${filters.countryId}`;
      }

      if (filters.status) {
        const isActive = filters.status === 'active';
        apiUrl += `&q[active_eq]=${isActive}`;
      }

      if (filters.domain) {
        apiUrl += `&q[domain_cont]=${encodeURIComponent(filters.domain)}`;
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

      const result: OrganizationApiResponse = await response.json();
      console.log('Organizations API response:', result);

      if (result && result.organizations && Array.isArray(result.organizations)) {
        setOrganizations(result.organizations);
        // Set pagination if available, otherwise use default
        if (result.pagination) {
          setPagination(result.pagination);
        } else {
          setPagination({
            current_page: page,
            per_page: per_page,
            total_pages: Math.ceil(result.organizations.length / per_page),
            total_count: result.organizations.length,
            has_next_page: false,
            has_prev_page: false
          });
        }
      } else {
        throw new Error('Invalid organizations data format');
      }
    } catch (error: any) {
      console.error('Error fetching organizations:', error);
      toast.error(`Failed to load organizations: ${error.message}`, {
        duration: 5000,
      });
      setOrganizations([]);
    } finally {
      setLoading(false);
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
        } else if (data && data.countries && Array.isArray(data.countries)) {
          // Handle existing format as fallback
          const mappedCountries = data.countries
            .filter(([id, name]) => id && name)
            .map(([id, name]) => ({ id: Number(id), name: String(name) }));
          setCountriesDropdown(mappedCountries);
        } else if (Array.isArray(data)) {
          const mappedCountries = data
            .map((item) => {
              if (Array.isArray(item) && item.length >= 2 && item[0] && item[1]) {
                return { id: Number(item[0]), name: String(item[1]) };
              }
              const id = item?.id || item?.value;
              const name = item?.name || item?.label;
              if (id && name) {
                return { id: Number(id), name: String(name) };
              }
              return null;
            })
            .filter(Boolean);
          setCountriesDropdown(mappedCountries);
        } else {
          console.error('Countries data format unexpected:', data);
          setCountriesDropdown([]);
          toast.error('Invalid countries data format');
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
  const handleApplyFilters = (filters: OrganizationFilters) => {
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
      fetchOrganizations(1, perPage, '', appliedFilters);
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
  const displayedData = organizations;

  // Render row function for enhanced table
  const renderRow = (org: OrganizationItem) => ({
    actions: (
      <div className="flex items-center gap-2">
        <button
          onClick={() => org?.id && handleView(org.id)}
          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
          title="View"
          disabled={!org?.id}
        >
          <Eye className="w-4 h-4" />
        </button>
        {/* <button
          onClick={() => org?.id && handleEdit(org.id)}
          className="p-1 text-green-600 hover:bg-green-50 rounded"
          title="Edit"
          disabled={!canEditOrganization || !org?.id}
        >
          <Edit className="w-4 h-4" />
        </button> */}
        {/* <button
          onClick={() => org?.id && handleDelete(org.id)}
          className="p-1 text-red-600 hover:bg-red-50 rounded"
          title="Delete"
          disabled={!canEditOrganization || !org?.id}
        >
          <Trash2 className="w-4 h-4" />
        </button> */}
      </div>
    ),
    name: (
      <div className="flex items-center gap-3">
        {org?.attachfile?.document_url && (
          <img
            src={org.attachfile.document_url}
            alt={org?.name || 'Organization'}
            className="w-8 h-8 rounded object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
        <div>
          <div className="font-medium">{org?.name || 'N/A'}</div>
          {org?.sub_domain && (
            <div className="text-sm text-gray-500">{org.sub_domain}</div>
          )}
        </div>
      </div>
    ),
    domain: (
      <div className="text-sm">
        <div>{org?.domain || '-'}</div>
        {org?.front_domain && org.front_domain !== org.domain && (
          <div className="text-gray-500">Frontend: {org.front_domain}</div>
        )}
      </div>
    ),
    country: (
      <span className="text-sm text-gray-600">
        {getCountryName(org?.country_id)}
      </span>
    ),
    status: (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          org?.active
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}
      >
        {org?.active ? 'Active' : 'Inactive'}
      </span>
    ),
    created_at: (
      <span className="text-sm text-gray-600">
        {formatDate(org?.created_at)}
      </span>
    )
  });

  const handleView = (id: number) => {
    console.log('View organization:', id);
    // Navigate to organization details page
    navigate(`/ops-account/organizations/details/${id}`);
  };

  const handleEdit = (id: number) => {
    console.log('Edit organization:', id);
    setSelectedOrganizationId(id);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id: number) => {
    console.log('Delete organization:', id);
    setSelectedOrganizationId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedOrganizationId) return;

    if (!canEditOrganization) {
      toast.error('You do not have permission to delete organizations');
      return;
    }

    try {
      const response = await fetch(getFullUrl(`/organizations/${selectedOrganizationId}.json`), {
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

      toast.success('Organization deleted successfully!', {
        duration: 3000,
      });

      // Refresh the data
      fetchOrganizations(currentPage, perPage, debouncedSearchQuery, appliedFilters);
      setIsDeleteModalOpen(false);
      setSelectedOrganizationId(null);
    } catch (error: any) {
      console.error('Error deleting organization:', error);
      toast.error(`Failed to delete organization: ${error.message}`, {
        duration: 5000,
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Organizations</h1>
      </header>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-[#C72030]" />
          <span className="ml-2 text-gray-600">Loading organizations...</span>
        </div>
      )}

      {!loading && (
        <>
          <EnhancedTaskTable
            data={displayedData}
            columns={columns}
            renderRow={renderRow}
            storageKey="organization-dashboard-v1"
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
                disabled={!canEditOrganization}
              >
                <Plus className="w-4 h-4 mr-2" /> Add Organization
              </Button>
            )}
            rightActions={(
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsBulkUploadOpen(true)}
                  disabled={!canEditOrganization}
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
      <AddOrganizationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          fetchOrganizations(currentPage, perPage, debouncedSearchQuery, appliedFilters);
          setIsAddModalOpen(false);
        }}
        countriesDropdown={countriesDropdown}
        canEdit={canEditOrganization}
      />

      {selectedOrganizationId !== null && (
        <>
          <EditOrganizationModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedOrganizationId(null);
            }}
            onSuccess={() => {
              fetchOrganizations(currentPage, perPage, debouncedSearchQuery, appliedFilters);
              setIsEditModalOpen(false);
              setSelectedOrganizationId(null);
            }}
            organizationId={selectedOrganizationId}
            countriesDropdown={countriesDropdown}
            canEdit={canEditOrganization}
          />

          <DeleteOrganizationModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedOrganizationId(null);
            }}
            onConfirm={handleDeleteConfirm}
            organizationId={selectedOrganizationId}
          />
        </>
      )}

      <OrganizationFilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
        countriesDropdown={countriesDropdown}
      />

      <BulkUploadModal
        isOpen={isBulkUploadOpen}
        onClose={() => setIsBulkUploadOpen(false)}
        title="Bulk Upload Organizations"
        description="Upload a CSV file to import organizations"
        onImport={async (file: File) => {
          // Handle bulk upload logic here
          console.log('Uploading organizations file:', file);
          toast.success('Organizations uploaded successfully');
          fetchOrganizations(currentPage, perPage, debouncedSearchQuery, appliedFilters);
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
