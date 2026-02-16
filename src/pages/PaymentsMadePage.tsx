import React, { useState, useEffect, useRef } from "react";
import { PaymentDetailView } from "./components/PaymentDetailView";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Plus,
  MoreVertical,
  ChevronDown,
  Search,
  Filter,
  Paperclip,
  MessageSquare,
  X,
  Edit,
  Printer,
  CheckCircle,
  MoreHorizontal,
  Download,
  Upload,
  Star,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { toast as sonnerToast } from "sonner";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { TicketPagination } from "@/components/TicketPagination";
import { useDebounce } from "@/hooks/useDebounce";

// Type definitions for Payment
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
    const remainingPayments = payments.filter(
      (p) => !selectedPaymentIds.includes(p.id)
    );
    setPayments(remainingPayments);
    localStorage.setItem("mock_payments", JSON.stringify(remainingPayments));
    setSelectedPaymentIds([]);
    sonnerToast.success("Payments deleted successfully");
  };
  const [payments, setPayments] = useState<Payment[]>(() => {
    const savedPayments = localStorage.getItem("mock_payments");
    if (savedPayments) {
      return JSON.parse(savedPayments);
    }
    const initialMock: Payment[] = [
      {
        id: "1",
        payment_number: "3",
        vendor_name: "Gophygital",
        date: "12/02/2026",
        mode: "Cash",
        status: "DRAFT",
        amount: 12333.0,
        unused_amount: 0.0,
        bank_reference_number: "",
        paid_through_account: "Petty Cash",
        currency_symbol: "₹",
      },
      {
        id: "2",
        payment_number: "2",
        vendor_name: "Gophygital",
        date: "12/02/2026",
        mode: "Cash",
        status: "PAID",
        amount: 250.0,
        unused_amount: 0.0,
        bank_reference_number: "",
        paid_through_account: "Distributions",
        currency_symbol: "₹",
      },
      {
        id: "3",
        payment_number: "1",
        vendor_name: "Gophygital",
        date: "12/11/2025",
        mode: "Cash",
        status: "PAID",
        amount: 250.0,
        unused_amount: 0.0,
        bank_reference_number: "",
        paid_through_account: "Petty Cash",
        currency_symbol: "₹",
      },
    ];
    localStorage.setItem("mock_payments", JSON.stringify(initialMock));
    return initialMock;
  });

  const [isImportMenuOpen, setIsImportMenuOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedView, setSelectedView] = useState("All Payments");
  const [favorites, setFavorites] = useState<string[]>(["Advance Payments"]);
  const [appliedFilters, setAppliedFilters] = useState<PaymentFilters>({});

  const moreMenuRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
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
    total_count: 3, // Mock count
    has_next_page: false,
    has_prev_page: false,
  });

  // Payment view options
  const paymentViews = [
    { name: "All Payments", icon: Star },
    { name: "Draft", icon: Star },
    { name: "Paid", icon: Star },
    { name: "Void", icon: Star },
    { name: "Advance Payments", icon: Star },
    { name: "Bill Payments", icon: Star },
  ];

  // Toggle favorite
  const toggleFavorite = (viewName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(viewName)
        ? prev.filter((fav) => fav !== viewName)
        : [...prev, viewName]
    );
  };

  // Separate views into favorites and default filters
  const favoriteViews = paymentViews.filter((view) =>
    favorites.includes(view.name)
  );
  const defaultViews = paymentViews.filter(
    (view) => !favorites.includes(view.name)
  );

  // Handle view selection
  const handleViewSelect = (viewName: string) => {
    setSelectedView(viewName);
    setIsDropdownOpen(false);
    // Apply filter based on view
    if (viewName === "All Payments") {
      setAppliedFilters({});
    } else if (viewName === "Paid") {
      setAppliedFilters({ status: "PAID" });
    } else if (viewName === "Draft") {
      setAppliedFilters({ status: "DRAFT" });
    } else if (viewName === "Void") {
      setAppliedFilters({ status: "VOID" });
    }
    setCurrentPage(1);
  };

  // Filter payments based on selected view
  const filteredPayments = payments.filter((payment) => {
    if (appliedFilters.status) {
      return payment.status === appliedFilters.status;
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
      label: "PAYMENT #",
      sortable: true,
      hideable: true,
      draggable: true,
    },
    {
      key: "reference_number",
      label: "REFERENCE#",
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
      label: "BILL#",
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

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handlePerPageChange = (newPerPage: number) => setPerPage(newPerPage);

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
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        {/* Left: View Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 text-lg font-semibold text-gray-900 hover:text-gray-700 transition-colors"
          >
            {selectedView}
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              {/* Favorites Section */}
              {favoriteViews.length > 0 && (
                <>
                  <div className="px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ChevronDown className="w-3 h-3 text-gray-500" />
                      <span className="text-xs font-semibold text-gray-500 uppercase">
                        Favorites
                      </span>
                    </div>
                    <span className="bg-blue-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                      {favoriteViews.length}
                    </span>
                  </div>
                  {favoriteViews.map((view) => (
                    <button
                      key={view.name}
                      onClick={() => handleViewSelect(view.name)}
                      className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                    >
                      <span className="text-sm text-gray-700">{view.name}</span>
                      <button
                        onClick={(e) => toggleFavorite(view.name, e)}
                        className="hover:scale-110 transition-transform"
                      >
                        <Star className="w-4 h-4 text-red-500 fill-red-500" />
                      </button>
                    </button>
                  ))}
                </>
              )}

              {/* Default Filters Section */}
              <div className="px-4 py-2 flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <ChevronDown className="w-3 h-3 text-gray-500" />
                  <span className="text-xs font-semibold text-gray-500 uppercase">
                    Default Filters
                  </span>
                </div>
                <span className="bg-blue-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                  {defaultViews.length}
                </span>
              </div>
              {defaultViews.map((view) => (
                <button
                  key={view.name}
                  onClick={() => handleViewSelect(view.name)}
                  className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                >
                  <span className="text-sm text-gray-700">{view.name}</span>
                  <button
                    onClick={(e) => toggleFavorite(view.name, e)}
                    className="hover:scale-110 transition-transform"
                  >
                    <Star className="w-4 h-4 text-gray-400" />
                  </button>
                </button>
              ))}

              {/* New Custom View */}
              <div className="border-t border-gray-200 mt-2 pt-2">
                <button className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left">
                  <Plus className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-600 font-medium">
                    New Custom View
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <EnhancedTaskTable
        data={filteredPayments}
        columns={columns}
        leftActions={
          <Button
            className="bg-[#d23f57] hover:bg-[#b03045] text-white gap-2 h-9 px-4 rounded-[4px]"
            onClick={() => navigate("/settings/payments-made/create")}
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
                className="gap-2 bg-white border-gray-300 h-9"
                onClick={() => {
                  setIsImportMenuOpen(!isImportMenuOpen);
                  setIsExportMenuOpen(false);
                  setIsMoreMenuOpen(false);
                }}
              >
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-normal">Import</span>
                  <ChevronDown className="h-4 w-4 text-gray-600" />
                </div>
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
                className="gap-2 bg-white border-gray-300 h-9"
                onClick={() => {
                  setIsExportMenuOpen(!isExportMenuOpen);
                  setIsImportMenuOpen(false);
                  setIsMoreMenuOpen(false);
                }}
              >
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-normal">Export</span>
                  <ChevronDown className="h-4 w-4 text-gray-600" />
                </div>
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
                      sonnerToast.info("Refresh List clicked");
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
        hideTableSearch={true}
        enableSearch={false}
        loading={loading}
        selectable={true}
        selectedItems={selectedPaymentIds}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectItem}
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
      {/* Floating Bulk Action Popup */}
      {selectedPaymentIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 shadow-xl rounded-lg px-4 py-3 flex items-center gap-4 z-50 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs bg-gray-50 hover:bg-gray-100"
            >
              Bulk Update
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs text-red-600 bg-white hover:text-red-700 hover:bg-red-50 border-red-200"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
          <div className="h-4 w-px bg-gray-300 mx-2"></div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full min-w-[24px] text-center">
              {selectedPaymentIds.length}
            </span>
            <span className="text-sm text-gray-600 font-medium">Selected</span>
          </div>
          <div className="h-4 w-px bg-gray-300 mx-2"></div>
          <button
            onClick={() => setSelectedPaymentIds([])}
            className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <div className="flex items-center gap-1 text-xs">
              <span>Esc</span>
              <X className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}
    </div>
  );
};
