import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { NotepadText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

interface ExpenseRow {
  id: string;
  status: string;
  date: string;
  transaction_type: string;
  transaction_number: string;
  vendor_name: string;
  category: string;
  customer_name: string;
  amount: number;
  amount_with_tax: number;
}

const columns: ColumnConfig[] = [
  { key: "status", label: "STATUS", sortable: true, hideable: false, draggable: true },
  { key: "date", label: "DATE", sortable: true, hideable: false, draggable: true },
  { key: "transaction_type", label: "TRANSACTION TYPE", sortable: true, hideable: false, draggable: true },
  { key: "transaction_number", label: "TRANSACTION#", sortable: true, hideable: false, draggable: true },
  { key: "vendor_name", label: "VENDOR NAME", sortable: true, hideable: false, draggable: true },
  { key: "category", label: "CATEGORY", sortable: true, hideable: false, draggable: true },
  { key: "customer_name", label: "CUSTOMER NAME", sortable: true, hideable: false, draggable: true },
  { key: "amount", label: "AMOUNT", sortable: true, hideable: false, draggable: true },
  { key: "amount_with_tax", label: "AMOUNT WITH TAX", sortable: true, hideable: false, draggable: true },
];

const statusColorMap: Record<string, string> = {
  Unbilled: "bg-orange-100 text-orange-700",
  "Non-Billable": "bg-gray-100 text-gray-700",
  Billable: "bg-blue-100 text-blue-700",
  Billed: "bg-green-100 text-green-700",
  Draft: "bg-gray-100 text-gray-700",
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

const ExpenseDetailsReport: React.FC = () => {
  const navigate = useNavigate();
  const defaultRange = useMemo(() => getCurrentMonthRange(), []);
  const [filters, setFilters] = useState(defaultRange);
  const [rows, setRows] = useState<ExpenseRow[]>([]);
  const [loading, setLoading] = useState(false);

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
        `https://${baseUrl}/expenses.json`,
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

      const mapped: ExpenseRow[] = list.map((item: any, i: number) => {
        const rawStatus = item.status || item.billable_status || "non_billable";
        const status =
          rawStatus === "non_billable"
            ? "Non-Billable"
            : rawStatus === "unbilled"
            ? "Unbilled"
            : rawStatus === "billed"
            ? "Billed"
            : rawStatus === "billable"
            ? "Billable"
            : rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1).replace(/_/g, "-");

        const categories = (item.expense_accounts || [])
          .map((a: any) => (a.lock_account_name || a.account_name || a.category_name || "").trim())
          .filter(Boolean)
          .join(", ");

        return {
          id: String(item.id ?? i),
          status,
          date: item.date || item.expense_date || "--",
          transaction_type: item.transaction_type || item.transaction?.transaction_type || "Expense",
          transaction_number:
            item.expense_number ||
            item.transaction_number ||
            item.transaction?.voucher_number ||
            item.reference_number ||
            `EXP-${item.id}`,
          vendor_name: item.vendor_name || item.supplier_name || "--",
          category: categories || item.category_name || item.account_name || "--",
          customer_name: item.customer_name || item.contact_name || "--",
          amount: toNumber(item.amount ?? item.total_amount),
          amount_with_tax: toNumber(item.amount_with_tax ?? item.total_with_tax ?? item.amount_with_taxes),
        };
      });

      setRows(mapped);
    } catch (err) {
      console.error("Failed to fetch expense details", err);
      setRows([]);
    } finally {
      setLoading(false);
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
        status: "__total__",
        date: "",
        transaction_type: "",
        transaction_number: "",
        vendor_name: "",
        category: "",
        customer_name: "",
        amount: totals.amount,
        amount_with_tax: totals.amount_with_tax,
      },
    ];
  }, [rows, totals]);

  const renderRow = (row: ExpenseRow) => {
    const isTotal = row.id === "__total__";
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
      transaction_type: <span className="text-sm text-gray-900">{isTotal ? "" : row.transaction_type}</span>,
      transaction_number: isTotal ? (
        <span />
      ) : (
        <button
          onClick={() => navigate(`/accounting/expenses/${row.id}`)}
          className="text-sm font-medium !text-blue-600 hover:underline text-left"
        >
          {row.transaction_number}
        </button>
      ),
      vendor_name: <span className="text-sm text-gray-900">{isTotal ? "" : row.vendor_name}</span>,
      category: <span className="text-sm text-gray-900">{isTotal ? "" : row.category}</span>,
      customer_name: <span className="text-sm text-gray-900">{isTotal ? "" : row.customer_name}</span>,
      amount: <span className={amtClass}>{formatCurrency(row.amount)}</span>,
      amount_with_tax: <span className={amtClass}>{formatCurrency(row.amount_with_tax)}</span>,
    };
  };

  return (
    <div className="w-full bg-[#f9f7f2] p-6" style={{ minHeight: "100vh", boxSizing: "border-box" }}>
      {/* Filter */}
      <div className="mb-6 rounded-lg border-2 bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E5E0D3] text-[#C72030]">
            <NotepadText className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">Expense Details</h3>
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
          <h1 className="mt-1 text-2xl font-semibold text-[#101828]">Expense Details</h1>
          <p className="mt-1 text-sm text-[#475467]">
            From {formatDisplayDate(filters.fromDate)} To {formatDisplayDate(filters.toDate)}
          </p>
        </div>

        <div className="p-4">
          <EnhancedTaskTable
            data={tableData}
            columns={columns}
            renderRow={renderRow}
            storageKey="expense-details-report-v2"
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

export default ExpenseDetailsReport;
