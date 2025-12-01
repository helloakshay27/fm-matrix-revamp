import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { GRNFilterDialog } from "@/components/GRNFilterDialog";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getGRN } from "@/store/slices/grnSlice";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useDynamicPermissions } from "@/hooks/useDynamicPermissions";

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
    key: "inventories_name",
    label: "Inventory",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "supplier_name",
    label: "Supplier",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "invoice_no",
    label: "Invoice Number",
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
    key: "po_number",
    label: "P.O. Number",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "po_reference_number",
    label: "P.O Reference Number",
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
    key: "last_approved_by",
    label: "Last Approved By",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "po_amount",
    label: "PO Amount",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "total_grn_amount",
    label: "Total GRN Amount",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "payable_amount",
    label: "Payable Amount",
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
    key: "tds_amount",
    label: "TDS Amount",
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
    key: "invoice_date",
    label: "Invoice Date",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
];

export const GRNSRNDashboard = () => {
  const dispatch = useAppDispatch();
  const token = localStorage.getItem("token");
  const baseUrl = localStorage.getItem("baseUrl");

  const { shouldShow } = useDynamicPermissions();
  const { loading } = useAppSelector(state => state.getGRN)

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [grn, setGrn] = useState([]);
  const [filters, setFilters] = useState<{
    grnNumber?: string;
    poNumber?: string;
    supplierName?: string;
    status?: string;
  }>({
    grnNumber: '',
    poNumber: '',
    supplierName: '',
    status: ''
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_count: 0,
    total_pages: 0,
  });

  const fetchData = async (page = 1, filterData = {}) => {
    try {
      const response = await dispatch(getGRN({ baseUrl, token, page: page, ...filterData })).unwrap();
      setGrn(response.grns);
      setPagination({
        current_page: Number(response.page),
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
    grnNumber?: string;
    poNumber?: string;
    supplierName?: string;
    status?: string;
  }) => {
    setFilters(newFilters);
    fetchData(1, {
      grn_number: newFilters.grnNumber,
      po_number: newFilters.poNumber,
      supplier_name: newFilters.supplierName,
      approval_status: newFilters.status,
    });
  };

  const debouncedFetchData = useCallback(
    debounce((query: string) => {
      fetchData(1, { search: query });
    }, 500),
    [pagination.current_page, filters]
  );

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setPagination((prev) => ({ ...prev, current_page: 1 })); // Reset to first page on search
    debouncedFetchData(query, {
      grn_number: filters.grnNumber,
      po_number: filters.poNumber,
      supplier_name: filters.supplierName,
      approval_status: filters.status,
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

  const renderCell = (item, columnKey: string) => {
    switch (columnKey) {
      case "approved_status":
        return (
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
              item.approved_status
            )}`}
          >
            {item.approved_status}
          </span>
        );
      case "inventories_name":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="max-w-[200px] truncate block cursor-pointer">
                  {item.inventories_name}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{item.inventories_name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      default:
        return item[columnKey] || "-";
    }
  };

  const handleAddNew = () => {
    navigate("/finance/grn-srn/add");
  };

  const handleFilter = () => {
    setIsFilterDialogOpen(true);
  };

  const handleView = (id: number) => {
    navigate(`/finance/grn-srn/details/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`/finance/grn-srn/edit/${id}`);
  };

  const renderActions = (item) => (
    <div className="flex gap-1">
      {
        shouldShow("grn-srn", "view") && (
          <Button
            size="sm"
            variant="ghost"
            className="p-1"
            onClick={() => handleView(item.id)}
          >
            <Eye className="w-4 h-4" />
          </Button>
        )
      }

      {
        shouldShow("grn-srn", "edit") && (
          item.approved_status === 'Pending' && <Button
            size="sm"
            variant="ghost"
            className="p-1"
            onClick={() => handleEdit(item.id)}
          >
            <Edit className="w-4 h-4" />
          </Button>
        )
      }
    </div>
  );

  const leftActions = (
    <div className="flex gap-3">
      {
        shouldShow("grn-srn", "add") && (
          <Button
            className="bg-[#C72030] hover:bg-[#A01020] text-white"
            onClick={handleAddNew}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        )
      }
    </div>
  );

  const handlePageChange = async (page: number) => {
    console.log(page)
    if (page < 1 || page > pagination.total_pages || page === pagination.current_page || loading) {
      return;
    }

    try {
      setPagination((prev) => ({ ...prev, current_page: page }));
      await fetchData(page, {
        grn_number: filters.grnNumber,
        po_number: filters.poNumber,
        supplier_name: filters.supplierName,
        approval_status: filters.status,
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
    <div className="p-6">
      <EnhancedTable
        data={grn}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        storageKey="grn-srn-table"
        searchTerm={searchQuery}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search by PO Number..."
        hideTableExport={true}
        exportFileName="grn_srn_export"
        enableSearch={true}
        leftActions={leftActions}
        onFilterClick={handleFilter}
        loading={loading}
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

      <GRNFilterDialog
        open={isFilterDialogOpen}
        onOpenChange={setIsFilterDialogOpen}
        filters={filters}
        setFilters={setFilters}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};
