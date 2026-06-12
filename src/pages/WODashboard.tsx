import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Plus, RefreshCw } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { buildReturnToPath } from "@/utils/listBackNavigation";
import { WOFilterDialog } from "@/components/WOFilterDialog";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { toast } from "sonner";
import { useAppDispatch } from "@/store/hooks";
import { fetchWorkOrders } from "@/store/slices/workOrderSlice";
import { cache } from "@/utils/cacheUtils";

const CACHE_TTL = 5 * 60 * 1000;
const STALE_TTL = 30 * 60 * 1000;
const CACHE_PREFIX = "wo";

const buildCacheKey = (siteId: string, page: number, params: Record<string, any>) => {
  const { reference_number = "", external_id = "", supplier_name = "", search = "" } = params;
  return `${CACHE_PREFIX}_site${siteId}_p${page}_ref${reference_number}_ext${external_id}_sup${supplier_name}_q${search}`;
};
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { updateServiceActiveStaus } from "@/store/slices/servicePRSlice";
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
    label: "WO No.",
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
    key: "created_on",
    label: "Created On",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "supplier",
    label: "Supplier",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "all_level_approved",
    label: "Approved Status",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "payment_tenure",
    label: "Payment Tenure (Days)",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "advance_amount",
    label: "Advance Amount",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "total_amount",
    label: "Total Amount",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "total_work_completed_percent",
    label: "Total Work Completed (%)",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "retention_percent",
    label: "Retention (%)",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "tds_percent",
    label: "TDS (%)",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "qc_percent",
    label: "QC (%)",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "active",
    label: "Active/Inactive",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "last_approved_by",
    label: "Last Approved By",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "tds_amount",
    label: "TDS Amount",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "retention_amount",
    label: "Retention Amount",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "retention_outstanding",
    label: "Retention Outstanding",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "qc_amount",
    label: "QC Amount",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "qc_outstanding",
    label: "QC Outstanding",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "no_of_invoices",
    label: "No. of Invoices",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "total_amount_paid",
    label: "Total Amount Paid",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "outstanding",
    label: "Outstanding",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "debit_credit_note_raised",
    label: "Debt/Credit Note Raised",
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
    key: "updated_by",
    label: "Updated By",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "updated_on",
    label: "Updated On",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
];

export const WODashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const token = localStorage.getItem("token");
  const baseUrl = localStorage.getItem("baseUrl");
  const [orgId, setOrgId] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const bgRefreshingRef = useRef(false);
  const currentSiteRef = useRef(localStorage.getItem("selectedSiteId") || "");

  const urlParams = new URLSearchParams(location.search);
  const urlPage = Number(urlParams.get("page")) || 1;
  const initialSearch = urlParams.get("search") || "";
  const initialFilters = {
    referenceNumber: urlParams.get("referenceNumber") || "",
    poNumber: urlParams.get("poNumber") || "",
    supplierName: urlParams.get("supplierName") || "",
  };

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [workOrders, setWorkOrders] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [pagination, setPagination] = useState({
    current_page: urlPage,
    total_count: 0,
    total_pages: 0,
  });
  const [updatingStatus, setUpdatingStatus] = useState<{ [key: string]: boolean }>({});

  const applyResponse = (response: any) => {
    setWorkOrders(response.work_orders);
    setPagination((prev) => ({
      ...prev,
      total_count: response.total_count,
      total_pages: response.total_pages,
    }));
  };
  const fetchData = async (filterData: Record<string, any> = {}) => {
    const page: number = filterData.page ?? pagination.current_page;
    const siteId = localStorage.getItem("selectedSiteId") || "";
    const cacheKey = buildCacheKey(siteId, page, filterData);

    const fresh = cache.get<any>(cacheKey, CACHE_TTL);
    if (fresh) {
      applyResponse(fresh);
      return;
    }

    const stale = cache.get<any>(cacheKey, STALE_TTL);
    if (stale) {
      applyResponse(stale);
      if (!bgRefreshingRef.current) {
        bgRefreshingRef.current = true;
        dispatch(fetchWorkOrders({ baseUrl, token, page, ...filterData }))
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

    setLoading(true);
    try {
      const response = await dispatch(
        fetchWorkOrders({ baseUrl, token, page, ...filterData })
      ).unwrap();
      cache.set(cacheKey, response, CACHE_TTL);
      applyResponse(response);
    } catch (error) {
      console.log(error);
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };
useEffect(() => {
      try {
        // first try explicit org_id stored separately (common pattern)
        const storedOrg = localStorage.getItem('org_id');
        if (storedOrg) {
          const num = Number(storedOrg);
          if (!Number.isNaN(num)) {
            setOrgId(num);
            return;
          }
        }
  
        // fallback to user object which may contain org_id/company_id
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          if (user.org_id) {
            setOrgId(user.org_id);
          } else if (user.company_id) {
            setOrgId(user.company_id);
          }
        }
      } catch (error) {
        console.error('Failed to load org_id:', error);
      }
    }, []);

  useEffect(() => {
    fetchData({ 
      page: urlPage,
      search: initialSearch,
      reference_number: initialFilters.referenceNumber,
      external_id: initialFilters.poNumber,
      supplier_name: initialFilters.supplierName,
    });
  }, []);

  // Update URL whenever pagination, filters or search changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (pagination.current_page > 1) params.set("page", pagination.current_page.toString());
    if (searchQuery) params.set("search", searchQuery);
    if (filters.referenceNumber) params.set("referenceNumber", filters.referenceNumber);
    if (filters.poNumber) params.set("poNumber", filters.poNumber);
    if (filters.supplierName) params.set("supplierName", filters.supplierName);
    
    navigate({ search: params.toString() }, { replace: true });
  }, [pagination.current_page, searchQuery, filters, navigate]);

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
    poNumber: string;
    supplierName: string;
  }) => {
    setFilters(newFilters); // Update filter state
    setPagination((prev) => ({ ...prev, current_page: 1 }));
    fetchData({
      page: 1,
      reference_number: newFilters.referenceNumber,
      external_id: newFilters.poNumber,
      supplier_name: newFilters.supplierName,
    }); // Fetch data with filters
  };

  const debouncedFetchData = useCallback(
    debounce((query: string, currentFilters: any) => {
      fetchData({ 
        page: 1,
        search: query,
        reference_number: currentFilters.reference_number,
        external_id: currentFilters.external_id,
        supplier_name: currentFilters.supplier_name
      });
    }, 500),
    []
  );

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setPagination((prev) => ({ ...prev, current_page: 1 })); // Reset to first page on search
    debouncedFetchData(query, {
      reference_number: filters.referenceNumber,
      external_id: filters.poNumber,
      supplier_name: filters.supplierName,
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

      setWorkOrders((prevData: any[]) =>
        prevData.map((row) =>
          row.id === itemId ? { ...row, active: newStatus } : row
        )
      );

      toast.success(`Work Order ${newStatus ? "activated" : "deactivated"} successfully`);
    } catch (error) {
      console.error("Error updating active status:", error);
      toast.error(error || "Failed to update active status. Please try again.");
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const renderCell = (item: any, columnKey: string) => {
    const value = item[columnKey];

    switch (columnKey) {
      case "all_level_approved":
        return (
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
              item?.all_level_approved ? "Approved" : item?.all_level_approved === false ? "Rejected" : "Pending"
            )}`}
          >
            {item?.all_level_approved ? "Approved" : item?.all_level_approved === false ? "Rejected" : "Pending"}
          </span>
        );
      case "tds_amount":
      case "retention_amount":
      case "retention_outstanding":
      case "qc_amount":
      case "qc_outstanding":
        return value ? value.toFixed(2) : "0.00";
      case "active":
        return (
          <Switch
            checked={item.active}
            onCheckedChange={() =>
              handleCheckboxChange(item)
            }
            className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
            disabled={updatingStatus[item.id]}
          />
        );
      case "debit_credit_note_raised":
        return value === true ? "Yes" : "No";
      default:
        return value !== undefined && value !== null ? value : "-";
    }
  };

  const renderActions = (item: any) => (
    <div className="flex items-center gap-3">
      <Button
        size="sm"
        variant="ghost"
        className="p-1"
        onClick={() => navigate(`/finance/wo/details/${item.id}`, {
          state: { returnTo: buildReturnToPath(location.pathname, location.search) },
        })}
      >
        <Eye className="w-4 h-4" />
      </Button>
      {
        item.all_level_approved === null && <Button
          size="sm"
          variant="ghost"
          className="p-1"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/finance/wo/edit/${item.id}`, {
              state: { returnTo: buildReturnToPath(location.pathname, location.search) },
            });
          }}
        >
          <Edit className="w-4 h-4" />
        </Button>
      }
    </div>
  );

  const handleRefresh = () => {
    cache.invalidatePattern(`${CACHE_PREFIX}*`);
    fetchData();
  };

  const leftActions = (
    <div className="flex items-center gap-2">
      {orgId !== 63 && (
        <Button
          className="fm-button-fix fm-button-brand px-4 py-2"
          variant="ghost"
          onClick={() => navigate('/finance/wo/add')}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
      )}
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
    if (page < 1 || page > pagination.total_pages || page === pagination.current_page || loading) {
      return;
    }

    navigate(`${location.pathname}?page=${page}`, { replace: true });

    try {
      setPagination((prev) => ({ ...prev, current_page: page }));
      await fetchData({
        page,
        reference_number: filters.referenceNumber,
        external_id: filters.poNumber,
        supplier_name: filters.supplierName,
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
        <PaginationItem key={1} className='cursor-pointer'>
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
          <PaginationItem key="ellipsis1" >
            <PaginationEllipsis />
          </PaginationItem>
        );
      } else {
        for (let i = 2; i <= Math.min(3, totalPages - 1); i++) {
          items.push(
            <PaginationItem key={i} className='cursor-pointer'>
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
            <PaginationItem key={i} className='cursor-pointer'>
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
              <PaginationItem key={i} className='cursor-pointer'>
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
          <PaginationItem key={totalPages} className='cursor-pointer'>
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
          <PaginationItem key={i} className='cursor-pointer'>
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
        data={workOrders || []}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        storageKey="wo-dashboard-columns"
        className="min-w-[1200px]"
        emptyMessage="No work orders found"
        searchTerm={searchQuery}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search by WO No."
        exportFileName="work-orders"
        loading={loading}
        enableSearch={true}
        onFilterClick={() => setIsFilterDialogOpen(true)}
        filterAdjacentActions={refreshAction}
        leftActions={leftActions}
      />

      <div className="flex justify-center mt-6">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(Math.max(1, pagination.current_page - 1))}
                className={pagination.current_page === 1 || loading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
            {renderPaginationItems()}
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(Math.min(pagination.total_pages, pagination.current_page + 1))}
                className={pagination.current_page === pagination.total_pages || loading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <WOFilterDialog
        open={isFilterDialogOpen}
        onOpenChange={setIsFilterDialogOpen}
        filters={filters}
        setFilters={setFilters}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};
