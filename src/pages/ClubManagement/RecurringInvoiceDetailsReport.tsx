import React, { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import axios from "axios";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import TextField from "@mui/material/TextField";
import { Dialog, DialogContent, DialogTitle, CircularProgress } from "@mui/material";
import { Button } from "@/components/ui/button";
import { FileText, CirclePlus, Edit, NotepadText } from "lucide-react";

interface RecurringInvoiceAPI {
  id: number;
  status?: string;
  profile_name?: string;
  name?: string;
  customer_name?: string;
  resident_name?: string;
  billing_frequency?: string;
  frequency?: string;
  recurrence_frequency?: string;
  last_invoice_date?: string;
  last_sent_date?: string;
  next_invoice_date?: string;
  next_invoice_at?: string;
  expiry_date?: string;
  end_date?: string;
  amount?: string | number;
  total_amount?: string | number;
  price?: string | number;
}

interface RecurringInvoiceRow {
  id: number;
  status: string;
  profile_name: string;
  customer_name: string;
  frequency: string;
  last_invoice_date: string;
  next_invoice_date: string;
  expiry_date: string;
  amount: number;
}

const columns: ColumnConfig[] = [
  { key: "status", label: "STATUS", sortable: true, hideable: false, draggable: true },
  { key: "profile_name", label: "PROFILE NAME", sortable: true, hideable: false, draggable: true },
  { key: "customer_name", label: "CUSTOMER NAME", sortable: true, hideable: false, draggable: true },
  { key: "frequency", label: "FREQUENCY", sortable: true, hideable: false, draggable: true },
  { key: "last_invoice_date", label: "LAST INVOICE DATE", sortable: true, hideable: false, draggable: true },
  { key: "next_invoice_date", label: "NEXT INVOICE DATE", sortable: true, hideable: false, draggable: true },
  { key: "expiry_date", label: "EXPIRY DATE", sortable: true, hideable: false, draggable: true },
  { key: "amount", label: "AMOUNT", sortable: true, hideable: false, draggable: true },
  { key: "activity", label: "ACTIVITY", sortable: false, hideable: false, draggable: true },
];

const formatDate = (value?: string) => {
  if (!value) return "-";
  try {
    const date = new Date(value);
    if (isNaN(date.getTime())) return value;
    return format(date, "dd/MM/yyyy");
  } catch (e) {
    return value;
  }
};

const formatCurrency = (value: number) => {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const toNumber = (value?: string | number) => {
  return parseFloat(String(value ?? 0)) || 0;
};

const statusBadge = (status: string) => {
  const normalized = status?.toLowerCase() || "";
  let bg = "bg-gray-100 text-gray-600";
  if (normalized === "active") bg = "bg-green-100 text-green-700";
  else if (normalized === "inactive" || normalized === "stopped") bg = "bg-red-100 text-red-700";
  else if (normalized === "expired") bg = "bg-orange-100 text-orange-700";
  else if (normalized === "draft") bg = "bg-yellow-100 text-yellow-700";

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide ${bg}`}>
      {status || "-"}
    </span>
  );
};

const RecurringInvoiceDetailsReport: React.FC = () => {
  const [rows, setRows] = useState<RecurringInvoiceRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [approvalLevels, setApprovalLevels] = useState<any[]>([]);
  const [activityInvoiceId, setActivityInvoiceId] = useState<number | null>(null);
  const [activityView, setActivityView] = useState<"activity" | "approval">("activity");
  const [filters, setFilters] = useState({
    fromDate: "01/03/2026",
    toDate: "31/03/2026",
  });

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const formatted = value ? value.split("-").reverse().join("/") : "";
    setFilters((prev) => ({ ...prev, [name]: formatted }));
  };

  const fetchRecurringInvoices = useCallback(async (fromDate: string, toDate: string) => {
    setLoading(true);
    try {
      const baseUrl = localStorage.getItem("baseUrl");
      const token = localStorage.getItem("token");
      const lockAccountId = localStorage.getItem("lock_account_id");

      const response = await axios.get(`https://${baseUrl}/lock_account_invoices.json`, {
        params: {
          lock_account_id: lockAccountId,
          "q[recurring_eq]": 1,
          "q[date_gteq]": fromDate,
          "q[date_lteq]": toDate,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      const list: RecurringInvoiceAPI[] =
        response.data?.lock_account_invoices || response.data || [];

      const mappedRows = list.map((item) => ({
        id: item.id,
        status: item.status || "-",
        profile_name: item.profile_name || item.name || "-",
        customer_name: item.customer_name || item.resident_name || "-",
        frequency: item.billing_frequency || item.frequency || item.recurrence_frequency || "-",
        last_invoice_date: item.last_invoice_date || item.last_sent_date || "",
        next_invoice_date: item.next_invoice_date || item.next_invoice_at || "",
        expiry_date: item.expiry_date || item.end_date || "",
        amount: toNumber(item.amount ?? item.total_amount ?? item.price),
      }));

      setRows(mappedRows);
    } catch (error) {
      console.error("Failed to load recurring invoice details report", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecurringInvoices(filters.fromDate, filters.toDate);
  }, [fetchRecurringInvoices]);

  const openActivity = async (invoiceId: number) => {
    setActivityInvoiceId(invoiceId);
    setActivityLogs([]);
    setApprovalLevels([]);
    setActivityOpen(true);
    setActivityLoading(true);
    setActivityView("activity");
    try {
      const baseUrl = localStorage.getItem("baseUrl");
      const token = localStorage.getItem("token");
      const lockAccountId = localStorage.getItem("lock_account_id");
      const res = await axios.get(`https://${baseUrl}/lock_account_invoices/${invoiceId}.json`, {
        params: { lock_account_id: lockAccountId },
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data || {};
      setActivityLogs(Array.isArray(data.activity_logs) ? data.activity_logs : []);
      const levels =
        data?.approval_status?.approval_levels ||
        data?.approval_levels ||
        [];
      setApprovalLevels(Array.isArray(levels) ? levels : []);
    } catch (e) {
      console.error("Failed to load recurring invoice activity logs", e);
      setActivityLogs([]);
      setApprovalLevels([]);
    } finally {
      setActivityLoading(false);
    }
  };

  const renderRow = (row: RecurringInvoiceRow) => ({
    status: statusBadge(row.status),
    profile_name: <span className="text-sm font-medium text-blue-600">{row.profile_name}</span>,
    customer_name: <span className="text-sm font-medium text-blue-600">{row.customer_name}</span>,
    frequency: <span className="text-sm text-gray-600">{row.frequency}</span>,
    last_invoice_date: <span className="text-sm text-gray-600">{formatDate(row.last_invoice_date)}</span>,
    next_invoice_date: <span className="text-sm text-gray-600">{formatDate(row.next_invoice_date)}</span>,
    expiry_date: <span className="text-sm text-gray-600">{formatDate(row.expiry_date)}</span>,
    amount: <span className="text-sm font-semibold text-blue-600">{formatCurrency(row.amount)}</span>,
    activity: (
      <Button
        type="button"
        variant="outline"
        className="h-8 px-3"
        onClick={() => openActivity(row.id)}
      >
        Activity
      </Button>
    ),
  });

  return (
    <div className="w-full bg-[#f9f7f2] p-6" style={{ minHeight: "100vh", boxSizing: "border-box" }}>

      {/* Filter */}
      <div className="mb-6 rounded-lg border-2 bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E5E0D3] text-[#C72030]">
            <NotepadText className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">Recurring Invoice Details</h3>
        </div>
        <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-3">
          <TextField
            label="From Date"
            type="date"
            name="fromDate"
            value={filters.fromDate.split("/").reverse().join("-")}
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            size="small"
          />
          <TextField
            label="To Date"
            type="date"
            name="toDate"
            value={filters.toDate.split("/").reverse().join("-")}
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            size="small"
          />
          <Button
            type="button"
            className="h-[40px] bg-[#C72030] text-white hover:bg-[#A01020]"
            onClick={() => fetchRecurringInvoices(filters.fromDate, filters.toDate)}
          >
            View
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-white overflow-hidden">
        <div className="px-6 py-5 text-center border-b border-[#EAECF0] bg-[#F8F9FC]">
          {/* <p className="text-sm font-medium text-[#667085]">Lockated</p> */}
          <h1 className="mt-1 text-2xl font-semibold text-[#101828]">Recurring Invoice Details</h1>
          <p className="mt-1 text-sm text-[#475467]">From {filters.fromDate} To {filters.toDate}</p>
        </div>

        <div className="p-4">
          <EnhancedTaskTable
            data={rows}
            columns={columns}
            renderRow={renderRow}
            storageKey="recurring-invoice-details-report-v1"
            hideTableExport={true}
            hideTableSearch={false}
            // enableSearch={true}
            hideColumnsButton={true}
            loading={loading}
            emptyMessage="There are no transactions during the selected date range."
          />
        </div>
      </div>

      <Dialog open={activityOpen} onClose={() => setActivityOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <div className="flex items-center justify-between gap-3">
            <span>
              {activityView === "activity" ? "Activity Logs" : "Approval Log"}
              {activityInvoiceId ? ` (Invoice #${activityInvoiceId})` : ""}
            </span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant={activityView === "activity" ? "default" : "outline"}
                className="h-8 px-3"
                onClick={() => setActivityView("activity")}
              >
                Activity
              </Button>
              <Button
                type="button"
                variant={activityView === "approval" ? "default" : "outline"}
                className="h-8 px-3"
                onClick={() => setActivityView("approval")}
              >
                Approval
              </Button>
            </div>
          </div>
        </DialogTitle>
        <DialogContent dividers>
          {activityLoading ? (
            <div className="flex items-center justify-center py-10">
              <CircularProgress />
            </div>
          ) : activityView === "activity" ? (
            activityLogs.length > 0 ? (
            <div className="divide-y">
              {activityLogs.map((log: any, idx: number) => {
                const key = `${log?.date || ""}-${log?.time || ""}-${idx}`;
                const hint = `${log?.action || ""} ${log?.message || ""}`.toLowerCase();
                const isConverted = hint.includes("convert");
                const isCreated = hint.includes("create");
                const isAccepted = hint.includes("accept");
                const isSent = hint.includes("sent");

                const Icon = isConverted || isCreated ? CirclePlus : (isAccepted || isSent ? Edit : FileText);
                const iconWrapClass =
                  isConverted || isCreated
                    ? "bg-green-50 text-green-600 border-green-100"
                    : (isAccepted || isSent
                      ? "bg-sky-50 text-sky-600 border-sky-100"
                      : "bg-gray-50 text-gray-500 border-gray-100");

                return (
                  <div key={key} className="flex gap-6 py-5">
                    <div className="min-w-[170px] text-sm text-gray-500">
                      <div>{log?.date || "—"} {log?.time || ""}</div>
                    </div>

                    <div className={`w-9 h-9 rounded-full border flex items-center justify-center ${iconWrapClass}`}>
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {log?.message || "—"}
                      </div>
                      <div className="text-sm text-gray-500">
                        by <span className="font-medium text-gray-900">{log?.user || "—"}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            ) : (
              <p className="text-sm text-gray-500">No activity logs found.</p>
            )
          ) : (
            approvalLevels.length > 0 ? (
              <div className="rounded-lg border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#7a0c0c]">
                      <th className="text-left px-3 py-2 text-white font-semibold w-[70px]">Sr.No.</th>
                      <th className="text-left px-3 py-2 text-white font-semibold">Approval Level</th>
                      <th className="text-left px-3 py-2 text-white font-semibold">Approved By</th>
                      <th className="text-left px-3 py-2 text-white font-semibold">Date</th>
                      <th className="text-left px-3 py-2 text-white font-semibold">Status</th>
                      <th className="text-left px-3 py-2 text-white font-semibold">Remark</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvalLevels.map((lvl: any, index: number) => (
                      <tr key={lvl?.id ?? index} className="border-t">
                        <td className="px-3 py-2 font-medium">{index + 1}</td>
                        <td className="px-3 py-2 font-medium">{lvl?.name || "—"}</td>
                        <td className="px-3 py-2 font-medium">{lvl?.approved_by || "—"}</td>
                        <td className="px-3 py-2 font-medium">{lvl?.approved_at || "—"}</td>
                        <td className="px-3 py-2">
                          <span
                            className={`px-3 py-1 rounded text-xs font-semibold ${
                              String(lvl?.status || "").toLowerCase() === "approved"
                                ? "bg-green-100 text-green-800"
                                : String(lvl?.status || "").toLowerCase() === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {String(lvl?.status || "pending").toUpperCase()}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-gray-500">{lvl?.rejection_reason || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No approval logs found.</p>
            )
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecurringInvoiceDetailsReport;
