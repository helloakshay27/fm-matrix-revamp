import React, { useState, useEffect, useRef, useCallback } from "react";
import { PaymentDetailView } from "./components/PaymentDetailView";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Plus,
  ChevronDown,
  X,
  MoreHorizontal,
  Download,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast as sonnerToast } from "sonner";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { TicketPagination } from "@/components/TicketPagination";
import { useDebounce } from "@/hooks/useDebounce";
import { API_CONFIG } from "@/config/apiConfig";

// API shape returned by lock_payments.json
interface LockPayment {
  id: number;
  order_number: string;
  payment_of: string;
  payment_of_id: number;
  payment_mode: string | null;
  sub_total: string | null;
  gst: string | null;
  discount: string | null;
  total_amount: string;
  paid_amount: string | null;
  payment_status: string | null;
  pg_state: string | null;
  pg_response_code: string | null;
  pg_response_msg: string | null;
  pg_transaction_id: string | null;
  created_at: string;
  updated_at: string;
  payment_method: string | null;
  card_type: string | null;
  cheque_number: string | null;
  cheque_date: string | null;
  bank_name: string | null;
  ifsc: string | null;
  branch: string | null;
  neft_reference: string | null;
  notes: string | null;
  payment_gateway: string | null;
  user_id: number | null;
  redirect: string;
  payment_type: string | null;
  convenience_charge: string | null;
  refunded_amount: string | null;
  refund_mode: string | null;
  refund_transaction_no: string | null;
  refund_note: string | null;
  refunded_by: string | null;
  refunded_on: string | null;
  receipt_number: string | null;
  created_by_id: number | null;
  updt_balance: string | null;
  recon_status: string | null;
  reconciled_by: string | null;
  reconciled_on: string | null;
  resource_id: number;
  resource_type: string;
  sgst: string | null;
}

// Internal display type for the table / detail view
interface Payment {
  id: string;
  payment_number: string;
  vendor_name: string;
  date: string;
  mode: string;
  status: "DRAFT" | "PAID" | "VOID";
  amount: number;
  unused_amount: number;
  bank_reference_number: string;
  paid_through_account: string;
  currency_symbol: string;
}

interface PaymentFilters {
  status?: string;
  mode?: string;
  dateFrom?: string;
  dateTo?: string;
}

// Helper: map API LockPayment → internal Payment
const mapLockPayment = (lp: LockPayment): Payment => {
  const statusRaw = (lp.payment_status || "").toLowerCase();
  let status: Payment["status"] = "DRAFT";
  if (statusRaw === "paid" || statusRaw === "success") status = "PAID";
  else if (statusRaw === "void" || statusRaw === "failed") status = "VOID";

  const date = lp.created_at
    ? new Date(lp.created_at).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "-";

  return {
    id: String(lp.id),
    payment_number: lp.receipt_number || lp.order_number || String(lp.id),
    vendor_name: lp.payment_of || "-",
    date,
    mode: lp.payment_mode || lp.payment_method || "-",
    status,
    amount: parseFloat(lp.total_amount || "0") || 0,
    unused_amount: 0,
    bank_reference_number: lp.neft_reference || lp.pg_transaction_id || "",
    paid_through_account: lp.payment_gateway || lp.bank_name || "-",
    currency_symbol: "₹",
  };
};

export const PaymentsMadePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"list" | "detail">("list");
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(
    "1"
  );

  useEffect(() => {
    const paymentId = searchParams.get("paymentId");
    const view = searchParams.get("view");
    if (paymentId && view === "detail") {
      setSelectedPaymentId(paymentId);
      setViewMode("detail");
    }
  }, [searchParams]);
  const [selectedPaymentIds, setSelectedPaymentIds] = useState<string[]>([]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPaymentIds(filteredPayments.map((p) => p.id));
    } else {
      setSelectedPaymentIds([]);
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedPaymentIds((prev) => [...prev, id]);
    } else {
      setSelectedPaymentIds((prev) => prev.filter((i) => i !== id));
    }
  };

  const handleDelete = () => {
    setPayments((prev) =>
      prev.filter((p) => !selectedPaymentIds.includes(p.id))
    );
    setSelectedPaymentIds([]);
    sonnerToast.success("Payments deleted successfully");
  };
  const [payments, setPayments] = useState<Payment[]>([]);

  const [isImportMenuOpen, setIsImportMenuOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<PaymentFilters>({});

  const moreMenuRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        moreMenuRef.current &&
        !moreMenuRef.current.contains(event.target as Node)
      ) {
        setIsMoreMenuOpen(false);
        setIsImportMenuOpen(false);
        setIsExportMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedPayment = payments.find((p) => p.id === selectedPaymentId);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchQuery = useDebounce(searchTerm, 1000);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total_pages: 1,
    total_count: 0,
    has_next_page: false,
    has_prev_page: false,
  });

  // Fetch payment list from API
  const fetchPayments = useCallback(
    async (page: number = 1) => {
      setLoading(true);
      try {
        const baseUrl = API_CONFIG.BASE_URL;
        const token = API_CONFIG.TOKEN;
        if (!baseUrl || !token) {
          sonnerToast.error("API not configured. Please log in.");
          return;
        }
        const url = new URL(
          `${baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`}/lock_payments.json`
        );
        url.searchParams.append("page", String(page));
        url.searchParams.append("per_page", String(perPage));

        const response = await fetch(url.toString(), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        const list: LockPayment[] = data.lock_payments || [];
        setPayments(list.map(mapLockPayment));

        if (data.pagination) {
          setPagination((prev) => ({
            ...prev,
            current_page: data.pagination.current_page ?? page,
            total_pages: data.pagination.total_pages ?? 1,
            total_count: data.pagination.total_count ?? list.length,
          }));
        } else {
          setPagination((prev) => ({ ...prev, total_count: list.length }));
        }
      } catch (err) {
        console.error("Failed to fetch payments:", err);
        sonnerToast.error("Failed to load payments");
      } finally {
        setLoading(false);
      }
    },
    [perPage]
  );

  useEffect(() => {
    fetchPayments(currentPage);
  }, [currentPage, fetchPayments]);

  // Filter payments based on selected view + search term
  const filteredPayments = payments.filter((payment) => {
    // Status filter
    if (appliedFilters.status && payment.status !== appliedFilters.status) {
      return false;
    }
    // Search filter
    if (debouncedSearchQuery) {
      const q = debouncedSearchQuery.toLowerCase();
      const matchesSearch =
        payment.payment_number.toLowerCase().includes(q) ||
        payment.vendor_name.toLowerCase().includes(q) ||
        String(payment.amount).includes(q) ||
        payment.mode.toLowerCase().includes(q) ||
        payment.status.toLowerCase().includes(q) ||
        payment.date.toLowerCase().includes(q) ||
        (payment.bank_reference_number || "").toLowerCase().includes(q) ||
        (payment.paid_through_account || "").toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }
    return true;
  });

  // Re-define columns inside component if needed or use constants
  // Column configuration for the enhanced table
  const columns: ColumnConfig[] = [
    {
      key: "date",
      label: "DATE",
      sortable: true,
      hideable: true,
      draggable: true,
    },
    {
      key: "payment_number",
      label: "PAYMENT",
      sortable: true,
      hideable: true,
      draggable: true,
    },
    {
      key: "reference_number",
      label: "REFERENCE",
      sortable: true,
      hideable: true,
      draggable: true,
    },
    {
      key: "vendor_name",
      label: "VENDOR NAME",
      sortable: true,
      hideable: true,
      draggable: true,
    },
    {
      key: "bill_number",
      label: "BILL",
      sortable: true,
      hideable: true,
      draggable: true,
    },
    {
      key: "mode",
      label: "MODE",
      sortable: true,
      hideable: true,
      draggable: true,
    },
    {
      key: "status",
      label: "STATUS",
      sortable: true,
      hideable: true,
      draggable: true,
    },
    {
      key: "amount",
      label: "AMOUNT",
      sortable: true,
      hideable: true,
      draggable: true,
    },
    {
      key: "unused_amount",
      label: "UNUSED AMOUNT",
      sortable: true,
      hideable: true,
      draggable: true,
    },
    {
      key: "bank_reference_number",
      label: "BANK REFERENCE NUMBER",
      sortable: true,
      hideable: true,
      draggable: true,
    },
    {
      key: "paid_through_account",
      label: "PAID THROUGH ACCOUNT",
      sortable: true,
      hideable: true,
      draggable: true,
    },
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  const renderRow = (payment: Payment) => ({
    date: <span className="text-sm text-gray-900">{payment.date}</span>,
    payment_number: (
      <div
        className="font-medium text-blue-500 cursor-pointer hover:underline"
        onClick={() => sonnerToast.info(`View payment ${payment.id}`)}
      >
        {payment.payment_number}
      </div>
    ),
    reference_number: <span className="text-sm text-gray-900">-</span>,
    vendor_name: (
      <span className="text-sm text-gray-900">{payment.vendor_name}</span>
    ),
    bill_number: <span className="text-sm text-gray-900">-</span>,
    mode: <span className="text-sm text-gray-900">{payment.mode}</span>,
    status: (
      <span
        className={cn(
          "text-xs font-semibold uppercase",
          payment.status === "PAID" ? "text-green-500" : "text-gray-500"
        )}
      >
        {payment.status}
      </span>
    ),
    amount: (
      <span className="text-sm text-gray-900 font-medium">
        {payment.currency_symbol}
        {payment.amount.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    ),
    unused_amount: (
      <span className="text-sm text-gray-900">
        {payment.currency_symbol}
        {payment.unused_amount.toFixed(2)}
      </span>
    ),
    bank_reference_number: (
      <span className="text-sm text-gray-900">
        {payment.bank_reference_number || "-"}
      </span>
    ),
    paid_through_account: (
      <span className="text-sm text-gray-900">
        {payment.paid_through_account}
      </span>
    ),
  });

  if (viewMode === "detail") {
    return (
      <div className="bg-white min-h-screen ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
        <PaymentDetailView
          payments={filteredPayments}
          selectedPaymentId={selectedPaymentId}
          onSelectPayment={(id) => setSelectedPaymentId(id)}
          onClose={() => {
            setSearchParams({});
            setViewMode("list");
          }}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">All Payments</h1>
      </div>

      <EnhancedTaskTable
        data={filteredPayments}
        columns={columns}
        leftActions={
          <Button
            className="bg-[#d23f57] hover:bg-[#b03045] text-white gap-2 h-9 px-4 rounded-[4px]"
            onClick={() => navigate("/accounting/payments-made/create")}
          >
            <Plus className="h-4 w-4" />
            New
          </Button>
        }
        rightActions={
          <div className="flex items-center gap-2" ref={moreMenuRef}>
            {/* Import Button */}
            <div className="relative">
              <Button
                variant="outline"
                size="icon"
                className="bg-white border-gray-300 h-9 w-9 rounded-[4px]"
                onClick={() => {
                  setIsImportMenuOpen(!isImportMenuOpen);
                  setIsExportMenuOpen(false);
                  setIsMoreMenuOpen(false);
                }}
              >
                <Upload className="h-4 w-4 text-gray-600" />
              </Button>
              {isImportMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <button
                    onClick={() => {
                      setIsImportMenuOpen(false);
                      sonnerToast.info("Import Payments clicked");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-left text-sm"
                  >
                    Import Payments
                  </button>
                </div>
              )}
            </div>

            {/* Export Button */}
            <div className="relative">
              <Button
                variant="outline"
                size="icon"
                className="bg-white border-gray-300 h-9 w-9 rounded-[4px]"
                onClick={() => {
                  setIsExportMenuOpen(!isExportMenuOpen);
                  setIsImportMenuOpen(false);
                  setIsMoreMenuOpen(false);
                }}
              >
                <Download className="h-4 w-4 text-gray-600" />
              </Button>
              {isExportMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <button
                    onClick={() => {
                      setIsExportMenuOpen(false);
                      sonnerToast.info("Export Payments clicked");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-left text-sm"
                  >
                    Export Payments
                  </button>
                </div>
              )}
            </div>

            <div className="relative">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 border-gray-300 rounded-[4px]"
                onClick={() => {
                  setIsMoreMenuOpen(!isMoreMenuOpen);
                  setIsImportMenuOpen(false);
                  setIsExportMenuOpen(false);
                }}
              >
                <MoreHorizontal className="h-4 w-4 text-gray-600" />
              </Button>
              {isMoreMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <button
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      sonnerToast.info("Preferences clicked");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-left text-sm"
                  >
                    Preferences
                  </button>
                  <button
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      fetchPayments(currentPage);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-left text-sm"
                  >
                    Refresh List
                  </button>
                </div>
              )}
            </div>
          </div>
        }
        renderRow={renderRow}
        storageKey="payments-made-dashboard-v1"
        hideTableExport={true}
        hideTableSearch={false}
        enableSearch={true}
        searchTerm={searchTerm}
        onSearchChange={(val) => setSearchTerm(val)}
        searchPlaceholder="Search payments..."
        loading={loading}
        onRowClick={(payment) => {
          setSelectedPaymentId(payment.id);
          setViewMode("detail");
        }}
      />

      {pagination.total_count > 0 && (
        <TicketPagination
          currentPage={currentPage}
          totalPages={Math.ceil(pagination.total_count / perPage)}
          totalRecords={pagination.total_count}
          perPage={perPage}
          isLoading={loading}
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
        />
      )}
    </div>
  );
};
