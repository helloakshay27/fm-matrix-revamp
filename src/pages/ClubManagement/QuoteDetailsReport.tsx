import React, { useMemo, useState, useEffect, useCallback } from "react";
import TextField from "@mui/material/TextField";
import { NotepadText } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

type QuoteRow = {
  id: string;
  quoteId: string | number;
  status: string;
  quoteDate: string;
  expiryDate: string;
  quoteNo: string;
  referenceNo: string;
  customerName: string;
  quoteAmount: number;
};

const getCurrentMonthRange = () => {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  return { fromDate: fmt(firstDay), toDate: fmt(lastDay) };
};

// ✅ Format DD-MM-YYYY
const formatDisplayDate = (value: string) => {
  if (!value) return "--";
  const d = new Date(`${value}T00:00:00`);
  if (isNaN(d.getTime())) return value;

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
};

const formatAmount = (value: number) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
  })}`;

const statusColorMap: Record<string, string> = {
  Overdue: "bg-orange-100 text-orange-700",
  Sent: "bg-blue-100 text-blue-700",
  Open: "bg-gray-100 text-gray-800",
  Paid: "bg-green-100 text-green-700",
  Draft: "bg-yellow-100 text-yellow-700",
  Accepted: "bg-green-100 text-green-700",
};

// ✅ Columns
const columns: ColumnConfig[] = [
  { key: "status", label: "Status", sortable: true, hideable: false, draggable: true },
  { key: "quoteDate", label: "Quote Date", sortable: true, hideable: false, draggable: true },
  { key: "expiryDate", label: "Expiry Date", sortable: true, hideable: false, draggable: true },
  { key: "quoteNo", label: "Quote#", sortable: true, hideable: false, draggable: true },
  { key: "referenceNo", label: "Reference#", sortable: true, hideable: false, draggable: true },
  { key: "customerName", label: "Customer Name", sortable: true, hideable: false, draggable: true },
  { key: "quoteAmount", label: "Quote Amount", sortable: true, hideable: false, draggable: true },
];

const QuoteDetailsReport: React.FC = () => {
  const navigate = useNavigate();
  const defaultRange = useMemo(() => getCurrentMonthRange(), []);
  const [filters, setFilters] = useState(defaultRange);
  const [rows, setRows] = useState<QuoteRow[]>([]);
  const [loading, setLoading] = useState(false);

  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");
  const lock_account_id = localStorage.getItem("lock_account_id");

  const fetchQuoteDetails = useCallback(async (fromDate: string, toDate: string) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://${baseUrl}/lock_account_quotes.json`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            lock_account_id,
            "q[date_gteq]": fromDate,
            "q[date_lteq]": toDate,
          },
        }
      );

      const data = res?.data || [];
      const list: any[] = Array.isArray(data) ? data : data.quote_details || [];

      const mapped: QuoteRow[] = list.map((item: any, index: number) => ({
        id: item.id ? String(item.id) : `row-${index}`,
        quoteId: item.id || "",
        status: item.status
          ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
          : "--",
        quoteDate: item.date || "",
        expiryDate: item.expiry_date || "",
        quoteNo: item.quote_number || "--",
        referenceNo: item.reference_number || "--",
        customerName: item.customer_name || "--",
        quoteAmount: Number(item.total_amount || 0),
      }));

      setRows(mapped);
    } catch (err) {
      console.error("API Error:", err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, lock_account_id, token]);

  useEffect(() => {
    fetchQuoteDetails(defaultRange.fromDate, defaultRange.toDate);
  }, [defaultRange.fromDate, defaultRange.toDate, fetchQuoteDetails]);

  const totalAmount = useMemo(() => rows.reduce((acc, r) => acc + r.quoteAmount, 0), [rows]);

  const tableData = useMemo(() => {
    if (rows.length === 0) return rows;
    return [
      ...rows,
      {
        id: "__total__",
        quoteId: "",
        status: "__total__",
        quoteDate: "",
        expiryDate: "",
        quoteNo: "",
        referenceNo: "",
        customerName: "",
        quoteAmount: totalAmount,
      },
    ];
  }, [rows, totalAmount]);

  const renderRow = (row: QuoteRow) => {
    const isTotal = row.id === "__total__";

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
      quoteDate: <span className="text-sm text-gray-600">{isTotal ? "" : formatDisplayDate(row.quoteDate)}</span>,
      expiryDate: <span className="text-sm text-gray-600">{isTotal ? "" : formatDisplayDate(row.expiryDate)}</span>,
      quoteNo: isTotal ? <span /> : (
        <button
          onClick={() => navigate(`/accounting/quotes/details/${row.quoteId}`)}
          className="text-sm font-medium !text-blue-600 hover:underline text-left"
        >
          {row.quoteNo}
        </button>
      ),
      referenceNo: <span className="text-sm text-gray-600">{isTotal ? "" : row.referenceNo}</span>,
      customerName: <span className="text-sm font-medium text-blue-600">{isTotal ? "" : row.customerName}</span>,
      quoteAmount: (
        <span className={`text-sm font-medium ${isTotal ? "font-bold text-[#1A1A1A]" : "text-blue-600"}`}>
          {formatAmount(row.quoteAmount)}
        </span>
      ),
    };
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-full bg-[#f9f7f2] p-6 min-h-screen">
      
      {/* FILTER */}
      <div className="bg-white rounded-lg border p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 flex items-center justify-center bg-[#E5E0D3] rounded-full">
            <NotepadText className="text-[#C72030]" />
          </div>
          <h3 className="text-lg font-semibold">Quote Details</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
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
            onClick={() => fetchQuoteDetails(filters.fromDate, filters.toDate)}
            className="bg-[#C72030] hover:bg-[#A01020] text-white h-[40px]"
          >
            View
          </Button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="px-6 py-5 text-center border-b bg-[#F8F9FC]">
          <h1 className="text-2xl font-semibold">Quote Details</h1>
          <p className="text-sm text-gray-500">
            From {formatDisplayDate(filters.fromDate)} To{" "}
            {formatDisplayDate(filters.toDate)}
          </p>
        </div>

        <div className="p-4">
          <EnhancedTaskTable
            data={tableData}
            columns={columns}
            renderRow={renderRow}
            storageKey="quote-details"
            loading={loading}
            hideTableExport
            hideColumnsButton={true}
          />
        </div>
      </div>
    </div>
  );
};

export default QuoteDetailsReport;