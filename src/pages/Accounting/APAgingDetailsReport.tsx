import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { NotepadText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

interface BillApi {
  id: number;
  status?: string;
  bill_date?: string;
  due_date?: string;
  date?: string;
  created_at?: string;
  bill_number?: string;
  reference_number?: string;
  vendor_name?: string;
  resident_name?: string;
  transaction_type?: string;
  amount?: number | string;
  total_amount?: number | string;
  after_roundoff_amount?: number | string;
  balance_due?: number | string;
  balance_amount?: number | string;
}

interface APAgingDetailsRow {
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
  is_summary_row?: boolean;
}

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

const toInputDate = (ddmmyyyy: string) => {
  const [day, month, year] = ddmmyyyy.split("/");
  return `${year}-${month}-${day}`;
};

const toApiDate = (ddmmyyyy: string) => {
  const [day, month, year] = ddmmyyyy.split("/");
  return `${year}-${month}-${day}`;
};

const formatDate = (value?: string) => {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-GB", {
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

const formatAsOfDate = (value: string) => {
  const [day, month, year] = value.split("/");
  if (!day || !month || !year) return value;
  return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
};

const parseAmount = (value?: string | number) => {
  if (typeof value === "number") return value;
  if (!value) return 0;
  return parseFloat(String(value).replace(/,/g, "")) || 0;
};

const normalizeStatus = (status?: string) => {
  const value = (status || "open").toString().trim().toLowerCase();
  if (!value) return "Open";
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const isWithinRange = (dateValue: string, fromDate: string, toDate: string) => {
  if (!dateValue) return false;
  const rowDate = new Date(dateValue);
  const from = new Date(toApiDate(fromDate));
  const to = new Date(toApiDate(toDate));
  if (Number.isNaN(rowDate.getTime()) || Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return true;
  rowDate.setHours(0, 0, 0, 0);
  from.setHours(0, 0, 0, 0);
  to.setHours(23, 59, 59, 999);
  return rowDate >= from && rowDate <= to;
};

const getAgeDays = (dueDate: string, asOfDate: string) => {
  if (!dueDate) return "";
  const due = new Date(dueDate);
  const asOf = new Date(toApiDate(asOfDate));
  if (Number.isNaN(due.getTime()) || Number.isNaN(asOf.getTime())) return "";
  due.setHours(0, 0, 0, 0);
  asOf.setHours(0, 0, 0, 0);
  const diff = Math.floor((asOf.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? String(diff) : "";
};

const APAgingDetailsReport: React.FC = () => {
  const [rows, setRows] = useState<APAgingDetailsRow[]>([]);
  const [loading, setLoading] = useState(false);

  const defaultDateRange = useMemo(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return {
      fromDate: firstDay.toLocaleDateString("en-GB"),
      toDate: lastDay.toLocaleDateString("en-GB"),
    };
  }, []);

  const [filters, setFilters] = useState(defaultDateRange);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const formatted = value ? value.split("-").reverse().join("/") : "";
    setFilters((prev) => ({ ...prev, [name]: formatted }));
  };

  const fetchData = useCallback(async (fromDate: string, toDate: string) => {
    setLoading(true);
    try {
      const baseUrl = localStorage.getItem("baseUrl");
      const token = localStorage.getItem("token");
      const lockAccountId = localStorage.getItem("lock_account_id");

      const response = await axios.get(`https://${baseUrl}/lock_account_bills.json`, {
        params: {
          lock_account_id: lockAccountId,
          "q[date_gteq]": toApiDate(fromDate),
          "q[date_lteq]": toApiDate(toDate),
          page: 1,
          per_page: 500,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      const bills: BillApi[] = response.data?.data || response.data?.lock_account_bills || response.data || [];

      const detailRows: APAgingDetailsRow[] = (bills || [])
        .filter((bill) => isWithinRange(bill.bill_date || bill.date || bill.created_at || "", fromDate, toDate))
        .map((bill) => {
          const billDate = bill.bill_date || bill.date || bill.created_at || "";
          const billAmount =
            parseAmount(bill.after_roundoff_amount) ||
            parseAmount(bill.total_amount) ||
            parseAmount(bill.amount);
          const balanceDue = parseAmount(bill.balance_due ?? bill.balance_amount ?? billAmount);

          return {
            id: String(bill.id),
            date: billDate,
            due_date: bill.due_date || billDate,
            transaction_number: bill.bill_number || bill.reference_number || String(bill.id),
            type: bill.transaction_type || "Bill",
            status: normalizeStatus(bill.status),
            vendor_name: bill.vendor_name || bill.resident_name || "-",
            age: getAgeDays(bill.due_date || billDate, toDate),
            bill_amount: billAmount,
            balance_due: balanceDue,
          };
        });

      const sectionTotals = detailRows.reduce(
        (acc, row) => ({
          bill_amount: acc.bill_amount + row.bill_amount,
          balance_due: acc.balance_due + row.balance_due,
        }),
        { bill_amount: 0, balance_due: 0 }
      );

      const summaryRow: APAgingDetailsRow = {
        id: "current-summary",
        date: "Current",
        due_date: "",
        transaction_number: "",
        type: "",
        status: "",
        vendor_name: "",
        age: "",
        bill_amount: sectionTotals.bill_amount,
        balance_due: sectionTotals.balance_due,
        is_summary_row: true,
      };

      setRows([summaryRow, ...detailRows]);
    } catch (error) {
      console.error("Failed to fetch AP aging details", error);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(defaultDateRange.fromDate, defaultDateRange.toDate);
  }, [defaultDateRange.fromDate, defaultDateRange.toDate, fetchData]);

  const detailRows = useMemo(() => rows.filter((row) => !row.is_summary_row), [rows]);

  const totals = useMemo(
    () =>
      detailRows.reduce(
        (acc, row) => ({
          bill_amount: acc.bill_amount + row.bill_amount,
          balance_due: acc.balance_due + row.balance_due,
        }),
        { bill_amount: 0, balance_due: 0 }
      ),
    [detailRows]
  );

  const renderRow = (row: APAgingDetailsRow) => ({
    date: (
      <span className={`text-[13px] text-[#111827] ${row.is_summary_row ? "font-semibold" : ""}`}>
        {row.is_summary_row ? "Current" : formatDate(row.date)}
      </span>
    ),
    due_date: (
      <span className="text-[13px] text-[#111827]">
        {row.due_date ? formatDate(row.due_date) : ""}
      </span>
    ),
    transaction_number: (
      <span className="text-[13px] font-semibold text-[#2563eb]">{row.transaction_number}</span>
    ),
    type: <span className="text-[13px] text-[#111827]">{row.type}</span>,
    status: <span className="text-[13px] text-[#2563eb]">{row.status}</span>,
    vendor_name: (
      <span className="text-[13px] font-semibold text-[#2563eb]">{row.vendor_name}</span>
    ),
    age: <span className="text-[13px] text-[#111827]">{row.age}</span>,
    bill_amount: (
      <span
        className={`text-[13px] font-semibold ${
          row.is_summary_row ? "text-[#111827]" : "text-[#2563eb]"
        }`}
      >
        {formatCurrency(row.bill_amount)}
      </span>
    ),
    balance_due: (
      <span
        className={`text-[13px] font-semibold ${
          row.is_summary_row ? "text-[#111827]" : "text-[#2563eb]"
        }`}
      >
        {formatCurrency(row.balance_due)}
      </span>
    ),
  });

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="overflow-hidden border border-[#EAECF0] bg-white">
        {/* Filter Header */}
        <div className="border-b border-[#EAECF0] bg-white px-6 py-4">
          <div className="mb-5 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E5E0D3]">
              <NotepadText color="#d32f2f" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#111827]">AP Aging Details By Bill Due Date</h3>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <TextField
              label="From Date"
              type="date"
              name="fromDate"
              value={toInputDate(filters.fromDate)}
              onChange={handleDateChange}
              InputLabelProps={{ shrink: true }}
              size="small"
              fullWidth
            />
            <TextField
              label="To Date"
              type="date"
              name="toDate"
              value={toInputDate(filters.toDate)}
              onChange={handleDateChange}
              InputLabelProps={{ shrink: true }}
              size="small"
              fullWidth
            />
            <Button
              onClick={() => fetchData(filters.fromDate, filters.toDate)}
              className="h-[40px] bg-[#C72030] text-white hover:bg-[#A01020]"
            >
              View
            </Button>
          </div>
        </div>

        {/* Report Title */}
        <div className="border-b border-[#EAECF0] bg-white px-6 py-12 text-center">
          <p className="text-[14px] font-medium text-[#667085]">Lockated</p>
          <h1 className="mt-3 text-[20px] font-semibold text-[#111827]">
            AP Aging Details By Bill Due Date
          </h1>
          <p className="mt-2 text-[14px] text-[#344054]">
            As of {formatAsOfDate(filters.toDate)}
          </p>
        </div>

        {/* Table */}
        <div className="p-0">
          <EnhancedTaskTable
            data={rows}
            columns={columns}
            renderRow={renderRow}
            storageKey="ap-aging-details-report-v1"
            hideTableExport={true}
            hideTableSearch={true}
            enableSearch={false}
            hideColumnsButton={true}
            loading={loading}
            emptyMessage="There are no transactions during the selected date range."
            toolbarClassName="hidden"
            tableWrapperClassName="border-0 rounded-none"
            headerCellClassName="bg-[#F7F7FB] text-[#5F6293] text-[12px] font-semibold uppercase tracking-[0.02em] hover:bg-[#F7F7FB]"
            rowClassName="hover:bg-transparent shadow-none"
            cellClassName="px-8 py-3 border-b border-[#EAECF0] hover:bg-transparent align-middle"
          />

          {/* Total footer row */}
          <div
            className="grid border-b border-[#EAECF0] bg-white px-8 py-3 text-[14px] text-[#111827]"
            style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
          >
            <div className="font-semibold">Total</div>
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div className="font-semibold text-[#111827]">{formatCurrency(totals.bill_amount)}</div>
            <div className="font-semibold text-[#111827]">{formatCurrency(totals.balance_due)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APAgingDetailsReport;
