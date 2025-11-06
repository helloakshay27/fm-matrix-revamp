import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Download, Filter, Upload, Eye, Edit, Trash2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AddCompanyModal } from '@/components/AddCompanyModal';
import { EditCompanyModalNew } from '@/components/EditCompanyModalNew';
import { DeleteCompanyModal } from '@/components/DeleteCompanyModal';
import { CompanyFilterModal, CompanyFilters } from '@/components/CompanyFilterModal';
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
interface CompanyItem {
  id: number;
  name: string;
  organization_id: number;
  country_id: number;
  billing_term: string;
  billing_rate: string;
  live_date: string;
  remarks: string;
  created_at: string;
  updated_at: string;
}

interface CompanyApiResponse {
  data: CompanyItem[];
  companies: CompanyItem[];
  code: number;
  pagination?: {
    current_page: number;
    per_page: number;
    total_pages: number;
    total_count: number;
    has_next_page: boolean;
    has_prev_page: boolean;
  };
}

interface CompanyTabProps {
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
    label: 'Company Name',
    sortable: true,
    hideable: true,
    draggable: true
  },
  {
    key: 'organization',
    label: 'Organization',
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
    key: 'billing_rate',
    label: 'Billing Rate',
    sortable: true,
    hideable: true,
    draggable: true
  },
  {
    key: 'live_date',
    label: 'Live Date',
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

export const CompanyTab: React.FC<CompanyTabProps> = ({
  searchQuery,
  setSearchQuery,
  entriesPerPage,
  setEntriesPerPage
}) => {
  const navigate = useNavigate();
  const { getFullUrl, getAuthHeader } = useApiConfig();
  
  // State management
  const [companies, setCompanies] = useState<CompanyItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchQuery = useDebounce(searchTerm, 1000);
  const [appliedFilters, setAppliedFilters] = useState<CompanyFilters>({});
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
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
  
  // Dropdowns and permissions
  const [organizationsDropdown, setOrganizationsDropdown] = useState<any[]>([]);
  const [countriesDropdown, setCountriesDropdown] = useState<any[]>([]);
  const [canEditCompany, setCanEditCompany] = useState(false);

  const user = getUser() || {
    id: 0,
    firstname: "Guest",
    lastname: "",
    email: "",
  };

  const checkEditPermission = () => {
    const userEmail = user.email || '';
    const allowedEmails = ['abhishek.sharma@lockated.com', 'your-specific-email@domain.com'];
    setCanEditCompany(allowedEmails.includes(userEmail));
  };

  useEffect(() => {
    fetchOrganizationsDropdown();
    fetchCountriesDropdown();
    checkEditPermission();
  }, []);

  // Load data on component mount and when page/perPage/filters change
  useEffect(() => {
    fetchCompanies(currentPage, perPage, debouncedSearchQuery, appliedFilters);
  }, [currentPage, perPage, debouncedSearchQuery, appliedFilters]);

  // Fetch companies data from API
  const fetchCompanies = async (page = 1, per_page = 10, search = '', filters: CompanyFilters = {}) => {
    setLoading(true);
    try {
      // Build API URL with parameters
      let apiUrl = getFullUrl(`/pms/company_setups/company_index.json?page=${page}&per_page=${per_page}`);

      // Add search parameter
      if (search.trim()) {
        apiUrl += `&q[search_all_fields_cont]=${encodeURIComponent(search.trim())}`;
      }

      // Add filter parameters
      if (filters.organizationId) {
        apiUrl += `&q[organization_id_eq]=${filters.organizationId}`;
      }

      if (filters.countryId) {
        apiUrl += `&q[country_id_eq]=${filters.countryId}`;
      }

      if (filters.billing_rate) {
        apiUrl += `&q[billing_rate_cont]=${encodeURIComponent(filters.billing_rate)}`;
      }

      if (filters.live_date_from) {
        apiUrl += `&q[live_date_gteq]=${filters.live_date_from}`;
      }

      if (filters.live_date_to) {
        apiUrl += `&q[live_date_lteq]=${filters.live_date_to}`;
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

      const result: CompanyApiResponse = await response.json();
      console.log('Companies API response:', result);

      if (result && result.code === 200 && Array.isArray(result.data)) {
        setCompanies(result.data);
        // Set pagination if available, otherwise use default
        if (result.pagination) {
          setPagination(result.pagination);
        } else {
          setPagination({
            current_page: page,
            per_page: per_page,
            total_pages: Math.ceil(result.data.length / per_page),
            total_count: result.data.length,
            has_next_page: false,
            has_prev_page: false
          });
        }
      } else if (result && Array.isArray(result.companies)) {
        setCompanies(result.companies);
      } else if (Array.isArray(result)) {
        setCompanies(result);
      } else {
        throw new Error('Invalid companies data format');
      }
    } catch (error: any) {
      console.error('Error fetching companies:', error);
      toast.error(`Failed to load companies: ${error.message}`, {
        duration: 5000,
      });
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrganizationsDropdown = async () => {
    try {
      const response = await fetch(getFullUrl('/organizations.json'), {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.organizations && Array.isArray(data.organizations)) {
          setOrganizationsDropdown(data.organizations);
        } else if (Array.isArray(data)) {
          setOrganizationsDropdown(data);
        }
      }
    } catch (error) {
      console.error('Error fetching organizations:', error);
    }
  };

  const fetchCountriesDropdown = async () => {
    try {
      const response = await fetch('https://fm-uat-api.lockated.com/pms/countries.json?access_token=KKgTUIuVekyUWe5qce0snu7nfhioTPW4XHMmzmXCxdU');

      if (response.ok) {
        const data = await response.json();
        console.log('Countries API response:', data);
        
        // Map the API response to the expected dropdown format
        // API returns array of objects with id and name properties
        if (Array.isArray(data)) {
          const mappedCountries = data
            .filter((country) => country?.id && country?.name) // Filter out invalid entries
            .map((country) => ({ 
              id: Number(country.id), 
              name: String(country.name) 
            }));
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
  const handleApplyFilters = (filters: CompanyFilters) => {
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
      fetchCompanies(1, perPage, '', appliedFilters);
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

  // Helper function to get organization name
  const getOrganizationName = (organizationId: number | null | undefined) => {
    if (!organizationId) return 'Unknown';
    const organization = organizationsDropdown.find(o => o.id && o.id.toString() === organizationId.toString());
    return organization ? organization.name : 'Unknown';
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
  const displayedData = companies;

  // Render row function for enhanced table
  const renderRow = (company: CompanyItem) => ({
    actions: (
      <div className="flex items-center gap-2">
        <button
          onClick={() => company?.id && handleView(company.id)}
          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
          title="View"
          disabled={!company?.id}
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={() => company?.id && handleEdit(company.id)}
          className="p-1 text-green-600 hover:bg-green-50 rounded"
          title="Edit"
          disabled={!canEditCompany || !company?.id}
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => company?.id && handleDelete(company.id)}
          className="p-1 text-red-600 hover:bg-red-50 rounded"
          title="Delete"
          disabled={!canEditCompany || !company?.id}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    ),
    name: (
      <div className="flex items-center gap-3">
        <div>
          <div className="font-medium">{company?.name || 'N/A'}</div>
          {company?.remarks && (
            <div className="text-sm text-gray-500">{company.remarks}</div>
          )}
        </div>
      </div>
    ),
    organization: (
      <span className="text-sm text-gray-600">
        {getOrganizationName(company?.organization_id)}
      </span>
    ),
    country: (
      <span className="text-sm text-gray-600">
        {getCountryName(company?.country_id)}
      </span>
    ),
    billing_rate: (
      <div className="text-sm">
        <div>{company?.billing_rate || '-'}</div>
        {company?.billing_term && (
          <div className="text-gray-500">Term: {company.billing_term}</div>
        )}
      </div>
    ),
    live_date: (
      <span className="text-sm text-gray-600">
        {formatDate(company?.live_date)}
      </span>
    ),
    created_at: (
      <span className="text-sm text-gray-600">
        {formatDate(company?.created_at)}
      </span>
    )
  });

  const handleView = (id: number) => {
    console.log('View company:', id);
    // Navigate to company details page
    navigate(`/ops-account/companies/details/${id}`);
  };

  const handleEdit = (id: number) => {
    console.log('Edit company:', id);
    setSelectedCompanyId(id);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id: number) => {
    console.log('Delete company:', id);
    setSelectedCompanyId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCompanyId) return;

    if (!canEditCompany) {
      toast.error('You do not have permission to delete companies');
      return;
    }

    try {
      const response = await fetch(getFullUrl(`/pms/company_setups/${selectedCompanyId}.json`), {
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

      toast.success('Company deleted successfully!', {
        duration: 3000,
      });

      // Refresh the data
      fetchCompanies(currentPage, perPage, debouncedSearchQuery, appliedFilters);
      setIsDeleteModalOpen(false);
      setSelectedCompanyId(null);
    } catch (error: any) {
      console.error('Error deleting company:', error);
      toast.error(`Failed to delete company: ${error.message}`, {
        duration: 5000,
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Companies</h1>
      </header>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-[#C72030]" />
          <span className="ml-2 text-gray-600">Loading companies...</span>
        </div>
      )}

      {!loading && (
        <>
          <EnhancedTaskTable
            data={displayedData}
            columns={columns}
            renderRow={renderRow}
            storageKey="company-dashboard-v1"
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
                disabled={!canEditCompany}
              >
                <Plus className="w-4 h-4 mr-2" /> Add Company
              </Button>
            )}
            // rightActions={(
            //   <div className="flex items-center gap-2">
            //     <Button
            //       variant="outline"
            //       size="sm"
            //       onClick={() => setIsBulkUploadOpen(true)}
            //       disabled={!canEditCompany}
            //     >
            //       <Upload className="w-4 h-4 mr-2" />
            //       Bulk Upload
            //     </Button>
            //     <Button
            //       variant="outline"
            //       size="sm"
            //       onClick={() => setIsExportOpen(true)}
            //     >
            //       <Download className="w-4 h-4 mr-2" />
            //       Export
            //     </Button>
            //   </div>
            // )}
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
      <AddCompanyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          fetchCompanies(currentPage, perPage, debouncedSearchQuery, appliedFilters);
          setIsAddModalOpen(false);
        }}
        organizationsDropdown={organizationsDropdown}
        countriesDropdown={countriesDropdown}
        canEdit={canEditCompany}
      />

      {selectedCompanyId !== null && (
        <>
          <EditCompanyModalNew
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedCompanyId(null);
            }}
            onSuccess={() => {
              fetchCompanies(currentPage, perPage, debouncedSearchQuery, appliedFilters);
              setIsEditModalOpen(false);
              setSelectedCompanyId(null);
            }}
            companyId={selectedCompanyId}
            organizationsDropdown={organizationsDropdown}
            countriesDropdown={countriesDropdown}
            canEdit={canEditCompany}
          />

          <DeleteCompanyModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedCompanyId(null);
            }}
            onConfirm={handleDeleteConfirm}
            companyId={selectedCompanyId}
          />
        </>
      )}

      <CompanyFilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
        organizationsDropdown={organizationsDropdown}
        countriesDropdown={countriesDropdown}
      />

      <BulkUploadModal
        isOpen={isBulkUploadOpen}
        onClose={() => setIsBulkUploadOpen(false)}
        title="Bulk Upload Companies"
        description="Upload a CSV file to import companies"
        onImport={async (file: File) => {
          // Handle bulk upload logic here
          console.log('Uploading companies file:', file);
          toast.success('Companies uploaded successfully');
          fetchCompanies(currentPage, perPage, debouncedSearchQuery, appliedFilters);
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
