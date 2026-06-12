import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Edit, RefreshCw } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { buildReturnToPath } from "@/utils/listBackNavigation";
import { ServicePRFilterDialog } from "@/components/ServicePRFilterDialog";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { toast } from "sonner";
import { useAppDispatch } from "@/store/hooks";
import {
  getServicePr,
  updateServiceActiveStaus,
} from "@/store/slices/servicePRSlice";
import { cache } from "@/utils/cacheUtils";

const CACHE_TTL = 5 * 60 * 1000;
const STALE_TTL = 30 * 60 * 1000;
const CACHE_PREFIX = "service_pr";

const buildCacheKey = (siteId: string, page: number, params: Record<string, any>) => {
  const { reference_number = "", external_id = "", supplier_name = "", approval_status = "", search = "" } = params;
  return `${CACHE_PREFIX}_site${siteId}_p${page}_ref${reference_number}_ext${external_id}_sup${supplier_name}_st${approval_status}_q${search}`;
};
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Switch } from "@/components/ui/switch";

const debounce = (func: (...args: any[]) => void, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const columns: ColumnConfig[] = [
  {
    key: "id",
    label: "ID",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "wo_no",
    label: "PR No.",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "po_number",
    label: "Wo Number",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "reference_number",
    label: "Reference No.",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "supplier",
    label: "Supplier Name",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "approved_by_user",
    label: "Last Approved By",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "approved_status",
    label: "Approved Status",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "created_by",
    label: "Created By",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "created_on",
    label: "Created On",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "total_value",
    label: "PR Amount",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "active",
    label: "Active/Inactive",
    sortable: false,
    draggable: true,
    defaultVisible: true,
  },
];

export const ServicePRDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const token = localStorage.getItem("token");
  const baseUrl = localStorage.getItem("baseUrl");
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const bgRefreshingRef = useRef(false);
  const currentSiteRef = useRef(localStorage.getItem("selectedSiteId") || "");

  const urlParams = new URLSearchParams(location.search);
  const urlPage = Number(urlParams.get("page")) || 1;
  const initialSearch = urlParams.get("search") || "";
  const initialFilters = {
    referenceNumber: urlParams.get("referenceNumber") || "",
    prNumber: urlParams.get("prNumber") || "",
    supplierName: urlParams.get("supplierName") || "",
    approvalStatus: urlParams.get("approvalStatus") || "Select",
  };

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [servicePR, setServicePR] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  // const [pagination, setPagination] = useState({
  //   current_page: 1,
  //   total_count: 0,
  //   total_pages: 0,
  // });

  const [pagination, setPagination] = useState({
    current_page: urlPage,
    total_count: 0,
    total_pages: 0,
  });
  const [updatingStatus, setUpdatingStatus] = useState<{
    [key: string]: boolean;
  }>({});

 const applyResponse = (response: any) => {
  setServicePR(response.work_orders);
  setPagination((prev) => ({
    ...prev,
    total_count: response.total_count,
    total_pages: response.total_pages,
  }));
};

  const fetchData = async (filterParams: Record<string, any> = {}) => {
    const page: number = filterParams.page ?? pagination.current_page;
    const siteId = localStorage.getItem("selectedSiteId") || "";
    const cacheKey = buildCacheKey(siteId, page, filterParams);

    // Fresh cache — return instantly, no network call
    const fresh = cache.get<any>(cacheKey, CACHE_TTL);
    if (fresh) {
      applyResponse(fresh);
      return;
    }

    // Stale cache — show old data immediately, refresh silently in background
    const stale = cache.get<any>(cacheKey, STALE_TTL);
    if (stale) {
      applyResponse(stale);
      if (!bgRefreshingRef.current) {
        bgRefreshingRef.current = true;
        dispatch(getServicePr({ baseUrl, token, page, ...filterParams }))
          .unwrap()
          .then((response) => {
            cache.set(cacheKey, response, CACHE_TTL);
            applyResponse(response);
          })
          .catch(console.error)
          .finally(() => { bgRefreshingRef.current = false; });
      }
      return;
    }

    // No cache — fetch with loading indicator
    setLoading(true);
    try {
      const response = await dispatch(
        getServicePr({ baseUrl, token, page, ...filterParams })
      ).unwrap();
      cache.set(cacheKey, response, CACHE_TTL);
      applyResponse(response);
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData({ 
      page: urlPage,
      search: initialSearch,
      reference_number: initialFilters.referenceNumber,
      external_id: initialFilters.prNumber,
      supplier_name: initialFilters.supplierName,
      approval_status: initialFilters.approvalStatus !== "Select" ? initialFilters.approvalStatus : "",
    });
  }, []);

  // Update URL whenever pagination, filters or search changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (pagination.current_page > 1) params.set("page", pagination.current_page.toString());
    if (searchQuery) params.set("search", searchQuery);
    if (filters.referenceNumber) params.set("referenceNumber", filters.referenceNumber);
    if (filters.prNumber) params.set("prNumber", filters.prNumber);
    if (filters.supplierName) params.set("supplierName", filters.supplierName);
    if (filters.approvalStatus && filters.approvalStatus !== "Select") params.set("approvalStatus", filters.approvalStatus);
    
    navigate({ search: params.toString() }, { replace: true });
  }, [pagination.current_page, searchQuery, filters, navigate]);

  // Invalidate cache and re-fetch when site changes while page is open
  useEffect(() => {
    const interval = setInterval(() => {
      const newSiteId = localStorage.getItem("selectedSiteId") || "";
      if (newSiteId !== currentSiteRef.current) {
        currentSiteRef.current = newSiteId;
        cache.invalidatePattern(`${CACHE_PREFIX}*`);
        fetchData();
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleApplyFilters = (newFilters: {
    referenceNumber: string;
    prNumber: string;
    supplierName: string;
    approvalStatus: string;
  }) => {
    setFilters(newFilters);
    fetchData({
      reference_number: newFilters.referenceNumber,
      external_id: newFilters.prNumber,
      supplier_name: newFilters.supplierName,
      approval_status: newFilters.approvalStatus,
    });
  };

  const debouncedFetchData = useCallback(
    debounce((query: string) => {
      fetchData({ search: query });
    }, 500),
    [pagination.current_page, filters]
  );

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setPagination((prev) => ({ ...prev, current_page: 1 })); // Reset to first page on search
    debouncedFetchData(query, {
      reference_number: filters.referenceNumber,
      external_id: filters.prNumber,
      supplier_name: filters.supplierName,
      approval_status: filters.approvalStatus,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'partial':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCheckboxChange = async (item: any) => {
    const newStatus = !item.active;
    const itemId = item.id;

    if (updatingStatus[itemId]) return;

    try {
      setUpdatingStatus((prev) => ({ ...prev, [itemId]: true }));

      await dispatch(
        updateServiceActiveStaus({
          baseUrl,
          token,
          id: itemId,
          data: {
            pms_work_order: {
              active: newStatus,
            },
          },
        })
      ).unwrap();

      setServicePR((prevData: any[]) =>
        prevData.map((row) =>
          row.id === itemId ? { ...row, active: newStatus } : row
        )
      );

      toast.success(
        `Service PR ${newStatus ? "activated" : "deactivated"} successfully`
      );
    } catch (error) {
      console.error("Error updating active status:", error);
      toast.error(error || "Failed to update active status. Please try again.");
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case "approved_status":
        return (
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
              item.all_level_approved
                ? "Approved"
                : item.all_level_approved === false
                  ? "Rejected"
                  : "Pending"
            )}`}
          >
            {item.all_level_approved
              ? "Approved"
              : item.all_level_approved === false
                ? "Rejected"
                : "Pending"}
          </span>
        );
      case "active":
        return (
          <Switch
            checked={item.active}
            onCheckedChange={() => handleCheckboxChange(item)}
            className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
            disabled={updatingStatus[item.id]}
          />
        );
      case "prAmount":
        return <span className="font-medium">{item.prAmount}</span>;
      default:
        return item[columnKey] || "-";
    }
  };

  const renderActions = (item: any) => (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="ghost"
        className="p-1"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/finance/service-pr/details/${item.id}`, {
            state: { returnTo: buildReturnToPath(location.pathname, location.search) },
          });
        }}
      >
        <Eye className="w-4 h-4" />
      </Button>
      {item.can_edit && (
        <Button
          size="sm"
          variant="ghost"
          className="p-1"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/finance/service-pr/edit/${item.id}`, {
              state: { returnTo: buildReturnToPath(location.pathname, location.search) },
            });
          }}
        >
          <Edit className="w-4 h-4" />
        </Button>
      )}
    </div>
  );

  const handleRefresh = () => {
    cache.invalidatePattern(`${CACHE_PREFIX}*`);
    fetchData();
  };

  const leftActions = (
    <div className="flex items-center gap-2">
      <Button
        className="bg-[#C72030] hover:bg-[#C72030]/90 text-white h-9 px-4 text-sm font-medium"
        onClick={() => navigate("/finance/service-pr/add")}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add
      </Button>
    </div>
  );

  const refreshAction = (
    <Button
      variant="outline"
      size="sm"
      className="h-9 w-9 p-0"
      onClick={handleRefresh}
      disabled={loading}
      title="Refresh"
    >
      <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
    </Button>
  );

 const handlePageChange = async (page: number) => {
  if (
    page < 1 ||
    page > pagination.total_pages ||
    page === pagination.current_page ||
    loading
  ) {
    return;
  }

  navigate(`${location.pathname}?page=${page}`, { replace: true });

  try {
    setPagination((prev) => ({ ...prev, current_page: page }));
    await fetchData({
        page,
        reference_number: filters.referenceNumber,
        external_id: filters.prNumber,
        supplier_name: filters.supplierName,
        approval_status: filters.approvalStatus,
        search: searchQuery,
      });
    } catch (error) {
      console.error("Error changing page:", error);
      toast.error("Failed to load page data. Please try again.");
    }
  };

  const renderPaginationItems = () => {
    if (!pagination.total_pages || pagination.total_pages <= 0) {
      return null;
    }
    const items = [];
    const totalPages = pagination.total_pages;
    const currentPage = pagination.current_page;
    const showEllipsis = totalPages > 7;

    if (showEllipsis) {
      items.push(
        <PaginationItem key={1} className="cursor-pointer">
          <PaginationLink
            onClick={() => handlePageChange(1)}
            isActive={currentPage === 1}
            aria-disabled={loading}
            className={loading ? "pointer-events-none opacity-50" : ""}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (currentPage > 4) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      } else {
        for (let i = 2; i <= Math.min(3, totalPages - 1); i++) {
          items.push(
            <PaginationItem key={i} className="cursor-pointer">
              <PaginationLink
                onClick={() => handlePageChange(i)}
                isActive={currentPage === i}
                aria-disabled={loading}
                className={loading ? "pointer-events-none opacity-50" : ""}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }

      if (currentPage > 3 && currentPage < totalPages - 2) {
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          items.push(
            <PaginationItem key={i} className="cursor-pointer">
              <PaginationLink
                onClick={() => handlePageChange(i)}
                isActive={currentPage === i}
                aria-disabled={loading}
                className={loading ? "pointer-events-none opacity-50" : ""}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }

      if (currentPage < totalPages - 3) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      } else {
        for (let i = Math.max(totalPages - 2, 2); i < totalPages; i++) {
          if (!items.find((item) => item.key === i.toString())) {
            items.push(
              <PaginationItem key={i} className="cursor-pointer">
                <PaginationLink
                  onClick={() => handlePageChange(i)}
                  isActive={currentPage === i}
                  aria-disabled={loading}
                  className={loading ? "pointer-events-none opacity-50" : ""}
                >
                  {i}
                </PaginationLink>
              </PaginationItem>
            );
          }
        }
      }

      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages} className="cursor-pointer">
            <PaginationLink
              onClick={() => handlePageChange(totalPages)}
              isActive={currentPage === totalPages}
              aria-disabled={loading}
              className={loading ? "pointer-events-none opacity-50" : ""}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i} className="cursor-pointer">
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
              aria-disabled={loading}
              className={loading ? "pointer-events-none opacity-50" : ""}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  return (
    <div className="p-4 sm:p-6">
      <EnhancedTable
        data={servicePR || []}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        storageKey="service-pr-dashboard-columns-v2"
        className="min-w-[1000px]"
        emptyMessage="No service PR data available"
        searchTerm={searchQuery}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search by PR No."
        exportFileName="service-prs"
        enableSearch={true}
        enableSelection={true}
        leftActions={leftActions}
        onFilterClick={() => setIsFilterDialogOpen(true)}
        filterAdjacentActions={refreshAction}
        loading={loading}
      />

      <div className="flex justify-center mt-6">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() =>
                  handlePageChange(Math.max(1, pagination.current_page - 1))
                }
                className={
                  pagination.current_page === 1 || loading
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
            {renderPaginationItems()}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  handlePageChange(
                    Math.min(
                      pagination.total_pages,
                      pagination.current_page + 1
                    )
                  )
                }
                className={
                  pagination.current_page === pagination.total_pages || loading
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <ServicePRFilterDialog
        open={isFilterDialogOpen}
        onOpenChange={setIsFilterDialogOpen}
        filters={filters}
        setFilters={setFilters}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};
