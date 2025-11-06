import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Download, Filter, Upload, Printer, QrCode, Eye, Edit, Trash2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AddCountryModal } from '@/components/AddCountryModal';
import { EditCountryModal } from '@/components/EditCountryModal';
import { DeleteCountryModal } from '@/components/DeleteCountryModal';
import { CountryFilterModal, CountryFilters } from '@/components/CountryFilterModal';
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
interface CountryItem {
  id: number;
  company_setup_id: number;
  country_id: number;
  active: boolean;
  organization_id: number | null;
  created_at: string;
  updated_at: string;
  url: string;
  company_name: string;
  country_name: string;
}

interface CountryApiResponse {
  headquarters?: CountryItem[];
  data?: CountryItem[];
  pagination?: {
    current_page: number;
    per_page: number;
    total_pages: number;
    total_count: number;
    has_next_page: boolean;
    has_prev_page: boolean;
  };
}

interface CountryTabProps {
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
    key: 'id',
    label: 'ID',
    sortable: true,
    hideable: true,
    draggable: true
  },
  {
    key: 'country_name',
    label: 'Country',
    sortable: true,
    hideable: true,
    draggable: true
  },
  {
    key: 'company_name',
    label: 'Company',
    sortable: true,
    hideable: true,
    draggable: true
  },
  {
    key: 'active',
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

export const CountryTab: React.FC<CountryTabProps> = ({
  searchQuery,
  setSearchQuery,
  entriesPerPage,
  setEntriesPerPage
}) => {
  const navigate = useNavigate();
  const { getFullUrl, getAuthHeader } = useApiConfig();
  
  // State management
  const [countries, setCountries] = useState<CountryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchQuery = useDebounce(searchTerm, 1000);
  const [appliedFilters, setAppliedFilters] = useState<CountryFilters>({});
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
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(null);
  
  // Maps for displaying related data
  const [countriesMap, setCountriesMap] = useState<Map<number, string>>(new Map());
  const [companiesMap, setCompaniesMap] = useState<Map<number, string>>(new Map());
  const [countriesDropdown, setCountriesDropdown] = useState<any[]>([]);
  const [companiesDropdown, setCompaniesDropdown] = useState<any[]>([]);
  const [canEditCountry, setCanEditCountry] = useState(false);

  const user = getUser() || {
    id: 0,
    firstname: "Guest",
    lastname: "",
    email: "",
  };

  const checkEditPermission = () => {
    const userEmail = user.email || '';
    const allowedEmails = ['abhishek.sharma@lockated.com', 'your-specific-email@domain.com'];
    setCanEditCountry(allowedEmails.includes(userEmail));
  };

  useEffect(() => {
    fetchCompanies();
    fetchCountriesDropdown();
    checkEditPermission();
  }, []);

  // Load data on component mount and when page/perPage/filters change
  useEffect(() => {
    fetchCountries(currentPage, perPage, debouncedSearchQuery, appliedFilters);
  }, [currentPage, perPage, debouncedSearchQuery, appliedFilters]);

  // Fetch countries data from API
  const fetchCountries = async (page = 1, per_page = 10, search = '', filters: CountryFilters = {}) => {
    setLoading(true);
    try {
      // Build API URL with parameters
      let apiUrl = getFullUrl('/headquarters.json');



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

      const result: CountryApiResponse = await response.json();


      let countryData: CountryItem[] = [];
      
      if (Array.isArray(result)) {
        countryData = result;
      } else if (result && result.headquarters && Array.isArray(result.headquarters)) {
        countryData = result.headquarters;
      } else if (result && result.data && Array.isArray(result.data)) {
        countryData = result.data;
      }



      // Apply client-side filtering and searching
      let filteredData = countryData;

      if (search.trim()) {
        const searchLower = search.toLowerCase();
        filteredData = filteredData.filter(country =>
          country.country_name?.toLowerCase().includes(searchLower) ||
          country.company_name?.toLowerCase().includes(searchLower)
        );
      }

      if (filters.countryId) {
        filteredData = filteredData.filter(country => 
          country.country_id === parseInt(filters.countryId!)
        );
      }

      if (filters.companyId) {
        filteredData = filteredData.filter(country => 
          country.company_setup_id === parseInt(filters.companyId!)
        );
      }

      // Implement client-side pagination
      const totalPages = Math.ceil(filteredData.length / per_page);
      const startIndex = (page - 1) * per_page;
      const endIndex = startIndex + per_page;
      const paginatedData = filteredData.slice(startIndex, endIndex);
      

      
      setCountries(paginatedData);
      
      setPagination({
        current_page: page,
        per_page: per_page,
        total_pages: totalPages,
        total_count: filteredData.length,
        has_next_page: page < totalPages,
        has_prev_page: page > 1
      });

    } catch (error) {
      console.error('Error fetching countries:', error);
      toast.error('Error fetching countries');
      setCountries([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await fetch(getFullUrl('/pms/company_setups/company_index.json'), {
        method: 'GET',
        headers: {
          'Authorization': getAuthHeader(),
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData && responseData.code === 200 && Array.isArray(responseData.data)) {
          setCompaniesDropdown(responseData.data);
          const compMap = new Map();
          responseData.data.forEach((company: any) => {
            compMap.set(company.id, company.name);
          });
          setCompaniesMap(compMap);
        } else if (responseData && Array.isArray(responseData.companies)) {
          setCompaniesDropdown(responseData.companies);
          const compMap = new Map();
          responseData.companies.forEach((company: any) => {
            compMap.set(company.id, company.name);
          });
          setCompaniesMap(compMap);
        } else if (Array.isArray(responseData)) {
          setCompaniesDropdown(responseData);
          const compMap = new Map();
          responseData.forEach((company: any) => {
            compMap.set(company.id, company.name);
          });
          setCompaniesMap(compMap);
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

        
        if (Array.isArray(data)) {
          // Handle direct array format
          const uniqueCountries = new Map();
          data.forEach((country: any) => {
            const id = country.country_id || country.id;
            const name = country.country_name || country.name;
            if (id && name && !uniqueCountries.has(id)) {
              uniqueCountries.set(id, name);
            }
          });
          
          const countriesArray = Array.from(uniqueCountries.entries()).map(([id, name]) => ({ id, name }));
          setCountriesDropdown(countriesArray);
          setCountriesMap(uniqueCountries);
        } else if (data && data.headquarters && Array.isArray(data.headquarters)) {
          // Handle nested headquarters format
          const uniqueCountries = new Map();
          data.headquarters.forEach((hq: any) => {
            const id = hq.country_id;
            const name = hq.country_name;
            if (id && name && !uniqueCountries.has(id)) {
              uniqueCountries.set(id, name);
            }
          });
          
          const countriesArray = Array.from(uniqueCountries.entries()).map(([id, name]) => ({ id, name }));
          setCountriesDropdown(countriesArray);
          setCountriesMap(uniqueCountries);
        } else if (data && data.countries && Array.isArray(data.countries)) {
          // Handle existing format as fallback
          const mappedCountries = data.countries.map(([id, name]) => ({ id, name }));
          setCountriesDropdown(mappedCountries);
          const countryMap = new Map();
          data.countries.forEach(([id, name]) => {
            countryMap.set(id, name);
          });
          setCountriesMap(countryMap);
        }
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  // Modal handlers
  const handleEdit = (countryId: number) => {
    if (!canEditCountry) {
      toast.error('You do not have permission to edit countries');
      return;
    }
    setSelectedCountryId(countryId);
    setIsEditModalOpen(true);
  };

  const handleDelete = (countryId: number) => {
    if (!canEditCountry) {
      toast.error('You do not have permission to delete countries');
      return;
    }
    setSelectedCountryId(countryId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    fetchCountries(currentPage, perPage, debouncedSearchQuery, appliedFilters);
  };

  const handleApplyFilters = (filters: CountryFilters) => {
    setAppliedFilters(filters);
    setCurrentPage(1); // Reset to first page when applying filters
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setCurrentPage(1); // Reset to first page when changing per page
  };

  // Update search term when parent searchQuery changes
  useEffect(() => {
    setSearchTerm(searchQuery);
  }, [searchQuery]);

  // Sync with parent's entries per page
  useEffect(() => {
    const entriesNum = parseInt(entriesPerPage);
    if (!isNaN(entriesNum) && entriesNum !== perPage) {
      setPerPage(entriesNum);
      setCurrentPage(1);
    }
  }, [entriesPerPage, perPage]);

  // Data is passed directly to EnhancedTaskTable with renderCell and renderActions

  const totalPages = pagination.total_pages;
  const totalRecords = pagination.total_count;

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#C72030]" />
        </div>
      ) : (
        <>
          <EnhancedTaskTable 
            data={countries}
            columns={columns}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            loading={loading}
            renderActions={(country: CountryItem) => (
              <div className="flex items-center gap-2">
                {/* <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(country.id)}
                  className="hover:bg-gray-100"
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(country.id)}
                  className="hover:bg-red-100 text-red-600"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </Button> */}
              </div>
            )}
            renderCell={(country: CountryItem, columnKey: string) => {
              switch (columnKey) {
                case 'id':
                  return country.id;
                case 'country_name':
                  return country.country_name || '-';
                case 'company_name':
                  return country.company_name || '-';
                case 'active':
                  return (
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        country.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {country.active ? 'Active' : 'Inactive'}
                    </span>
                  );
                case 'created_at':
                  return country.created_at ? new Date(country.created_at).toLocaleDateString() : '-';
                default:
                  return '-';
              }
            }}
            leftActions={
              <Button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-[#C72030] hover:bg-[#A01020] text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Country
              </Button>
            }
            // rightActions={(
            //   <div className="flex items-center gap-2">
            //     <Button
            //       variant="outline"
            //       size="sm"
            //       onClick={() => setIsFilterOpen(true)}
            //     >
            //       <Filter className="w-4 h-4 mr-2" />
            //       Filter
            //     </Button>
            //     <Button
            //       variant="outline"
            //       size="sm"
            //       onClick={() => setIsBulkUploadOpen(true)}
            //     >
            //       <Upload className="w-4 h-4 mr-2" />
            //       Import
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
      <AddCountryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          fetchCountries(currentPage, perPage, debouncedSearchQuery, appliedFilters);
          setIsAddModalOpen(false);
        }}
        countriesDropdown={countriesDropdown}
        companiesDropdown={companiesDropdown}
        canEdit={canEditCountry}
      />

      {selectedCountryId !== null && (
        <>
          <EditCountryModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedCountryId(null);
            }}
            onSuccess={() => {
              fetchCountries(currentPage, perPage, debouncedSearchQuery, appliedFilters);
              setIsEditModalOpen(false);
              setSelectedCountryId(null);
            }}
            countryId={selectedCountryId}
            countriesDropdown={countriesDropdown}
            companiesDropdown={companiesDropdown}
            canEdit={canEditCountry}
          />

          <DeleteCountryModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedCountryId(null);
            }}
            onConfirm={handleDeleteConfirm}
            countryId={selectedCountryId}
          />
        </>
      )}

      <CountryFilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
        countriesDropdown={countriesDropdown}
        companiesDropdown={companiesDropdown}
      />

      <BulkUploadModal
        isOpen={isBulkUploadOpen}
        onClose={() => setIsBulkUploadOpen(false)}
        title="Bulk Upload Countries"
        description="Upload a CSV file to import countries"
        onImport={async (file: File) => {
          // Handle bulk upload logic here
          console.log('Uploading countries file:', file);
          toast.success('Countries uploaded successfully');
          fetchCountries(currentPage, perPage, debouncedSearchQuery, appliedFilters);
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
