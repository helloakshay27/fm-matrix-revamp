import React, { useMemo, useState, useEffect, useCallback } from "react";
import TextField from "@mui/material/TextField";
import { NotepadText } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

interface ReceivableSummaryRow {
  id: string;
  customerName: string;
  date: string;
  transactionNo: string;
  referenceNo: string;
  status: string;
  transactionType: string;
  total: number;
  balance: number;
}

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

const formatDisplayDate = (value: string) => {
  if (!value) return "--/--/----";
  const parsedDate = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsedDate.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB").format(parsedDate);
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return "--";
  const [y, m, d] = dateStr.split("-");
  return `${d}-${m}-${y}`;
};

const formatCurrency = (value: number): string => {
  const sign = value < 0 ? "-" : "";
  const formatted = Math.abs(Number(value || 0)).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${sign}₹${formatted}`;
};

const statusColorMap: Record<string, string> = {
  Overdue: "bg-orange-100 text-orange-700",
  Open: "bg-blue-100 text-blue-700",
  Sent: "bg-blue-100 text-blue-700",
  Paid: "bg-green-100 text-green-700",
  Draft: "bg-yellow-100 text-yellow-700",
};

const columns: ColumnConfig[] = [
  { key: "customerName", label: "Customer Name", sortable: true, hideable: false, draggable: true },
  { key: "date", label: "Date", sortable: true, hideable: false, draggable: true },
  { key: "transactionNo", label: "Transaction#", sortable: true, hideable: false, draggable: true },
  { key: "referenceNo", label: "Reference#", sortable: true, hideable: false, draggable: true },
  { key: "status", label: "Status", sortable: true, hideable: false, draggable: true },
  { key: "transactionType", label: "Transaction Type", sortable: true, hideable: false, draggable: true },
  { key: "total", label: "Total", sortable: true, hideable: false, draggable: true },
  { key: "balance", label: "Balance", sortable: true, hideable: false, draggable: true },
];

const ReceivableSummaryReport: React.FC = () => {
  const defaultRange = useMemo(() => getCurrentMonthRange(), []);
  const [filters, setFilters] = useState(defaultRange);
  const [reportRows, setReportRows] = useState<ReceivableSummaryRow[]>([]);
  const [loading, setLoading] = useState(false);

  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");
  const lock_account_id = localStorage.getItem("lock_account_id");

  const fetchData = useCallback(async (fromDate: string, toDate: string) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://${baseUrl}/lock_account_customers/receivable_summary.json`,
        {
          params: {
            lock_account_id,
            "q[date_gteq]": toApiDate(fromDate),
            "q[date_lteq]": toApiDate(toDate),
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const apiData = res?.data || [];
      const mapped: ReceivableSummaryRow[] = apiData.map((item: any, i: number) => {
        const rawStatus = item.status || "";
        const status = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1);
        return {
          id: item.id ? String(item.id) : `row-${i}`,
          customerName: item.customer_name || "--",
          date: formatDate(item.date),
          transactionNo: item.transaction_number || "--",
          referenceNo: item.reference_number || "--",
          status,
          transactionType: item.transaction_type || "--",
          total: Number(item.total ?? 0),
          balance: Number(item.balance ?? 0),
        };
      });

      setReportRows(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, token, lock_account_id]);

  useEffect(() => {
    fetchData(defaultRange.fromDate, defaultRange.toDate);
  }, [defaultRange.fromDate, defaultRange.toDate, fetchData]);

  const totals = useMemo(
    () =>
      reportRows.reduce(
        (acc, row) => ({
          total: acc.total + row.total,
          balance: acc.balance + row.balance,
        }),
        { total: 0, balance: 0 }
      ),
    [reportRows]
  );

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const tableData = useMemo(() => {
    if (reportRows.length === 0) return reportRows;
    return [
      ...reportRows,
      {
        id: "__total__",
        customerName: "__total__",
        date: "",
        transactionNo: "",
        referenceNo: "",
        status: "",
        transactionType: "",
        total: totals.total,
        balance: totals.balance,
      },
    ];
  }, [reportRows, totals]);

  const renderRow = (row: ReceivableSummaryRow) => {
    const isTotal = row.id === "__total__";
    const amtClass = `text-sm font-medium ${isTotal ? "font-bold text-[#1A1A1A]" : "text-blue-600"}`;
    return {
      customerName: isTotal ? (
        <span className="text-sm font-bold text-[#1A1A1A]">Total</span>
      ) : (
        <span className="text-sm font-medium text-blue-600">{row.customerName}</span>
      ),
      date: <span className="text-sm text-gray-600">{isTotal ? "" : row.date}</span>,
      transactionNo: (
        <span className="text-sm font-medium text-blue-600">{isTotal ? "" : row.transactionNo}</span>
      ),
      referenceNo: (
        <span className="text-sm text-gray-600">{isTotal ? "" : (row.referenceNo || "--")}</span>
      ),
      status: isTotal ? <span /> : row.status ? (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            statusColorMap[row.status] || "bg-gray-100 text-gray-800"
          }`}
        >
          {row.status}
        </span>
      ) : <span />,
      transactionType: (
        <span className="text-sm text-gray-600">{isTotal ? "" : row.transactionType}</span>
      ),
      total: <span className={amtClass}>{formatCurrency(row.total)}</span>,
      balance: <span className={amtClass}>{formatCurrency(row.balance)}</span>,
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
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
            Receivable Summary
          </h3>
        </div>

        <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-3">
          <TextField
            label="From Date"
            type="date"
            name="fromDate"
            value={filters.fromDate}
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            size="small"
          />
          <TextField
            label="To Date"
            type="date"
            name="toDate"
            value={filters.toDate}
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            size="small"
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
          <h1 className="mt-1 text-2xl font-semibold text-[#101828]">
            Receivable Summary
          </h1>
          <p className="mt-1 text-sm text-[#475467]">
            From {formatDisplayDate(filters.fromDate)} To {formatDisplayDate(filters.toDate)}
          </p>
        </div>

        <div className="p-4">
          <EnhancedTaskTable
            data={tableData}
            columns={columns}
            renderRow={renderRow}
            storageKey="receivable-summary-report-v1"
            hideTableExport={true}
            hideTableSearch={false}
            loading={loading}
            hideColumnsButton={true}
            emptyMessage="No data to display"
          />
        </div>
      </div>
    </div>
  );
};

export default ReceivableSummaryReport;
