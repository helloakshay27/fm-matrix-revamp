import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, RefreshCw, Settings, Banknote, CreditCard, Clock } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { VendorGRNFilterDialog } from "@/components/VendorGRNFilterDialog";
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
  { key: "grnNumber", label: "GRN Number", sortable: true, draggable: true, defaultVisible: true },
  { key: "inventory", label: "Inventory", sortable: true, draggable: true, defaultVisible: true },
  { key: "supplier", label: "Supplier", sortable: true, draggable: true, defaultVisible: true },
  { key: "invoiceNumber", label: "Invoice Number", sortable: true, draggable: true, defaultVisible: true },
  { key: "referenceNumber", label: "Reference Number", sortable: true, draggable: true, defaultVisible: true },
  { key: "poNumber", label: "PO Number", sortable: true, draggable: true, defaultVisible: true },
  { key: "approvalStatus", label: "Approval Status", sortable: true, draggable: true, defaultVisible: true },
  { key: "woAmount", label: "WO Amount", sortable: true, draggable: true, defaultVisible: true },
  { key: "totalInvoiceAmount", label: "Total Invoice Amount", sortable: true, draggable: true, defaultVisible: true },
  { key: "adjustmentAmount", label: "Adjustment Amount", sortable: true, draggable: true, defaultVisible: true },
  { key: "retentionAmount", label: "Retention Amount", sortable: true, draggable: true, defaultVisible: true },
  { key: "tdsAmount", label: "TDS Amount", sortable: true, draggable: true, defaultVisible: true },
  { key: "qcAmount", label: "QC Amount", sortable: true, draggable: true, defaultVisible: true },
  { key: "payableAmount", label: "Payable Amount", sortable: true, draggable: true, defaultVisible: true },
  { key: "invoiceDate", label: "Invoice Date", sortable: true, draggable: true, defaultVisible: true },
];

export const VendorGRNListPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const baseUrl = localStorage.getItem("baseUrl");

  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [grnList, setGrnList] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    grnNumber: "",
    poNumber: "",
    supplierName: "",
    status: "",
  });
  const [stats, setStats] = useState({
    totalCount: 0,
    totalAmount: 0,
    totalPaidAmount: 0,
    totalPendingAmount: 0,
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
    const cards = response?.cards || {};
    setStats({
      totalCount: cards.total || cards.total_grn || 0,
      totalAmount: cards.total_amount || 0,
      totalPaidAmount: cards.total_paid_amount || cards.paid_amount || 0,
      totalPendingAmount: cards.total_pending_amount || cards.pending_amount || 0,
    });

    const items = response?.grns || response?.data || [];
    const formatted = items.map((item: any) => ({
      id: item.id,
      grnNumber: item.grn_number || "-",
      inventory: item.inventory || "-",
      supplier: item.supplier_name || "-",
      invoiceNumber: item.invoice_no || "-",
      referenceNumber: item.reference_number || "-",
      poNumber: item.po_number || "-",
      approvalStatus: item.approved_status || "Pending",
      woAmount: item.wo_amount ?? "-",
      totalInvoiceAmount: item.total_invoice_amount ?? "-",
      adjustmentAmount: item.adjustment_amount ?? "-",
      retentionAmount: item.retention_amount ?? "-",
      tdsAmount: item.tds_amount ?? "-",
      qcAmount: item.qc_amount ?? "-",
      payableAmount: item.payable_amount ?? "-",
      invoiceDate: item.invoice_date || "-",
    }));
    setGrnList(formatted);
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
      if (filterData.grn_number) params.append("grn_number", filterData.grn_number);
      if (filterData.po_number) params.append("po_number", filterData.po_number);
      if (filterData.supplier_name) params.append("supplier_name", filterData.supplier_name);
      if (filterData.status) params.append("status", filterData.status);

      const response = await fetch(
        `https://${baseUrl}/pms/grns/grns_list.json?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.ok) throw new Error("Failed to fetch vendor GRN data");
      const data = await response.json();
      applyResponse(data);
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to load GRN data");
      setGrnList([]);
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
      grn_number: newFilters.grnNumber,
      po_number: newFilters.poNumber,
      supplier_name: newFilters.supplierName,
      status: newFilters.status,
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
      case "approvalStatus":
        return (
          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.approvalStatus)}`}>
            {item.approvalStatus}
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
        onClick={() => navigate(`/vendor/grn/details/${item.id}`)}
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
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#f6f4ee] rounded-lg p-4 shadow-[0px_2px_18px_rgba(45,44,40,0.06)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[rgba(199,32,48,0.08)] flex items-center justify-center shrink-0">
            <Settings className="w-6 h-6 text-[#D92818]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#D92818] leading-none mb-1">{stats.totalCount}</p>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total no. of GRN</p>
          </div>
        </div>
        
        <div className="bg-[#f6f4ee] rounded-lg p-4 shadow-[0px_2px_18px_rgba(45,44,40,0.06)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[rgba(199,32,48,0.08)] flex items-center justify-center shrink-0">
            <Banknote className="w-6 h-6 text-[#D92818]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#D92818] leading-none mb-1">₹ {Number(stats.totalAmount).toLocaleString()}</p>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Value Amount</p>
          </div>
        </div>

        <div className="bg-[#f6f4ee] rounded-lg p-4 shadow-[0px_2px_18px_rgba(45,44,40,0.06)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[rgba(199,32,48,0.08)] flex items-center justify-center shrink-0">
            <CreditCard className="w-6 h-6 text-[#D92818]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#D92818] leading-none mb-1">₹ {Number(stats.totalPaidAmount).toLocaleString()}</p>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Paid Amount</p>
          </div>
        </div>

        <div className="bg-[#f6f4ee] rounded-lg p-4 shadow-[0px_2px_18px_rgba(45,44,40,0.06)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[rgba(199,32,48,0.08)] flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6 text-[#D92818]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#D92818] leading-none mb-1">₹ {Number(stats.totalPendingAmount).toLocaleString()}</p>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Pending Amount</p>
          </div>
        </div>
      </div>

      <EnhancedTable
        data={grnList}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        storageKey="vendor-grn-list-columns"
        className="min-w-[1100px]"
        emptyMessage="No GRN records found"
        selectAllLabel="Select all GRNs"
        searchTerm={searchQuery}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search by GRN Number"
        exportFileName="vendor-grn-records"
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

      <VendorGRNFilterDialog
        open={isFilterDialogOpen}
        onOpenChange={setIsFilterDialogOpen}
        filters={filters}
        setFilters={setFilters}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};
