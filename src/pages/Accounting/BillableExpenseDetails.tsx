import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { NotepadText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

interface BillableExpenseRow {
  id: string;
  date: string;
  transaction_no: string;
  vendor_name: string;
  item_name: string;
  item_amount_bcy: number;
  markup_percent: number;
  invoice_item_amount_bcy: number;
  marked_up_amount: number;
  gross_profit: number;
}

const columns: ColumnConfig[] = [
  { key: "date", label: "DATE", sortable: true, hideable: false, draggable: true },
  { key: "transaction_no", label: "TRANSACTION#", sortable: true, hideable: false, draggable: true },
  { key: "vendor_name", label: "VENDOR NAME", sortable: true, hideable: false, draggable: true },
  { key: "item_name", label: "ITEM NAME", sortable: true, hideable: false, draggable: true },
  { key: "item_amount_bcy", label: "ITEM AMOUNT (BCY)", sortable: true, hideable: false, draggable: true },
  { key: "markup_percent", label: "MARKUP (%)", sortable: true, hideable: false, draggable: true },
  { key: "invoice_item_amount_bcy", label: "INVOICE ITEM AMOUNT (BCY)", sortable: true, hideable: false, draggable: true },
  { key: "marked_up_amount", label: "MARKED UP AMOUNT", sortable: true, hideable: false, draggable: true },
  { key: "gross_profit", label: "GROSS PROFIT", sortable: true, hideable: false, draggable: true },
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

const BillableExpenseDetails: React.FC = () => {
  const navigate = useNavigate();
  const defaultRange = useMemo(() => getCurrentMonthRange(), []);
  const [filters, setFilters] = useState(defaultRange);
  const [rows, setRows] = useState<BillableExpenseRow[]>([]);
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
        `https://${baseUrl}/expenses/billable_expense_details.json`,
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

      const mapped: BillableExpenseRow[] = list.map((item: any, i: number) => ({
        id: String(item.id ?? item.expense_id ?? i),
        date: item.date || item.expense_date || "--",
        transaction_no: item.transaction_number || item.expense_number || item.reference_number || "--",
        vendor_name: item.vendor_name || item.supplier_name || "--",
        item_name: item.item_name || item.name || item.description || "--",
        item_amount_bcy: toNumber(item.item_amount_bcy ?? item.item_amount ?? item.amount ?? item.total_amount),
        markup_percent: toNumber(item.markup_percent ?? item.markup),
        invoice_item_amount_bcy: toNumber(item.invoice_item_amount_bcy ?? item.invoice_item_amount ?? item.billed_amount),
        marked_up_amount: toNumber(item.marked_up_amount ?? item.markup_amount),
        gross_profit: toNumber(item.gross_profit),
      }));

      setRows(mapped);
    } catch (err) {
      console.error("Failed to fetch billable expense details", err);
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
          item_amount_bcy: acc.item_amount_bcy + row.item_amount_bcy,
          invoice_item_amount_bcy: acc.invoice_item_amount_bcy + row.invoice_item_amount_bcy,
          marked_up_amount: acc.marked_up_amount + row.marked_up_amount,
          gross_profit: acc.gross_profit + row.gross_profit,
        }),
        { item_amount_bcy: 0, invoice_item_amount_bcy: 0, marked_up_amount: 0, gross_profit: 0 }
      ),
    [rows]
  );

  const tableData = useMemo(() => {
    if (rows.length === 0) return rows;
    return [
      ...rows,
      {
        id: "__total__",
        date: "",
        transaction_no: "__total__",
        vendor_name: "",
        item_name: "",
        item_amount_bcy: totals.item_amount_bcy,
        markup_percent: 0,
        invoice_item_amount_bcy: totals.invoice_item_amount_bcy,
        marked_up_amount: totals.marked_up_amount,
        gross_profit: totals.gross_profit,
      },
    ];
  }, [rows, totals]);

  const renderRow = (row: BillableExpenseRow) => {
    const isTotal = row.id === "__total__";
    const amtClass = `text-sm font-medium ${isTotal ? "font-bold text-[#1A1A1A]" : "text-blue-600"}`;

    return {
      date: <span className="text-sm text-gray-600">{isTotal ? "" : row.date}</span>,
      transaction_no: isTotal ? (
        <span className="text-sm font-bold text-[#1A1A1A]">Total</span>
      ) : (
        <span className="text-sm text-gray-900">{row.transaction_no}</span>
      ),
      vendor_name: <span className="text-sm text-gray-900">{isTotal ? "" : row.vendor_name}</span>,
      item_name: <span className="text-sm text-gray-900">{isTotal ? "" : row.item_name}</span>,
      item_amount_bcy: isTotal ? (
        <span className={amtClass}>{formatCurrency(row.item_amount_bcy)}</span>
      ) : (
        <button
          onClick={() => navigate(`/accounting/expenses/${row.id}`)}
          className="text-sm font-medium !text-blue-600 hover:underline text-left"
        >
          {formatCurrency(row.item_amount_bcy)}
        </button>
      ),
      markup_percent: (
        <span className={`text-sm font-medium ${isTotal ? "text-[#1A1A1A]" : "text-gray-900"}`}>
          {isTotal ? "" : `${row.markup_percent}%`}
        </span>
      ),
      invoice_item_amount_bcy: <span className={amtClass}>{formatCurrency(row.invoice_item_amount_bcy)}</span>,
      marked_up_amount: <span className={amtClass}>{formatCurrency(row.marked_up_amount)}</span>,
      gross_profit: <span className={amtClass}>{formatCurrency(row.gross_profit)}</span>,
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
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">Billable Expense Details</h3>
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
          <h1 className="mt-1 text-2xl font-semibold text-[#101828]">Billable Expense Details</h1>
          <p className="mt-1 text-sm text-[#475467]">
            From {formatDisplayDate(filters.fromDate)} To {formatDisplayDate(filters.toDate)}
          </p>
        </div>

        <div className="p-4">
          <EnhancedTaskTable
            data={tableData}
            columns={columns}
            renderRow={renderRow}
            storageKey="billable-expense-details-v2"
            hideTableExport={true}
            hideTableSearch={false}
            hideColumnsButton={true}
            loading={loading}
            emptyMessage="No billable expense details found for the selected date range."
          />
        </div>
      </div>
    </div>
  );
};

export default BillableExpenseDetails;
