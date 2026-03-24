import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { NotepadText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

interface PayableDetailAPI {
  id?: number | string;
  status?: string;
  date?: string;
  bill_date?: string;
  transaction_number?: string;
  bill_number?: string;
  reference_number?: string;
  vendor_name?: string;
  supplier_name?: string;
  transaction_type?: string;
  type?: string;
  item_name?: string;
  name?: string;
  quantity_ordered?: string | number;
  quantity?: string | number;
  qty?: string | number;
  item_price_bcy?: string | number;
  item_price?: string | number;
  rate?: string | number;
  unit_price?: string | number;
  item_amount_bcy?: string | number;
  amount?: string | number;
  total_amount?: string | number;
}

type PayableDetailsRow = {
  id: string;
  status: string;
  date: string;
  transaction_number: string;
  vendor_name: string;
  transaction_type: string;
  item_name: string;
  quantity_ordered: number;
  item_price_bcy: number;
  item_amount_bcy: number;
};

const columns: ColumnConfig[] = [
  { key: "status", label: "STATUS", sortable: true, hideable: false, draggable: true },
  { key: "date", label: "DATE", sortable: true, hideable: false, draggable: true },
  { key: "transaction_number", label: "TRANSACTION#", sortable: true, hideable: false, draggable: true },
  { key: "vendor_name", label: "VENDOR NAME", sortable: true, hideable: false, draggable: true },
  { key: "transaction_type", label: "TRANSACTION TYPE", sortable: true, hideable: false, draggable: true },
  { key: "item_name", label: "ITEM NAME", sortable: true, hideable: false, draggable: true },
  { key: "quantity_ordered", label: "QUANTITY ORDERED", sortable: true, hideable: false, draggable: true },
  { key: "item_price_bcy", label: "ITEM PRICE (BCY)", sortable: true, hideable: false, draggable: true },
  { key: "item_amount_bcy", label: "ITEM AMOUNT (BCY)", sortable: true, hideable: false, draggable: true },
];

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

const formatDate = (value?: string) => {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const formatCurrency = (value: number) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const toNumber = (v?: string | number) => parseFloat(String(v ?? 0)) || 0;

const statusBadgeMap: Record<string, string> = {
  open: "bg-blue-100 text-blue-700",
  paid: "bg-green-100 text-green-700",
  draft: "bg-gray-100 text-gray-700",
  overdue: "bg-orange-100 text-orange-700",
  void: "bg-red-100 text-red-700",
  cancelled: "bg-red-100 text-red-700",
};

const PayableDetailsReport: React.FC = () => {
  const [filters, setFilters] = useState({ fromDate: "", toDate: "" });
  const [rows, setRows] = useState<PayableDetailsRow[]>([]);
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
        `https://${baseUrl}/lock_account_items/payable_details.json`,
        {
          params: {
            lock_account_id: lockAccountId,
            ...(fromDate && { "q[date_gteq]": toApiDate(fromDate) }),
            ...(toDate && { "q[date_lteq]": toApiDate(toDate) }),
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const payload = response.data;
      let groups: any[] = [];
      if (Array.isArray(payload)) {
        groups = payload;
      } else if (payload && typeof payload === "object") {
        const arrayKey = Object.keys(payload).find((k) => Array.isArray(payload[k]));
        if (arrayKey) groups = payload[arrayKey];
      }

      // Grouped response: [{ item_id, item_name, rows: [...] }]
      const mapped: PayableDetailsRow[] = groups.flatMap((group: any, gi: number) =>
        (group.rows || []).map((row: any, ri: number) => ({
          id: `${gi}-${ri}`,
          status: row.status
            ? row.status.charAt(0).toUpperCase() + row.status.slice(1)
            : "-",
          date: row.date || "",
          transaction_number: row.transaction_number || "-",
          vendor_name: row.vendor_name || row.supplier_name || "-",
          transaction_type: row.transaction_type || row.type || "-",
          item_name: row.item_name || group.item_name || "-",
          quantity_ordered: toNumber(row.quantity_ordered ?? row.quantity),
          item_price_bcy: toNumber(row.item_price_bcy ?? row.item_price ?? row.rate),
          item_amount_bcy: toNumber(row.item_amount_bcy ?? row.total ?? row.amount),
        }))
      );

      setRows(mapped);
    } catch (err) {
      console.error("Failed to fetch payable details", err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData("", "");
  }, [fetchData]);

  const totals = useMemo(
    () =>
      rows.reduce(
        (acc, row) => ({
          quantity_ordered: acc.quantity_ordered + row.quantity_ordered,
          item_amount_bcy: acc.item_amount_bcy + row.item_amount_bcy,
        }),
        { quantity_ordered: 0, item_amount_bcy: 0 }
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
        transaction_number: "",
        vendor_name: "",
        transaction_type: "",
        item_name: "",
        quantity_ordered: totals.quantity_ordered,
        item_price_bcy: 0,
        item_amount_bcy: totals.item_amount_bcy,
      },
    ];
  }, [rows, totals]);

  const renderRow = (row: PayableDetailsRow) => {
    const isTotal = row.id === "__total__";
    return {
      status: isTotal ? (
        <span className="text-sm font-bold text-[#1A1A1A]">Total</span>
      ) : row.status && row.status !== "-" ? (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadgeMap[row.status.toLowerCase()] || "bg-gray-100 text-gray-700"}`}>
          {row.status}
        </span>
      ) : (
        <span className="text-sm text-gray-600">-</span>
      ),
      date: <span className="text-sm text-gray-600">{isTotal ? "" : formatDate(row.date)}</span>,
      transaction_number: (
        <span className="text-sm font-medium text-blue-600">{isTotal ? "" : row.transaction_number}</span>
      ),
      vendor_name: (
        <span className="text-sm font-medium text-blue-600">{isTotal ? "" : row.vendor_name}</span>
      ),
      transaction_type: (
        <span className="text-sm text-gray-600">{isTotal ? "" : row.transaction_type}</span>
      ),
      item_name: (
        <span className="text-sm text-gray-600">{isTotal ? "" : row.item_name}</span>
      ),
      quantity_ordered: (
        <span className={`text-sm font-medium ${isTotal ? "font-bold text-[#1A1A1A]" : "text-gray-900"}`}>
          {isTotal ? row.quantity_ordered.toFixed(2) : row.quantity_ordered.toFixed(2)}
        </span>
      ),
      item_price_bcy: (
        <span className="text-sm text-gray-600">{isTotal ? "" : formatCurrency(row.item_price_bcy)}</span>
      ),
      item_amount_bcy: (
        <span className={`text-sm font-medium ${isTotal ? "font-bold text-[#1A1A1A]" : "text-blue-600"}`}>
          {formatCurrency(row.item_amount_bcy)}
        </span>
      ),
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
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">Payable Details</h3>
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
          <p className="text-sm font-medium text-[#667085]">Lockated</p>
          <h1 className="mt-1 text-2xl font-semibold text-[#101828]">Payable Details</h1>
          <p className="mt-1 text-sm text-[#475467]">
            {filters.fromDate && filters.toDate
              ? `From ${formatDisplayDate(filters.fromDate)} To ${formatDisplayDate(filters.toDate)}`
              : "All dates"}
          </p>
        </div>

        <div className="p-4">
          <EnhancedTaskTable
            data={tableData}
            columns={columns}
            renderRow={renderRow}
            storageKey="payable-details-report-v1"
            hideTableExport={true}
            hideTableSearch={false}
            enableSearch={true}
            loading={loading}
            emptyMessage="There are no transactions during the selected date range."
          />
        </div>
      </div>
    </div>
  );
};

export default PayableDetailsReport;
