import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Download,
  Filter,
  Upload,
  Printer,
  QrCode,
  Eye,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AddCountryModal } from "@/components/AddCountryModal";
import { EditCountryModal } from "@/components/EditCountryModal";
import { DeleteCountryModal } from "@/components/DeleteCountryModal";
import {
  CountryFilterModal,
  CountryFilters,
} from "@/components/CountryFilterModal";
import { ExportModal } from "@/components/ExportModal";
import { BulkUploadModal } from "@/components/BulkUploadModal";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { TicketPagination } from "@/components/TicketPagination";
import { toast } from "sonner";
import { useApiConfig } from "@/hooks/useApiConfig";
import { getUser } from "@/utils/auth";
import { useDebounce } from "@/hooks/useDebounce";

// Type definitions for the API response
interface CountryItem {
  id: number;
  name: string;
  company_setup_id: number;
  country_id: number;
  active: boolean;
  organization_id: number | null;
  organization_name?: string;
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
    key: "id",
    label: "ID",
    sortable: true,
    hideable: true,
    draggable: true,
  },
  // {
  //   key: "name",
  //   label: "Headquarter Name",
  //   sortable: true,
  //   hideable: true,
  //   draggable: true,
  // },
  {
    key: "organization_name",
    label: "Organization",
    sortable: true,
    hideable: true,
    draggable: true,
  },
  {
    key: "country_name",
    label: "Country Name",
    sortable: true,
    hideable: true,
    draggable: true,
  },
  {
    key: "company_name",
    label: "Company",
    sortable: true,
    hideable: true,
    draggable: true,
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    hideable: true,
    draggable: true,
  },
  {
    key: "created_at",
    label: "Created At",
    sortable: true,
    hideable: true,
    draggable: true,
  },
];

export const CountryTab: React.FC<CountryTabProps> = ({
  searchQuery,
  setSearchQuery,
  entriesPerPage,
  setEntriesPerPage,
}) => {
  const navigate = useNavigate();
  const { getFullUrl, getAuthHeader } = useApiConfig();

  // State management
  const [countries, setCountries] = useState<CountryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const debouncedSearchQuery = useDebounce(searchQuery, 1000);
  const [appliedFilters, setAppliedFilters] = useState<CountryFilters>({});
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total_pages: 1,
    total_count: 0,
    has_next_page: false,
    has_prev_page: false,
  });

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(
    null
  );

  // Maps for displaying related data
  const [countriesMap, setCountriesMap] = useState<Map<number, string>>(
    new Map()
  );
  const [companiesMap, setCompaniesMap] = useState<Map<number, string>>(
    new Map()
  );
  type DropdownItem = { id: number; name: string };
  const [countriesDropdown, setCountriesDropdown] = useState<DropdownItem[]>(
    []
  );
  const [companiesDropdown, setCompaniesDropdown] = useState<DropdownItem[]>(
    []
  );
  const [organizationsDropdown, setOrganizationsDropdown] = useState<
    DropdownItem[]
  >([]);
  const [canEditCountry, setCanEditCountry] = useState(false);

  const user = getUser() || {
    id: 0,
    firstname: "Guest",
    lastname: "",
    email: "",
  };

  const checkEditPermission = React.useCallback(() => {
    const userEmail = user.email || "";
    const allowedEmails = [
      "abhishek.sharma@lockated.com",
      "adhip.shetty@lockated.com",
      "helloakshay27@gmail.com",
      "dev@lockated.com",
      "sumitra.patil@lockated.com",
    ];
    setCanEditCountry(allowedEmails.includes(userEmail));
  }, [user.email]);

  // Effects are placed after function declarations below

  // Fetch countries data from API
  const fetchCountries = React.useCallback(
    async (
      page = 1,
      per_page = 10,
      search = "",
      filters: CountryFilters = {}
    ) => {
      setLoading(true);
      try {
        // Build API URL with parameters
        const apiUrl = getFullUrl("/headquarters.json");

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: getAuthHeader(),
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: CountryApiResponse = await response.json();

        let countryData: CountryItem[] = [];

        if (Array.isArray(result)) {
          countryData = result;
        } else if (
          result &&
          result.headquarters &&
          Array.isArray(result.headquarters)
        ) {
          countryData = result.headquarters;
        } else if (result && result.data && Array.isArray(result.data)) {
          countryData = result.data;
        }

        // Apply client-side filtering and searching
        let filteredData = countryData;

        if (search.trim()) {
          const searchLower = search.toLowerCase();
          filteredData = filteredData.filter(
            (country) =>
              country.name?.toLowerCase().includes(searchLower) ||
              country.country_name?.toLowerCase().includes(searchLower) ||
              country.company_name?.toLowerCase().includes(searchLower) ||
              country.organization_name?.toLowerCase().includes(searchLower)
          );
        }

        if (filters.countryId) {
          filteredData = filteredData.filter(
            (country) => country.country_id === parseInt(filters.countryId!)
          );
        }

        if (filters.companyId) {
          filteredData = filteredData.filter(
            (country) =>
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
          has_prev_page: page > 1,
        });
      } catch (error) {
        console.error("Error fetching countries:", error);
        toast.error("Error fetching countries");
        setCountries([]);
      } finally {
        setLoading(false);
      }
    },
    [getFullUrl, getAuthHeader]
  );

  const fetchCompanies = React.useCallback(async () => {
    try {
      const response = await fetch(
        getFullUrl("/pms/company_setups/company_index.json"),
        {
          method: "GET",
          headers: {
            Authorization: getAuthHeader(),
          },
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        if (
          responseData &&
          responseData.code === 200 &&
          Array.isArray(responseData.data)
        ) {
          setCompaniesDropdown(responseData.data as DropdownItem[]);
          const compMap = new Map();
          (responseData.data as DropdownItem[]).forEach((company) => {
            compMap.set(company.id, company.name);
          });
          setCompaniesMap(compMap);
        } else if (responseData && Array.isArray(responseData.companies)) {
          setCompaniesDropdown(responseData.companies as DropdownItem[]);
          const compMap = new Map();
          (responseData.companies as DropdownItem[]).forEach((company) => {
            compMap.set(company.id, company.name);
          });
          setCompaniesMap(compMap);
        } else if (Array.isArray(responseData)) {
          setCompaniesDropdown(responseData as DropdownItem[]);
          const compMap = new Map();
          (responseData as DropdownItem[]).forEach((company) => {
            compMap.set(company.id, company.name);
          });
          setCompaniesMap(compMap);
        }
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  }, [getAuthHeader, getFullUrl]);

  const fetchCountriesDropdown = React.useCallback(async () => {
    try {
      // Prefer token/baseUrl from localStorage (set by Layout when token in URL)
      const storedBaseUrl = localStorage.getItem("baseUrl");
      const storedToken = localStorage.getItem("token");

      let url: string;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      if (storedBaseUrl) {
        const normalizedBase = storedBaseUrl.startsWith("http")
          ? storedBaseUrl.replace(/\/+$/, "")
          : `https://${storedBaseUrl.replace(/\/+$/, "")}`;
        url = `${normalizedBase}/pms/countries.json`;
      } else {
        // Fallback to configured helper
        url = getFullUrl("/pms/countries.json");
      }

      if (storedToken) {
        headers["Authorization"] = `Bearer ${storedToken}`;
      } else {
        try {
          headers["Authorization"] = getAuthHeader();
        } catch (e) {
          console.warn("No token available for Authorization header:", e);
        }
      }

      const response = await fetch(url, {
        method: "GET",
        headers,
      });

      if (response.ok) {
        const data = await response.json();
        console.warn("Countries API response:", data);

        // Map the API response to the expected dropdown format
        // API returns array of objects with id and name properties
        if (Array.isArray(data)) {
          const mappedCountries = data
            .filter((country) => country?.id && country?.name) // Filter out invalid entries
            .map((country) => ({
              id: Number(country.id),
              name: String(country.name),
            }));
          setCountriesDropdown(mappedCountries);

          // Also update the countries map for quick lookups
          const countryMap = new Map();
          mappedCountries.forEach((country) => {
            countryMap.set(country.id, country.name);
          });
          setCountriesMap(countryMap);
        } else {
          console.error("Countries data format unexpected:", data);
          setCountriesDropdown([]);
          setCountriesMap(new Map());
        }
      } else {
        console.error(
          "Failed to fetch countries",
          response.status,
          await response.text()
        );
        setCountriesDropdown([]);
        setCountriesMap(new Map());
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
      setCountriesDropdown([]);
      setCountriesMap(new Map());
    }
  }, [getAuthHeader, getFullUrl]);

  const fetchOrganizations = React.useCallback(async () => {
    try {
      const response = await fetch(getFullUrl("/organizations.json"), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAuthHeader(),
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.organizations && Array.isArray(data.organizations)) {
          setOrganizationsDropdown(data.organizations as DropdownItem[]);
        } else if (Array.isArray(data)) {
          setOrganizationsDropdown(data as DropdownItem[]);
        }
      }
    } catch (error) {
      console.error("Error fetching organizations:", error);
      setOrganizationsDropdown([]);
    }
  }, [getAuthHeader, getFullUrl]);

  // Run initial data loads and permission check after callbacks are defined
  useEffect(() => {
    fetchCompanies();
    fetchCountriesDropdown();
    fetchOrganizations();
    checkEditPermission();
  }, [
    fetchCompanies,
    fetchCountriesDropdown,
    fetchOrganizations,
    checkEditPermission,
  ]);

  // Load data when page/perPage/search/filters change
  useEffect(() => {
    fetchCountries(currentPage, perPage, debouncedSearchQuery, appliedFilters);
  }, [
    currentPage,
    perPage,
    debouncedSearchQuery,
    appliedFilters,
    fetchCountries,
  ]);

  // Modal handlers
  const handleToggleStatus = async (
    countryId: number,
    currentStatus: boolean
  ) => {
    if (!canEditCountry) {
      toast.error("You do not have permission to update headquarters status");
      return;
    }

    try {
      const response = await fetch(
        getFullUrl(`/headquarters/${countryId}.json`),
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: getAuthHeader(),
          },
          body: JSON.stringify({
            pms_headquarter: {
              active: !currentStatus,
            },
          }),
        }
      );

      if (response.ok) {
        toast.success(
          `Headquarter ${!currentStatus ? "activated" : "deactivated"} successfully`
        );
        fetchCountries(
          currentPage,
          perPage,
          debouncedSearchQuery,
          appliedFilters
        );
      } else {
        toast.error("Failed to update headquarters status");
      }
    } catch (error) {
      console.error("Error updating headquarters status:", error);
      toast.error("Error updating headquarters status");
    }
  };

  const handleView = (countryId: number) => {
    navigate(
      `/ops-console/master/location/account/headquarters/details/${countryId}`
    );
  };

  const handleEdit = (countryId: number) => {
    if (!canEditCountry) {
      toast.error("You do not have permission to edit countries");
      return;
    }
    setSelectedCountryId(countryId);
    setIsEditModalOpen(true);
  };

  const handleDelete = (countryId: number) => {
    if (!canEditCountry) {
      toast.error("You do not have permission to delete countries");
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
            searchTerm={searchQuery}
            onSearchChange={setSearchQuery}
            enableSearch={true}
            hideTableSearch={false}
            loading={loading}
            renderActions={(country: CountryItem) => (
              <div className="flex items-center gap-2">
                {/* <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleView(country.id)}
                  className="hover:bg-blue-100 text-blue-600"
                  title="View"
                >
                  <Eye className="h-4 w-4" />
                </Button> */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(country.id)}
                  className="hover:bg-gray-100"
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                {/* <Button
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
                case "id":
                  return country.id;
                case "name":
                  return country.name || "-";
                case "organization_name":
                  return country.organization_name || "-";
                case "country_name":
                  return country.country_name || "-";
                case "company_name":
                  return country.company_name || "-";
                case "status":
                  return (
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={country.active}
                        onCheckedChange={() =>
                          handleToggleStatus(country.id, country.active)
                        }
                        disabled={!canEditCountry}
                        aria-label={`Toggle status for ${country.name || "headquarter"}`}
                      />
                      <span
                        className={`text-xs font-medium ${country.active ? "text-green-700" : "text-red-700"}`}
                      ></span>
                    </div>
                  );
                case "created_at":
                  return country.created_at
                    ? new Date(country.created_at).toLocaleDateString()
                    : "-";
                default:
                  return "-";
              }
            }}
            leftActions={
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-[#C72030] hover:bg-[#A01020] text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Headquarter
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
          fetchCountries(
            currentPage,
            perPage,
            debouncedSearchQuery,
            appliedFilters
          );
          setIsAddModalOpen(false);
        }}
        countriesDropdown={countriesDropdown}
        companiesDropdown={companiesDropdown}
        organizationsDropdown={organizationsDropdown}
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
              fetchCountries(
                currentPage,
                perPage,
                debouncedSearchQuery,
                appliedFilters
              );
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
          console.warn("Uploading countries file:", file);
          toast.success("Countries uploaded successfully");
          fetchCountries(
            currentPage,
            perPage,
            debouncedSearchQuery,
            appliedFilters
          );
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
