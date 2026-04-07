import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { NotepadText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

interface SupplierAgingDetailAPI {
  id?: number | string;
  status?: string;
  date?: string;
  bill_date?: string;
  due_date?: string;
  bill_number?: string;
  transaction_number?: string;
  reference_number?: string;
  transaction_type?: string;
  type?: string;
  vendor_name?: string;
  supplier_name?: string;
  age?: string | number;
  bill_amount?: string | number;
  total_amount?: string | number;
  amount?: string | number;
  balance_due?: string | number;
  balance_amount?: string | number;
}

type APAgingDetailsRow = {
  id: string;
  date: string;
  due_date: string;
  transaction_number: string;
  type: string;
  status: string;
  vendor_name: string;
  age: string;
  bill_amount: number;
  balance_due: number;
};

const columns: ColumnConfig[] = [
  { key: "date", label: "DATE", sortable: true, hideable: false, draggable: true },
  { key: "due_date", label: "DUE DATE", sortable: true, hideable: false, draggable: true },
  { key: "transaction_number", label: "TRANSACTION#", sortable: true, hideable: false, draggable: true },
  { key: "type", label: "TYPE", sortable: true, hideable: false, draggable: true },
  { key: "status", label: "STATUS", sortable: true, hideable: false, draggable: true },
  { key: "vendor_name", label: "VENDOR NAME", sortable: true, hideable: false, draggable: true },
  { key: "age", label: "AGE", sortable: true, hideable: false, draggable: true },
  { key: "bill_amount", label: "BILL AMOUNT", sortable: true, hideable: false, draggable: true },
  { key: "balance_due", label: "BALANCE DUE", sortable: true, hideable: false, draggable: true },
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

const APAgingDetailsReport: React.FC = () => {
  const [filters, setFilters] = useState({ fromDate: "", toDate: "" });
  const [rows, setRows] = useState<APAgingDetailsRow[]>([]);
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
        `https://${baseUrl}/pms/suppliers/supplier_aging_details.json`,
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
      let list: SupplierAgingDetailAPI[] = [];
      if (Array.isArray(payload)) {
        list = payload;
      } else if (payload && typeof payload === "object") {
        const arrayKey = Object.keys(payload).find((k) => Array.isArray(payload[k]));
        if (arrayKey) list = payload[arrayKey];
      }

      const mapped: APAgingDetailsRow[] = list.map((item, i) => {
        const billAmt = toNumber(item.bill_amount ?? item.total_amount ?? item.amount);
        return {
          id: String(item.id ?? i),
          date: item.date || item.bill_date || "",
          due_date: item.due_date || "",
          transaction_number: item.bill_number || item.transaction_number || item.reference_number || "-",
          type: item.transaction_type || item.type || "Bill",
          status: item.status
            ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
            : "-",
          vendor_name: item.vendor_name || item.supplier_name || "-",
          age: String(item.age ?? ""),
          bill_amount: billAmt,
          balance_due: toNumber(item.balance_due ?? item.balance_amount ?? billAmt),
        };
      });

      setRows(mapped);
    } catch (err) {
      console.error("Failed to fetch AP aging details", err);
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
          bill_amount: acc.bill_amount + row.bill_amount,
          balance_due: acc.balance_due + row.balance_due,
        }),
        { bill_amount: 0, balance_due: 0 }
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
        due_date: "",
        transaction_number: "",
        type: "",
        status: "__total__",
        vendor_name: "",
        age: "",
        bill_amount: totals.bill_amount,
        balance_due: totals.balance_due,
      },
    ];
  }, [rows, totals]);

  const renderRow = (row: APAgingDetailsRow) => {
    const isTotal = row.id === "__total__";
    return {
      date: <span className="text-sm text-gray-600">{isTotal ? "" : formatDate(row.date)}</span>,
      due_date: <span className="text-sm text-gray-600">{isTotal ? "" : formatDate(row.due_date)}</span>,
      transaction_number: (
        <span className="text-sm font-medium text-blue-600">{isTotal ? "" : row.transaction_number}</span>
      ),
      type: <span className="text-sm text-gray-600">{isTotal ? "" : row.type}</span>,
      status: isTotal ? (
        <span className="text-sm font-bold text-[#1A1A1A]">Total</span>
      ) : row.status && row.status !== "-" ? (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadgeMap[row.status.toLowerCase()] || "bg-gray-100 text-gray-700"}`}>
          {row.status}
        </span>
      ) : (
        <span className="text-sm text-gray-600">-</span>
      ),
      vendor_name: (
        <span className="text-sm font-medium text-blue-600">{isTotal ? "" : row.vendor_name}</span>
      ),
      age: <span className="text-sm text-gray-600">{isTotal ? "" : row.age}</span>,
      bill_amount: (
        <span className={`text-sm font-medium ${isTotal ? "font-bold text-[#1A1A1A]" : "text-blue-600"}`}>
          {formatCurrency(row.bill_amount)}
        </span>
      ),
      balance_due: (
        <span className={`text-sm font-medium ${isTotal ? "font-bold text-[#1A1A1A]" : "text-gray-900"}`}>
          {formatCurrency(row.balance_due)}
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
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">AP Aging Details By Bill Due Date</h3>
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
          <h1 className="mt-1 text-2xl font-semibold text-[#101828]">AP Aging Details By Bill Due Date</h1>
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
            storageKey="ap-aging-details-report-v1"
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

export default APAgingDetailsReport;
