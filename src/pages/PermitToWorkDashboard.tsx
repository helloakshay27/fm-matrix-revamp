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
  PauseCircle,
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
    key: 'srNo',
    label: 'Sr. No.',
    sortable: false,
    draggable: false,
    defaultVisible: true
  },
  {
    key: 'id',
    label: 'ID',
    sortable: true,
    draggable: true,
    defaultVisible: true
  },

  {
    key: 'reference_number',
    label: 'Ref No',
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
    sortable: false,
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
  },
  {
    key: 'label',
    label: 'Label',
    sortable: false,
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
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
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
  // Handle Excel export
  const handleExcelExport = async () => {
    try {
      setLoading(true);
      const exportUrl = `${API_CONFIG.BASE_URL}/pms/permits/export.xlsx`;

      let url = exportUrl;
      if (currentFilters) {
        url += `?${currentFilters}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${API_CONFIG.TOKEN}`,
        },
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      // Get the blob from the response
      const blob = await response.blob();

      // Create a URL for the blob
      const downloadUrl = window.URL.createObjectURL(blob);

      // Create a temporary link element
      const link = document.createElement('a');
      link.href = downloadUrl;

      // Set the filename for the download
      const currentDate = new Date().toISOString().split('T')[0];
      link.download = `permits-export-${currentDate}.xlsx`;

      // Append link to document, click it, and remove it
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the URL object
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error exporting permits:', error);
      setError('Failed to export permits');
    } finally {
      setLoading(false);
    }
  };

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
      case 'srNo': {
        // Find index of permit in current page
        const index = permits.findIndex(p => p.id === permit.id);
        // Use 10 records per page for serial number calculation
        return <span className="font-medium">{(currentPage - 1) * 10 + index + 1}</span>;
      }
      case 'id':
        return <span className="font-medium">{permit.id}</span>;
      case 'label':
        const color = permit["color"] || '#E5E7EB';
        if (color.toLowerCase() === '#6c3483') {
          return 'Permit To Complete';
        } else if (color.toLowerCase() === '#008081') {
          return 'Awaiting Closure';
        } else {
          return '-';
        }
      case 'reference_number':
        return permit.reference_number;
      case 'permit_type': {
        const bgColor = permit["color"] || '#E5E7EB';
        // If color is #6C3483, set text color to white
        // const textColor = bgColor.toLowerCase() === '#6c3483' ? '#fff' : '#222';
        const textColor = (bgColor.toLowerCase() === '#6c3483' || bgColor.toLowerCase() === '#008081') ? '#fff' : '#222';

        return (
          <span
            className="px-2 py-1 rounded text-sm font-semibold"
            style={{ backgroundColor: bgColor, color: textColor }}
          >
            {permit.permit_type}
          </span>
        );
      }
      case 'permit_for':
        return <div className="w-[200px] text-ellipsis overflow-hidden">{permit.permit_for}</div>;
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
      <div className="w-14 h-14 bg-[#C4B89D54] flex items-center justify-center">
        {React.cloneElement(icon, { className: `w-6 h-6 text-[#C72030]` })}
      </div>
      <div>
        <div className="text-2xl font-semibold text-[#1A1A1A]">{value}</div>
        <div className="text-sm font-medium text-[#1A1A1A]">{label}</div>
      </div>
    </div>
  );

  const leftActions = (
    <div className="flex items-center gap-2">
      <Button
        onClick={handleAddPermit}
        className="bg-[#C72030] hover:bg-[#B01D2A] text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Create Permit
      </Button>
    </div>
  )

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
              icon={<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M28.2321 16.2C27.1429 21.6386 23.0365 26.7587 17.2725 27.9036C11.5085 29.0485 5.65936 26.3712 2.76543 21.2636C-0.128499 16.156 0.585937 9.77066 4.53738 5.42673C8.48882 1.08278 15.1608 -0.115619 20.6072 2.0598" stroke="#C72030" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M9.71484 14.024L15.1612 19.4625L28.2326 5.32227" stroke="#C72030" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              }
              label="Approved"
              value={permitCounts.approved}
              onClick={() => handleStatCardClick('Approved')}
            />
            <StatCard
              icon={<svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.5 30C23.5082 30 30 23.5082 30 15.5C30 7.49188 23.5082 1 15.5 1C7.49188 1 1 7.49188 1 15.5C1 23.5082 7.49188 30 15.5 30Z" stroke="#C72030" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M15.5 5.83301V15.4997" stroke="#C72030" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M22.3311 22.3311L15.5 15.5" stroke="#C72030" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              }
              label="Open"
              value={permitCounts.open}
              onClick={() => handleStatCardClick('Open')}
            />
            <StatCard
              icon={<svg
                width="27"
                height="27"
                viewBox="0 0 27 27"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M13.5 25.3125C6.97613 25.3125 1.6875 20.0222 1.6875 13.5C1.6875 6.97781 6.97613 1.6875 13.5 1.6875C20.0239 1.6875 25.3125 6.97781 25.3125 13.5C25.3125 20.0222 20.0239 25.3125 13.5 25.3125ZM13.5 0C6.04378 0 0 6.04125 0 13.5C0 20.9588 6.04378 27 13.5 27C20.9562 27 27 20.9588 27 13.5C27 6.04125 20.9562 0 13.5 0ZM18.3237 8.67377C17.9913 8.34471 17.4538 8.34471 17.1214 8.67377L13.495 12.3018L9.92081 8.72435C9.5909 8.39528 9.05596 8.39528 8.72775 8.72435C8.39784 9.05341 8.39784 9.59345 8.72775 9.92251L12.3019 13.4916L8.70246 17.0944C8.37087 17.4234 8.37087 17.9634 8.70246 18.3009C9.0349 18.63 9.57318 18.63 9.90562 18.3009L13.505 14.6982L17.0792 18.2757C17.4091 18.6047 17.944 18.6047 18.2731 18.2757C18.603 17.9466 18.603 17.4066 18.2731 17.0775L14.6981 13.5084L18.3237 9.88028C18.6553 9.54278 18.6553 9.01127 18.3237 8.67377Z"
                  fill="#C72030"
                />
              </svg>
              }
              label="Closed"
              value={permitCounts.closed}
              onClick={() => handleStatCardClick('Closed')}
            />
            <StatCard
              icon={<svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 20H21"
                  stroke="#C72030"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16.5 3.5L20.5 7.5L7 21H3V17L16.5 3.5Z"
                  stroke="#C72030"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>}
              label="Draft"
              value={permitCounts.draft}
              onClick={() => handleStatCardClick('Draft')}
            />
            <StatCard
              icon={<PauseCircle />}
              label="Hold"
              value={permitCounts.hold}
              onClick={() => handleStatCardClick('Hold')}
            />
            <StatCard
              icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                <mask id="mask0_10858_4198" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                  <rect width="24" height="24" fill="url(#pattern0_10858_4198)" />
                </mask>
                <g mask="url(#mask0_10858_4198)">
                  <rect x="-3" y="-2" width="29" height="28" fill="#C72030" />
                </g>
                <defs>
                  <pattern id="pattern0_10858_4198" patternContentUnits="objectBoundingBox" width="1" height="1">
                    <use xlinkHref="#image0_10858_4198" transform="scale(0.00195312)" />
                  </pattern>
                  <image id="image0_10858_4198" width="512" height="512" preserveAspectRatio="none" xlinkHref="data:image/png;base64,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" />
                </defs>
              </svg>
              }
              label="Rejected"
              value={permitCounts.rejected}
              onClick={() => handleStatCardClick('Rejected')}
            />
            <StatCard
              icon={<svg
                width="23"
                height="23"
                viewBox="0 0 23 23"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <mask
                  id="mask0_10858_4202"
                  style={{ maskType: "alpha" }}
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="23"
                  height="23"
                >
                  <rect width="23" height="23" fill="url(#pattern0_10858_4202)" />
                </mask>
                <g mask="url(#mask0_10858_4202)">
                  <rect x="-5" y="-5" width="33" height="32" fill="#C72030" />
                </g>
                <defs>
                  <pattern
                    id="pattern0_10858_4202"
                    patternContentUnits="objectBoundingBox"
                    width="1"
                    height="1"
                  >
                    <use
                      xlinkHref="#image0_10858_4202"
                      transform="scale(0.00195312)"
                    />
                  </pattern>
                  <image
                    id="image0_10858_4202"
                    width="512"
                    height="512"
                    preserveAspectRatio="none"
                    xlinkHref="data:image/png;base64,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"
                  />
                </defs>
              </svg>
              }
              label="Extended"
              value={permitCounts.extended}
              onClick={() => handleStatCardClick('Extended')}
            />
            <StatCard
              icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                <mask id="mask0_10858_4206" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                  <rect width="24" height="24" fill="url(#pattern0_10858_4206)" />
                </mask>
                <g mask="url(#mask0_10858_4206)">
                  <rect x="-1" width="26" height="24" fill="#C72030" />
                </g>
                <defs>
                  <pattern id="pattern0_10858_4206" patternContentUnits="objectBoundingBox" width="1" height="1">
                    <use xlinkHref="#image0_10858_4206" transform="scale(0.00195312)" />
                  </pattern>
                  <image id="image0_10858_4206" width="512" height="512" preserveAspectRatio="none" xlinkHref="data:image/png;base64,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" />
                </defs>
              </svg>
              }
              label="Expired"
              value={permitCounts.expired}
              onClick={() => handleStatCardClick('Expired')}
            />
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
            handleExport={handleExcelExport}
            exportFileName="permits-export"
            pagination={false} // Keep client-side pagination disabled since we handle server-side
            pageSize={pageSize}
            loading={loading}
            onFilterClick={() => setIsFilterModalOpen(true)}
            emptyMessage={error || "No permits found"}
            storageKey="permit-dashboard-table"
            leftActions={leftActions}

          />

          {/* Standard pagination like AMC/Asset dashboards */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-700">
                {(() => {
                  const pageSize = 10;
                  const start = ((currentPage - 1) * pageSize) + 1;
                  const end = Math.min(currentPage * pageSize, totalCount);
                  if (totalCount === 0) {
                    return "No results";
                  }
                  return `Showing ${start} to ${end} of ${totalCount} results`;
                })()}
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