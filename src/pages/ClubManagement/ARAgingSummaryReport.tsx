import React, { useMemo, useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { NotepadText, ArrowLeft } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { Button } from "@/components/ui/button";

// ─── TYPES ─────────────────────────────────────────

interface ARAgingRow {
  id: string;
  customerName: string;
  current: number;
  day1to15: number;
  day16to30: number;
  day31to45: number;
  dayAbove45: number;
  total: number;
  totalFCY: number;
}

interface DetailRow {
  id: string;
  invoiceId?: string | number;
  customerId?: string | number;
  date: string;
  dueDate: string;
  transactionNo: string;
  type: string;
  status: string;
  customerName: string;
  age: string;
  amount: number;
  balanceDue: number;
}

interface DetailSection {
  label: string;
  rows: DetailRow[];
}

// ─── COLUMNS ───────────────────────────────────────

const summaryColumns: ColumnConfig[] = [
  { key: "customerName", label: "Customer Name", sortable: true },
  { key: "current", label: "Current", sortable: true },
  { key: "day1to15", label: "1-15 Days", sortable: true },
  { key: "day16to30", label: "16-30 Days", sortable: true },
  { key: "day31to45", label: "31-45 Days", sortable: true },
  { key: "dayAbove45", label: "> 45 Days", sortable: true },
  { key: "total", label: "Total", sortable: true },
  { key: "totalFCY", label: "Total (FCY)", sortable: true },
];

const detailColumns: ColumnConfig[] = [
  { key: "date", label: "Date", sortable: true },
  { key: "dueDate", label: "Due Date", sortable: true },
  { key: "transactionNo", label: "Transaction#", sortable: true },
  { key: "type", label: "Type", sortable: true },
  { key: "status", label: "Status", sortable: true },
  { key: "customerName", label: "Customer Name", sortable: true },
  { key: "age", label: "Age", sortable: true },
  { key: "amount", label: "Amount", sortable: true },
  { key: "balanceDue", label: "Balance Due", sortable: true },
];

// ─── HELPERS ───────────────────────────────────────

const formatCurrency = (val: number) =>
  `₹${Number(val || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
  })}`;

const formatDate = (dateStr: string) => {
  if (!dateStr) return "--";
  const [y, m, d] = dateStr.split("-");
  return `${d}-${m}-${y}`;
};

const BUCKET_LABEL_MAP: Record<string, string> = {
  current: "Current",
  "1-15": "1 - 15 Days",
  "16-30": "16 - 30 Days",
  "31-45": "31 - 45 Days",
  "45+": "> 45 Days",
};

const statusColorMap: Record<string, string> = {
  Overdue: "bg-orange-100 text-orange-700",
  Sent: "bg-blue-100 text-blue-700",
  Paid: "bg-green-100 text-green-700",
  Open: "bg-gray-100 text-gray-700",
};

// ─── COMPONENT ─────────────────────────────────────

const ARAgingSummaryReport: React.FC = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<ARAgingRow[]>([]);
  const [rawData, setRawData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [detailView, setDetailView] = useState<{
    bucket: string;
    customer: string;
  } | null>(null);

  const defaultRange = useMemo(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const fmt = (d: Date) =>
      `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
    return { fromDate: fmt(firstDay), toDate: fmt(lastDay) };
  }, []);

  const [filters, setFilters] = useState(defaultRange);

  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");
  const lock_account_id = localStorage.getItem("lock_account_id");

  // ─── DATE CHANGE ────────────────────────────────
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const formatted = value
      ? value.split("-").reverse().join("/")
      : "";

    setFilters((prev) => ({
      ...prev,
      [name]: formatted,
    }));
  };

  // ─── API CALL ──────────────────────────────────
  const fetchARAging = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `https://${baseUrl}/lock_account_customers/aging_summary.json`,
        {
          params: {
            lock_account_id,
            "q[date_gteq]": filters.fromDate,
            "q[date_lteq]": filters.toDate,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const apiData = res?.data || [];

      setRawData(apiData);

      const mapped: ARAgingRow[] = apiData.map((item: any, index: number) => ({
        id: String(item.id || index),
        customerName: item.name || "Unknown",
        current: item.aging?.current || 0,
        day1to15: item.aging?.["1_15"] || 0,
        day16to30: item.aging?.["16_30"] || 0,
        day31to45: item.aging?.["31_45"] || 0,
        dayAbove45: item.aging?.["gt_45"] || 0,
        total: item.total_outstanding || 0,
        totalFCY: item.total_outstanding || 0,
      }));

      setRows(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchARAging();
  }, [defaultRange.fromDate, defaultRange.toDate]);

  // ─── TOTALS ─────────────────────────────────────
  const totals = useMemo(
    () =>
      rows.reduce(
        (acc, r) => ({
          current: acc.current + r.current,
          day1to15: acc.day1to15 + r.day1to15,
          day16to30: acc.day16to30 + r.day16to30,
          day31to45: acc.day31to45 + r.day31to45,
          dayAbove45: acc.dayAbove45 + r.dayAbove45,
          total: acc.total + r.total,
          totalFCY: acc.totalFCY + r.totalFCY,
        }),
        {
          current: 0,
          day1to15: 0,
          day16to30: 0,
          day31to45: 0,
          dayAbove45: 0,
          total: 0,
          totalFCY: 0,
        }
      ),
    [rows]
  );

  // ─── DETAIL MAPPING ─────────────────────────────
  const BUCKET_KEY_MAP: Record<string, string> = {
    current: "current",
    "1-15": "1_15",
    "16-30": "16_30",
    "31-45": "31_45",
    "45+": "gt_45",
  };

  const getDetailRows = (bucket: string, customer: string): DetailRow[] => {
    const customerData = rawData.find((i) => i.name === customer);
    if (!customerData) return [];

    const agingDetails = customerData.aging_details || {};
    const key = BUCKET_KEY_MAP[bucket];
    const data = agingDetails[key]?.data || [];

    return data.map((d: any, i: number) => ({
      id: `${i}`,
      invoiceId: d.id || d.invoice_id || "",
      customerId: customerData.id || "",
      date: formatDate(d.date),
      dueDate: formatDate(d.due_date),
      transactionNo: d.number || "--",
      type: d.type || "--",
      status: d.days_overdue > 0 ? "Overdue" : "Sent",
      customerName: customerData.name,
      age: d.days_overdue > 0 ? `${d.days_overdue} Days` : "--",
      amount: d.balance_due ?? 0,
      balanceDue: d.balance_due ?? 0,
    }));
  };

  const allDetailRows = useMemo(() => {
    if (!detailView) return [];
    const data = getDetailRows(detailView.bucket, detailView.customer);
    const bucketLabel = BUCKET_LABEL_MAP[detailView.bucket] || detailView.bucket;
    const totalBalanceDue = data.reduce((sum, r) => sum + r.balanceDue, 0);
    const totalAmount = data.reduce((sum, r) => sum + r.amount, 0);

    return [
      // Section header row
      {
        id: "__section__",
        date: "", dueDate: "", transactionNo: "", type: "",
        status: "__section__",
        customerName: bucketLabel,
        age: "", amount: 0, balanceDue: 0,
      },
      ...data,
      // Total row
      {
        id: "__total__",
        date: "", dueDate: "", transactionNo: "", type: "",
        status: "__total__",
        customerName: "Total",
        age: "", amount: totalAmount, balanceDue: totalBalanceDue,
      },
    ];
  }, [detailView, rawData]);

  // ─── TABLE DATA WITH TOTAL ROW ──────────────────
  const tableData = useMemo(() => {
    if (rows.length === 0) return rows;
    return [
      ...rows,
      {
        id: "__total__",
        customerName: "__total__",
        current: totals.current,
        day1to15: totals.day1to15,
        day16to30: totals.day16to30,
        day31to45: totals.day31to45,
        dayAbove45: totals.dayAbove45,
        total: totals.total,
        totalFCY: totals.totalFCY,
      },
    ];
  }, [rows, totals]);

  // ─── RENDER SUMMARY ROW ─────────────────────────
  const makeBucketCell = (value: number, bucket: string, customerName: string, isTotal: boolean) =>
    isTotal ? (
      <span className="text-sm font-bold text-[#1A1A1A]">{formatCurrency(value)}</span>
    ) : value > 0 ? (
      <span
        className="text-blue-600 cursor-pointer hover:underline font-medium text-sm"
        onClick={() => setDetailView({ bucket, customer: customerName })}
      >
        {formatCurrency(value)}
      </span>
    ) : (
      <span className="text-sm text-gray-500">{formatCurrency(value)}</span>
    );

  const renderSummaryRow = (row: ARAgingRow) => {
    const isTotal = row.id === "__total__";
    const customerId = rawData.find((d) => d.name === row.customerName)?.id;
    return {
      customerName: isTotal ? (
        <span className="text-sm font-bold text-[#1A1A1A]">Total</span>
      ) : (
        <button
          onClick={() => navigate(`/accounting/customers/details/${customerId || ""}`)}
          className="text-sm font-medium !text-blue-600 hover:underline text-left"
        >
          {row.customerName}
        </button>
      ),
      current: makeBucketCell(row.current, "current", row.customerName, isTotal),
      day1to15: makeBucketCell(row.day1to15, "1-15", row.customerName, isTotal),
      day16to30: makeBucketCell(row.day16to30, "16-30", row.customerName, isTotal),
      day31to45: makeBucketCell(row.day31to45, "31-45", row.customerName, isTotal),
      dayAbove45: makeBucketCell(row.dayAbove45, "45+", row.customerName, isTotal),
      total: (
        <span className={`font-semibold text-sm ${isTotal ? "text-[#1A1A1A]" : ""}`}>
          {formatCurrency(row.total)}
        </span>
      ),
      totalFCY: (
        <span className={`text-sm ${isTotal ? "font-bold text-[#1A1A1A]" : ""}`}>
          {formatCurrency(row.totalFCY)}
        </span>
      ),
    };
  };

  const renderDetailRow = (row: DetailRow) => {
    if (row.status === "__section__") {
      const sectionCell = (
        <span className="font-semibold text-sm text-[#1A1A1A] bg-[#f9f7f2]">
          {row.customerName}
        </span>
      );
      return {
        date: sectionCell, dueDate: <span />, transactionNo: <span />,
        type: <span />, status: <span />, customerName: <span />,
        age: <span />, amount: <span />, balanceDue: <span />,
      };
    }

    if (row.status === "__total__") {
      return {
        date: <span className="font-bold text-sm text-[#1A1A1A]">Total</span>,
        dueDate: <span />, transactionNo: <span />,
        type: <span />, status: <span />, customerName: <span />,
        age: <span />,
        amount: <span className="font-bold text-sm text-[#1A1A1A]">{formatCurrency(row.amount)}</span>,
        balanceDue: <span className="font-bold text-sm text-[#1A1A1A]">{formatCurrency(row.balanceDue)}</span>,
      };
    }

    return {
      date: <span className="text-sm text-gray-600">{row.date}</span>,
      dueDate: <span className="text-sm text-gray-600">{row.dueDate}</span>,
      transactionNo: (
        <button
          onClick={() => navigate(`/accounting/dashboard/invoices/${row.invoiceId || ""}`)}
          className="text-sm font-medium !text-blue-600 hover:underline text-left"
        >
          {row.transactionNo}
        </button>
      ),
      type: <span className="text-sm text-gray-600">{row.type}</span>,
      status: (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColorMap[row.status] || "bg-gray-100 text-gray-800"}`}>
          {row.status}
        </span>
      ),
      customerName: (
        <button
          onClick={() => navigate(`/accounting/customers/details/${row.customerId || ""}`)}
          className="text-sm font-medium !text-blue-600 hover:underline text-left"
        >
          {row.customerName}
        </button>
      ),
      age: <span className="text-sm text-gray-600">{row.age}</span>,
      amount: <span className="text-sm font-medium text-blue-600">{formatCurrency(row.amount)}</span>,
      balanceDue: <span className="text-sm font-medium text-gray-900">{formatCurrency(row.balanceDue)}</span>,
    };
  };

  // ─── DETAIL VIEW ────────────────────────────────
  if (detailView) {
    const bucketLabel = BUCKET_LABEL_MAP[detailView.bucket] || detailView.bucket;
    return (
      <div className="p-6 bg-[#f9f7f2] min-h-screen">
        {/* Back button */}
        <button
          onClick={() => setDetailView(null)}
          className="mb-4 flex items-center gap-2 text-sm font-medium text-[#1A1A1A]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to AR Aging Summary
        </button>

        <div className="bg-white rounded-lg border overflow-hidden">
          {/* Page Header */}
          <div className="px-6 py-5 text-center border-b border-[#EAECF0] bg-[#F8F9FC]">
            <h1 className="mt-1 text-2xl font-semibold text-[#101828]">
              AR Aging Summary Details
            </h1>
            <p className="mt-1 text-sm text-[#475467]">
              {detailView.customer} — {bucketLabel}
            </p>
          </div>

          <div className="px-6 py-3 border-b text-sm text-[#475467]">
            {filters.fromDate} to {filters.toDate}
          </div>

          <EnhancedTaskTable
            data={allDetailRows}
            columns={detailColumns}
            renderRow={renderDetailRow}
            loading={loading}
            emptyMessage="No transactions in this date range."
            // hideColumnsButton={true}
            hideColumnsButton={true}
          />
        </div>
      </div>
    );
  }

  // ─── SUMMARY VIEW ───────────────────────────────
  return (
    <div className="p-6 bg-[#f9f7f2] min-h-screen">
      
      {/* FILTER */}
      <div className="mb-6 rounded-lg border-2 bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E5E0D3] text-[#C72030]">
            <NotepadText className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">AR Aging Summary</h3>
        </div>
        <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-3">
          <TextField
            label="From Date"
            type="date"
            name="fromDate"
            value={filters.fromDate.split("/").reverse().join("-")}
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
            size="small"
            fullWidth
          />
          <TextField
            label="To Date"
            type="date"
            name="toDate"
            value={filters.toDate.split("/").reverse().join("-")}
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
            size="small"
            fullWidth
          />
          <Button
            type="button"
            className="h-[40px] bg-[#C72030] text-white hover:bg-[#A01020]"
            onClick={fetchARAging}
          >
            View
          </Button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg border overflow-hidden">
        {/* Page Header */}
        <div className="px-6 py-5 text-center border-b border-[#EAECF0] bg-[#F8F9FC]">
          {/* <p className="text-sm font-medium text-[#667085]">Lockated</p> */}
          <h1 className="mt-1 text-2xl font-semibold text-[#101828]">
            AR Aging Summary 
            {/* By Invoice Due Date */}
          </h1>
          <p className="mt-1 text-sm text-[#475467]">
            As of {new Date().toLocaleDateString("en-GB")}
          </p>
        </div>

        <EnhancedTaskTable
          data={tableData}
          columns={summaryColumns}
          renderRow={renderSummaryRow}
          loading={loading}
          hideColumnsButton={true}
        />
      </div>
    </div>
  );
};

export default ARAgingSummaryReport;