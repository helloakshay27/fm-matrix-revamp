import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { NotepadText, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

interface ExpenseSummaryRow {
  id: string;
  category_name: string;
  amount: number;
  amount_with_tax: number;
}

interface ExpenseDetailRow {
  id: string;
  customerId?: string | number;
  vendorId?: string | number;
  date: string;
  type: string;
  customer_name: string;
  vendor_name: string;
  amount: number;
  amount_with_tax: number;
}

const columns: ColumnConfig[] = [
  { key: "category_name", label: "CATEGORY NAME", sortable: true, hideable: false, draggable: true },
  { key: "amount", label: "AMOUNT", sortable: true, hideable: false, draggable: true },
  { key: "amount_with_tax", label: "AMOUNT WITH TAX", sortable: true, hideable: false, draggable: true },
];

const detailColumns: ColumnConfig[] = [
  { key: "date", label: "DATE", sortable: true, hideable: false, draggable: true },
  { key: "type", label: "TYPE", sortable: true, hideable: false, draggable: true },
  { key: "customer_name", label: "CUSTOMER NAME", sortable: true, hideable: false, draggable: true },
  { key: "vendor_name", label: "VENDOR NAME", sortable: true, hideable: false, draggable: true },
  { key: "amount", label: "AMOUNT", sortable: true, hideable: false, draggable: true },
  { key: "amount_with_tax", label: "AMOUNT WITH TAX", sortable: true, hideable: false, draggable: true },
];

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

const ExpenseSummaryByCategoryReport: React.FC = () => {
  const navigate = useNavigate();
  const defaultRange = useMemo(() => getCurrentMonthRange(), []);
  const [filters, setFilters] = useState(defaultRange);
  const [rows, setRows] = useState<ExpenseSummaryRow[]>([]);
  const [loading, setLoading] = useState(false);

  // Detail view state
  const [detailItem, setDetailItem] = useState<{
    id: string;
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
        `https://${baseUrl}/expenses/summary_by_category.json`,
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

      const mapped: ExpenseSummaryRow[] = list.map((item: any, i: number) => ({
        id: String(item.id ?? item.account_id ?? item.category_id ?? i),
        category_name: item.category_name || item.category || item.name || "--",
        amount: toNumber(item.amount ?? item.total_amount),
        amount_with_tax: toNumber(item.amount_with_tax ?? item.total_with_tax ?? item.amount_with_taxes),
      }));

      setRows(mapped);
    } catch (err) {
      console.error("Failed to fetch expense summary by category", err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDetail = useCallback(async (row: ExpenseSummaryRow, fromDate: string, toDate: string) => {
    setDetailLoading(true);
    try {
      const baseUrl = localStorage.getItem("baseUrl");
      const token = localStorage.getItem("token");
      const lockAccountId = localStorage.getItem("lock_account_id");

      const response = await axios.get(
        `https://${baseUrl}/expenses/expenses_by_category.json`,
        {
          params: {
            lock_account_id: lockAccountId,
            category_id: row.id,
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

      const detailRows: ExpenseDetailRow[] = list.map((item: any, i: number) => ({
        id: String(item.id ?? i),
        customerId: item.customer_id || item.contact_id || "",
        vendorId: item.vendor_id || item.supplier_id || "",
        date: item.date || item.expense_date || item.bill_date || "--",
        type: item.type || item.transaction_type || item.source_of_supply || "--",
        customer_name: item.customer_name || item.contact_name || "--",
        vendor_name: item.vendor_name || item.supplier_name || "--",
        amount: toNumber(item.amount ?? item.total_amount),
        amount_with_tax: toNumber(item.amount_with_tax ?? item.total_with_tax ?? item.amount_with_taxes),
      }));

      setDetailItem({ id: row.id, name: row.category_name, rows: detailRows });
    } catch (err) {
      console.error("Failed to fetch expense detail by category", err);
      setDetailItem({ id: row.id, name: row.category_name, rows: [] });
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
          amount: acc.amount + row.amount,
          amount_with_tax: acc.amount_with_tax + row.amount_with_tax,
        }),
        { amount: 0, amount_with_tax: 0 }
      ),
    [rows]
  );

  const tableData = useMemo(() => {
    if (rows.length === 0) return rows;
    return [
      ...rows,
      {
        id: "__total__",
        category_name: "__total__",
        amount: totals.amount,
        amount_with_tax: totals.amount_with_tax,
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
        customerId: "",
        vendorId: "",
        date: "",
        type: "__total__",
        customer_name: "",
        vendor_name: "",
        amount: detailTotals.amount,
        amount_with_tax: detailTotals.amount_with_tax,
      },
    ];
  }, [detailRows, detailTotals]);

  const renderRow = (row: ExpenseSummaryRow) => {
    const isTotal = row.id === "__total__";
    const amtClass = `text-sm font-medium ${isTotal ? "font-bold text-[#1A1A1A]" : "text-blue-600"}`;
    return {
      category_name: isTotal ? (
        <span className="text-sm font-bold text-[#1A1A1A]">Total</span>
      ) : (
        <span className="text-sm text-gray-900">{row.category_name}</span>
      ),
      amount: isTotal ? (
        <span className={amtClass}>{formatCurrency(row.amount)}</span>
      ) : (
        <button
          onClick={() => fetchDetail(row, filters.fromDate, filters.toDate)}
          className="text-sm font-medium !text-blue-600 hover:underline text-left"
        >
          {formatCurrency(row.amount)}
        </button>
      ),
      amount_with_tax: isTotal ? (
        <span className={amtClass}>{formatCurrency(row.amount_with_tax)}</span>
      ) : (
        <button
          onClick={() => fetchDetail(row, filters.fromDate, filters.toDate)}
          className="text-sm font-medium !text-blue-600 hover:underline text-left"
        >
          {formatCurrency(row.amount_with_tax)}
        </button>
      ),
    };
  };

  const renderDetailRow = (row: ExpenseDetailRow) => {
    const isTotal = row.type === "__total__";
    const amtClass = `text-sm font-medium ${isTotal ? "font-bold text-[#1A1A1A]" : "text-blue-600"}`;
    return {
      date: <span className="text-sm text-gray-600">{isTotal ? "" : row.date}</span>,
      type: isTotal ? (
        <span className="text-sm font-bold text-[#1A1A1A]">Total</span>
      ) : (
        <span className="text-sm text-gray-900">{row.type}</span>
      ),
      customer_name: isTotal ? (
        <span />
      ) : row.customerId ? (
        <button
          onClick={() => navigate(`/accounting/customers/details/${row.customerId}`)}
          className="text-sm font-medium !text-blue-600 hover:underline text-left"
        >
          {row.customer_name}
        </button>
      ) : (
        <span className="text-sm text-gray-900">{row.customer_name}</span>
      ),
      vendor_name: isTotal ? (
        <span />
      ) : row.vendorId ? (
        <button
          onClick={() => navigate(`/maintenance/vendor/view/${row.vendorId}`)}
          className="text-sm font-medium !text-blue-600 hover:underline text-left"
        >
          {row.vendor_name}
        </button>
      ) : (
        <span className="text-sm text-gray-900">{row.vendor_name}</span>
      ),
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
                Expense Summary — {detailItem.name}
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
              storageKey="expense-summary-by-category-detail-v1"
              hideTableExport={true}
              hideTableSearch={false}
              hideColumnsButton={true}
              loading={detailLoading}
              emptyMessage="No expense details found for this category."
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
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">Expense Summary by Category</h3>
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
          <h1 className="mt-1 text-2xl font-semibold text-[#101828]">Expense Summary by Category</h1>
          <p className="mt-1 text-sm text-[#475467]">
            From {formatDisplayDate(filters.fromDate)} To {formatDisplayDate(filters.toDate)}
          </p>
        </div>

        <div className="p-4">
          <EnhancedTaskTable
            data={tableData}
            columns={columns}
            renderRow={renderRow}
            storageKey="expense-summary-by-category-report-v2"
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

export default ExpenseSummaryByCategoryReport;
