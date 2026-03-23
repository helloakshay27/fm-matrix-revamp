import React, { useMemo, useState, useEffect } from "react";
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
  totalBcy: number;
  totalFcy: number;
  balanceBcy: number;
  balanceFcy: number;
}

const getCurrentMonthRange = () => {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return {
    fromDate: firstDay.toISOString().split("T")[0],
    toDate: lastDay.toISOString().split("T")[0],
  };
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
};

const columns: ColumnConfig[] = [
  { key: "customerName", label: "Customer Name", sortable: true, hideable: true, draggable: true },
  { key: "date", label: "Date", sortable: true, hideable: true, draggable: true },
  { key: "transactionNo", label: "Transaction#", sortable: true, hideable: true, draggable: true },
  { key: "referenceNo", label: "Reference#", sortable: true, hideable: true, draggable: true },
  { key: "status", label: "Status", sortable: true, hideable: true, draggable: true },
  { key: "transactionType", label: "Transaction Type", sortable: true, hideable: true, draggable: true },
  { key: "totalBcy", label: "Total (BCY)", sortable: true, hideable: true, draggable: true },
  { key: "totalFcy", label: "Total (FCY)", sortable: true, hideable: true, draggable: true },
  { key: "balanceBcy", label: "Balance (BCY)", sortable: true, hideable: true, draggable: true },
  { key: "balanceFcy", label: "Balance (FCY)", sortable: true, hideable: true, draggable: true },
];

const ReceivableSummaryReport: React.FC = () => {
  const defaultRange = useMemo(() => getCurrentMonthRange(), []);
  const [filters, setFilters] = useState(defaultRange);
  const [reportRows, setReportRows] = useState<ReceivableSummaryRow[]>([]);
  const [loading, setLoading] = useState(false);

  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");
  const lock_account_id = localStorage.getItem("lock_account_id");

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://${baseUrl}/lock_account_customers/receivable_summary.json`,
        {
          params: {
            lock_account_id,
            "q[date_gteq]": toApiDate(filters.fromDate),
            "q[date_lteq]": toApiDate(filters.toDate),
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const apiData = res?.data || [];
      const mapped: ReceivableSummaryRow[] = apiData.map((item: any, i: number) => {
        const daysOverdue = item.days_overdue ?? 0;
        const status = item.status || (daysOverdue > 0 ? "Overdue" : "Sent");
        return {
          id: String(item.id || i),
          customerName: item.customer_name || item.name || "--",
          date: formatDate(item.date),
          transactionNo: item.number || item.transaction_no || "--",
          referenceNo: item.reference_number || item.reference_no || "",
          status,
          transactionType: item.transaction_type || item.type || "--",
          totalBcy: item.total_amount ?? item.total_bcy ?? 0,
          totalFcy: item.total_amount ?? item.total_fcy ?? 0,
          balanceBcy: item.balance_due ?? item.balance_bcy ?? 0,
          balanceFcy: item.balance_due ?? item.balance_fcy ?? 0,
        };
      });

      setReportRows(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totals = useMemo(
    () =>
      reportRows.reduce(
        (acc, row) => ({
          totalBcy: acc.totalBcy + row.totalBcy,
          totalFcy: acc.totalFcy + row.totalFcy,
          balanceBcy: acc.balanceBcy + row.balanceBcy,
          balanceFcy: acc.balanceFcy + row.balanceFcy,
        }),
        { totalBcy: 0, totalFcy: 0, balanceBcy: 0, balanceFcy: 0 }
      ),
    [reportRows]
  );

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Append totals as last row inside the table
  const tableData = useMemo(() => {
    if (reportRows.length === 0) return reportRows;
    return [
      ...reportRows,
      {
        id: "__total__",
        customerName: "Total",
        date: "",
        transactionNo: "",
        referenceNo: "",
        status: "",
        transactionType: "",
        totalBcy: totals.totalBcy,
        totalFcy: totals.totalFcy,
        balanceBcy: totals.balanceBcy,
        balanceFcy: totals.balanceFcy,
      },
    ];
  }, [reportRows, totals]);

  const renderRow = (row: ReceivableSummaryRow) => {
    const isTotal = row.id === "__total__";
    return {
      customerName: (
        <span className={`text-sm font-medium ${isTotal ? "font-bold text-[#1A1A1A]" : "text-blue-600"}`}>
          {row.customerName}
        </span>
      ),
      date: (
        <span className="text-sm text-gray-600">{row.date}</span>
      ),
      transactionNo: (
        <span className="text-sm font-medium text-blue-600">{row.transactionNo}</span>
      ),
      referenceNo: (
        <span className="text-sm text-gray-600">{row.referenceNo || "--"}</span>
      ),
      status: row.status ? (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            statusColorMap[row.status] || "bg-gray-100 text-gray-800"
          }`}
        >
          {row.status}
        </span>
      ) : <span />,
      transactionType: (
        <span className="text-sm text-gray-600">{row.transactionType}</span>
      ),
      totalBcy: (
        <span className={`text-sm font-medium ${isTotal ? "font-bold text-[#1A1A1A]" : "text-blue-600"}`}>
          {formatCurrency(row.totalBcy)}
        </span>
      ),
      totalFcy: (
        <span className={`text-sm font-medium ${isTotal ? "font-bold text-[#1A1A1A]" : "text-gray-900"}`}>
          {formatCurrency(row.totalFcy)}
        </span>
      ),
      balanceBcy: (
        <span className={`text-sm font-medium ${isTotal ? "font-bold text-[#1A1A1A]" : "text-gray-900"}`}>
          {formatCurrency(row.balanceBcy)}
        </span>
      ),
      balanceFcy: (
        <span className={`text-sm font-medium ${isTotal ? "font-bold text-[#1A1A1A]" : "text-gray-900"}`}>
          {formatCurrency(row.balanceFcy)}
        </span>
      ),
    };
  };

  return (
    <div
      className="w-full bg-[#f9f7f2] p-6"
      style={{ minHeight: "100vh", boxSizing: "border-box" }}
    >
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
            onClick={fetchData}
          >
            View
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-white overflow-hidden">
        <div className="px-6 py-5 text-center border-b border-[#EAECF0] bg-[#F8F9FC]">
          <p className="text-sm font-medium text-[#667085]">Lockated</p>
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
            enableSearch={true}
            loading={loading}
            emptyMessage="No data to display"
          />
        </div>
      </div>
    </div>
  );
};

export default ReceivableSummaryReport;
