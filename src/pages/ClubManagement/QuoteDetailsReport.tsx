import React, { useMemo, useState, useEffect, useCallback } from "react";
import TextField from "@mui/material/TextField";
import { NotepadText } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

interface RawQuoteItem {
  id?: number;
  status?: string;
  quote_date?: string;
  expiry_date?: string;
  quote_number?: string;
  reference_number?: string;
  customer_name?: string;
  invoice_number?: string;
  project_name?: string;
  quote_amount?: number;
}

type QuoteRow = {
  id: string;
  status: string;
  quoteDate: string;
  expiryDate: string;
  quoteNo: string;
  referenceNo: string;
  customerName: string;
  invoiceNo: string;
  projectName: string;
  quoteAmount: number;
};

// ✅ Default date range
const getCurrentMonthRange = () => {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return {
    fromDate: firstDay.toISOString().split("T")[0],
    toDate: lastDay.toISOString().split("T")[0],
  };
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
  { key: "status", label: "Status", sortable: true },
  { key: "quoteDate", label: "Quote Date", sortable: true },
  { key: "expiryDate", label: "Expiry Date", sortable: true },
  { key: "quoteNo", label: "Quote#", sortable: true },
  { key: "referenceNo", label: "Reference#", sortable: true },
  { key: "customerName", label: "Customer Name", sortable: true },
  { key: "invoiceNo", label: "Invoice#", sortable: true },
  { key: "projectName", label: "Project Name", sortable: true },
  { key: "quoteAmount", label: "Quote Amount", sortable: true },
];

const QuoteDetailsReport: React.FC = () => {
  const defaultRange = useMemo(() => getCurrentMonthRange(), []);
  const [filters, setFilters] = useState(defaultRange);
  const [rows, setRows] = useState<QuoteRow[]>([]);
  const [loading, setLoading] = useState(false);

  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");
  const lock_account_id = localStorage.getItem("lock_account_id");

  // ✅ API CALL
  const fetchQuoteDetails = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://${baseUrl}/lock_account_quotes.json`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            lock_account_id: lock_account_id,
            from_date: filters.fromDate,
            to_date: filters.toDate,
          },
        }
      );

      const data = res?.data || [];

      const mapped: QuoteRow[] = (
        Array.isArray(data) ? data : data.quote_details || []
      ).map((item: RawQuoteItem, index: number) => ({
        // ✅ UNIQUE KEY FIX
        id:
          item.id?.toString() ||
          item.quote_number ||
          item.reference_number ||
          `row-${index}`,

        status: item.status || "",
        quoteDate: item.date || "",
        expiryDate: item.expiry_date || "",
        quoteNo: item.quote_number || "",
        referenceNo: item.reference_number || "",
        customerName: item.customer_name || "",
        invoiceNo: item.invoice_number || "",
        projectName: item.project_name || "",
        quoteAmount: item.total_amount || 0,
      }));

      setRows(mapped);
    } catch (err) {
      console.error("API Error:", err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, lock_account_id, token, filters]);

  useEffect(() => {
    fetchQuoteDetails();
  }, [fetchQuoteDetails]);

  // ✅ TOTAL CALCULATION
  const totals = useMemo(
    () =>
      rows.reduce(
        (acc, row) => ({
          quoteAmount: acc.quoteAmount + row.quoteAmount,
        }),
        { quoteAmount: 0 }
      ),
    [rows]
  );

  // ✅ TOTAL ROW
  const totalRow: QuoteRow = {
    id: "total-row",
    status: "",
    quoteDate: "",
    expiryDate: "",
    quoteNo: "",
    referenceNo: "",
    customerName: "",
    invoiceNo: "",
    projectName: "",
    quoteAmount: totals.quoteAmount,
  };

  // ✅ RENDER ROW
  const renderRow = (row: QuoteRow) => {
    const isTotal = row.id === "total-row";

    return {
      status: isTotal ? (
        <span className="font-semibold text-black">Total</span>
      ) : (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            statusColorMap[row.status] || "bg-gray-100"
          }`}
        >
          {row.status}
        </span>
      ),

      quoteDate: <span>{isTotal ? "" : formatDisplayDate(row.quoteDate)}</span>,
      expiryDate: <span>{isTotal ? "" : formatDisplayDate(row.expiryDate)}</span>,
      quoteNo: <span>{isTotal ? "" : row.quoteNo}</span>,
      referenceNo: <span>{isTotal ? "" : row.referenceNo}</span>,
      customerName: <span>{isTotal ? "" : row.customerName}</span>,
      invoiceNo: <span>{isTotal ? "" : row.invoiceNo}</span>,
      projectName: <span>{isTotal ? "" : row.projectName}</span>,

      quoteAmount: (
        <span className="font-semibold text-blue-700">
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
            onClick={fetchQuoteDetails}
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
            data={[...rows, totalRow]} // ✅ include total row
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