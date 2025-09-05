import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { WOFilterDialog } from "@/components/WOFilterDialog";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchWorkOrders } from "@/store/slices/workOrderSlice";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { updateServiceActiveStaus } from "@/store/slices/servicePRSlice";

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

  const { loading } = useAppSelector(state => state.fetchWorkOrders)

  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [workOrders, setWorkOrders] = useState([]);
  const [filters, setFilters] = useState({
    referenceNumber: '',
    poNumber: '',
    supplierName: ''
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_count: 0,
    total_pages: 0,
  });
  const [updatingStatus, setUpdatingStatus] = useState<{ [key: string]: boolean }>({});

  const fetchData = async (filterData = {}) => {
    try {
      const response = await dispatch(
        fetchWorkOrders({ baseUrl, token, page: pagination.current_page, ...filterData })
      ).unwrap();
      setWorkOrders(response.work_orders);
      setPagination({
        current_page: response.current_page,
        total_count: response.total_count,
        total_pages: response.total_pages
      })
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApplyFilters = (newFilters: {
    referenceNumber: string;
    poNumber: string;
    supplierName: string;
  }) => {
    setFilters(newFilters); // Update filter state
    fetchData({
      reference_number: newFilters.referenceNumber,
      external_id: newFilters.poNumber,
      supplier_name: newFilters.supplierName,
    }); // Fetch data with filters
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
      external_id: filters.poNumber,
      supplier_name: filters.supplierName,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-500 text-white";
      case "rejected":
        return "bg-red-500 text-white";
      case "pending":
        return "bg-yellow-500 text-black";
      default:
        return "bg-gray-500 text-white";
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
      case "active":
        return (
          <input
            type="checkbox"
            checked={item.active}
            onChange={() => handleCheckboxChange(item)}
            className={`w-4 h-4 ${updatingStatus[item.id] ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
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
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/finance/wo/edit/${item.id}`);
        }}
      >
        <Edit className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="p-1"
        onClick={() => navigate(`/finance/wo/details/${item.id}`)}
      >
        <Eye className="w-4 h-4" />
      </Button>
    </div>
  );

  const leftActions = (
    <>
      <Button
        style={{ backgroundColor: '#F2EEE9', color: '#BF213E' }}
        className="hover:bg-[#F2EEE9]/90"
        onClick={() => navigate('/finance/wo/add')}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add
      </Button>
    </>
  );

  const handlePageChange = async (page: number) => {
    if (page < 1 || page > pagination.total_pages || page === pagination.current_page || loading) {
      return;
    }

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
