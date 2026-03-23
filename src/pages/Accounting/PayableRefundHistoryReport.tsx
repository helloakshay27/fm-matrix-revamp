import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import TextField from "@mui/material/TextField";
import { Button } from "@/components/ui/button";
import { NotepadText } from "lucide-react";

interface RefundHistoryApi {
  id: number;
  created_at?: string;
  payment_date?: string;
  order_number?: string;
  payment_number?: string;
  receipt_number?: string;
  resident_name?: string;
  vendor_name?: string;
  payment_mode?: string;
  payment_method?: string;
  notes?: string;
  paid_amount?: string | number;
  payment_amount?: string | number;
  total_amount?: string | number;
}

interface RefundHistoryRow {
  id: number;
  date: string;
  reference: string;
  transaction_number: string;
  vendor_name: string;
  mode: string;
  notes: string;
  amount_fcy: number;
  amount_bcy: number;
}

const columns: ColumnConfig[] = [
  { key: "date", label: "DATE", sortable: true, hideable: false, draggable: true },
  { key: "reference", label: "REFERENCE#", sortable: true, hideable: false, draggable: true },
  { key: "transaction_number", label: "TRANSACTION#", sortable: true, hideable: false, draggable: true },
  { key: "vendor_name", label: "VENDOR NAME", sortable: true, hideable: false, draggable: true },
  { key: "mode", label: "MODE", sortable: true, hideable: false, draggable: true },
  { key: "notes", label: "NOTES", sortable: true, hideable: false, draggable: true },
  { key: "amount_fcy", label: "AMOUNT (FCY)", sortable: true, hideable: false, draggable: true },
  { key: "amount_bcy", label: "AMOUNT (BCY)", sortable: true, hideable: false, draggable: true },
];

const formatDate = (value?: string) => {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleDateString("en-GB", {
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

const toNumber = (value?: string | number) => {
  return parseFloat(String(value ?? 0)) || 0;
};

const toInputDate = (ddmmyyyy: string) => {
  const [day, month, year] = ddmmyyyy.split("/");
  return `${year}-${month}-${day}`;
};

const PayableRefundHistoryReport: React.FC = () => {
  const [rows, setRows] = useState<RefundHistoryRow[]>([]);
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

  const fetchRefundHistory = useCallback(async (fromDate: string, toDate: string) => {
    setLoading(true);

    try {
      const baseUrl = localStorage.getItem("baseUrl");
      const token = localStorage.getItem("token");
      const lockAccountId = localStorage.getItem("lock_account_id");

      const response = await axios.get(`https://${baseUrl}/lock_payments.json`, {
        params: {
          lock_account_id: lockAccountId,
          "q[payment_made_eq]": 1,
          "q[date_gteq]": fromDate,
          "q[date_lteq]": toDate,
          per_page: 500,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const list: RefundHistoryApi[] = response.data.lock_payments || response.data || [];

      const mappedRows = list.map((item) => {
        const amount = toNumber(item.paid_amount ?? item.payment_amount ?? item.total_amount);

        return {
          id: item.id,
          date: item.payment_date || item.created_at || "",
          reference: item.order_number || "",
          transaction_number: item.payment_number || item.receipt_number || String(item.id),
          vendor_name: item.vendor_name || item.resident_name || "-",
          mode: item.payment_mode || item.payment_method || "-",
          notes: item.notes || "",
          amount_fcy: amount,
          amount_bcy: amount,
        };
      });

      setRows(mappedRows);
    } catch (error) {
      console.error("Failed to load payable refund history report", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRefundHistory(defaultDateRange.fromDate, defaultDateRange.toDate);
  }, [defaultDateRange.fromDate, defaultDateRange.toDate, fetchRefundHistory]);

  const renderRow = (row: RefundHistoryRow) => ({
    date: <span className="text-[13px] text-[#111827]">{formatDate(row.date)}</span>,
    reference: <span className="text-[13px] text-[#111827]">{row.reference || ""}</span>,
    transaction_number: <span className="text-[13px] text-[#111827]">{row.transaction_number}</span>,
    vendor_name: <span className="text-[13px] font-semibold text-[#2563eb]">{row.vendor_name}</span>,
    mode: <span className="text-[13px] text-[#111827]">{row.mode}</span>,
    notes: <span className="text-[13px] text-[#111827]">{row.notes || ""}</span>,
    amount_fcy: <span className="text-[13px] font-semibold text-[#111827]">{formatCurrency(row.amount_fcy)}</span>,
    amount_bcy: <span className="text-[13px] font-semibold text-[#111827]">{formatCurrency(row.amount_bcy)}</span>,
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
              <h3 className="text-lg font-semibold text-[#111827]">Refund History</h3>
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
              onClick={() => fetchRefundHistory(filters.fromDate, filters.toDate)}
              className="h-[40px] bg-[#C72030] text-white hover:bg-[#A01020]"
            >
              View
            </Button>
          </div>
        </div>

        <div className="border-b border-[#EAECF0] bg-white px-6 py-12 text-center">
          <p className="text-[14px] font-medium text-[#667085]">Lockated</p>
          <h1 className="mt-3 text-[20px] font-semibold text-[#111827]">Refund History</h1>
          <p className="mt-2 text-[14px] text-[#344054]">From {filters.fromDate} To {filters.toDate}</p>
        </div>

        <div className="p-0">
          <EnhancedTaskTable
            data={rows}
            columns={columns}
            renderRow={renderRow}
            storageKey="payable-refund-history-report-v1"
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
        </div>
      </div>
    </div>
  );
};

export default PayableRefundHistoryReport;
