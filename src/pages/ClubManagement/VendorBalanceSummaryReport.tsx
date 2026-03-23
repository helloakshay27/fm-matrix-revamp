import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { NotepadText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

interface SupplierBalanceAPI {
  id?: number | string;
  vendor_name?: string;
  supplier_name?: string;
  name?: string;
  billed_amount?: string | number;
  total_billed?: string | number;
  amount_paid?: string | number;
  total_paid?: string | number;
  closing_balance?: string | number;
  balance?: string | number;
  balance_type?: string;
  closing_balance_type?: string;
}

type VendorBalanceRow = {
  id: string;
  vendorName: string;
  billedAmount: number;
  amountPaid: number;
  closingBalance: number;
  closingBalanceType: string;
};

const columns: ColumnConfig[] = [
  { key: "vendorName", label: "VENDOR NAME", sortable: true, hideable: false, draggable: true },
  { key: "billedAmount", label: "BILLED AMOUNT", sortable: true, hideable: false, draggable: true },
  { key: "amountPaid", label: "AMOUNT PAID", sortable: true, hideable: false, draggable: true },
  { key: "closingBalance", label: "CLOSING BALANCE", sortable: true, hideable: false, draggable: true },
];

const toApiDate = (iso: string) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

const formatDisplayDate = (iso: string) => {
  if (!iso) return "--";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
};

const formatAmount = (value: number) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const toNumber = (v?: string | number) => parseFloat(String(v ?? 0)) || 0;

const VendorBalanceSummaryReport: React.FC = () => {
  const [filters, setFilters] = useState({ fromDate: "", toDate: "" });
  const [rows, setRows] = useState<VendorBalanceRow[]>([]);
  const [loading, setLoading] = useState(false);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const fetchData = useCallback(async (fromDate: string, toDate: string) => {
    setLoading(true);
    try {
      const baseUrl = localStorage.getItem("baseUrl");
      const token = localStorage.getItem("token");
      const lockAccountId = localStorage.getItem("lock_account_id");

      const response = await axios.get(
        `https://${baseUrl}/pms/suppliers/supplier_balance_summary.json`,
        {
          params: {
            lock_account_id: lockAccountId,
            ...(fromDate && { "q[date_gteq]": toApiDate(fromDate) }),
            ...(toDate && { "q[date_lteq]": toApiDate(toDate) }),
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const payload = response.data;
      let list: SupplierBalanceAPI[] = [];
      if (Array.isArray(payload)) {
        list = payload;
      } else if (payload && typeof payload === "object") {
        // Try all array-valued keys
        const arrayKey = Object.keys(payload).find((k) => Array.isArray(payload[k]));
        if (arrayKey) list = payload[arrayKey];
      }

      const mapped: VendorBalanceRow[] = list.map((item, i) => ({
        id: String(item.id ?? i),
        vendorName: item.vendor_name || item.supplier_name || item.name || "-",
        billedAmount: toNumber(item.billed_amount ?? item.total_billed),
        amountPaid: toNumber(item.amount_paid ?? item.total_paid),
        closingBalance: toNumber(item.closing_balance ?? item.balance),
        closingBalanceType: item.balance_type || item.closing_balance_type || "Dr",
      }));

      setRows(mapped);
    } catch (err) {
      console.error("Failed to fetch vendor balance summary", err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData("", "");
  }, [fetchData]);

  const totals = useMemo(
    () =>
      rows.reduce(
        (acc, row) => ({
          billedAmount: acc.billedAmount + row.billedAmount,
          amountPaid: acc.amountPaid + row.amountPaid,
          closingBalance:
            acc.closingBalance +
            (row.closingBalanceType === "Cr" ? -row.closingBalance : row.closingBalance),
        }),
        { billedAmount: 0, amountPaid: 0, closingBalance: 0 }
      ),
    [rows]
  );

  const tableData = useMemo(() => {
    if (rows.length === 0) return rows;
    return [
      ...rows,
      {
        id: "__total__",
        vendorName: "__total__",
        billedAmount: totals.billedAmount,
        amountPaid: totals.amountPaid,
        closingBalance: Math.abs(totals.closingBalance),
        closingBalanceType: totals.closingBalance >= 0 ? "Dr" : "Cr",
      },
    ];
  }, [rows, totals]);

  const renderRow = (row: VendorBalanceRow) => {
    const isTotal = row.id === "__total__";
    return {
      vendorName: isTotal ? (
        <span className="text-sm font-bold text-[#1A1A1A]">Total</span>
      ) : (
        <span className="text-sm font-medium text-blue-600">{row.vendorName}</span>
      ),
      billedAmount: (
        <span className={`text-sm font-medium ${isTotal ? "font-bold text-[#1A1A1A]" : "text-gray-900"}`}>
          {formatAmount(row.billedAmount)}
        </span>
      ),
      amountPaid: (
        <span className={`text-sm font-medium ${isTotal ? "font-bold text-[#1A1A1A]" : "text-gray-900"}`}>
          {formatAmount(row.amountPaid)}
        </span>
      ),
      closingBalance: (
        <span className={`text-sm font-medium ${isTotal ? "font-bold text-[#1A1A1A]" : "text-gray-900"}`}>
          {formatAmount(row.closingBalance)} {row.closingBalanceType}
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
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">Vendor Balance Summary</h3>
        </div>
        <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-3">
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
          <p className="text-sm font-medium text-[#667085]">Lockated</p>
          <h1 className="mt-1 text-2xl font-semibold text-[#101828]">Vendor Balance Summary</h1>
          <p className="mt-1 text-sm text-[#475467]">
            {filters.fromDate && filters.toDate
              ? `From ${formatDisplayDate(filters.fromDate)} To ${formatDisplayDate(filters.toDate)}`
              : "Select a date range and click View"}
          </p>
        </div>

        <div className="p-4">
          <EnhancedTaskTable
            data={tableData}
            columns={columns}
            renderRow={renderRow}
            storageKey="vendor-balance-summary-report-v1"
            hideTableExport={true}
            hideTableSearch={false}
            enableSearch={true}
            loading={loading}
            emptyMessage="There are no transactions during the selected date range."
          />
        </div>
      </div>
    </div>
  );
};

export default VendorBalanceSummaryReport;
