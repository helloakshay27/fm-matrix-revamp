import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import TextField from "@mui/material/TextField";
import { Button } from "@/components/ui/button";
import { NotepadText } from "lucide-react";

interface RefundApi {
  id: number;
  created_at?: string;
  payment_date?: string;
  order_number?: string;
  payment_number?: string;
  receipt_number?: string;
  resident_name?: string;
  payment_mode?: string;
  payment_method?: string;
  notes?: string;
  paid_amount?: string | number;
  payment_amount?: string | number;
  total_amount?: string | number;
}

interface RefundRow {
  id: number;
  date: string;
  reference: string;
  transaction_number: string;
  customer_name: string;
  mode: string;
  notes: string;
  amount_fcy: number;
  amount_bcy: number;
}

const columns: ColumnConfig[] = [
  { key: "date", label: "DATE", sortable: true, hideable: false, draggable: true },
  { key: "reference", label: "REFERENCE#", sortable: true, hideable: false, draggable: true },
  { key: "transaction_number", label: "TRANSACTION#", sortable: true, hideable: false, draggable: true },
  { key: "customer_name", label: "CUSTOMER NAME", sortable: true, hideable: false, draggable: true },
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

const RefundHistoryReport: React.FC = () => {
  const [rows, setRows] = useState<RefundRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    fromDate: "01/03/2026",
    toDate: "31/03/2026",
  });

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

      const list: RefundApi[] = response.data.lock_payments || response.data || [];

      const mappedRows = list.map((item) => {
        const amount = toNumber(item.paid_amount ?? item.payment_amount ?? item.total_amount);

        return {
          id: item.id,
          date: item.payment_date || item.created_at || "",
          reference: item.order_number || "",
          transaction_number: item.payment_number || item.receipt_number || String(item.id),
          customer_name: item.resident_name || "-",
          mode: item.payment_mode || item.payment_method || "-",
          notes: item.notes || "",
          amount_fcy: amount,
          amount_bcy: amount,
        };
      });

      setRows(mappedRows);
    } catch (error) {
      console.error("Failed to load refund history report", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRefundHistory("01/03/2026", "31/03/2026");
  }, [fetchRefundHistory]);

  const renderRow = (row: RefundRow) => ({
    date: <span className="text-[13px] text-[#111827] font-medium">{formatDate(row.date)}</span>,
    reference: <span className="text-[13px] text-[#111827] font-medium">{row.reference || "-"}</span>,
    transaction_number: <span className="text-[13px] text-[#111827] font-medium">{row.transaction_number}</span>,
    customer_name: <span className="text-[13px] text-[#111827] font-medium">{row.customer_name}</span>,
    mode: <span className="text-[13px] text-[#111827] font-medium">{row.mode}</span>,
    notes: <span className="text-[13px] text-[#111827] font-medium">{row.notes || "-"}</span>,
    amount_fcy: <span className="text-[13px] text-[#111827] font-medium">{formatCurrency(row.amount_fcy)}</span>,
    amount_bcy: <span className="text-[13px] text-[#111827] font-medium">{formatCurrency(row.amount_bcy)}</span>,
  });

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="overflow-hidden border border-[#EAECF0] bg-white">
        <div className="border-b border-[#EAECF0] bg-white px-6 py-4">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#E5E0D3]">
              <NotepadText color="#d32f2f" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Refund History</h3>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
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
              onClick={() => fetchRefundHistory(filters.fromDate, filters.toDate)}
              className="bg-[#C72030] hover:bg-[#A01020] text-white h-[40px]"
            >
              View
            </Button>
          </div>
        </div>

        {/* Header Section */}
        <div className="border-b border-[#EAECF0] bg-white px-6 py-8 text-center">
          <p className="text-[14px] font-medium text-[#667085]">Lockated</p>
          <h1 className="mt-3 text-[20px] font-semibold text-[#111827]">Refund History</h1>
          <p className="mt-2 text-[14px] text-[#344054]">From {filters.fromDate} To {filters.toDate}</p>
        </div>

        {/* Table Section */}
        <div className="p-0">
          <EnhancedTaskTable
            data={rows}
            columns={columns}
            renderRow={renderRow}
            storageKey="refund-history-report-v1"
            hideTableExport={true}
            hideTableSearch={true}
            enableSearch={false}
            hideColumnsButton={true}
            loading={loading}
            emptyMessage="There are no transactions during the selected date range."
            toolbarClassName="hidden"
            tableWrapperClassName="border-0 rounded-none"
            headerCellClassName="bg-[#F9FAFB] text-[#374151] text-[12px] font-semibold uppercase tracking-[0.5px] border-b border-[#E5E7EB] hover:bg-[#F9FAFB] px-6 py-4"
            rowClassName="hover:bg-white border-b border-[#E5E7EB]"
            cellClassName="px-6 py-4 text-[13px] text-[#374151] hover:bg-white align-middle"
          />
        </div>
      </div>
    </div>
  );
};

export default RefundHistoryReport;