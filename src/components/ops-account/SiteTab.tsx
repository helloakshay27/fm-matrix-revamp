import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Download,
  Filter,
  Upload,
  Eye,
  Edit,
  Trash2,
  Loader2,
  MapPin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { AddSiteModal } from "@/components/AddSiteModal";
import { DeleteSiteModal } from "@/components/DeleteSiteModal";
import { SiteFilterModal, SiteFilters } from "@/components/SiteFilterModal";
import { ExportModal } from "@/components/ExportModal";
import { BulkUploadModal } from "@/components/BulkUploadModal";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { TicketPagination } from "@/components/TicketPagination";
import { toast } from "sonner";
import { useApiConfig } from "@/hooks/useApiConfig";
import { getUser } from "@/utils/auth";
import { useDebounce } from "@/hooks/useDebounce";
import { SiteData } from "@/services/siteService";

// Type definitions for the API response
interface SiteItem {
  id: number;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country_id: number;
  region_id: number;
  company_id: number;
  site_type: string;
  active: boolean;
  latitude: number;
  longitude: number;
  contact_person: string;
  contact_email: string;
  contact_phone: string;
  description: string;
  created_at: string;
  updated_at: string;
  country_name?: string;
  region_name?: string;
  company_name?: string;
  attachfile?: {
    id?: number;
    document_file_name?: string;
    document_content_type?: string;
    document_url?: string;
  };
}

interface SiteApiResponse {
  sites: SiteItem[];
  data: SiteItem[];
  pagination?: {
    current_page: number;
    per_page: number;
    total_pages: number;
    total_count: number;
    has_next_page: boolean;
    has_prev_page: boolean;
  };
}

interface SiteTabProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  entriesPerPage: string;
  setEntriesPerPage: (entries: string) => void;
}

// Column configuration for the enhanced table
const columns: ColumnConfig[] = [
  {
    key: "actions",
    label: "Action",
    sortable: false,
    hideable: false,
    draggable: false,
  },

  {
    key: "name",
    label: "Site Name",
    sortable: true,
    hideable: true,
    draggable: true,
  },
  {
    key: "code",
    label: "Code",
    sortable: true,
    hideable: true,
    draggable: true,
  },
  {
    key: "location",
    label: "Location",
    sortable: true,
    hideable: true,
    draggable: true,
  },
  {
    key: "company",
    label: "Company",
    sortable: true,
    hideable: true,
    draggable: true,
  },
  {
    key: "region",
    label: "Region",
    sortable: true,
    hideable: true,
    draggable: true,
  },
  {
    key: "site_type",
    label: "Type",
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
  {
    key: "site_image",
    label: "Site Image",
    sortable: false,
    hideable: true,
    draggable: true,
  },
];

export const SiteTab: React.FC<SiteTabProps> = ({
  searchQuery,
  setSearchQuery,
  entriesPerPage,
  setEntriesPerPage,
}) => {
  const navigate = useNavigate();
  const { getFullUrl, getAuthHeader } = useApiConfig();

  // State management
  const [sites, setSites] = useState<SiteItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchQuery = useDebounce(searchTerm, 1000);
  const [appliedFilters, setAppliedFilters] = useState<SiteFilters>({});
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
  const [selectedSiteId, setSelectedSiteId] = useState<number | null>(null);
  const [selectedSiteData, setSelectedSiteData] = useState<SiteData | null>(
    null
  );

  // Dropdowns and permissions
  type DropdownItem = { id: number; name: string };
  const [companiesDropdown, setCompaniesDropdown] = useState<DropdownItem[]>(
    []
  );
  const [regionsDropdown, setRegionsDropdown] = useState<DropdownItem[]>([]);
  const [countriesDropdown, setCountriesDropdown] = useState<DropdownItem[]>(
    []
  );
  const [canEditSite, setCanEditSite] = useState(false);

  const user = getUser() || {
    id: 0,
    firstname: "Guest",
    lastname: "",
    email: "",
  };

  const checkEditPermission = useCallback(() => {
    const userEmail = user.email || "";
    const allowedEmails = [
      "abhishek.sharma@lockated.com",
      "adhip.shetty@lockated.com",
      "helloakshay27@gmail.com",
      "dev@lockated.com",
      "sumitra.patil@lockated.com",
    ];
    setCanEditSite(allowedEmails.includes(userEmail));
  }, [user.email]);

  // Effects moved below function declarations to avoid temporal dead zone

  // Fetch sites data from API
  const fetchSites = useCallback(
    async (page = 1, per_page = 10, search = "", filters: SiteFilters = {}) => {
      setLoading(true);
      try {
        // Build API URL with parameters
        let apiUrl = getFullUrl(
          `/pms/sites/all_site_list.json?page=${page}&per_page=${per_page}`
        );

        // Add search parameter
        if (search.trim()) {
          apiUrl += `&q[search_all_fields_cont]=${encodeURIComponent(search.trim())}`;
        }

        // Add filter parameters
        if (filters.companyId) {
          apiUrl += `&q[company_id_eq]=${filters.companyId}`;
        }

        if (filters.regionId) {
          apiUrl += `&q[region_id_eq]=${filters.regionId}`;
        }

        if (filters.countryId) {
          apiUrl += `&q[country_id_eq]=${filters.countryId}`;
        }

        if (filters.site_type) {
          apiUrl += `&q[site_type_cont]=${encodeURIComponent(filters.site_type)}`;
        }

        if (filters.status) {
          const isActive = filters.status === "active";
          apiUrl += `&q[active_eq]=${isActive}`;
        }

        console.warn("🔗 API URL with filters:", apiUrl);

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

        const result: SiteApiResponse = await response.json();
        console.warn("Sites API response:", result);

        if (result && Array.isArray(result.sites)) {
          setSites(result.sites);
          // Set pagination if available, otherwise use default
          if (result.pagination) {
            setPagination(result.pagination);
          } else {
            setPagination({
              current_page: page,
              per_page: per_page,
              total_pages: Math.ceil(result.sites.length / per_page),
              total_count: result.sites.length,
              has_next_page: false,
              has_prev_page: false,
            });
          }
        } else if (result && Array.isArray(result.data)) {
          setSites(result.data);
        } else if (Array.isArray(result)) {
          setSites(result);
        } else {
          throw new Error("Invalid sites data format");
        }
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error("Error fetching sites:", error);
        toast.error(`Failed to load sites: ${msg}`, {
          duration: 5000,
        });
        setSites([]);
      } finally {
        setLoading(false);
      }
    },
    [getFullUrl, getAuthHeader]
  );

  const fetchCompaniesDropdown = useCallback(async () => {
    try {
      const response = await fetch(
        getFullUrl("/pms/company_setups/company_index.json"),
        {
          headers: {
            Authorization: getAuthHeader(),
            "Content-Type": "application/json",
          },
        }
      );

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
      console.error("Error fetching companies:", error);
    }
  }, [getFullUrl, getAuthHeader]);

  const fetchRegionsDropdown = useCallback(async () => {
    try {
      const response = await fetch(getFullUrl("/pms/regions.json"), {
        headers: {
          Authorization: getAuthHeader(),
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data && Array.isArray(data.regions)) {
          setRegionsDropdown(data.regions);
        } else if (data && Array.isArray(data.data)) {
          setRegionsDropdown(data.data);
        } else if (Array.isArray(data)) {
          setRegionsDropdown(data);
        }
      }
    } catch (error) {
      console.error("Error fetching regions:", error);
    }
  }, [getFullUrl, getAuthHeader]);

  const fetchCountriesDropdown = useCallback(async () => {
    try {
      const response = await fetch(getFullUrl("/headquarters.json"), {
        headers: {
          Authorization: getAuthHeader(),
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.warn("Countries API response:", data);

        if (Array.isArray(data)) {
          // Handle direct array format
          const uniqueCountries = new Map();
          (
            data as Array<{
              id?: number;
              country_id?: number;
              name?: string;
              country_name?: string;
            }>
          ).forEach((country) => {
            const id = country?.country_id || country?.id;
            const name = country?.country_name || country?.name;
            if (id && name && !uniqueCountries.has(id)) {
              uniqueCountries.set(id, name);
            }
          });

          const countriesArray = Array.from(uniqueCountries.entries()).map(
            ([id, name]) => ({ id: Number(id), name: String(name) })
          );
          setCountriesDropdown(countriesArray);
        } else if (
          data &&
          data.headquarters &&
          Array.isArray(data.headquarters)
        ) {
          // Handle nested headquarters format
          const uniqueCountries = new Map();
          (
            data.headquarters as Array<{
              country_id?: number;
              country_name?: string;
            }>
          ).forEach((hq) => {
            const id = hq?.country_id;
            const name = hq?.country_name;
            if (id && name && !uniqueCountries.has(id)) {
              uniqueCountries.set(id, name);
            }
          });

          const countriesArray = Array.from(uniqueCountries.entries()).map(
            ([id, name]) => ({ id: Number(id), name: String(name) })
          );
          setCountriesDropdown(countriesArray);
        } else {
          console.error("Countries data format unexpected:", data);
          setCountriesDropdown([]);
        }
      } else {
        toast.error("Failed to fetch countries");
        setCountriesDropdown([]);
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
      toast.error("Error fetching countries");
      setCountriesDropdown([]);
    }
  }, [getFullUrl, getAuthHeader]);

  // Load dropdowns and permissions on mount (after declarations)
  useEffect(() => {
    fetchCompaniesDropdown();
    fetchRegionsDropdown();
    fetchCountriesDropdown();
    checkEditPermission();
  }, [
    fetchCompaniesDropdown,
    fetchRegionsDropdown,
    fetchCountriesDropdown,
    checkEditPermission,
  ]);

  // Load data on component mount and when page/perPage/filters change (after fetchSites is declared)
  useEffect(() => {
    fetchSites(currentPage, perPage, debouncedSearchQuery, appliedFilters);
  }, [currentPage, perPage, debouncedSearchQuery, appliedFilters, fetchSites]);

  // Handle filter application
  const handleApplyFilters = (filters: SiteFilters) => {
    console.warn("📊 Applying filters:", filters);
    setAppliedFilters(filters);
    setCurrentPage(1); // Reset to first page when applying filters
  };

  // Handle search
  const handleSearch = (term: string) => {
    console.warn("Search query:", term);
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
    // Force immediate search if query is empty (for clear search)
    if (!term.trim()) {
      fetchSites(1, perPage, "", appliedFilters);
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
    if (!companyId) return "Unknown";
    const company = companiesDropdown.find(
      (c) => c.id && c.id.toString() === companyId.toString()
    );
    return company ? company.name : "Unknown";
  };

  // Helper function to get region name
  const getRegionName = (regionId: number | null | undefined) => {
    if (!regionId) return "Unknown";
    const region = regionsDropdown.find(
      (r) => r.id && r.id.toString() === regionId.toString()
    );
    return region ? region.name : "Unknown";
  };

  // Helper function to get country name
  const getCountryName = (countryId: number | null | undefined) => {
    if (!countryId) return "Unknown";
    const country = countriesDropdown.find(
      (c) => c.id && c.id.toString() === countryId.toString()
    );
    return country ? country.name : "Unknown";
  };

  // Format date helper
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  // Toggle site active status
  const handleToggleStatus = async (siteId: number, currentStatus: boolean) => {
    if (!canEditSite) {
      toast.error("You do not have permission to change site status");
      return;
    }

    try {
      const response = await fetch(getFullUrl(`/pms/sites/${siteId}.json`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAuthHeader(),
        },
        body: JSON.stringify({ pms_site: { active: !currentStatus } }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast.success(
        `Site ${!currentStatus ? "activated" : "deactivated"} successfully`
      );
      // Refresh the data
      fetchSites(currentPage, perPage, debouncedSearchQuery, appliedFilters);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error("Error toggling site status:", error);
      toast.error(`Failed to update site status: ${msg}`);
    }
  };

  const totalRecords = pagination.total_count;
  const totalPages = pagination.total_pages;

  // Use API data directly instead of client-side filtering
  const displayedData = sites;

  // Render row function for enhanced table
  const renderRow = (site: SiteItem) => ({
    actions: (
      <div className="flex items-center gap-2">
        <button
          onClick={() => site?.id && handleView(site.id)}
          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
          title="View"
          disabled={!site?.id}
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={() => site?.id && handleEdit(site.id)}
          className="p-1 text-green-600 hover:bg-green-50 rounded"
          title="Edit"
          disabled={!canEditSite || !site?.id}
        >
          <Edit className="w-4 h-4" />
        </button>
        {/* <button
          onClick={() => site?.id && handleDelete(site.id)}
          className="p-1 text-red-600 hover:bg-red-50 rounded"
          title="Delete"
          disabled={!canEditSite || !site?.id}
        >
          <Trash2 className="w-4 h-4" />
        </button> */}
      </div>
    ),
    site_image: (
      <div className="flex items-center justify-center">
        {site?.attachfile?.document_url ? (
          <img
            src={site.attachfile.document_url}
            alt={
              site?.attachfile?.document_file_name || site?.name || "Site image"
            }
            className="h-12 w-12 object-cover rounded border border-gray-200"
            loading="lazy"
          />
        ) : (
          <div>-</div>
        )}
      </div>
    ),
    name: (
      <div className="flex items-center gap-3">
        {/* <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <MapPin className="w-4 h-4 text-blue-600" />
        </div> */}
        <div>
          <div className="font-medium">{site?.name || "N/A"}</div>
          {site?.description && (
            <div className="text-sm text-gray-500">{site.description}</div>
          )}
        </div>
      </div>
    ),
    code: (
      <div className="text-sm text-center font-mono">{site?.code || "-"}</div>
    ),
    location: (
      <div className="text-sm">
        <div className="font-medium">
          {site?.city || "Unknown"}, {site?.state || "Unknown"}
        </div>
        <div className="text-gray-500">{site?.address || "No address"}</div>
        {site?.postal_code && (
          <div className="text-gray-500">ZIP: {site.postal_code}</div>
        )}
      </div>
    ),
    company: (
      <span className="text-sm text-gray-600">
        {getCompanyName(site?.company_id)}
      </span>
    ),
    region: (
      <span className="text-sm text-gray-600">
        {getRegionName(site?.region_id)}
      </span>
    ),
    site_type: (
      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
        {site?.site_type || "Standard"}
      </span>
    ),
    status: (
      <div className="flex items-center justify-center">
        <Switch
          checked={!!site?.active}
          onCheckedChange={() =>
            site?.id && handleToggleStatus(site.id, !!site.active)
          }
          disabled={!canEditSite}
          aria-label={`Toggle status for ${site?.name || "site"}`}
        />
      </div>
    ),
    created_at: (
      <span className="text-sm text-gray-600">
        {formatDate(site?.created_at)}
      </span>
    ),
  });

  const handleView = (id: number) => {
    console.warn("View site:", id);
    // Navigate to site details page
    navigate(`/ops-console/master/location/account/sites/details/${id}`);
  };

  const handleEdit = (id: number) => {
    console.warn("Edit site:", id);
    setSelectedSiteId(id);
    // Fetch the full site data from the API
    fetch(getFullUrl(`/pms/sites/${id}.json`), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: getAuthHeader(),
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        const site = result.site;
        if (site) {
          // Map all fields from API response, including all boolean/toggle fields
          const mappedSiteData: SiteData = {
            id: site.id,
            name: site.name,
            code: site.code,
            address: site.address,
            city: site.city,
            district: site.district,
            state: site.state,
            postal_code: site.postal_code,
            country_id: site.country_id ?? site.headquarter_id,
            region_id: site.region_id,
            company_id: site.company_id,
            site_type: site.site_type,
            active: site.active,
            latitude: site.latitude,
            longitude: site.longitude,
            contact_person: site.contact_person,
            contact_email: site.contact_email,
            contact_phone: site.contact_phone,
            description: site.description,
            created_at: site.created_at,
            updated_at: site.updated_at,
            country_name: site.country_name ?? site.headquarter_name,
            region_name: site.region_name,
            company_name: site.company_name,
            headquarter_id: site.headquarter_id,
            image_url: site.image_url ? [...site.image_url] : [],
            google_maps_url: site.google_maps_url,
            attachfile: site.image_url ? [...site.image_url] : [],
            // All boolean/toggle fields for switches in modal
            skip_host_approval: site.skip_host_approval,
            survey_enabled: site.survey_enabled,
            fitout_enabled: site.fitout_enabled,
            mailroom_enabled: site.mailroom_enabled,
            create_breakdown_ticket: site.create_breakdown_ticket,
            parking_enabled: site.parking_enabled,
            default_visitor_pass: site.default_visitor_pass,
            ecommerce_service_enabled: site.ecommerce_service_enabled,
            operational_audit_enabled: site.operational_audit_enabled,
            steps_enabled: site.steps_enabled,
            transportation_enabled: site.transportation_enabled,
            business_card_enabled: site.business_card_enabled,
            visitor_enabled: site.visitor_enabled,
            govt_id_enabled: site.govt_id_enabled,
            visitor_host_mandatory: site.visitor_host_mandatory,
            // Optionally include all other fields from API response
            ...site
          };
          setSelectedSiteData(mappedSiteData);
          setIsEditModalOpen(true);
        } else {
          toast.error("Site not found");
        }
      })
      .catch((error) => {
        console.error("Error fetching site by id:", error);
        toast.error("Failed to fetch site details");
      });
  };

  const handleDelete = (id: number) => {
    console.warn("Delete site:", id);
    setSelectedSiteId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    console.log("Delete Confirm Clicked", selectedSiteId);
    if (!selectedSiteId) return;

    if (!canEditSite) {
      toast.error("You do not have permission to delete sites");
      return;
    }

    try {
      const response = await fetch(
        getFullUrl(`/pms/sites/${selectedSiteId}.json`),
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: getAuthHeader(),
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast.success("Site deleted successfully!", {
        duration: 3000,
      });

      // Refresh the data
      fetchSites(currentPage, perPage, debouncedSearchQuery, appliedFilters);
      setIsDeleteModalOpen(false);
      setSelectedSiteId(null);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error("Error deleting site:", error);
      toast.error(`Failed to delete site: ${msg}`, {
        duration: 5000,
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Sites</h1>
      </header>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-[#C72030]" />
          <span className="ml-2 text-gray-600">Loading sites...</span>
        </div>
      )}

      {!loading && (
        <>
          <EnhancedTaskTable
            data={displayedData}
            columns={columns}
            renderRow={renderRow}
            storageKey="site-dashboard-v1"
            hideTableExport={true}
            hideTableSearch={false}
            enableSearch={true}
            searchTerm={searchTerm}
            onSearchChange={handleSearch}
            onFilterClick={() => setIsFilterOpen(true)}
            leftActions={
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => setIsAddModalOpen(true)}
                disabled={!canEditSite}
              >
                <Plus className="w-4 h-4 mr-2" /> Add Site
              </Button>
            }
            // rightActions={(
            //   <div className="flex items-center gap-2">
            //     <Button
            //       variant="outline"
            //       size="sm"
            //       onClick={() => setIsBulkUploadOpen(true)}
            //       disabled={!canEditSite}
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
      <AddSiteModal
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
          setSelectedSiteData(null);
        }}
        onSiteAdded={() => {
          fetchSites(
            currentPage,
            perPage,
            debouncedSearchQuery,
            appliedFilters
          );
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
          setSelectedSiteData(null);
        }}
        editingSite={isEditModalOpen ? selectedSiteData : null}
      />

      {selectedSiteId !== null && (
        <DeleteSiteModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedSiteId(null);
          }}
          onConfirm={handleDeleteConfirm}
          siteId={selectedSiteId}
        />
      )}

      <SiteFilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
        companiesDropdown={companiesDropdown}
        regionsDropdown={regionsDropdown}
        countriesDropdown={countriesDropdown}
      />

      <BulkUploadModal
        isOpen={isBulkUploadOpen}
        onClose={() => setIsBulkUploadOpen(false)}
        title="Bulk Upload Sites"
        description="Upload a CSV file to import sites"
        onImport={async (file: File) => {
          // Handle bulk upload logic here
          console.warn("Uploading sites file:", file);
          toast.success("Sites uploaded successfully");
          fetchSites(
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
