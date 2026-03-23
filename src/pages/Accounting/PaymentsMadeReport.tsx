import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import TextField from "@mui/material/TextField";
import { Button } from "@/components/ui/button";
import { NotepadText } from "lucide-react";

interface LockPaymentAPI {
  id: number;
  order_number?: string;
  neft_reference?: string;
  resident_name?: string;
  vendor_name?: string;
  payment_mode?: string;
  payment_method?: string;
  notes?: string;
  deposit_to_ledger_name?: string;
  paid_amount?: string | number;
  payment_amount?: string | number;
  total_amount?: string | number;
  payment_status?: string;
  payment_status_text?: string;
  payment_date?: string;
  created_at?: string;
  bill_payments?: { formatted_number?: string; payment_date?: string }[];
}

type PaymentMadeRow = {
  id: string;
  date: string;
  reference_number: string;
  bill_numbers: string;
  vendor_name: string;
  payment_mode: string;
  notes: string;
  deposit_to: string;
  status: string;
  amount: number;
};

const columns: ColumnConfig[] = [
  { key: "date", label: "DATE", sortable: true, hideable: false, draggable: true },
  { key: "reference_number", label: "REFERENCE#", sortable: true, hideable: false, draggable: true },
  { key: "bill_numbers", label: "BILL#", sortable: true, hideable: false, draggable: true },
  { key: "vendor_name", label: "VENDOR NAME", sortable: true, hideable: false, draggable: true },
  { key: "payment_mode", label: "PAYMENT MODE", sortable: true, hideable: false, draggable: true },
  { key: "notes", label: "NOTES", sortable: true, hideable: false, draggable: true },
  { key: "deposit_to", label: "PAID THROUGH", sortable: true, hideable: false, draggable: true },
  { key: "status", label: "STATUS", sortable: true, hideable: false, draggable: true },
  { key: "amount", label: "AMOUNT", sortable: true, hideable: false, draggable: true },
];

const getCurrentMonthRange = () => {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const fmt = (d: Date) => {
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    return `${dd}/${mm}/${d.getFullYear()}`;
  };
  return { fromDate: fmt(firstDay), toDate: fmt(lastDay) };
};

const toInputDate = (ddmmyyyy: string) => {
  const [day, month, year] = ddmmyyyy.split("/");
  return `${year}-${month}-${day}`;
};

const formatDisplayDate = (value: string) => {
  if (!value) return "--";
  return value;
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

const formatCurrency = (value: number) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const statusBadgeMap: Record<string, string> = {
  paid: "bg-green-100 text-green-700",
  completed: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  draft: "bg-gray-100 text-gray-700",
  failed: "bg-red-100 text-red-700",
  cancelled: "bg-red-100 text-red-700",
};

const PaymentsMadeReport: React.FC = () => {
  const defaultRange = useMemo(() => getCurrentMonthRange(), []);
  const [filters, setFilters] = useState(defaultRange);
  const [rows, setRows] = useState<PaymentMadeRow[]>([]);
  const [loading, setLoading] = useState(false);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const formatted = value ? value.split("-").reverse().join("/") : "";
    setFilters((prev) => ({ ...prev, [name]: formatted }));
  };

  const fetchPaymentsMade = useCallback(async (fromDate: string, toDate: string) => {
    setLoading(true);
    try {
      const baseUrl = localStorage.getItem("baseUrl");
      const token = localStorage.getItem("token");
      const lockAccountId = localStorage.getItem("lock_account_id");

      const response = await axios.get(`https://${baseUrl}/lock_payments.json`, {
        params: {
          lock_account_id: lockAccountId,
          "q[payment_made_eq]": 1,
          "q[payment_date_gteq]": fromDate,
          "q[payment_date_lteq]": toDate,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      const list: LockPaymentAPI[] = response.data?.lock_payments || response.data || [];

      const mapped: PaymentMadeRow[] = list.map((p, i) => {
        const billNums = (p.bill_payments || [])
          .map((b) => b.formatted_number)
          .filter(Boolean)
          .join(", ");

        return {
          id: String(p.id ?? i),
          date: p.payment_date || p.bill_payments?.[0]?.payment_date || p.created_at || "",
          reference_number: p.order_number || p.neft_reference || "",
          bill_numbers: billNums,
          vendor_name: p.vendor_name || p.resident_name || "-",
          payment_mode: p.payment_mode || p.payment_method || "-",
          notes: p.notes || "",
          deposit_to: p.deposit_to_ledger_name || "-",
          status: p.payment_status || p.payment_status_text || "",
          amount: parseFloat(String(p.paid_amount ?? p.payment_amount ?? p.total_amount ?? 0)) || 0,
        };
      });

      setRows(mapped);
    } catch (err) {
      console.error("Failed to fetch payments made", err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPaymentsMade(defaultRange.fromDate, defaultRange.toDate);
  }, [defaultRange.fromDate, defaultRange.toDate, fetchPaymentsMade]);

  const totalAmount = useMemo(() => rows.reduce((acc, r) => acc + r.amount, 0), [rows]);

  const tableData = useMemo(() => {
    if (rows.length === 0) return rows;
    return [
      ...rows,
      {
        id: "__total__",
        date: "",
        reference_number: "",
        bill_numbers: "",
        vendor_name: "",
        payment_mode: "",
        notes: "",
        deposit_to: "",
        status: "__total__",
        amount: totalAmount,
      },
    ];
  }, [rows, totalAmount]);

  const renderRow = (row: PaymentMadeRow) => {
    const isTotal = row.id === "__total__";
    return {
      date: <span className="text-sm text-gray-600">{isTotal ? "" : formatDate(row.date)}</span>,
      reference_number: <span className="text-sm text-gray-600">{isTotal ? "" : row.reference_number}</span>,
      bill_numbers: <span className="text-sm font-medium text-blue-600">{isTotal ? "" : row.bill_numbers}</span>,
      vendor_name: isTotal ? (
        <span className="text-sm font-bold text-[#1A1A1A]">Total</span>
      ) : (
        <span className="text-sm font-medium text-blue-600">{row.vendor_name}</span>
      ),
      payment_mode: <span className="text-sm text-gray-600">{isTotal ? "" : row.payment_mode}</span>,
      notes: <span className="text-sm text-gray-600">{isTotal ? "" : row.notes}</span>,
      deposit_to: <span className="text-sm text-gray-600">{isTotal ? "" : row.deposit_to}</span>,
      status: isTotal ? <span /> : (
        row.status ? (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadgeMap[row.status.toLowerCase()] || "bg-gray-100 text-gray-700"}`}>
            {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
          </span>
        ) : <span />
      ),
      amount: (
        <span className={`text-sm font-medium ${isTotal ? "font-bold text-[#1A1A1A]" : "text-blue-600"}`}>
          {formatCurrency(row.amount)}
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
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">Payments Made</h3>
        </div>
        <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-3">
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
            type="button"
            className="h-[40px] bg-[#C72030] text-white hover:bg-[#A01020]"
            onClick={() => fetchPaymentsMade(filters.fromDate, filters.toDate)}
          >
            View
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-white overflow-hidden">
        <div className="px-6 py-5 text-center border-b border-[#EAECF0] bg-[#F8F9FC]">
          <p className="text-sm font-medium text-[#667085]">Lockated</p>
          <h1 className="mt-1 text-2xl font-semibold text-[#101828]">Payments Made</h1>
          <p className="mt-1 text-sm text-[#475467]">
            From {formatDisplayDate(filters.fromDate)} To {formatDisplayDate(filters.toDate)}
          </p>
        </div>

        <div className="p-4">
          <EnhancedTaskTable
            data={tableData}
            columns={columns}
            renderRow={renderRow}
            storageKey="payments-made-report-v1"
            hideTableExport={true}
            hideTableSearch={false}
            enableSearch={true}
            loading={loading}
            emptyMessage="There are no payments made during the selected date range."
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentsMadeReport;
