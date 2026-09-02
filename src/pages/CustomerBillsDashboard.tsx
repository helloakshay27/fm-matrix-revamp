import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { FileText, Wallet, Clock, CheckCircle2, Eye } from "lucide-react";
import { CustomerBillsFilterDialog } from "@/components/CustomerBillsFilterDialog";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useAppDispatch } from "@/store/hooks";
import { getCustomerBills } from "@/store/slices/customerBillsSlice";
import { toast } from "sonner";
import { format } from "date-fns";

interface CustomerBill {
  id: number;
  billNumber: string;
  customer: string;
  description: string;
  billingDate: string;
  totalAmount: number;
  dueDate: string;
  note: string | null;
  status: string;
}

interface CustomerBillsFilters {
  billNo: string;
  paymentStatus: string;
  publishStatus: string;
}

const emptyFilters: CustomerBillsFilters = {
  billNo: "",
  paymentStatus: "",
  publishStatus: "",
};

const columns: ColumnConfig[] = [
  { key: "id", label: "ID", sortable: true, defaultVisible: true },
  { key: "billNumber", label: "Bill Number", sortable: true, defaultVisible: true },
  { key: "customer", label: "Customer", sortable: true, defaultVisible: true },
  { key: "description", label: "Description", sortable: true, defaultVisible: true, width: 280 },
  { key: "billingDate", label: "Billing Date", sortable: true, defaultVisible: true },
  { key: "totalAmount", label: "Total Amount", sortable: true, defaultVisible: true },
  { key: "dueDate", label: "Due Date", sortable: true, defaultVisible: true },
  { key: "note", label: "Note", sortable: true, defaultVisible: true },
  { key: "status", label: "Status", sortable: true, defaultVisible: true },
];

const debounce = (func: (...args: any[]) => void, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const CustomerBillsDashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const baseUrl = localStorage.getItem("baseUrl");
  const currency = localStorage.getItem("currency") || "";

  const [loading, setLoading] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<CustomerBillsFilters>(emptyFilters);
  const [customerBillsData, setCustomerBillsData] = useState<CustomerBill[]>([]);
  const [pagination, setPagination] = useState({ current_page: 1, total_pages: 0 });
  const [stats, setStats] = useState({ totalInvoices: 0, totalAmount: 0, pendingAmount: 0, paidAmount: 0 });

  const applyResponse = (response: any) => {
    const formattedBills: CustomerBill[] = (response.lock_account_bills || []).map((item: any) => ({
      id: item.id,
      billNumber: item.bill_number,
      customer: item.customer,
      description: item.description,
      billingDate: item.billing_date,
      totalAmount: item.total_amount,
      dueDate: item.due_date,
      note: item.note,
      status: item.status,
    }));

    setCustomerBillsData(formattedBills);
    setPagination({
      current_page: response.current_page,
      total_pages: response.total_pages,
    });
    setStats({
      totalInvoices: response.total_invoices || 0,
      totalAmount: response.total_amount || 0,
      pendingAmount: response.pending_amount || 0,
      paidAmount: response.paid_amount || 0,
    });
  };

  const fetchData = useCallback(
    async (params: { page: number; search?: string; billNo?: string; paymentStatus?: string }) => {
      setLoading(true);
      try {
        const response = await dispatch(getCustomerBills({ baseUrl, token, ...params })).unwrap();
        applyResponse(response);
      } catch (error: any) {
        console.error(error);
        toast.error(error?.message || "Failed to fetch customer bills. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [dispatch, baseUrl, token]
  );

  useEffect(() => {
    fetchData({ page: 1 });
  }, [fetchData]);

  const handleApplyFilters = (newFilters: CustomerBillsFilters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, current_page: 1 }));
    fetchData({
      page: 1,
      search: searchQuery,
      billNo: newFilters.billNo,
      paymentStatus: newFilters.paymentStatus,
    });
  };

  const debouncedFetchData = useCallback(
    debounce((query: string) => {
      fetchData({ page: 1, search: query, billNo: filters.billNo, paymentStatus: filters.paymentStatus });
    }, 500),
    [fetchData, filters]
  );

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setPagination((prev) => ({ ...prev, current_page: 1 }));
    debouncedFetchData(query);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > pagination.total_pages || page === pagination.current_page || loading) {
      return;
    }
    setPagination((prev) => ({ ...prev, current_page: page }));
    fetchData({
      page,
      search: searchQuery,
      billNo: filters.billNo,
      paymentStatus: filters.paymentStatus,
    });
  };

  const renderPaginationItems = () => {
    if (!pagination.total_pages || pagination.total_pages <= 0) return null;
    const items = [];
    const { total_pages: totalPages, current_page: currentPage } = pagination;

    for (let i = 1; i <= totalPages; i++) {
      if (totalPages > 7 && i > 2 && i < totalPages - 1 && Math.abs(i - currentPage) > 1) {
        if (i === 3 || i === totalPages - 2) {
          items.push(
            <PaginationItem key={`ellipsis-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          );
        }
        continue;
      }
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
    return items;
  };

  const statsCards = [
    { label: "Total Invoices", value: `${stats.totalInvoices.toLocaleString("en-IN")}`, icon: FileText },
    { label: "Total Amount", value: `${stats.totalAmount.toLocaleString("en-IN")}`, icon: Wallet },
    { label: "Pending Amount", value: `${stats.pendingAmount.toLocaleString("en-IN")}`, icon: Clock },
    { label: "Paid Amount", value: `${stats.paidAmount.toLocaleString("en-IN")}`, icon: CheckCircle2 },
  ];

  const renderCell = (item: CustomerBill, columnKey: string) => {
    switch (columnKey) {
      case "billingDate":
      case "dueDate":
        return item[columnKey] ? format(new Date(item[columnKey]), "dd-MM-yyyy") : "-";
      case "totalAmount":
        return item.totalAmount ? `${currency} ${item.totalAmount.toLocaleString("en-IN")}` : "-";
      case "status":
        return item.status ? <StatusBadge status={item.status}>{item.status}</StatusBadge> : "-";
      default:
        return ((item as unknown as Record<string, unknown>)[columnKey] as ReactNode) ?? "-";
    }
  };

  const renderActions = (item: CustomerBill) => (
    <div className="flex justify-center">
      <Button
        size="sm"
        variant="ghost"
        className="h-8 w-8 p-0 hover:bg-brand-selected"
        onClick={() => navigate(`/finance/customer-bills/details/${item.id}`)}
        title="View"
      >
        <Eye className="h-4 w-4 text-brand" />
      </Button>
    </div>
  );

  return (
    <div className="p-4 sm:p-6">
      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6 text-brand-text">Customer Bills</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div
              key={index}
              className="bg-brand-card-bg p-6 rounded-lg shadow-[0px_1px_8px_rgba(45,45,45,0.05)] flex items-center gap-4"
            >
              <div className="w-14 h-14 bg-[#C4B89D54] flex items-center justify-center">
                <IconComponent className="w-6 h-6 text-brand" />
              </div>
              <div>
                <div className="text-2xl font-semibold text-brand-text">{card.value}</div>
                <div className="text-sm font-medium text-brand-text-light">{card.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <EnhancedTable
        data={customerBillsData}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        storageKey="customer-bills-table"
        emptyMessage="No customer bills found"
        searchTerm={searchQuery}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search by bill number or customer..."
        enableSearch
        disableClientSearch
        onFilterClick={() => setIsFilterDialogOpen(true)}
        loading={loading}
      />

      {pagination.total_pages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(pagination.current_page - 1)}
                  className={pagination.current_page === 1 || loading ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {renderPaginationItems()}
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(pagination.current_page + 1)}
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
      )}

      <CustomerBillsFilterDialog
        open={isFilterDialogOpen}
        onOpenChange={setIsFilterDialogOpen}
        onApply={handleApplyFilters}
      />
    </div>
  );
};
