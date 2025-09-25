import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Eye,
  Filter,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
  RefreshCw,
  Settings,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { API_CONFIG } from "@/config/apiConfig";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { PermitFilterModal } from "@/components/PermitFilterModal";
import { debounce } from "lodash";

// Type definitions for permit data
interface Permit {
  id: number;
  created_at: string;
  updated_at: string;
  status: string;
  permit_for: string;
  reference_number: string;
  permit_type: string;
  location: string;
  requested_by: string;
  jsa_submitted: boolean;
  form_submitted: string | null;
  department_name: string;
  status_color_code: string;
  jsa_data: any;
  permit_jsa_url: string;
  print_jsa: any;
  vender_name?: string;
  expiry_date?: string;
}

interface PaginationInfo {
  current_page: number;
  total_count: number;
  total_pages: number;
}

interface PermitsResponse {
  total_permits: number;
  permits: Permit[];
  pagination: PaginationInfo;
}

// Type definition for permit counts response
interface PermitCounts {
  total: number;
  draft: number;
  hold: number;
  open: number;
  approved: number;
  rejected: number;
  extended: number;
  closed: number;
  expired: number;
}

// Column configuration for EnhancedTable
const permitColumns = [
  {
    key: 'id',
    label: 'Ref No.',
    sortable: true,
    draggable: true,
    defaultVisible: true
  },
  {
    key: 'reference_number',
    label: 'ID',
    sortable: true,
    draggable: true,
    defaultVisible: true
  },
  {
    key: 'permit_type',
    label: 'Permit Type',
    sortable: true,
    draggable: true,
    defaultVisible: true
  },
  {
    key: 'permit_for',
    label: 'Permit For',
    sortable: true,
    draggable: true,
    defaultVisible: true
  },
  {
    key: 'requested_by',
    label: 'Created By',
    sortable: true,
    draggable: true,
    defaultVisible: true
  },
  {
    key: 'department_name',
    label: 'Designation',
    sortable: true,
    draggable: true,
    defaultVisible: true
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    draggable: true,
    defaultVisible: true
  },
  {
    key: 'location',
    label: 'Location',
    sortable: true,
    draggable: true,
    defaultVisible: true
  },
  {
    key: 'vender_name',
    label: 'Vendor Name',
    sortable: true,
    draggable: true,
    defaultVisible: true
  },
  {
    key: 'created_at',
    label: 'Created On',
    sortable: true,
    draggable: true,
    defaultVisible: true
  },
  {
    key: 'expiry_date',
    label: 'Permit Expiry/Extend Date',
    sortable: true,
    draggable: true,
    defaultVisible: true
  }
];

// API function to fetch permits
const fetchPermits = async (page: number = 1, filters?: string): Promise<PermitsResponse> => {
  let url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PERMITS}?page=${page}`;

  if (filters) {
    url += `&${filters}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${API_CONFIG.TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch permits');
  }

  return await response.json();
};

// API function to fetch permit counts
const fetchPermitCounts = async (): Promise<PermitCounts> => {
  const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PERMIT_COUNTS}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${API_CONFIG.TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch permit counts');
  }

  return await response.json();
};

const calculateStats = (permits: Permit[]) => {
  return {
    total: permits.length,
    active: permits.filter(p => p.status === "Active").length,
    pending: permits.filter(p => p.status === "Pending Approval").length,
    completed: permits.filter(p => p.status === "Completed").length,
    expired: permits.filter(p => p.status === "Expired").length,
    draft: permits.filter(p => p.status === "Draft").length,
  };
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active": return "bg-green-100 text-green-800";
    case "Pending Approval": return "bg-yellow-100 text-yellow-800";
    case "Completed": return "bg-blue-100 text-blue-800";
    case "Expired": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getRiskColor = (risk: string) => {
  switch (risk) {
    case "High": return "bg-red-100 text-red-800";
    case "Medium": return "bg-yellow-100 text-yellow-800";
    case "Low": return "bg-green-100 text-green-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

export const PermitToWorkDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [permits, setPermits] = useState<Permit[]>([]);
  const [originalPermits, setOriginalPermits] = useState<Permit[]>([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [permitCounts, setPermitCounts] = useState<PermitCounts>({
    total: 0,
    draft: 0,
    hold: 0,
    open: 0,
    approved: 0,
    rejected: 0,
    extended: 0,
    closed: 0,
    expired: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state to maintain filters across page navigation
  const [currentFilters, setCurrentFilters] = useState<string>('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize] = useState(20);

  // Fetch permits on component mount and when page/filters change
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Fetch both permits and counts in parallel
        // Pass current filters to maintain filtering across page navigation
        const [permitsResponse, countsResponse] = await Promise.all([
          fetchPermits(currentPage, currentFilters),
          fetchPermitCounts()
        ]);

        setPermits(permitsResponse.permits);
        // Only update originalPermits if no filters are applied
        if (!currentFilters) {
          setOriginalPermits(permitsResponse.permits);
        }
        setPermitCounts(countsResponse);

        // Update pagination info
        if (permitsResponse.pagination) {
          setCurrentPage(permitsResponse.pagination.current_page || 1);
          setTotalPages(permitsResponse.pagination.total_pages || 1);
          setTotalCount(permitsResponse.pagination.total_count || 0);
        } else {
          // Fallback pagination info if not provided
          setCurrentPage(1);
          setTotalPages(1);
          setTotalCount(permitsResponse.permits?.length || 0);
        }

        setError(null);
      } catch (err) {
        setError('Failed to load permit data');
        console.error('Error fetching permit data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentPage, currentFilters]); // Add currentFilters to dependencies

  const debouncedSearch = useCallback(
    debounce(async (searchValue: string) => {
      try {
        setLoading(true);
        setCurrentPage(1); // Reset to first page on search

        let filters = currentFilters;
        if (searchValue) {
          const searchParam = `q[reference_number_or_permit_type_name_cont]=${encodeURIComponent(searchValue)}`;
          filters = filters ? `${filters}&${searchParam}` : searchParam;
        }

        const permitsResponse = await fetchPermits(1, filters);
        setPermits(permitsResponse.permits || []);

        if (permitsResponse.pagination) {
          setCurrentPage(permitsResponse.pagination.current_page || 1);
          setTotalPages(permitsResponse.pagination.total_pages || 1);
          setTotalCount(permitsResponse.pagination.total_count || 0);
        } else {
          setCurrentPage(1);
          setTotalPages(1);
          setTotalCount(permitsResponse.permits?.length || 0);
        }

        setError(null);
        setIsFilterApplied(!!searchValue || !!currentFilters);
      } catch (err) {
        setError('Failed to load permit data');
        console.error('Error fetching search results:', err);
      } finally {
        setLoading(false);
      }
    }, 500), // 500ms debounce delay
    [currentFilters]
  );

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const stats = calculateStats(permits);

  const handleAddPermit = () => {
    navigate("/safety/permit/add");
  };

  const handleViewPermit = (permitId: number) => {
    navigate(`/safety/permit/details/${permitId}`);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Refresh permits data
  const handleRefresh = async () => {
    try {
      setLoading(true);

      // Fetch both permits and counts in parallel
      const [permitsResponse, countsResponse] = await Promise.all([
        fetchPermits(currentPage),
        fetchPermitCounts()
      ]);

      setPermits(permitsResponse.permits);
      setOriginalPermits(permitsResponse.permits);
      setPermitCounts(countsResponse);

      // Update pagination info
      if (permitsResponse.pagination) {
        setCurrentPage(permitsResponse.pagination.current_page || 1);
        setTotalPages(permitsResponse.pagination.total_pages || 1);
        setTotalCount(permitsResponse.pagination.total_count || 0);
      } else {
        // Fallback pagination info if not provided
        setCurrentPage(currentPage);
        setTotalPages(1);
        setTotalCount(permitsResponse.permits?.length || 0);
      }

      setError(null);
      setIsFilterApplied(false);
    } catch (err) {
      setError('Failed to load permit data');
      console.error('Error fetching permit data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle filtered results from the filter modal
  const handleFilteredResults = (filteredPermits: Permit[], paginationInfo?: PaginationInfo, filterString?: string) => {
    setPermits(filteredPermits);
    setIsFilterApplied(true);

    // Store the filter string to maintain filters across page navigation
    setCurrentFilters(filterString || '');

    // Reset to page 1 when applying new filters
    setCurrentPage(1);

    // Update pagination info if provided
    if (paginationInfo) {
      setCurrentPage(paginationInfo.current_page || 1);
      setTotalPages(paginationInfo.total_pages || 1);
      setTotalCount(paginationInfo.total_count || 0);
    } else {
      // Reset pagination to single page if no pagination info provided
      setCurrentPage(1);
      setTotalPages(1);
      setTotalCount(filteredPermits.length);
    }
  };

  // Clear filters and restore original data
  const handleClearFilters = () => {
    setPermits(originalPermits);
    setIsFilterApplied(false);

    // Clear the current filters
    setCurrentFilters('');

    // Reset pagination to reflect the original data
    // This will trigger a refresh from the server
    setCurrentPage(1);
  };

  // Navigation functions for StatCards
  const handleStatCardClick = async (status?: string) => {
    try {
      setLoading(true);
      setCurrentPage(1); // Reset to first page when filtering

      let filters = '';
      if (status) {
        filters = `q[status_eq]=${status}`;
      }

      // Update current filters state
      setCurrentFilters(filters);

      const permitsResponse = await fetchPermits(1, filters);

      setPermits(permitsResponse.permits || []);

      // Update pagination info
      if (permitsResponse.pagination) {
        setCurrentPage(permitsResponse.pagination.current_page || 1);
        setTotalPages(permitsResponse.pagination.total_pages || 1);
        setTotalCount(permitsResponse.pagination.total_count || 0);
      } else {
        // Fallback pagination info if not provided
        setCurrentPage(1);
        setTotalPages(1);
        setTotalCount(permitsResponse.permits?.length || 0);
      }

      setIsFilterApplied(!!status); // Set filter applied if status is provided
      setError(null);
    } catch (err) {
      setError('Failed to load permit data');
      console.error('Error fetching filtered permits:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle page change for pagination
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || loading) return;
    setCurrentPage(newPage);
  };

  // Render cell content for EnhancedTable
  const renderCell = (permit: Permit, columnKey: string) => {
    switch (columnKey) {
      case 'id':
        return <span className="font-medium">{permit.id}</span>;
      case 'reference_number':
        return permit.reference_number;
      case 'permit_type':
        return permit.permit_type;
      case 'permit_for':
        return permit.permit_for;
      case 'requested_by':
        return permit.requested_by;
      case 'department_name':
        return permit.department_name;
      case 'status':
        return (
          <Badge
            className="text-white"
            style={{ backgroundColor: permit.status_color_code }}
          >
            {permit.status}
          </Badge>
        );
      case 'location':
        return (
          <span className="max-w-xs truncate block" title={permit.location}>
            {permit.location}
          </span>
        );
      case 'vendor_name':
        return permit.vender_name || '-';
      case 'created_at':
        return formatDate(permit.created_at);
      case 'expiry_date':
        return permit.expiry_date ? formatDate(permit.expiry_date) : '-';
      default:
        return permit[columnKey as keyof Permit] || '-';
    }
  };

  // Render actions for each row
  const renderActions = (permit: Permit) => (
    <div className="flex items-center gap-2">
      <div title="View permit details">
        <Eye
          className="w-5 h-5 text-gray-600 cursor-pointer hover:text-[#C72030]"
          onClick={(e) => {
            e.stopPropagation();
            console.log("Eye clicked for permit:", permit.id);
            handleViewPermit(permit.id);
          }}
        />
      </div>
    </div>
  );

  const renderPaginationItems = () => {
    const items = [];
    const showEllipsis = totalPages > 7;

    if (showEllipsis) {
      // Show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => handlePageChange(1)}
            isActive={currentPage === 1}
            className={currentPage === 1 ? "bg-[#C72030] text-white" : ""}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Show ellipsis if current page is far from start
      if (currentPage > 4) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Show current page and neighbors
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
              className={currentPage === i ? "bg-[#C72030] text-white" : ""}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      // Show ellipsis if current page is far from end
      if (currentPage < totalPages - 3) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Show last page
      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              onClick={() => handlePageChange(totalPages)}
              isActive={currentPage === totalPages}
              className={currentPage === totalPages ? "bg-[#C72030] text-white" : ""}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
              className={currentPage === i ? "bg-[#C72030] text-white" : ""}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  const StatCard = ({ icon, label, value, onClick }: any) => (
    <div
      className="bg-[#f6f4ee] p-6 rounded-lg shadow-[0px_2px_18px_rgba(45,45,45,0.1)] flex items-center gap-4 cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={onClick}
    >
      <div className="w-14 h-14 bg-[#FBEDEC] rounded-full flex items-center justify-center">
        {React.cloneElement(icon, { className: `w-6 h-6 text-[#C72030]` })}
      </div>
      <div>
        <div className="text-2xl font-bold text-[#C72030]">{value}</div>
        <div className="text-sm font-medium text-gray-600">{label}</div>
      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6">
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200">
          <TabsTrigger
            value="list"
            className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
          >
            <FileText className="w-4 h-4" />
            List
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
          >
            <Settings className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-4 mb-6">
            <StatCard
              icon={<FileText />}
              label="Total Permits"
              value={permitCounts.total}
              onClick={() => handleStatCardClick()}
            />
            <StatCard
              icon={<CheckCircle />}
              label="Approved"
              value={permitCounts.approved}
              onClick={() => handleStatCardClick('Approved')}
            />
            <StatCard
              icon={<Clock />}
              label="Open"
              value={permitCounts.open}
              onClick={() => handleStatCardClick('Open')}
            />
            <StatCard
              icon={<CheckCircle />}
              label="Closed"
              value={permitCounts.closed}
              onClick={() => handleStatCardClick('Closed')}
            />
            <StatCard
              icon={<AlertTriangle />}
              label="Draft"
              value={permitCounts.draft}
              onClick={() => handleStatCardClick('Draft')}
            />
            <StatCard
              icon={<AlertTriangle />}
              label="Hold"
              value={permitCounts.hold}
              onClick={() => handleStatCardClick('Hold')}
            />
            <StatCard
              icon={<AlertTriangle />}
              label="Rejected"
              value={permitCounts.rejected}
              onClick={() => handleStatCardClick('Rejected')}
            />
            <StatCard
              icon={<AlertTriangle />}
              label="Extended"
              value={permitCounts.extended}
              onClick={() => handleStatCardClick('Extended')}
            />
            <StatCard
              icon={<AlertTriangle />}
              label="Expired"
              value={permitCounts.expired}
              onClick={() => handleStatCardClick('Expired')}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6 ">
            <div className="flex items-center gap-2">
              <Button
                onClick={handleAddPermit}
                className="bg-[#C72030] hover:bg-[#B01D2A] text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Permit
              </Button>
            </div>
          </div>

          <EnhancedTable
            data={permits}
            columns={permitColumns}
            renderCell={renderCell}
            renderActions={renderActions}
            onRowClick={(permit) => handleViewPermit(permit.id)}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            searchPlaceholder="Search permits..."
            enableExport={true}
            exportFileName="permits-export"
            pagination={false} // Keep client-side pagination disabled since we handle server-side
            pageSize={pageSize}
            loading={loading}
            onFilterClick={() => setIsFilterModalOpen(true)}
            emptyMessage={error || "No permits found"}
            storageKey="permit-dashboard-table"
          />

          {/* Standard pagination like AMC/Asset dashboards */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-700">
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} results
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  {renderPaginationItems()}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Permit Status Distribution</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total: {permitCounts.total}</span>
                  <span>100%</span>
                </div>
                <div className="flex justify-between">
                  <span>Approved: {permitCounts.approved}</span>
                  <span>{permitCounts.total > 0 ? ((permitCounts.approved / permitCounts.total) * 100).toFixed(1) : 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Open: {permitCounts.open}</span>
                  <span>{permitCounts.total > 0 ? ((permitCounts.open / permitCounts.total) * 100).toFixed(1) : 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Closed: {permitCounts.closed}</span>
                  <span>{permitCounts.total > 0 ? ((permitCounts.closed / permitCounts.total) * 100).toFixed(1) : 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Draft: {permitCounts.draft}</span>
                  <span>{permitCounts.total > 0 ? ((permitCounts.draft / permitCounts.total) * 100).toFixed(1) : 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Hold: {permitCounts.hold}</span>
                  <span>{permitCounts.total > 0 ? ((permitCounts.hold / permitCounts.total) * 100).toFixed(1) : 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Rejected: {permitCounts.rejected}</span>
                  <span>{permitCounts.total > 0 ? ((permitCounts.rejected / permitCounts.total) * 100).toFixed(1) : 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Extended: {permitCounts.extended}</span>
                  <span>{permitCounts.total > 0 ? ((permitCounts.extended / permitCounts.total) * 100).toFixed(1) : 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Expired: {permitCounts.expired}</span>
                  <span>{permitCounts.total > 0 ? ((permitCounts.expired / permitCounts.total) * 100).toFixed(1) : 0}%</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Permit Types</h3>
              <div className="space-y-2">
                {permits.reduce((acc: any[], permit) => {
                  const existingType = acc.find(item => item.type === permit.permit_type);
                  if (existingType) {
                    existingType.count++;
                  } else {
                    acc.push({ type: permit.permit_type, count: 1 });
                  }
                  return acc;
                }, []).map((typeData, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{typeData.type}: {typeData.count}</span>
                    <span>{permits.length > 0 ? ((typeData.count / permits.length) * 100).toFixed(1) : 0}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <PermitFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleFilteredResults}
        onLoadingChange={setLoading}
        onReset={handleClearFilters}
      />
    </div>
  );
};