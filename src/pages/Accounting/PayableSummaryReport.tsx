import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { NotepadText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

interface BillApi {
  id: number;
  status?: string;
  bill_date?: string;
  date?: string;
  created_at?: string;
  bill_number?: string;
  reference_number?: string;
  vendor_name?: string;
  resident_name?: string;
  customer_name?: string;
  amount?: number | string;
  total_amount?: number | string;
  total?: number | string;
  balance_due?: number | string;
  balance_amount?: number | string;
}

interface PayableSummaryRow {
  id: number;
  status: string;
  date: string;
  transaction_number: string;
  vendor_name: string;
  transaction_type: string;
  customer_name: string;
  total_bcy: number;
  balance_bcy: number;
}

const columns: ColumnConfig[] = [
  { key: "status", label: "STATUS", sortable: true, hideable: false, draggable: true },
  { key: "date", label: "DATE", sortable: true, hideable: false, draggable: true },
  { key: "transaction_number", label: "TRANSACTION#", sortable: true, hideable: false, draggable: true },
  { key: "vendor_name", label: "VENDOR NAME", sortable: true, hideable: false, draggable: true },
  { key: "transaction_type", label: "TRANSACTION TYPE", sortable: true, hideable: false, draggable: true },
  { key: "customer_name", label: "CUSTOMER NAME", sortable: true, hideable: false, draggable: true },
  { key: "total_bcy", label: "TOTAL (BCY)", sortable: true, hideable: false, draggable: true },
  { key: "balance_bcy", label: "BALANCE (BCY)", sortable: true, hideable: false, draggable: true },
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
  try {
    return new Date(value).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return value;
  }
};

const formatCurrency = (value: number) => {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const parseAmount = (value?: string | number) => {
  if (typeof value === "number") return value;
  if (!value) return 0;
  return parseFloat(String(value).replace(/,/g, "")) || 0;
};

const isWithinRange = (dateValue: string, fromDate: string, toDate: string) => {
  if (!dateValue) return false;

  const rowDate = new Date(dateValue);
  const from = new Date(toApiDate(fromDate));
  const to = new Date(toApiDate(toDate));

  if (Number.isNaN(rowDate.getTime()) || Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
    return true;
  }

  rowDate.setHours(0, 0, 0, 0);
  from.setHours(0, 0, 0, 0);
  to.setHours(23, 59, 59, 999);

  return rowDate >= from && rowDate <= to;
};

const normalizeStatus = (status?: string) => {
  const value = (status || "open").toString().trim().toLowerCase();
  if (!value) return "Open";
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const PayableSummaryReport: React.FC = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<PayableSummaryRow[]>([]);
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

    setFilters((prev) => ({
      ...prev,
      [name]: formatted,
    }));
  };

  const fetchPayableSummary = useCallback(async (fromDate: string, toDate: string) => {
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const list: BillApi[] = response.data?.data || response.data?.lock_account_bills || response.data || [];

      const mappedRows: PayableSummaryRow[] = (list || [])
        .filter((item) => isWithinRange(item.bill_date || item.date || item.created_at || "", fromDate, toDate))
        .map((item) => ({
          id: item.id,
          status: normalizeStatus(item.status),
          date: item.bill_date || item.date || item.created_at || "",
          transaction_number: item.bill_number || item.reference_number || String(item.id),
          vendor_name: item.vendor_name || item.resident_name || "-",
          transaction_type: "Bill",
          customer_name: item.customer_name || "",
          total_bcy: parseAmount(item.amount ?? item.total_amount ?? item.total),
          balance_bcy: parseAmount(item.balance_due ?? item.balance_amount),
        }));

      setRows(mappedRows);
    } catch (error) {
      console.error("Failed to fetch payable summary report", error);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayableSummary(defaultDateRange.fromDate, defaultDateRange.toDate);
  }, [defaultDateRange.fromDate, defaultDateRange.toDate, fetchPayableSummary]);

  const totals = useMemo(
    () =>
      rows.reduce(
        (acc, row) => ({
          total_bcy: acc.total_bcy + row.total_bcy,
          balance_bcy: acc.balance_bcy + row.balance_bcy,
        }),
        { total_bcy: 0, balance_bcy: 0 }
      ),
    [rows]
  );

  const renderRow = (row: PayableSummaryRow) => ({
    status: (
      <span className={`text-[13px] ${row.status.toLowerCase() === "paid" ? "text-[#059669]" : "text-[#2563eb]"}`}>
        {row.status}
      </span>
    ),
    date: <span className="text-[13px] text-[#111827]">{formatDate(row.date)}</span>,
    transaction_number: (
      <button
        type="button"
        onClick={() => navigate("/accounting/reports/payable-details")}
        className="text-[13px] font-semibold text-[#2563eb] hover:underline"
      >
        {row.transaction_number}
      </button>
    ),
    vendor_name: <span className="text-[13px] font-semibold text-[#2563eb]">{row.vendor_name}</span>,
    transaction_type: <span className="text-[13px] text-[#111827]">{row.transaction_type}</span>,
    customer_name: <span className="text-[13px] text-[#111827]">{row.customer_name}</span>,
    total_bcy: <span className="text-[13px] font-semibold text-[#2563eb]">{formatCurrency(row.total_bcy)}</span>,
    balance_bcy: <span className="text-[13px] font-semibold text-[#2563eb]">{formatCurrency(row.balance_bcy)}</span>,
  });

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="overflow-hidden border border-[#EAECF0] bg-white">
        <div className="border-b border-[#EAECF0] bg-white px-6 py-4">
          <div className="mb-5 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E5E0D3]">
              <NotepadText color="#d32f2f" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#111827]">Payable Summary</h3>
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
              onClick={() => fetchPayableSummary(filters.fromDate, filters.toDate)}
              className="h-[40px] bg-[#C72030] text-white hover:bg-[#A01020]"
            >
              View
            </Button>
          </div>
        </div>

        <div className="border-b border-[#EAECF0] bg-white px-6 py-12 text-center">
          <p className="text-[14px] font-medium text-[#667085]">Lockated</p>
          <h1 className="mt-3 text-[20px] font-semibold text-[#111827]">Payable Summary</h1>
          <p className="mt-2 text-[14px] text-[#344054]">From {filters.fromDate} To {filters.toDate}</p>
        </div>

        <div className="p-0">
          <EnhancedTaskTable
            data={rows}
            columns={columns}
            renderRow={renderRow}
            storageKey="payable-summary-report-v1"
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

          <div
            className="grid border-b border-[#EAECF0] bg-white px-8 py-3 text-[14px] text-[#111827]"
            style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
          >
            <div>Total</div>
            <div />
            <div />
            <div />
            <div />
            <div />
            <div className="text-right font-semibold text-[#111827]">{formatCurrency(totals.total_bcy)}</div>
            <div className="text-right font-semibold text-[#111827]">{formatCurrency(totals.balance_bcy)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayableSummaryReport;
