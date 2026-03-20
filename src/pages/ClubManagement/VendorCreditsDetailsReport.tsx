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

const statusClassMap: Record<string, string> = {
  draft: "text-[#6B7280]",
  open: "text-[#2563EB]",
  paid: "text-[#059669]",
  overdue: "text-[#DC2626]",
  cancelled: "text-[#B91C1C]",
};

const VendorCreditsDetailsReport: React.FC = () => {
  const defaultRange = useMemo(() => getCurrentMonthRange(), []);
  const [filters, setFilters] = useState(defaultRange);
  const [appliedFilters, setAppliedFilters] = useState(defaultRange);
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
            "q[date_gteq]": fromDate,
            "q[date_lteq]": toDate,
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

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const renderRow = (row: VendorCreditRow) => ({
    status: (
      <span className={`text-[13px] font-medium ${statusClassMap[row.status.toLowerCase()] || "text-[#374151]"}`}>
        {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
      </span>
    ),
    vendorCreditDate: <span className="text-[13px] font-medium text-[#111827]">{formatDisplayDate(row.vendorCreditDate)}</span>,
    creditNoteNumber: <span className="text-[13px] font-medium text-[#2563EB]">{row.creditNoteNumber}</span>,
    vendorName: <span className="text-[13px] font-medium text-[#2563EB]">{row.vendorName}</span>,
    amount: <span className="text-[13px] font-medium text-[#2563EB]">{formatAmount(row.amount)}</span>,
    balanceAmount: <span className="text-[13px] font-medium text-[#2563EB]">{formatAmount(row.balanceAmount)}</span>,
  });

  return (
    <div className="w-full bg-[#f9f7f2] p-6 min-h-screen">
      <div className="bg-white rounded-lg border-2 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 flex items-center justify-center bg-[#E5E0D3] rounded-full text-[#C72030]">
            <NotepadText className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-[#1A1A1A]">Vendor Credits Details</h3>
        </div>

        <div className="grid md:grid-cols-3 items-end gap-6">
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
            onClick={() => {
              setAppliedFilters(filters);
              fetchVendorCreditDetails(filters.fromDate, filters.toDate);
            }}
            className="bg-[#C72030] hover:bg-[#A01020] text-white h-[40px]"
          >
            View
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="px-6 py-5 text-center border-b bg-[#F8F9FC]">
          <p className="text-sm font-medium text-[#667085]">Lockated</p>
          <h1 className="mt-1 text-2xl font-semibold text-[#101828]">Vendor Credits Details</h1>
          <p className="mt-1 text-sm text-[#475467]">
            From {formatDisplayDate(appliedFilters.fromDate)} To {formatDisplayDate(appliedFilters.toDate)}
          </p>
        </div>

        <div className="p-4">
          <EnhancedTaskTable
            data={rows}
            columns={columns}
            renderRow={renderRow}
            storageKey="vendor-credits-details-report-v1"
            loading={loading}
            hideTableExport={true}
            hideTableSearch={true}
            enableSearch={false}
            hideColumnsButton={false}
            emptyMessage="There are no transactions during the selected date range."
            rightActions={
              <div className="text-sm font-medium text-[#475467]">
                Group By : None
              </div>
            }
            headerCellClassName="bg-[#F9FAFB] text-[#374151] text-[12px] font-semibold uppercase tracking-[0.5px] border-b border-[#E5E7EB] hover:bg-[#F9FAFB] px-6 py-4"
            rowClassName="hover:bg-white border-b border-[#E5E7EB]"
            cellClassName="px-6 py-4 text-[13px] text-[#374151] hover:bg-white align-middle"
          />

          {rows.length > 0 && (
            <div className="rounded-b-md border border-t-0 border-[#E5E7EB] bg-white px-6 py-4 text-sm font-semibold text-[#1A1A1A]">
              <div className="grid grid-cols-6 gap-4">
                <div>Total</div>
                <div />
                <div />
                <div />
                <div className="text-right text-gray-900">{formatAmount(totals.amount)}</div>
                <div className="text-right text-gray-900">{formatAmount(totals.balanceAmount)}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorCreditsDetailsReport;
