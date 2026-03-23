import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { NotepadText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

interface VendorCreditApi {
  id?: number | string;
  status?: string;
  date?: string;
  credit_note_date?: string;
  credit_note_number?: string;
  vendor_name?: string;
  supplier_name?: string;
  total_amount?: number | string;
  amount?: number | string;
  balance_due?: number | string;
  balance_amount?: number | string;
}

type VendorCreditRow = {
  id: string;
  status: string;
  vendorCreditDate: string;
  creditNoteNumber: string;
  vendorName: string;
  amount: number;
  balanceAmount: number;
};

const columns: ColumnConfig[] = [
  { key: "status", label: "STATUS", sortable: true, hideable: false, draggable: true },
  { key: "vendorCreditDate", label: "VENDOR CREDIT DATE", sortable: true, hideable: false, draggable: true },
  { key: "creditNoteNumber", label: "CREDIT NOTE#", sortable: true, hideable: false, draggable: true },
  { key: "vendorName", label: "VENDOR NAME", sortable: true, hideable: false, draggable: true },
  { key: "amount", label: "AMOUNT", sortable: true, hideable: false, draggable: true },
  { key: "balanceAmount", label: "BALANCE AMOUNT", sortable: true, hideable: false, draggable: true },
];

const getCurrentMonthRange = () => {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  return {
    fromDate: firstDay.toISOString().split("T")[0],
    toDate: lastDay.toISOString().split("T")[0],
  };
};

const formatDisplayDate = (value: string) => {
  if (!value) return "--";

  const d = new Date(`${value}T00:00:00`);
  if (Number.isNaN(d.getTime())) return value;

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
};

const formatAmount = (value: number) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const toNumber = (value?: string | number) => Number(value ?? 0) || 0;


const statusBadgeMap: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  open: "bg-blue-100 text-blue-700",
  paid: "bg-green-100 text-green-700",
  closed: "bg-green-100 text-green-700",
  overdue: "bg-orange-100 text-orange-700",
  cancelled: "bg-red-100 text-red-700",
  void: "bg-red-100 text-red-700",
};

const VendorCreditsDetailsReport: React.FC = () => {
  const defaultRange = useMemo(() => getCurrentMonthRange(), []);
  const [filters, setFilters] = useState(defaultRange);
  const [rows, setRows] = useState<VendorCreditRow[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchVendorCreditDetails = useCallback(async (fromDate: string, toDate: string) => {
    setLoading(true);

    try {
      const baseUrl = localStorage.getItem("baseUrl");
      const token = localStorage.getItem("token");
      const lockAccountId = localStorage.getItem("lock_account_id");

      const response = await axios.get(
        `https://${baseUrl}/lock_account_supplier_credits.json`,
        {
          params: {
            lock_account_id: lockAccountId,
            "q[date_gteq]": fromDate.includes("-") ? fromDate.split("-").reverse().join("/") : fromDate,
            "q[date_lteq]": toDate.includes("-") ? toDate.split("-").reverse().join("/") : toDate,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const payload = response?.data;
      const sourceRows: VendorCreditApi[] = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
          ? payload.data
          : [];

      const mappedRows: VendorCreditRow[] = sourceRows.map((item, index) => ({
        id: String(item.id ?? item.credit_note_number ?? `vc-${index}`),
        status: item.status || "draft",
        vendorCreditDate: item.date || item.credit_note_date || "",
        creditNoteNumber: item.credit_note_number || `VC-${item.id ?? index + 1}`,
        vendorName: item.vendor_name || item.supplier_name || "-",
        amount: toNumber(item.total_amount ?? item.amount),
        balanceAmount: toNumber(item.balance_due ?? item.balance_amount ?? item.total_amount ?? item.amount),
      }));

      setRows(mappedRows);
    } catch (error) {
      console.error("Failed to load vendor credits details report", error);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVendorCreditDetails(defaultRange.fromDate, defaultRange.toDate);
  }, [defaultRange.fromDate, defaultRange.toDate, fetchVendorCreditDetails]);

  const totals = useMemo(
    () =>
      rows.reduce(
        (acc, row) => ({
          amount: acc.amount + row.amount,
          balanceAmount: acc.balanceAmount + row.balanceAmount,
        }),
        { amount: 0, balanceAmount: 0 }
      ),
    [rows]
  );

  const tableData = useMemo(() => {
    if (rows.length === 0) return rows;
    return [
      ...rows,
      {
        id: "__total__",
        status: "__total__",
        vendorCreditDate: "",
        creditNoteNumber: "",
        vendorName: "",
        amount: totals.amount,
        balanceAmount: totals.balanceAmount,
      },
    ];
  }, [rows, totals]);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const renderRow = (row: VendorCreditRow) => {
    const isTotal = row.id === "__total__";
    return {
      status: isTotal ? (
        <span className="text-sm font-bold text-[#1A1A1A]">Total</span>
      ) : (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadgeMap[row.status.toLowerCase()] || "bg-gray-100 text-gray-700"}`}>
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </span>
      ),
      vendorCreditDate: <span className="text-sm text-gray-600">{isTotal ? "" : formatDisplayDate(row.vendorCreditDate)}</span>,
      creditNoteNumber: <span className="text-sm font-medium text-blue-600">{isTotal ? "" : row.creditNoteNumber}</span>,
      vendorName: <span className="text-sm font-medium text-blue-600">{isTotal ? "" : row.vendorName}</span>,
      amount: (
        <span className={`text-sm font-medium ${isTotal ? "font-bold text-[#1A1A1A]" : "text-blue-600"}`}>
          {formatAmount(row.amount)}
        </span>
      ),
      balanceAmount: (
        <span className={`text-sm font-medium ${isTotal ? "font-bold text-[#1A1A1A]" : "text-gray-900"}`}>
          {formatAmount(row.balanceAmount)}
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
          <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">Vendor Credits Details</h3>
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
            onClick={() => fetchVendorCreditDetails(filters.fromDate, filters.toDate)}
          >
            View
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-white overflow-hidden">
        <div className="px-6 py-5 text-center border-b border-[#EAECF0] bg-[#F8F9FC]">
          <p className="text-sm font-medium text-[#667085]">Lockated</p>
          <h1 className="mt-1 text-2xl font-semibold text-[#101828]">Vendor Credits Details</h1>
          <p className="mt-1 text-sm text-[#475467]">
            From {formatDisplayDate(filters.fromDate)} To {formatDisplayDate(filters.toDate)}
          </p>
        </div>

        <div className="p-4">
          <EnhancedTaskTable
            data={tableData}
            columns={columns}
            renderRow={renderRow}
            storageKey="vendor-credits-details-report-v1"
            loading={loading}
            hideTableExport={true}
            hideTableSearch={false}
            enableSearch={true}
            emptyMessage="There are no transactions during the selected date range."
          />
        </div>
      </div>
    </div>
  );
};

export default VendorCreditsDetailsReport;
