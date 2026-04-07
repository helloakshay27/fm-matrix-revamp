import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { NotepadText, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

interface ExpensesByCustomerRow {
  id: string;
  customerId: string | number;
  customer_name: string;
  expense_count: number;
  expense_amount: number;
  expense_amount_with_tax: number;
}

interface ExpenseDetailRow {
  id: string;
  status: string;
  date: string;
  reference_number: string;
  category: string;
  notes: string;
  amount: number;
  amount_with_tax: number;
}

const columns: ColumnConfig[] = [
  { key: "customer_name", label: "CUSTOMER NAME", sortable: true, hideable: false, draggable: true },
  { key: "expense_count", label: "EXPENSE COUNT", sortable: true, hideable: false, draggable: true },
  { key: "expense_amount", label: "EXPENSE AMOUNT", sortable: true, hideable: false, draggable: true },
  { key: "expense_amount_with_tax", label: "EXPENSE AMOUNT WITH TAX", sortable: true, hideable: false, draggable: true },
];

const detailColumns: ColumnConfig[] = [
  { key: "status", label: "STATUS", sortable: true, hideable: false, draggable: true },
  { key: "date", label: "DATE", sortable: true, hideable: false, draggable: true },
  { key: "reference_number", label: "REFERENCE#", sortable: true, hideable: false, draggable: true },
  { key: "category", label: "CATEGORY", sortable: true, hideable: false, draggable: true },
  { key: "notes", label: "NOTES", sortable: true, hideable: false, draggable: true },
  { key: "amount", label: "AMOUNT", sortable: true, hideable: false, draggable: true },
  { key: "amount_with_tax", label: "AMOUNT WITH TAX", sortable: true, hideable: false, draggable: true },
];

const statusColorMap: Record<string, string> = {
  Unbilled: "bg-orange-100 text-orange-700",
  "Non-Billable": "bg-gray-100 text-gray-700",
  Billable: "bg-blue-100 text-blue-700",
  Billed: "bg-green-100 text-green-700",
};

const getCurrentMonthRange = () => {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  return { fromDate: fmt(firstDay), toDate: fmt(lastDay) };
};

const toApiDate = (iso: string) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

const formatDisplayDate = (iso: string) => {
  if (!iso) return "--";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
};

const formatCurrency = (value: number) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const toNumber = (v?: string | number) => parseFloat(String(v ?? 0)) || 0;

const ExpensesByCustomerReport: React.FC = () => {
  const defaultRange = useMemo(() => getCurrentMonthRange(), []);
  const [filters, setFilters] = useState(defaultRange);
  const [rows, setRows] = useState<ExpensesByCustomerRow[]>([]);
  const [loading, setLoading] = useState(false);

  // Detail view state
  const [detailItem, setDetailItem] = useState<{
    customerId: string | number;
    name: string;
    rows: ExpenseDetailRow[];
  } | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const fetchData = useCallback(async (fromDate: string, toDate: string) => {
    setLoading(true);
    try {
      const baseUrl = localStorage.getItem("baseUrl");
      const token = localStorage.getItem("token");
      const lockAccountId = localStorage.getItem("lock_account_id");

      const response = await axios.get(
        `https://${baseUrl}/expenses/summary_by_customer.json`,
        {
          params: {
            lock_account_id: lockAccountId,
            "q[date_gteq]": toApiDate(fromDate),
            "q[date_lteq]": toApiDate(toDate),
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const payload = response.data;
      let list: any[] = [];
      if (Array.isArray(payload)) {
        list = payload;
      } else if (payload && typeof payload === "object") {
        const arrayKey = Object.keys(payload).find((k) => Array.isArray(payload[k]));
        if (arrayKey) list = payload[arrayKey];
      }

      const mapped: ExpensesByCustomerRow[] = list.map((item: any, i: number) => ({
        id: String(item.id ?? item.customer_id ?? i),
        customerId: item.customer_id ?? item.id ?? "",
        customer_name: item.customer_name || item.name || "Others",
        expense_count: toNumber(item.expense_count ?? item.count),
        expense_amount: toNumber(item.amount ?? item.total_amount ?? item.expense_amount),
        expense_amount_with_tax: toNumber(
          item.amount_with_tax ?? item.total_with_tax ?? item.expense_amount_with_tax ?? item.amount_with_taxes
        ),
      }));

      setRows(mapped);
    } catch (err) {
      console.error("Failed to fetch expenses by customer", err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDetail = useCallback(async (row: ExpensesByCustomerRow, fromDate: string, toDate: string) => {
    setDetailLoading(true);
    try {
      const baseUrl = localStorage.getItem("baseUrl");
      const token = localStorage.getItem("token");
      const lockAccountId = localStorage.getItem("lock_account_id");

      const response = await axios.get(
        `https://${baseUrl}/expenses/expenses_by_customer.json`,
        {
          params: {
            lock_account_id: lockAccountId,
            customer_id: row.customerId,
            "q[date_gteq]": toApiDate(fromDate),
            "q[date_lteq]": toApiDate(toDate),
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const payload = response.data;
      let list: any[] = [];
      if (Array.isArray(payload)) {
        list = payload;
      } else if (payload && typeof payload === "object") {
        const arrayKey = Object.keys(payload).find((k) => Array.isArray(payload[k]));
        if (arrayKey) list = payload[arrayKey];
      }

      const detailRows: ExpenseDetailRow[] = list.map((item: any, i: number) => {
        const rawStatus = item.status || item.billable_status || "--";
        const status = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1).replace(/_/g, "-");
        return {
          id: String(item.id ?? i),
          status,
          date: item.date || item.expense_date || "--",
          reference_number: item.reference_number || item.invoice_number || "--",
          category: item.category_name || item.category || item.account_name || "--",
          notes: item.notes || item.description || "",
          amount: toNumber(item.amount ?? item.total_amount),
          amount_with_tax: toNumber(item.amount_with_tax ?? item.total_with_tax ?? item.amount_with_taxes),
        };
      });

      setDetailItem({ customerId: row.customerId, name: row.customer_name, rows: detailRows });
    } catch (err) {
      console.error("Failed to fetch expense detail by customer", err);
      setDetailItem({ customerId: row.customerId, name: row.customer_name, rows: [] });
    } finally {
      setDetailLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(defaultRange.fromDate, defaultRange.toDate);
  }, [defaultRange.fromDate, defaultRange.toDate, fetchData]);

  const totals = useMemo(
    () =>
      rows.reduce(
        (acc, row) => ({
          expense_count: acc.expense_count + row.expense_count,
          expense_amount: acc.expense_amount + row.expense_amount,
          expense_amount_with_tax: acc.expense_amount_with_tax + row.expense_amount_with_tax,
        }),
        { expense_count: 0, expense_amount: 0, expense_amount_with_tax: 0 }
      ),
    [rows]
  );

  const tableData = useMemo(() => {
    if (rows.length === 0) return rows;
    return [
      ...rows,
      {
        id: "__total__",
        customerId: "",
        customer_name: "__total__",
        expense_count: totals.expense_count,
        expense_amount: totals.expense_amount,
        expense_amount_with_tax: totals.expense_amount_with_tax,
      },
    ];
  }, [rows, totals]);

  const detailRows = detailItem?.rows ?? [];

  const detailTotals = useMemo(
    () =>
      detailRows.reduce(
        (acc, r) => ({
          amount: acc.amount + r.amount,
          amount_with_tax: acc.amount_with_tax + r.amount_with_tax,
        }),
        { amount: 0, amount_with_tax: 0 }
      ),
    [detailRows]
  );

  const detailTableData = useMemo(() => {
    if (detailRows.length === 0) return detailRows;
    return [
      ...detailRows,
      {
        id: "__total__",
        status: "__total__",
        date: "",
        reference_number: "",
        category: "",
        notes: "",
        amount: detailTotals.amount,
        amount_with_tax: detailTotals.amount_with_tax,
      },
    ];
  }, [detailRows, detailTotals]);

  const renderRow = (row: ExpensesByCustomerRow) => {
    const isTotal = row.id === "__total__";
    const amtClass = `text-sm font-medium ${isTotal ? "font-bold text-[#1A1A1A]" : "text-blue-600"}`;
    return {
      customer_name: isTotal ? (
        <span className="text-sm font-bold text-[#1A1A1A]">Total</span>
      ) : (
        <button
          onClick={() => fetchDetail(row, filters.fromDate, filters.toDate)}
          className="text-sm font-medium !text-blue-600 hover:underline text-left"
        >
          {row.customer_name}
        </button>
      ),
      expense_count: (
        <span className={`text-sm font-medium ${isTotal ? "font-bold text-[#1A1A1A]" : "text-gray-900"}`}>
          {row.expense_count}
        </span>
      ),
      expense_amount: <span className={amtClass}>{formatCurrency(row.expense_amount)}</span>,
      expense_amount_with_tax: <span className={amtClass}>{formatCurrency(row.expense_amount_with_tax)}</span>,
    };
  };

  const renderDetailRow = (row: ExpenseDetailRow) => {
    const isTotal = row.status === "__total__";
    const amtClass = `text-sm font-medium ${isTotal ? "font-bold text-[#1A1A1A]" : "text-blue-600"}`;
    return {
      status: isTotal ? (
        <span className="text-sm font-bold text-[#1A1A1A]">Total</span>
      ) : (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            statusColorMap[row.status] || "bg-gray-100 text-gray-700"
          }`}
        >
          {row.status}
        </span>
      ),
      date: <span className="text-sm text-gray-600">{isTotal ? "" : row.date}</span>,
      reference_number: <span className="text-sm text-gray-900">{isTotal ? "" : row.reference_number}</span>,
      category: <span className="text-sm text-gray-900">{isTotal ? "" : row.category}</span>,
      notes: <span className="text-sm text-gray-500">{isTotal ? "" : row.notes}</span>,
      amount: <span className={amtClass}>{formatCurrency(row.amount)}</span>,
      amount_with_tax: <span className={amtClass}>{formatCurrency(row.amount_with_tax)}</span>,
    };
  };

  // ── Detail View ──────────────────────────────────────────────────────────
  if (detailItem) {
    return (
      <div className="w-full bg-[#f9f7f2] p-6" style={{ minHeight: "100vh", boxSizing: "border-box" }}>
        <div className="rounded-lg border bg-white overflow-hidden">
          <div className="px-6 py-5 border-b border-[#EAECF0] bg-[#F8F9FC]">
            <button
              onClick={() => setDetailItem(null)}
              className="flex items-center gap-2 text-sm font-medium text-black hover:text-gray-700 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-[#101828]">
                Expenses For {detailItem.name}
              </h1>
              <p className="mt-1 text-sm text-[#475467]">
                From {formatDisplayDate(filters.fromDate)} To {formatDisplayDate(filters.toDate)}
              </p>
            </div>
          </div>

          <div className="p-4">
            <EnhancedTaskTable
              data={detailTableData}
              columns={detailColumns}
              renderRow={renderDetailRow}
              storageKey="expenses-by-customer-detail-v1"
              hideTableExport={true}
              hideTableSearch={false}
              hideColumnsButton={true}
              loading={detailLoading}
              emptyMessage="No expense details found for this customer."
            />
          </div>
        </div>
      </div>
    );
  }

  // ── List View ────────────────────────────────────────────────────────────
  return (
    <div className="w-full bg-[#f9f7f2] p-6" style={{ minHeight: "100vh", boxSizing: "border-box" }}>
      {/* Filter */}
      <div className="mb-6 rounded-lg border-2 bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E5E0D3] text-[#C72030]">
            <NotepadText className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">Expenses by Customer</h3>
        </div>
        <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-3">
          <TextField
            label="From Date"
            type="date"
            name="fromDate"
            value={filters.fromDate}
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
            size="small"
            fullWidth
          />
          <TextField
            label="To Date"
            type="date"
            name="toDate"
            value={filters.toDate}
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
            size="small"
            fullWidth
          />
          <Button
            type="button"
            className="h-[40px] bg-[#C72030] text-white hover:bg-[#A01020]"
            onClick={() => fetchData(filters.fromDate, filters.toDate)}
          >
            View
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-white overflow-hidden">
        <div className="px-6 py-5 text-center border-b border-[#EAECF0] bg-[#F8F9FC]">
          <h1 className="mt-1 text-2xl font-semibold text-[#101828]">Expenses by Customer</h1>
          <p className="mt-1 text-sm text-[#475467]">
            From {formatDisplayDate(filters.fromDate)} To {formatDisplayDate(filters.toDate)}
          </p>
        </div>

        <div className="p-4">
          <EnhancedTaskTable
            data={tableData}
            columns={columns}
            renderRow={renderRow}
            storageKey="expenses-by-customer-report-v2"
            hideTableExport={true}
            hideTableSearch={false}
            hideColumnsButton={true}
            loading={loading}
            emptyMessage="There are no expenses during the selected date range."
          />
        </div>
      </div>
    </div>
  );
};

export default ExpensesByCustomerReport;
