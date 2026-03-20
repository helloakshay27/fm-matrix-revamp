import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import TextField from "@mui/material/TextField";
import { Button } from "@/components/ui/button";
import { NotepadText } from "lucide-react";

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
];

const formatDate = (value?: string) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
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

      const response = await axios.get(`https://${baseUrl}/recurring_invoices.json`, {
        params: {
          lock_account_id: lockAccountId,
          "q[created_at_gteq]": fromDate,
          "q[created_at_lteq]": toDate,
          per_page: 500,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const list: RecurringInvoiceAPI[] =
        response.data.recurring_invoices || response.data || [];

      const mappedRows = list.map((item) => ({
        id: item.id,
        status: item.status || "-",
        profile_name: item.profile_name || item.name || "-",
        customer_name: item.customer_name || item.resident_name || "-",
        frequency:
          item.billing_frequency ||
          item.frequency ||
          item.recurrence_frequency ||
          "-",
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
    fetchRecurringInvoices("01/03/2026", "31/03/2026");
  }, [fetchRecurringInvoices]);

  const renderRow = (row: RecurringInvoiceRow) => ({
    status: statusBadge(row.status),
    profile_name: (
      <span className="text-[13px] text-[#111827] font-medium">{row.profile_name}</span>
    ),
    customer_name: (
      <span className="text-[13px] text-[#111827] font-medium">{row.customer_name}</span>
    ),
    frequency: (
      <span className="text-[13px] text-[#111827] font-medium">{row.frequency}</span>
    ),
    last_invoice_date: (
      <span className="text-[13px] text-[#111827] font-medium">
        {formatDate(row.last_invoice_date)}
      </span>
    ),
    next_invoice_date: (
      <span className="text-[13px] text-[#111827] font-medium">
        {formatDate(row.next_invoice_date)}
      </span>
    ),
    expiry_date: (
      <span className="text-[13px] text-[#111827] font-medium">
        {formatDate(row.expiry_date)}
      </span>
    ),
    amount: (
      <span className="text-[13px] text-[#111827] font-medium">
        {formatCurrency(row.amount)}
      </span>
    ),
  });

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="overflow-hidden border border-[#EAECF0] bg-white">
        {/* Filter Bar */}
        <div className="border-b border-[#EAECF0] bg-white px-6 py-4">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#E5E0D3]">
              <NotepadText color="#d32f2f" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Recurring Invoice Details</h3>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <TextField
              label="From Date"
              type="date"
              name="fromDate"
              value={filters.fromDate.split("/").reverse().join("-")}
              onChange={handleDateChange}
              InputLabelProps={{ shrink: true }}
              size="small"
              fullWidth
            />
            <TextField
              label="To Date"
              type="date"
              name="toDate"
              value={filters.toDate.split("/").reverse().join("-")}
              onChange={handleDateChange}
              InputLabelProps={{ shrink: true }}
              size="small"
              fullWidth
            />
            <Button
              onClick={() => fetchRecurringInvoices(filters.fromDate, filters.toDate)}
              className="bg-[#C72030] hover:bg-[#A01020] text-white h-[40px]"
            >
              View
            </Button>
          </div>
        </div>

        {/* Report Header */}
        <div className="border-b border-[#EAECF0] bg-white px-6 py-8 text-center">
          <p className="text-[14px] font-medium text-[#667085]">Lockated</p>
          <h1 className="mt-3 text-[20px] font-semibold text-[#111827]">
            Recurring Invoice Details
          </h1>
          <p className="mt-2 text-[14px] text-[#344054]">
            From {filters.fromDate} To {filters.toDate}
          </p>
        </div>

        {/* Table */}
        <div className="p-0">
          <EnhancedTaskTable
            data={rows}
            columns={columns}
            renderRow={renderRow}
            storageKey="recurring-invoice-details-report-v1"
            hideTableExport={true}
            hideTableSearch={true}
            enableSearch={false}
            hideColumnsButton={true}
            loading={loading}
            emptyMessage="There are no transactions during the selected date range."
            toolbarClassName="hidden"
            tableWrapperClassName="border-0 rounded-none"
            headerCellClassName="bg-[#F9FAFB] text-[#374151] text-[12px] font-semibold uppercase tracking-[0.5px] border-b border-[#E5E7EB] hover:bg-[#F9FAFB] px-6 py-4"
            rowClassName="hover:bg-white border-b border-[#E5E7EB]"
            cellClassName="px-6 py-4 text-[13px] text-[#374151] hover:bg-white align-middle"
          />
        </div>
      </div>
    </div>
  );
};

export default RecurringInvoiceDetailsReport;
