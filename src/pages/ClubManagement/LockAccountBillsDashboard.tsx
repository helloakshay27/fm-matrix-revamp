import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Eye, Download, Loader2, AlertTriangle, CreditCard } from "lucide-react";
import { LockAccountBillMarkPaymentDialog } from "./LockAccountBillMarkPaymentDialog";
import { Button } from "@/components/ui/button";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { TicketPagination } from "@/components/TicketPagination";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  LockAccountBillRecord,
  RESOURCE_TYPE_LABELS,
  downloadLockAccountBillInvoice,
} from "./lockAccountBillInvoiceUtils";

const STATUS_OPTIONS = [
  "draft",
  "pending_approval",
  "open",
  "approved",
  "rejected",
  "Paid",
  "Part Payment",
  "Cancelled",
];

// The FacilityBooking model's own current_status values (not this bill's own status) —
// see FacilityBooking#current_status. MySQL's default collation here is case-insensitive,
// so sending "Cancelled" still matches the stored "cancelled".
const FACILITY_BOOKING_STATUS_OPTIONS = ["Confirmed", "Cancelled", "Pending"];

const columns: ColumnConfig[] = [
  { key: "actions", label: "Action", sortable: false, hideable: false, draggable: false },
  { key: "id", label: "ID", sortable: true, hideable: true, draggable: true },
  { key: "bill_number", label: "Bill Number", sortable: true, hideable: true, draggable: true },
  { key: "resource_type", label: "Resource Type", sortable: true, hideable: true, draggable: true },
  { key: "resource_id", label: "Resource Id", sortable: true, hideable: true, draggable: true },
  { key: "facility_booking_status", label: "Facility Booking Status", sortable: true, hideable: true, draggable: true },
  { key: "bill_date", label: "Bill Date", sortable: true, hideable: true, draggable: true },
  { key: "due_date", label: "Due Date", sortable: true, hideable: true, draggable: true },
  { key: "total_amount", label: "Total Amount", sortable: true, hideable: true, draggable: true },
  { key: "balance_amount", label: "Balance Amount", sortable: true, hideable: true, draggable: true },
  { key: "status", label: "Status", sortable: true, hideable: true, draggable: true },
];

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const formatCurrency = (value?: number | null) => {
  if (value === null || value === undefined) return "-";
  return `₹${Number(value).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const LockAccountBillsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [bills, setBills] = useState<LockAccountBillRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [markPaymentBill, setMarkPaymentBill] = useState<LockAccountBillRecord | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 800);
  const [resourceTypeFilter, setResourceTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [facilityBookingStatusFilter, setFacilityBookingStatusFilter] = useState<string>("all");

  // A Facility Booking status filter only makes sense against Facility Booking bills — force
  // the resource type in step with it rather than let the two silently contradict each other
  // (the backend scopes facility_booking_status to resource_type=FacilityBooking regardless).
  useEffect(() => {
    if (facilityBookingStatusFilter !== "all" && resourceTypeFilter !== "FacilityBooking") {
      setResourceTypeFilter("FacilityBooking");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facilityBookingStatusFilter]);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkDownloading, setBulkDownloading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const getItemId = (bill: LockAccountBillRecord) => String(bill.id);

  // Shared by fetchBills (paginated list) and handleExportBills (full matching set) so the
  // export always reflects exactly what's currently filtered/visible on the list.
  const buildFilterParams = () => {
    const params = new URLSearchParams();
    const lockAccountId = localStorage.getItem("lock_account_id");
    if (lockAccountId) params.append("lock_account_id", lockAccountId);
    if (debouncedSearchTerm) params.append("q[bill_number_cont]", debouncedSearchTerm);
    if (statusFilter !== "all") params.append("q[status_eq]", statusFilter);
    if (fromDate) params.append("q[bill_date_gteq]", fromDate);
    if (toDate) params.append("q[bill_date_lteq]", toDate);
    if (facilityBookingStatusFilter !== "all") params.append("facility_booking_status", facilityBookingStatusFilter);

    // Only show bills with a resource_type set — Facility Booking / Club Member Allocation
    // (a real linked resource) or Other (a manually-created Invoice/Credit Note, resource_id blank).
    if (resourceTypeFilter === "all") {
      params.append("q[resource_type_in][]", "FacilityBooking");
      params.append("q[resource_type_in][]", "ClubMemberAllocation");
      params.append("q[resource_type_in][]", "Other");
    } else {
      params.append("q[resource_type_eq]", resourceTypeFilter);
    }
    return params;
  };

  const fetchBills = async (page = 1, per_page = 10) => {
    setLoading(true);
    setSelectedIds([]);
    try {
      const baseUrl = localStorage.getItem("baseUrl");
      const token = localStorage.getItem("token");

      const params = buildFilterParams();
      params.append("page", String(page));
      params.append("per_page", String(per_page));
      // Opts into { data, total_count } instead of the bare array other pages still rely on
      // (see index.json.jbuilder) — total_count in the body avoids depending on the
      // X-Total-Count response header being exposed via CORS at all.
      params.append("include_total", "true");

      const response = await axios.get(`https://${baseUrl}/lock_account_bills.json?${params.toString()}`, {
        headers: { Authorization: token ? `Bearer ${token}` : undefined },
      });

      const list: LockAccountBillRecord[] = Array.isArray(response.data?.data) ? response.data.data : [];
      setBills(list);
      setTotalRecords(Number(response.data?.total_count ?? list.length));
    } catch (error) {
      console.error("Error fetching lock account bills:", error);
      toast.error("Failed to load lock account bills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills(currentPage, perPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, perPage, debouncedSearchTerm, resourceTypeFilter, statusFilter, fromDate, toDate, facilityBookingStatusFilter]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  const handleView = (id: number) => navigate(`/club-management/lock-account-bills/details/${id}`);

  const handleDownload = async (bill: LockAccountBillRecord) => {
    setDownloadingId(bill.id);
    const loadingToast = toast.loading("Downloading invoice PDF...");
    try {
      await downloadLockAccountBillInvoice(bill);
      toast.success("Invoice PDF downloaded");
    } catch (error) {
      console.error("Error downloading invoice PDF:", error);
      toast.error(error instanceof Error ? error.message : "Failed to download invoice PDF");
    } finally {
      toast.dismiss(loadingToast);
      setDownloadingId(null);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? bills.map(getItemId) : []);
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((existing) => existing !== id)));
  };

  const handleBulkDownload = async () => {
    const selected = bills.filter((bill) => selectedIds.includes(getItemId(bill)));
    if (selected.length === 0) return;

    // Skip bills whose linked resource is gone up front — no point round-tripping to the
    // server for a download we already know will fail.
    const downloadable = selected.filter((bill) => bill.resource_exists !== false);
    const skipped = selected.length - downloadable.length;

    setBulkDownloading(true);
    const loadingToast = toast.loading(`Downloading ${downloadable.length} invoice(s)...`);
    let succeeded = 0;
    let failed = 0;
    // Sequential, not Promise.all: firing many simultaneous anchor-click downloads at once
    // gets several blocked by the browser's popup/download-spam guard.
    for (const bill of downloadable) {
      try {
        await downloadLockAccountBillInvoice(bill);
        succeeded += 1;
      } catch (error) {
        console.error(`Error downloading invoice for bill ${bill.id}:`, error);
        failed += 1;
      }
    }
    toast.dismiss(loadingToast);
    const skippedNote = skipped > 0 ? `, ${skipped} skipped (resource deleted)` : "";
    if (failed === 0) {
      toast.success(`Downloaded ${succeeded} invoice(s)${skippedNote}`);
    } else {
      toast.error(`Downloaded ${succeeded} invoice(s), ${failed} failed${skippedNote}`);
    }
    setBulkDownloading(false);
  };

  const csvCell = (value: unknown): string => {
    const text = value === null || value === undefined ? "" : String(value);
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };

  const handleExportBills = async () => {
    if (exporting) return;
    setExporting(true);
    const loadingToast = toast.loading("Preparing export...");
    try {
      const baseUrl = localStorage.getItem("baseUrl");
      const token = localStorage.getItem("token");
      const params = buildFilterParams();

      // export.json (not .csv) deliberately — the API's own CSV/XLS/HTML formats sit behind a
      // phone-verification redirect (see check_user in user_ext.rb), JSON doesn't. Build the
      // CSV client-side from the same {columns, data} shape instead.
      const response = await axios.get(
        `https://${baseUrl}/lock_account_bills/export.json?${params.toString()}`,
        { headers: { Authorization: token ? `Bearer ${token}` : undefined } }
      );

      const { columns: exportColumns, data } = response.data as {
        columns: string[];
        data: Record<string, unknown>[];
      };

      const headerLabels: Record<string, string> = {
        id: "ID",
        bill_number: "Bill Number",
        bill_date: "Bill Date",
        due_date: "Due Date",
        billed_to_name: "Billed To",
        billed_to_type: "Billed To Type",
        total_amount: "Total Amount",
        charge_amount: "Charge Amount",
        discount_amount: "Discount Amount",
        status: "Status",
        resource_type: "For (Type)",
        resource_id: "For (ID)",
        facility_booking_status: "Facility Booking Status",
        payment_status: "Payment Status",
        notes: "Notes",
      };

      const lines = [
        exportColumns.map((c) => csvCell(headerLabels[c] || c)).join(","),
        ...data.map((row) => exportColumns.map((c) => csvCell(row[c])).join(",")),
      ];
      const csvContent = lines.join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `lock-account-bills-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`Exported ${data.length} bill(s)`);
    } catch (error) {
      console.error("Error exporting lock account bills:", error);
      toast.error("Failed to export lock account bills");
    } finally {
      toast.dismiss(loadingToast);
      setExporting(false);
    }
  };

  const getStatusBadge = (status?: string | null) => {
    if (!status) return <span className="text-sm text-gray-900">-</span>;
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        {String(status).replace(/_/g, " ").toUpperCase()}
      </span>
    );
  };

  const totalPages = Math.max(1, Math.ceil(totalRecords / perPage));

  const renderRow = (bill: LockAccountBillRecord) => ({
    actions: (
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleView(bill.id)}
          className="p-1 text-black hover:bg-gray-100 rounded"
          title="View"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleDownload(bill)}
          disabled={downloadingId === bill.id || bill.resource_exists === false}
          className="p-1 text-black hover:bg-gray-100 rounded disabled:opacity-50"
          title={
            bill.resource_exists === false
              ? "Linked resource was deleted — invoice can't be generated"
              : "Download Invoice"
          }
        >
          <Download className="w-4 h-4" />
        </button>
        <button
          onClick={() => setMarkPaymentBill(bill)}
          disabled={
            !bill.resource_id ||
            (bill.total_amount ?? 0) <= 0 ||
            ["paid", "part payment"].includes(String(bill.status).toLowerCase())
          }
          className="p-1 text-black hover:bg-gray-100 rounded disabled:opacity-50"
          title={!bill.resource_id ? "Other (Invoice) bills are marked paid from the Invoice's own payment flow" : "Mark Payment"}
        >
          <CreditCard className="w-4 h-4" />
        </button>
      </div>
    ),
    id: <span className="text-sm text-gray-900">{bill.id}</span>,
    bill_number: <div className="font-medium text-brand">{bill.bill_number || "-"}</div>,
    resource_type: (
      <span className="inline-flex items-center gap-1.5 text-sm text-gray-900">
        {(bill.resource_type && RESOURCE_TYPE_LABELS[bill.resource_type]) || bill.resource_type || "-"}
        {bill.resource_exists === false && (
          <span
            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs font-medium bg-brand-error-bg text-brand-error"
            title="This resource has been deleted — invoice can't be generated"
          >
            <AlertTriangle className="w-3 h-3" /> Deleted
          </span>
        )}
      </span>
    ),
    resource_id: <span className="text-sm text-gray-900">{bill.resource_id ?? "-"}</span>,
    facility_booking_status: (
      <span className="text-sm text-gray-900">{bill.facility_booking_status || "-"}</span>
    ),
    bill_date: <span className="text-sm text-gray-600">{formatDate(bill.bill_date)}</span>,
    due_date: <span className="text-sm text-gray-600">{formatDate(bill.due_date)}</span>,
    total_amount: <span className="text-sm font-medium text-gray-900">{formatCurrency(bill.total_amount)}</span>,
    balance_amount: (
      <span className="text-sm font-medium text-red-600">{formatCurrency(bill.balance_amount)}</span>
    ),
    status: <div className="flex items-center justify-center gap-2">{getStatusBadge(bill.status)}</div>,
  });

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Lock Account Bills</h1>
      </header>

      <div className="flex items-end gap-3 flex-wrap p-4 border border-gray-200 rounded-lg bg-white">
        <div>
          <Label htmlFor="lab-resource-type" className="text-xs text-gray-600">Resource Type</Label>
          <Select
            value={resourceTypeFilter}
            onValueChange={(value) => { setResourceTypeFilter(value); setCurrentPage(1); }}
            disabled={facilityBookingStatusFilter !== "all"}
          >
            <SelectTrigger
              id="lab-resource-type"
              className="w-[190px] mt-1"
              title={facilityBookingStatusFilter !== "all" ? "Locked to Facility Booking while a Facility Booking Status filter is active" : undefined}
            >
              <SelectValue placeholder="Resource Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Resource Types</SelectItem>
              <SelectItem value="FacilityBooking">Facility Booking</SelectItem>
              <SelectItem value="ClubMemberAllocation">Club Member Allocation</SelectItem>
              <SelectItem value="Other">Other (Invoice)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="lab-status" className="text-xs text-gray-600">Status</Label>
          <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value); setCurrentPage(1); }}>
            <SelectTrigger id="lab-status" className="w-[160px] mt-1">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {STATUS_OPTIONS.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="lab-from-date" className="text-xs text-gray-600">Bill Date From</Label>
          <Input
            id="lab-from-date"
            type="date"
            value={fromDate}
            max={toDate || undefined}
            onChange={(e) => { setFromDate(e.target.value); setCurrentPage(1); }}
            className="w-[160px] mt-1"
          />
        </div>
        <div>
          <Label htmlFor="lab-to-date" className="text-xs text-gray-600">Bill Date To</Label>
          <Input
            id="lab-to-date"
            type="date"
            value={toDate}
            min={fromDate || undefined}
            onChange={(e) => { setToDate(e.target.value); setCurrentPage(1); }}
            className="w-[160px] mt-1"
          />
        </div>
        <div>
          <Label htmlFor="lab-fb-status" className="text-xs text-gray-600">Facility Booking Status</Label>
          <Select
            value={facilityBookingStatusFilter}
            onValueChange={(value) => { setFacilityBookingStatusFilter(value); setCurrentPage(1); }}
          >
            <SelectTrigger id="lab-fb-status" className="w-[200px] mt-1">
              <SelectValue placeholder="Facility Booking Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Status</SelectItem>
              {FACILITY_BOOKING_STATUS_OPTIONS.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {(fromDate || toDate || resourceTypeFilter !== "all" || statusFilter !== "all" || facilityBookingStatusFilter !== "all") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setFromDate("");
              setToDate("");
              setResourceTypeFilter("all");
              setStatusFilter("all");
              setFacilityBookingStatusFilter("all");
              setCurrentPage(1);
            }}
          >
            Clear filters
          </Button>
        )}
      </div>

      <EnhancedTaskTable
        data={bills}
        columns={columns}
        renderRow={renderRow}
        storageKey="lock-account-bills-dashboard-v1"
        hideTableExport={false}
        enableExport={true}
        exportFileName="lock-account-bills"
        handleExport={handleExportBills}
        hideTableSearch={false}
        enableSearch={true}
        isLoading={loading}
        loading={loading}
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        searchPlaceholder="Search by bill number..."
        emptyMessage="No lock account bills found"
        selectable={true}
        selectedItems={selectedIds}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectItem}
        getItemId={getItemId}
        selectAllLabel="Select all bills on this page"
        leftActions={
          selectedIds.length > 0 ? (
            <Button
              size="sm"
              onClick={handleBulkDownload}
              disabled={bulkDownloading}
              className="gap-2 fm-button-fix fm-button-brand"
            >
              {bulkDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Download Invoices ({selectedIds.length})
            </Button>
          ) : null
        }
      />

      {totalRecords > 0 && (
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="text-sm text-gray-600">
            Showing {Math.min((currentPage - 1) * perPage + 1, totalRecords)}–
            {Math.min(currentPage * perPage, totalRecords)} of {totalRecords} bills
          </div>
          <TicketPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalRecords={totalRecords}
            perPage={perPage}
            isLoading={loading}
            onPageChange={handlePageChange}
            onPerPageChange={handlePerPageChange}
          />
        </div>
      )}

      <LockAccountBillMarkPaymentDialog
        bill={markPaymentBill}
        open={!!markPaymentBill}
        onOpenChange={(open) => { if (!open) setMarkPaymentBill(null); }}
        onSuccess={() => fetchBills(currentPage, perPage)}
      />
    </div>
  );
};

export default LockAccountBillsDashboard;
