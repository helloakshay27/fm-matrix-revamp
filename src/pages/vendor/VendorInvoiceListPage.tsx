import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, RefreshCw } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { VendorInvoicesFilterDialog } from "@/components/VendorInvoicesFilterDialog";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const debounce = (func: (...args: any[]) => void, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const columns: ColumnConfig[] = [
  { key: "id", label: "ID", sortable: true, draggable: true, defaultVisible: true },
  { key: "invoiceNumber", label: "Invoice Number", sortable: true, draggable: true, defaultVisible: true },
  { key: "invoiceDate", label: "Invoice Date", sortable: true, draggable: true, defaultVisible: true },
  { key: "supplier", label: "Supplier", sortable: true, draggable: true, defaultVisible: true },
  { key: "woNumber", label: "W.O. Number", sortable: true, draggable: true, defaultVisible: true },
  { key: "externalId", label: "Reference Number", sortable: true, draggable: true, defaultVisible: true },
  { key: "woAmount", label: "WO Amount", sortable: true, draggable: true, defaultVisible: true },
  { key: "totalInvoiceAmount", label: "Total Invoice Amount", sortable: true, draggable: true, defaultVisible: true },
  { key: "approvedStatus", label: "Approved Status", sortable: true, draggable: true, defaultVisible: true },
  { key: "payableAmount", label: "Payable Amount", sortable: true, draggable: true, defaultVisible: true },
  { key: "paymentStatus", label: "Payment Status", sortable: true, draggable: true, defaultVisible: true },
];

export const VendorInvoiceListPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const baseUrl = localStorage.getItem("baseUrl");

  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [invoiceList, setInvoiceList] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    invoiceNumber: "",
    invoiceDate: "",
    supplierName: "",
    approvalStatus: "",
  });
  const [pagination, setPagination] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return {
      current_page: Number(params.get("page")) || 1,
      total_count: 0,
      total_pages: 0,
    };
  });

  const applyResponse = (response: any) => {
    const items = response?.work_order_invoices || response?.data || [];
    const formatted = items.map((item: any) => ({
      id: item.id,
      invoiceNumber: item.invoice_number || "-",
      invoiceDate: item.invoice_date || "-",
      supplier: item.supplier || "-",
      woNumber: item.wo_number || "-",
      externalId: item.external_id || "-",
      woAmount: item.wo_amount ?? "-",
      totalInvoiceAmount: item.total_invoice_amount ?? "-",
      approvedStatus: item.approved_status || "Pending",
      payableAmount: item.payment_status ?? "-",
      paymentStatus: item.payment_status ?? "-",
    }));
    setInvoiceList(formatted);
    setPagination((prev) => ({
      ...prev,
      total_count: response?.total_count ?? 0,
      total_pages: response?.total_pages ?? 0,
    }));
  };

  const fetchData = async (filterData: Record<string, any> = {}) => {
    const page: number = filterData.page ?? pagination.current_page;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", String(page));
      if (filterData.search) params.append("search", filterData.search);
      if (filterData.invoice_number) params.append("invoice_number", filterData.invoice_number);
      if (filterData.invoice_date) params.append("invoice_date", filterData.invoice_date);
      if (filterData.supplier_name) params.append("supplier_name", filterData.supplier_name);
      if (filterData.approval_status) params.append("approval_status", filterData.approval_status);

      const response = await fetch(
        `https://${baseUrl}/pms/work_order_invoices.json?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.ok) throw new Error("Failed to fetch vendor invoice data");
      const data = await response.json();
      applyResponse(data);
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to load invoice data");
      setInvoiceList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlPage = Number(params.get("page")) || 1;
    if (urlPage !== pagination.current_page) {
      navigate(`${location.pathname}?page=${pagination.current_page}`, { replace: true });
    }
  }, [pagination.current_page]);

  useEffect(() => {
    fetchData({ page: pagination.current_page });
  }, [pagination.current_page]);

  const handleApplyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
    fetchData({
      invoice_number: newFilters.invoiceNumber,
      invoice_date: newFilters.invoiceDate,
      supplier_name: newFilters.supplierName,
      approval_status: newFilters.approvalStatus,
    });
  };

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      fetchData({ search: query });
    }, 500),
    [pagination.current_page, filters]
  );

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setPagination((prev) => ({ ...prev, current_page: 1 }));
    debouncedSearch(query);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case "approvedStatus":
        return (
          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.approvedStatus)}`}>
            {item.approvedStatus}
          </span>
        );
      default:
        return item[columnKey] ?? "-";
    }
  };

  const renderActions = (item: any) => (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="ghost"
        className="p-1"
        onClick={() => navigate(`/vendor/invoice/details/${item.id}`)}
        title="View"
      >
        <Eye className="w-4 h-4" />
      </Button>
    </div>
  );

  const handlePageChange = async (page: number) => {
    if (page < 1 || page > pagination.total_pages || page === pagination.current_page || loading) return;
    navigate(`${location.pathname}?page=${page}`, { replace: true });
    setPagination((prev) => ({ ...prev, current_page: page }));
    await fetchData({ page, ...filters });
  };

  const renderPaginationItems = () => {
    if (!pagination.total_pages || pagination.total_pages <= 0) return null;
    const items = [];
    const totalPages = pagination.total_pages;
    const currentPage = pagination.current_page;

    for (let i = 1; i <= Math.min(totalPages, 7); i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        items.push(
          <PaginationItem key={i} className="cursor-pointer">
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
              className={loading ? "pointer-events-none opacity-50" : ""}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        items.push(
          <PaginationItem key={`ellipsis-${i}`}>
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }
    return items;
  };

  const refreshAction = (
    <Button
      variant="outline"
      size="sm"
      className="h-9 w-9 p-0"
      onClick={() => fetchData({ page: pagination.current_page })}
      disabled={loading}
      title="Refresh"
    >
      <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
    </Button>
  );

  return (
    <div className="p-4 sm:p-6">
      <EnhancedTable
        data={invoiceList}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        storageKey="vendor-invoice-list-columns"
        className="min-w-[1100px]"
        emptyMessage="No invoices found"
        selectAllLabel="Select all invoices"
        searchTerm={searchQuery}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search by Invoice Number"
        exportFileName="vendor-invoices"
        enableSearch={true}
        onFilterClick={() => setIsFilterDialogOpen(true)}
        filterAdjacentActions={refreshAction}
        loading={loading}
      />

      <div className="flex justify-center mt-6">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(Math.max(1, pagination.current_page - 1))}
                className={pagination.current_page === 1 || loading ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            {renderPaginationItems()}
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(Math.min(pagination.total_pages, pagination.current_page + 1))}
                className={pagination.current_page === pagination.total_pages || loading ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <VendorInvoicesFilterDialog
        open={isFilterDialogOpen}
        onOpenChange={setIsFilterDialogOpen}
        filters={filters}
        setFilters={setFilters}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};
